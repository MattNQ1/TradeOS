// Server-only Stripe client. Never import this from a Client Component —
// the secret key would leak to the browser.
//
// Lazy-initialized so the build doesn't fail when STRIPE_SECRET_KEY is unset.
// Routes that actually call Stripe will throw at runtime if the key is missing,
// which is the desired behavior (clear error, no silent fallback).
import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

function getStripe(): Stripe {
    if (cached) return cached;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error(
            "STRIPE_SECRET_KEY is not set. Add it to .env.local + Vercel env vars before using billing features.",
        );
    }
    cached = new Stripe(key, {
        // Pin the API version so future Stripe upgrades don't surprise us.
        apiVersion: "2025-02-24.acacia",
        typescript: true,
    });
    return cached;
}

// Proxy so existing `import { stripe } from "@/lib/stripe"` callers work without changes.
// Stripe client property/method access is proxied to the lazily-initialized instance.
export const stripe = new Proxy({} as Stripe, {
    get(_target, prop) {
        const client = getStripe();
        const value = client[prop as keyof Stripe];
        return typeof value === "function" ? value.bind(client) : value;
    },
});
