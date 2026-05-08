// Premium-feel stats grid. The numbers serious traders track.
"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { fmtUSD, fmtUSD0 } from "@/features/calculator/calc";
import type { AdvancedStats } from "./calc";

interface AdvancedStatsCardProps {
    stats: AdvancedStats;
}

export function AdvancedStatsCard({ stats }: AdvancedStatsCardProps) {
    return (
        <Card>
            <CardTitle>Performance</CardTitle>

            {/* Hero line */}
            <div className="bg-[var(--color-bg-elev-2)] rounded-xl p-4 border border-[var(--color-border)]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Total P&amp;L
                </p>
                <p
                    className={`text-3xl font-bold tabular-nums leading-tight mt-1 ${
                        stats.totalPnL > 0
                            ? "text-[var(--color-gain)]"
                            : stats.totalPnL < 0
                                ? "text-[var(--color-loss)]"
                                : ""
                    }`}
                >
                    {stats.totalPnL >= 0 ? "+" : ""}
                    {fmtUSD0.format(stats.totalPnL)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                    {stats.total} trade{stats.total === 1 ? "" : "s"} · {stats.wins} wins · {stats.losses} losses
                    {stats.breakeven > 0 ? ` · ${stats.breakeven} breakeven` : ""}
                </p>
            </div>

            {/* 2x2 main metrics */}
            <div className="grid grid-cols-2 gap-2">
                <Stat
                    label="Win rate"
                    value={stats.winRate === null ? "—" : `${(stats.winRate * 100).toFixed(0)}%`}
                />
                <Stat
                    label="Profit factor"
                    value={
                        stats.profitFactor === null
                            ? "—"
                            : stats.profitFactor === Infinity
                                ? "∞"
                                : stats.profitFactor.toFixed(2)
                    }
                    hint="≥1.5 is solid"
                />
                <Stat
                    label="Expectancy"
                    value={stats.expectancy === null ? "—" : fmtUSD.format(stats.expectancy)}
                    hint="$ per trade"
                    tone={stats.expectancy === null ? undefined : stats.expectancy > 0 ? "gain" : stats.expectancy < 0 ? "loss" : undefined}
                />
                <Stat
                    label="Payoff ratio"
                    value={stats.payoffRatio === null ? "—" : stats.payoffRatio.toFixed(2)}
                    hint="avg win ÷ avg loss"
                />
            </div>

            {/* Avg win / loss / best / worst row */}
            <div className="grid grid-cols-2 gap-2">
                <Stat
                    label="Avg win"
                    value={stats.avgWin === null ? "—" : fmtUSD0.format(stats.avgWin)}
                    tone="gain"
                />
                <Stat
                    label="Avg loss"
                    value={stats.avgLoss === null ? "—" : `−${fmtUSD0.format(stats.avgLoss)}`}
                    tone="loss"
                />
                <Stat
                    label="Best trade"
                    value={stats.bestTrade === 0 ? "—" : `+${fmtUSD0.format(stats.bestTrade)}`}
                    tone={stats.bestTrade > 0 ? "gain" : undefined}
                />
                <Stat
                    label="Worst trade"
                    value={stats.worstTrade === 0 ? "—" : fmtUSD0.format(stats.worstTrade)}
                    tone={stats.worstTrade < 0 ? "loss" : undefined}
                />
            </div>

            {/* Risk row */}
            <div className="grid grid-cols-3 gap-2">
                <Stat
                    label="Max DD"
                    value={stats.maxDrawdown === 0 ? "—" : `−${fmtUSD0.format(stats.maxDrawdown)}`}
                    tone={stats.maxDrawdown > 0 ? "loss" : undefined}
                    hint="peak to trough"
                />
                <Stat
                    label="Win streak"
                    value={String(stats.maxWinStreak)}
                    hint="longest"
                />
                <Stat
                    label="Loss streak"
                    value={String(stats.maxLossStreak)}
                    hint="longest"
                />
            </div>
        </Card>
    );
}

function Stat({
    label, value, hint, tone,
}: {
    label: string;
    value: string;
    hint?: string;
    tone?: "gain" | "loss";
}) {
    const colorClass =
        tone === "gain" ? "text-[var(--color-gain)]" :
        tone === "loss" ? "text-[var(--color-loss)]" : "";
    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {label}
            </p>
            <p className={`text-base font-bold tabular-nums leading-tight mt-0.5 ${colorClass}`}>
                {value}
            </p>
            {hint && (
                <p className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{hint}</p>
            )}
        </div>
    );
}
