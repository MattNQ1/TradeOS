// Reusable "Upgrade to Pro" CTA card. Drop in anywhere a Free user
// hits a paywall. Routes to /settings#subscription on click.
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
    title?: string;
    description?: string;
    /** Optional list of features unlocked by upgrading. */
    features?: string[];
}

export function UpgradePrompt({
    title = "Unlock with Pro",
    description = "This feature is part of TradeOS Pro. Upgrade for the full toolkit — or grab a Lifetime license to never see paywalls again.",
    features,
}: UpgradePromptProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-violet-700/10 to-transparent pointer-events-none" />

            <div className="relative p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded bg-[var(--color-accent)]">
                        Pro
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                        or Lifetime
                    </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1.5">{description}</p>

                {features && features.length > 0 && (
                    <ul className="space-y-1.5 my-4">
                        {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
                                <span className="text-[var(--color-text)]">{f}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex flex-col gap-2 mt-4">
                    <Link href="/settings">
                        <Button className="w-full">Upgrade to Pro · $19/mo</Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="secondary" className="w-full">Lifetime · $199 once</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
