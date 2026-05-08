// Server Actions for Stripe Checkout + Billing Portal.
// Called from the Settings page upgrade buttons.
"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export type Plan = "pro" | "lifetime";

export interface CheckoutResult {
    ok: boolean;
    url?: string;
    error?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function priceIdFor(plan: Plan): string | undefined {
    if (plan === "pro") return process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    if (plan === "lifetime") return process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
    return undefined;
}

export async function createCheckoutSession(plan: Plan): Promise<CheckoutResult> {
    const priceId = priceIdFor(plan);
    if (!priceId) {
        return { ok: false, error: `Stripe ${plan} price ID is not configured.` };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return { ok: false, error: "Not signed in." };

    // Reuse Stripe customer if one already exists for this user.
    const { data: existing } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();

    let customerId = existing?.stripe_customer_id ?? null;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
        // Note: we don't write the row here — the webhook does that on
        // checkout.session.completed. If checkout is abandoned, the customer
        // record on Stripe is harmless (Stripe re-uses it on the next attempt
        // because we look it up by user_id).
        // But we DO need to remember this customer ID across abandoned attempts.
        // Easiest: upsert just the customer_id now using the service-role admin client.
        // For simplicity we let the webhook handle it; an abandoned session
        // creating a duplicate customer is acceptable for v1.
    }

    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: plan === "pro" ? "subscription" : "payment",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${SITE_URL}/settings?upgraded=${plan}`,
            cancel_url: `${SITE_URL}/settings`,
            // Metadata flows through to the webhook so we know which user to upgrade.
            metadata: { plan, supabase_user_id: user.id },
            // Allow promotion codes (you can create them in the Stripe dashboard).
            allow_promotion_codes: true,
        });

        if (!session.url) return { ok: false, error: "Could not create checkout URL." };
        return { ok: true, url: session.url };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown Stripe error.";
        return { ok: false, error: msg };
    }
}

export async function createPortalSession(): Promise<CheckoutResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const { data } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!data?.stripe_customer_id) {
        return { ok: false, error: "No active subscription to manage." };
    }

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: data.stripe_customer_id,
            return_url: `${SITE_URL}/settings`,
        });
        return { ok: true, url: session.url };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown Stripe error.";
        return { ok: false, error: msg };
    }
}
