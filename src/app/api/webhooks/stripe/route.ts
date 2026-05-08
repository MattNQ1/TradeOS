// Stripe webhook handler.
//
// Stripe POSTs here whenever a payment / subscription event happens.
// We verify the signature, then update the user's subscriptions row.
//
// Uses the service role key directly (not the SSR client) because:
//   1. The request is unauthenticated (it's from Stripe, not a user)
//   2. We need to write to a table that has restrictive RLS (only service-role writes)
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } },
    );
}

export async function POST(request: Request) {
    if (!WEBHOOK_SECRET) {
        return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");
    if (!signature) {
        return new NextResponse("Missing signature", { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown";
        console.error("Stripe webhook signature failed:", msg);
        return new NextResponse(`Signature verification failed: ${msg}`, { status: 400 });
    }

    const admin = adminClient();

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, admin);
                break;

            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                await handleSubscriptionChange(event.data.object as Stripe.Subscription, admin);
                break;

            // Optional: react to renewal failures
            case "invoice.payment_failed":
                console.warn("Invoice payment failed:", event.data.object);
                break;

            default:
                // Other events ignored. Stripe sends MANY event types — we only care about a few.
                break;
        }
    } catch (err) {
        console.error("Stripe webhook processing error:", err);
        return new NextResponse("Webhook processing failed", { status: 500 });
    }

    return NextResponse.json({ received: true });
}

// ============================================================
// Handlers
// ============================================================

async function handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
    admin: ReturnType<typeof adminClient>,
) {
    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan as "pro" | "lifetime" | undefined;
    const customerId = session.customer as string | null;

    if (!userId || !plan || !customerId) {
        console.warn("Missing metadata on checkout.session.completed:", { userId, plan, customerId });
        return;
    }

    if (plan === "lifetime") {
        // One-time payment.
        await admin.from("subscriptions").upsert(
            {
                user_id: userId,
                tier: "lifetime",
                status: "active",
                stripe_customer_id: customerId,
                stripe_subscription_id: null,
                current_period_end: null,
                cancel_at_period_end: false,
            },
            { onConflict: "user_id" },
        );
        return;
    }

    // Pro: subscription mode. Pull live subscription state from Stripe.
    if (plan === "pro" && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await admin.from("subscriptions").upsert(
            {
                user_id: userId,
                tier: "pro",
                status: sub.status,
                stripe_customer_id: customerId,
                stripe_subscription_id: sub.id,
                current_period_end: subscriptionEndIso(sub),
                cancel_at_period_end: sub.cancel_at_period_end,
            },
            { onConflict: "user_id" },
        );
    }
}

async function handleSubscriptionChange(
    sub: Stripe.Subscription,
    admin: ReturnType<typeof adminClient>,
) {
    const customerId = sub.customer as string;

    const { data: existing } = await admin
        .from("subscriptions")
        .select("user_id, tier")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();

    if (!existing) {
        console.warn("No matching subscription row for customer:", customerId);
        return;
    }

    // Lifetime users keep their tier even if a parallel Pro subscription gets cancelled.
    if (existing.tier === "lifetime") return;

    const isCancelled = sub.status === "canceled" || sub.status === "incomplete_expired";

    if (isCancelled) {
        await admin
            .from("subscriptions")
            .update({
                tier: "free",
                status: "cancelled",
                stripe_subscription_id: null,
                current_period_end: null,
                cancel_at_period_end: false,
            })
            .eq("user_id", existing.user_id);
    } else {
        await admin
            .from("subscriptions")
            .update({
                tier: "pro",
                status: sub.status,
                stripe_subscription_id: sub.id,
                current_period_end: subscriptionEndIso(sub),
                cancel_at_period_end: sub.cancel_at_period_end,
            })
            .eq("user_id", existing.user_id);
    }
}

// ============================================================
// Helpers
// ============================================================

/** Stripe subscription period end as ISO string (or null if not present).
 *  current_period_end may live on the Subscription or on its first item depending
 *  on the API version — read from either via a structural cast. */
function subscriptionEndIso(sub: Stripe.Subscription): string | null {
    type Maybe = { current_period_end?: number };
    const fromSub = (sub as unknown as Maybe).current_period_end;
    const fromItem = sub.items?.data?.[0]
        ? (sub.items.data[0] as unknown as Maybe).current_period_end
        : undefined;
    const ts = fromSub ?? fromItem;
    return typeof ts === "number" ? new Date(ts * 1000).toISOString() : null;
}
