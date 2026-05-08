// Daily loss limit progress bar.
"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { fmtUSD0 } from "@/features/calculator/calc";
import type { DailyTrackerState } from "./tracker";

interface Props {
    state: DailyTrackerState;
}

export function DailyTrackerCard({ state }: Props) {
    return (
        <Card>
            <CardTitle>Daily loss limit</CardTitle>
            <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                Tracks today&apos;s realized P&amp;L from your journal.
            </p>

            {state.status === "none" ? (
                <p className="text-sm text-[var(--color-text-muted)] py-2">
                    No daily limit set for this preset.
                </p>
            ) : (
                <ProgressBlock state={state} />
            )}
        </Card>
    );
}

function ProgressBlock({ state }: { state: DailyTrackerState }) {
    const fillColor =
        state.status === "danger" ? "bg-[var(--color-loss)]" :
        state.status === "warn"   ? "bg-[var(--color-warn)]" :
                                    "bg-[var(--color-loss)]";

    const statusText = (() => {
        if (state.todayLoss === 0 && state.todayPnL >= 0) return "No realized losses today.";
        if (state.status === "danger") return "🚫 Daily loss limit hit. Stop trading.";
        if (state.status === "warn") return `⚠️ ${(100 - state.pct).toFixed(0)}% of daily buffer left.`;
        return `${fmtUSD0.format(state.bufferRemaining)} of daily buffer remaining.`;
    })();

    const statusClass =
        state.todayLoss === 0 && state.todayPnL >= 0 ? "text-[var(--color-gain)] font-semibold" :
        state.status === "danger" ? "text-[var(--color-loss)] font-semibold" :
        state.status === "warn"   ? "text-[var(--color-warn)] font-semibold" :
                                    "text-[var(--color-text-muted)]";

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm tabular-nums text-[var(--color-text-muted)]">
                <span>{fmtUSD0.format(-state.todayLoss)}</span>
                <span>−{fmtUSD0.format(state.limit)}</span>
            </div>
            <div className="h-2 bg-[var(--color-bg-elev-2)] rounded-full overflow-hidden">
                <div
                    className={`h-full ${fillColor} transition-all`}
                    style={{ width: `${state.pct}%` }}
                />
            </div>
            <p className={`text-xs mt-1 ${statusClass}`}>{statusText}</p>
        </div>
    );
}
