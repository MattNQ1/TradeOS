// Subscription card — shows current tier + upgrade buttons that route to Stripe Checkout.
"use client";

import { useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCheckoutSession, createPortalSession, type Plan } from "@/features/billing/actions";
import type { Tier } from "@/features/billing/tier";

interface SubscriptionSectionProps {
    tier: Tier;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
}

export function SubscriptionSection({ tier, cancelAtPeriodEnd, currentPeriodEnd }: SubscriptionSectionProps) {
    return (
        <Card>
            <CardTitle>Subscription</CardTitle>
            {tier === "free" && <FreeView />}
            {tier === "pro" && (
                <ProView cancelAtPeriodEnd={cancelAtPeriodEnd} currentPeriodEnd={currentPeriodEnd} />
            )}
            {tier === "lifetime" && <LifetimeView />}
        </Card>
    );
}

// ============================================================
// FREE view — current plan + upgrade CTAs
// ============================================================

function FreeView() {
    return (
        <>
            {/* Current plan */}
            <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Current plan
                        </p>
                        <p className="text-lg font-bold mt-0.5">Free</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            Calculator + manual journal. Upgrade for the full toolkit.
                        </p>
                    </div>
                    <span className="text-3xl">✦</span>
                </div>
            </div>

            {/* Pro upgrade — recurring */}
            <UpgradeCard
                plan="pro"
                badgeText="Most popular"
                title="TradeOS Pro"
                price="$19"
                priceSuffix="/mo"
                features={[
                    "Unlimited trades + history",
                    "Full economic calendar with AI-style explanations",
                    "Custom prop firm rules + multi-account",
                    "Auto-sync from your broker (when launched)",
                    "Priority support",
                ]}
                accentClass="border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]"
                gradientClass="from-emerald-600/15 via-violet-700/10 to-transparent"
                buttonText="Upgrade to Pro"
            />

            {/* Lifetime — one-time */}
            <UpgradeCard
                plan="lifetime"
                badgeText="Best value"
                title="Lifetime"
                price="$199"
                priceSuffix=" once"
                features={[
                    "All Pro features, forever",
                    "No recurring fees",
                    "Lifetime updates included",
                    "Founders pricing — locks in before public launch",
                ]}
                accentClass="border-[color-mix(in_oklab,var(--color-warn)_40%,transparent)]"
                gradientClass="from-amber-600/20 via-orange-700/10 to-transparent"
                buttonText="Get Lifetime"
            />
        </>
    );
}

// ============================================================
// PRO view — current state + manage subscription
// ============================================================

function ProView({
    cancelAtPeriodEnd, currentPeriodEnd,
}: { cancelAtPeriodEnd: boolean; currentPeriodEnd: string | null }) {
    const [pending, startTransition] = useTransition();

    const onManage = () => {
        startTransition(async () => {
            const res = await createPortalSession();
            if (res.ok && res.url) window.location.href = res.url;
            else alert(res.error ?? "Could not open billing portal.");
        });
    };

    const periodEndText = currentPeriodEnd
        ? new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric", year: "numeric" })
            .format(new Date(currentPeriodEnd))
        : null;

    return (
        <>
            <div className="relative overflow-hidden bg-[var(--color-bg-elev-2)] border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] rounded-xl p-4">
                <div className="absolute -right-2 -top-2 text-[80px] leading-none opacity-10 select-none pointer-events-none">⭐</div>
                <div className="relative">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                        Active subscription
                    </p>
                    <p className="text-xl font-bold mt-1">TradeOS Pro</p>
                    {periodEndText && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                            {cancelAtPeriodEnd
                                ? `Cancels on ${periodEndText}`
                                : `Renews on ${periodEndText}`}
                        </p>
                    )}
                </div>
            </div>

            <Button variant="secondary" className="w-full" onClick={onManage} disabled={pending}>
                {pending ? "Opening…" : "Manage subscription"}
            </Button>
            <p className="text-xs text-[var(--color-text-muted)] -mt-1">
                Manage billing, update payment method, or cancel via Stripe&apos;s secure portal.
            </p>
        </>
    );
}

// ============================================================
// LIFETIME view — unique badge
// ============================================================

function LifetimeView() {
    return (
        <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--color-warn)_40%,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/25 via-orange-700/15 to-transparent pointer-events-none" />
            <div className="relative p-5 text-center">
                <div className="text-5xl mb-2">🏆</div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-warn)]">
                    Founder
                </p>
                <p className="text-xl font-bold mt-1">Lifetime access</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                    All Pro features, forever. No recurring fees, no expirations.
                </p>
            </div>
        </div>
    );
}

// ============================================================
// Upgrade card with checkout flow
// ============================================================

interface UpgradeCardProps {
    plan: Plan;
    badgeText: string;
    title: string;
    price: string;
    priceSuffix: string;
    features: string[];
    accentClass: string;
    gradientClass: string;
    buttonText: string;
}

function UpgradeCard({
    plan, badgeText, title, price, priceSuffix, features, accentClass, gradientClass, buttonText,
}: UpgradeCardProps) {
    const [pending, startTransition] = useTransition();

    const onUpgrade = () => {
        startTransition(async () => {
            const res = await createCheckoutSession(plan);
            if (res.ok && res.url) {
                window.location.href = res.url;
            } else {
                alert(res.error ?? "Could not start checkout.");
            }
        });
    };

    return (
        <div className={`relative overflow-hidden rounded-xl border ${accentClass}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} pointer-events-none`} />

            <div className="relative p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                            {badgeText}
                        </p>
                        <h3 className="text-xl font-bold mt-0.5">{title}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold tabular-nums leading-tight">
                            {price}
                            <span className="text-xs font-normal text-[var(--color-text-muted)]">{priceSuffix}</span>
                        </p>
                    </div>
                </div>

                <ul className="space-y-1.5 mb-4">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
                            <span className="text-[var(--color-text)]">{f}</span>
                        </li>
                    ))}
                </ul>

                <Button className="w-full" onClick={onUpgrade} disabled={pending}>
                    {pending ? "Redirecting…" : buttonText}
                </Button>
            </div>
        </div>
    );
}
