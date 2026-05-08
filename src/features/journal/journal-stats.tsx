// Top-of-page stat cards for the journal.
"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { fmtUSD0 } from "@/features/calculator/calc";
import type { JournalStats } from "./trade-stats";

interface JournalStatsProps {
    stats: JournalStats;
}

export function JournalStatsCard({ stats }: JournalStatsProps) {
    return (
        <Card>
            <CardTitle>Journal stats</CardTitle>
            <div className="grid grid-cols-3 gap-2">
                <Mini label="Trades" value={String(stats.total)} />
                <Mini
                    label="Win rate"
                    value={stats.winRate === null ? "—" : `${Math.round(stats.winRate * 100)}%`}
                />
                <Mini
                    label="Total P&L"
                    value={fmtUSD0.format(stats.totalPnL)}
                    color={stats.totalPnL > 0 ? "gain" : stats.totalPnL < 0 ? "loss" : undefined}
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Mini
                    label="Avg R"
                    value={stats.avgR === null ? "—" : `${stats.avgR >= 0 ? "+" : ""}${stats.avgR.toFixed(2)}R`}
                    color={stats.avgR === null ? undefined : stats.avgR > 0 ? "gain" : stats.avgR < 0 ? "loss" : undefined}
                />
                <Mini
                    label="Today's P&L"
                    value={fmtUSD0.format(stats.todayPnL)}
                    color={stats.todayPnL > 0 ? "gain" : stats.todayPnL < 0 ? "loss" : undefined}
                />
            </div>
        </Card>
    );
}

function Mini({ label, value, color }: { label: string; value: string; color?: "gain" | "loss" }) {
    const colorClass =
        color === "gain" ? "text-[var(--color-gain)]" :
        color === "loss" ? "text-[var(--color-loss)]" : "";
    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
            <p className={`text-base font-bold tabular-nums leading-tight mt-0.5 ${colorClass}`}>{value}</p>
        </div>
    );
}
