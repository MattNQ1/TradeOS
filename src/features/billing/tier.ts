// Server-side tier resolution. Single source of truth for "is this user paid?".
import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Tier = "free" | "pro" | "lifetime";

export interface TierInfo {
    tier: Tier;
    /** When the current period ends (Pro only). null for free + lifetime. */
    currentPeriodEnd: string | null;
    /** True if the user has cancelled but is still in the paid period. */
    cancelAtPeriodEnd: boolean;
    /** True for any paid tier — convenience for guard checks. */
    isPaid: boolean;
    /** True if the user is in their Pro free trial. */
    isTrialing: boolean;
}

const FREE: TierInfo = {
    tier: "free", currentPeriodEnd: null, cancelAtPeriodEnd: false, isPaid: false, isTrialing: false,
};

export async function getUserTier(): Promise<TierInfo> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return FREE;

    const { data } = await supabase
        .from("subscriptions")
        .select("tier, status, current_period_end, cancel_at_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!data) return FREE;

    // Lifetime never expires.
    if (data.tier === "lifetime" && data.status === "active") {
        return {
            tier: "lifetime", currentPeriodEnd: null, cancelAtPeriodEnd: false,
            isPaid: true, isTrialing: false,
        };
    }

    // Pro: active or trialing AND period hasn't ended.
    if (data.tier === "pro" && (data.status === "active" || data.status === "trialing")) {
        const periodEnd = data.current_period_end;
        const stillActive = !periodEnd || new Date(periodEnd) > new Date();
        if (stillActive) {
            return {
                tier: "pro",
                currentPeriodEnd: periodEnd,
                cancelAtPeriodEnd: data.cancel_at_period_end,
                isPaid: true,
                isTrialing: data.status === "trialing",
            };
        }
    }

    return FREE;
}
