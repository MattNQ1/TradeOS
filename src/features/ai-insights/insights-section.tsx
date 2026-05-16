// AI-powered journal insights section. Sits inside the Journal page.
// Pro-only — free users see a polished pitch card. Pro users see their
// latest analysis + a button to regenerate.
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateInsight } from "./actions";
import type { JournalInsight } from "./types";

interface InsightsSectionProps {
    isPaid: boolean;
    latestInsight: JournalInsight | null;
    /** Total trades the user has — used to decide if there's enough data. */
    tradesCount: number;
}

export function InsightsSection({ isPaid, latestInsight, tradesCount }: InsightsSectionProps) {
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const onGenerate = () => {
        setError(null);
        startTransition(async () => {
            const res = await generateInsight();
            if (!res.ok) {
                setError(res.error ?? "Failed to generate insights.");
                return;
            }
            router.refresh();
        });
    };

    // ---- Free tier: pitch card ----
    if (!isPaid) {
        return (
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/12 via-emerald-700/4 to-transparent pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <CardTitle>AI insights</CardTitle>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)] text-white">
                            Pro
                        </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                        Hand your journal to a senior trading coach. Get back the patterns you can&rsquo;t see, the mistakes you keep making, and the setups that are actually working.
                    </p>
                    <ul className="flex flex-col gap-1.5 mt-2">
                        {[
                            "Patterns you can't spot in your own trades",
                            "Revenge sizing, FOMO entries, tilt — flagged with evidence",
                            "Your strongest setup, with the stats to prove it",
                            "Recent sessions compared to your earlier ones",
                        ].map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
                                <span className="text-[var(--color-text)]">{f}</span>
                            </li>
                        ))}
                    </ul>
                    <Link href="/settings" className="block mt-3">
                        <Button className="w-full">Try Pro free</Button>
                    </Link>
                </div>
            </Card>
        );
    }

    // ---- Pro tier ----
    const hasInsight = latestInsight !== null;
    const insightDate = hasInsight
        ? new Date(latestInsight.created_at)
        : null;
    const insightDateText = insightDate
        ? new Intl.DateTimeFormat(undefined, {
            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
        }).format(insightDate)
        : null;

    return (
        <Card>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <CardTitle>AI insights</CardTitle>
                    {insightDateText && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            Last analyzed {insightDateText} · {latestInsight?.trades_analyzed} trades
                        </p>
                    )}
                </div>
                <Button
                    size="sm"
                    onClick={onGenerate}
                    disabled={pending || tradesCount < 5}
                >
                    {pending ? "Analyzing…" : hasInsight ? "Re-analyze" : "Generate"}
                </Button>
            </div>

            {error && (
                <div className="bg-[color-mix(in_oklab,var(--color-loss)_8%,transparent)] border border-[color-mix(in_oklab,var(--color-loss)_30%,transparent)] rounded-lg p-3">
                    <p className="text-sm text-[var(--color-loss)]">{error}</p>
                </div>
            )}

            {pending && !error && (
                <div className="py-6 text-center">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Reading your trades, finding patterns&hellip;
                    </p>
                </div>
            )}

            {!hasInsight && !pending && !error && (
                <div className="py-4 text-center">
                    {tradesCount < 5 ? (
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Log at least 5 trades to enable analysis. You have <span className="font-semibold text-[var(--color-text)]">{tradesCount}</span>.
                        </p>
                    ) : (
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Tap <strong className="text-[var(--color-text)]">Generate</strong> for your first read. Takes about 10 seconds.
                        </p>
                    )}
                </div>
            )}

            {hasInsight && !pending && (
                <InsightContent insight={latestInsight} />
            )}
        </Card>
    );
}

function InsightContent({ insight }: { insight: JournalInsight }) {
    return (
        <div className="flex flex-col gap-3">
            {/* Hero summary */}
            {insight.summary && (
                <div className="bg-gradient-to-br from-emerald-600/12 via-emerald-700/4 to-transparent border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] rounded-lg p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-1">
                        Headline
                    </p>
                    <p className="text-sm font-medium text-[var(--color-text)] leading-relaxed">
                        {insight.summary}
                    </p>
                </div>
            )}

            {/* Patterns */}
            {insight.patterns.length > 0 && (
                <InsightBlock title="Patterns" icon="📈" items={insight.patterns} />
            )}

            {/* Emotional alerts */}
            {insight.emotional_alerts.length > 0 && (
                <InsightBlock
                    title="Emotional alerts"
                    icon="⚠️"
                    items={insight.emotional_alerts}
                    tone="warn"
                />
            )}

            {/* Improvements */}
            {insight.improvements.length > 0 && (
                <InsightBlock
                    title="Improvements"
                    icon="✨"
                    items={insight.improvements}
                    tone="gain"
                />
            )}

            {/* Strongest setup — single sentence */}
            {insight.strongest_setup && (
                <SinglePoint title="Strongest setup" icon="🎯" body={insight.strongest_setup} tone="gain" />
            )}

            {/* Session comparison — single sentence */}
            {insight.session_comparison && (
                <SinglePoint title="Recent vs older" icon="📊" body={insight.session_comparison} />
            )}

            {/* Footer hint */}
            <p className="text-[10px] text-[var(--color-text-subtle)] text-center">
                Analysis based on your last {insight.trades_analyzed} trades · AI-generated, verify against your records
            </p>
        </div>
    );
}

interface InsightBlockProps {
    title: string;
    icon: string;
    items: string[];
    tone?: "gain" | "warn";
}

function InsightBlock({ title, icon, items, tone }: InsightBlockProps) {
    const titleColor =
        tone === "warn" ? "text-[var(--color-warn)]" :
        tone === "gain" ? "text-[var(--color-gain)]" :
        "text-[var(--color-accent)]";

    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg p-3.5">
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${titleColor}`}>
                {icon} {title}
            </p>
            <ul className="flex flex-col gap-1.5">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className={`font-bold leading-tight pt-0.5 ${titleColor}`}>•</span>
                        <span className="text-[var(--color-text)]">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

interface SinglePointProps {
    title: string;
    icon: string;
    body: string;
    tone?: "gain";
}

function SinglePoint({ title, icon, body, tone }: SinglePointProps) {
    const titleColor = tone === "gain" ? "text-[var(--color-gain)]" : "text-[var(--color-accent)]";
    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg p-3.5">
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${titleColor}`}>
                {icon} {title}
            </p>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{body}</p>
        </div>
    );
}
