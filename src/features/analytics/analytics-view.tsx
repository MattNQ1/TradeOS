// Top-level Client Component for the analytics dashboard.
// Pure derivation from a list of trades — no server actions, no mutations.
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    calcAdvancedStats,
    calcEquityCurve,
    calcPnLByContract,
    calcPnLByDayOfWeek,
    calcPnLByDirection,
    calcRMultipleDistribution,
} from "./calc";
import { AdvancedStatsCard } from "./advanced-stats";
import { EquityCurveCard } from "./equity-curve";
import { BarChart, type BarDatum } from "./bar-chart";
import type { Trade } from "@/features/journal/types";

interface AnalyticsViewProps {
    trades: Trade[];
    userEmail: string;
}

export function AnalyticsView({ trades, userEmail }: AnalyticsViewProps) {
    const stats = useMemo(() => calcAdvancedStats(trades), [trades]);
    const equityPoints = useMemo(() => calcEquityCurve(trades), [trades]);
    const byDay = useMemo(() => calcPnLByDayOfWeek(trades), [trades]);
    const byContract = useMemo(() => calcPnLByContract(trades), [trades]);
    const byDirection = useMemo(() => calcPnLByDirection(trades), [trades]);
    const rDist = useMemo(() => calcRMultipleDistribution(trades), [trades]);

    // Empty state — first-time user. Give them a clear next step.
    if (trades.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome to TradeOS</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Signed in as <span className="text-[var(--color-text)]">{userEmail}</span>
                    </p>
                </div>

                <Card>
                    <CardTitle>Nothing to show yet</CardTitle>
                    <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                        Log a few trades in the Journal and this page lights up: equity curve, profit factor, win rate by day, P&amp;L by contract. Nothing inflated &mdash; just what the math actually says.
                    </p>
                    <Link href="/journal" className="block mt-2">
                        <Button className="w-full">Log your first trade</Button>
                    </Link>
                </Card>

                <Card>
                    <CardTitle>How TradeOS works</CardTitle>
                    <ol className="text-sm text-[var(--color-text-muted)] space-y-2 -mt-1">
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">1.</span>
                            <span><span className="text-[var(--color-text)] font-medium">Plan</span> &mdash; size every trade in the Calc tab before you click.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">2.</span>
                            <span><span className="text-[var(--color-text)] font-medium">Log</span> &mdash; tap once in the Journal after each fill. Two minutes a day.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">3.</span>
                            <span><span className="text-[var(--color-text)] font-medium">Learn</span> &mdash; let the analytics + the AI tab tell you what&rsquo;s actually working.</span>
                        </li>
                    </ol>
                </Card>
            </div>
        );
    }

    // ---- BarChart inputs ----
    const dayData: BarDatum[] = byDay.map((d) => ({
        label: d.label,
        value: d.pnl,
        sublabel: d.trades > 0 ? `${d.trades}` : undefined,
    }));

    const contractData: BarDatum[] = byContract.slice(0, 8).map((c) => ({
        label: c.contract,
        value: c.pnl,
        sublabel: `${c.trades}t · ${c.winRate === null ? "—" : `${Math.round(c.winRate * 100)}%`}`,
    }));

    const rData: BarDatum[] = rDist.map((b) => ({
        label: b.label,
        value: b.count,
    }));

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Signed in as <span className="text-[var(--color-text)]">{userEmail}</span>
                </p>
            </div>

            <AdvancedStatsCard stats={stats} />

            <EquityCurveCard points={equityPoints} />

            <Card>
                <CardTitle>P&amp;L by day of week</CardTitle>
                <BarChart data={dayData} />
            </Card>

            <Card>
                <CardTitle>P&amp;L by contract</CardTitle>
                <BarChart data={contractData} />
            </Card>

            <Card>
                <CardTitle>Long vs Short</CardTitle>
                <div className="grid grid-cols-2 gap-3">
                    <DirectionPanel
                        label="Long"
                        pnl={byDirection.long.pnl}
                        trades={byDirection.long.trades}
                        winRate={byDirection.long.winRate}
                        tone="gain"
                    />
                    <DirectionPanel
                        label="Short"
                        pnl={byDirection.short.pnl}
                        trades={byDirection.short.trades}
                        winRate={byDirection.short.winRate}
                        tone="loss"
                    />
                </div>
            </Card>

            {rData.length > 0 && (
                <Card>
                    <CardTitle>R-multiple distribution</CardTitle>
                    <p className="text-xs text-[var(--color-text-muted)] -mt-1">
                        How many trades closed at each R-multiple. Big +R clusters = winners running.
                    </p>
                    <BarChart data={rData} formatValue={(v) => String(v)} />
                </Card>
            )}
        </div>
    );
}

// ============================================================
// Sub-components
// ============================================================

function DirectionPanel({
    label, pnl, trades, winRate, tone,
}: {
    label: string;
    pnl: number;
    trades: number;
    winRate: number | null;
    tone: "gain" | "loss";
}) {
    const fmtPnL = `${pnl >= 0 ? "+" : ""}$${Math.round(Math.abs(pnl)).toLocaleString()}`;
    const colorClass =
        pnl > 0 ? "text-[var(--color-gain)]" :
        pnl < 0 ? "text-[var(--color-loss)]" : "";
    const accentBg =
        tone === "gain"
            ? "bg-[color-mix(in_oklab,var(--color-gain)_8%,transparent)] border-[color-mix(in_oklab,var(--color-gain)_25%,transparent)]"
            : "bg-[color-mix(in_oklab,var(--color-loss)_8%,transparent)] border-[color-mix(in_oklab,var(--color-loss)_25%,transparent)]";

    return (
        <div className={`rounded-xl p-3.5 border ${accentBg}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {label}
            </p>
            <p className={`text-xl font-bold tabular-nums leading-tight mt-1 ${colorClass}`}>
                {trades === 0 ? "—" : (pnl >= 0 ? "+" : "−") + fmtPnL.replace(/[+−]/, "")}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                {trades} trade{trades === 1 ? "" : "s"}
                {winRate !== null && ` · ${Math.round(winRate * 100)}% win`}
            </p>
        </div>
    );
}
