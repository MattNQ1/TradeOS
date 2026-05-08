// Subscription card — current plan + Pro upgrade preview.
// Stripe wiring will replace the "Coming soon" handler when ready to launch.
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SubscriptionSection() {
    const [proOpen, setProOpen] = useState(false);

    return (
        <>
            <Card>
                <CardTitle>Subscription</CardTitle>

                {/* Current plan */}
                <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                                Current plan
                            </p>
                            <p className="text-lg font-bold mt-0.5">Free</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                All core features. No credit card needed.
                            </p>
                        </div>
                        <span className="text-3xl">✦</span>
                    </div>
                </div>

                {/* Pro upgrade card */}
                <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]">
                    {/* Subtle gradient backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-violet-700/10 to-transparent pointer-events-none" />

                    <div className="relative p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                                    Recommended
                                </p>
                                <h3 className="text-xl font-bold mt-0.5 flex items-center gap-1.5">
                                    <span>⭐</span> TradeOS Pro
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">From</p>
                                <p className="text-2xl font-bold tabular-nums leading-tight">
                                    $19<span className="text-xs font-normal text-[var(--color-text-muted)]">/mo</span>
                                </p>
                            </div>
                        </div>

                        <ul className="space-y-1.5 mb-4">
                            <Feature>Unlimited trades &amp; history</Feature>
                            <Feature>Auto-sync from your broker / prop firm</Feature>
                            <Feature>AI insights on every event &amp; trade</Feature>
                            <Feature>Custom date ranges + advanced filters</Feature>
                            <Feature>Priority support</Feature>
                        </ul>

                        <Button className="w-full" onClick={() => setProOpen(true)}>
                            Upgrade to Pro
                            <span className="ml-1.5 text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-white/20 text-white leading-none">
                                Soon
                            </span>
                        </Button>
                    </div>
                </div>
            </Card>

            <ProSoonModal open={proOpen} onClose={() => setProOpen(false)} />
        </>
    );
}

function Feature({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
            <span className="text-[var(--color-text)]">{children}</span>
        </li>
    );
}

// ============================================================
// "Coming soon" preview modal for Pro
// ============================================================

interface ProSoonModalProps {
    open: boolean;
    onClose: () => void;
}

function ProSoonModal({ open, onClose }: ProSoonModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (open && !dlg.open) dlg.showModal();
        if (!open && dlg.open) dlg.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm overflow-hidden"
        >
            <div className="relative bg-gradient-to-br from-emerald-600/40 via-violet-700/20 to-transparent px-5 pt-6 pb-5 overflow-hidden">
                <div className="absolute -right-4 -top-4 text-[120px] leading-none opacity-10 select-none pointer-events-none">
                    ⭐
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center hover:bg-black/50"
                >
                    ✕
                </button>

                <div className="relative">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white px-2 py-1 rounded bg-[var(--color-accent)] mb-3">
                        Coming soon
                    </span>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight">
                        TradeOS Pro
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                        Pro plans aren&apos;t open yet — but they&apos;re coming. Keep using the free tier; nothing you build here will be lost.
                    </p>
                </div>
            </div>

            <div className="px-5 py-5 flex flex-col gap-4">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                        Planned tiers
                    </h3>
                    <div className="space-y-2">
                        <TierRow name="Free" price="$0" desc="Calculator, journal, calendar, prop firm tools" />
                        <TierRow name="Pro" price="$19/mo" desc="Auto-sync, AI insights, unlimited history" highlight />
                        <TierRow name="Lifetime" price="$199" desc="One-time. All Pro features, forever." />
                    </div>
                </div>

                <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg p-3.5">
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                        <span className="font-semibold text-[var(--color-text)]">Early users get a discount.</span> Sign up early, lock in a lower price when Pro launches.
                    </p>
                </div>
            </div>

            <div className="px-5 py-4 border-t border-[var(--color-border-soft)] flex justify-end">
                <Button variant="ghost" onClick={onClose}>Got it</Button>
            </div>
        </dialog>
    );
}

function TierRow({
    name, price, desc, highlight,
}: { name: string; price: string; desc: string; highlight?: boolean }) {
    return (
        <div
            className={`flex items-start justify-between gap-3 p-3 rounded-lg border ${
                highlight
                    ? "bg-[color-mix(in_oklab,var(--color-accent)_8%,transparent)] border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
                    : "bg-[var(--color-bg-elev-2)] border-[var(--color-border)]"
            }`}
        >
            <div className="min-w-0">
                <p className={`text-sm font-bold ${highlight ? "text-[var(--color-accent)]" : ""}`}>{name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
            </div>
            <p className="text-sm font-bold tabular-nums whitespace-nowrap">{price}</p>
        </div>
    );
}
