// Trailing drawdown rules display.
"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { fmtUSD0 } from "@/features/calculator/calc";
import type { TrailingDrawdownState } from "./tracker";

interface Props {
    state: TrailingDrawdownState | null;
}

export function TrailingDrawdownCard({ state }: Props) {
    return (
        <Card>
            <CardTitle>Trailing drawdown</CardTitle>
            <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                {state?.isTrailing
                    ? "Calculated from your journal: peak balance minus the firm's trailing distance."
                    : "Static drawdown — fixed below your starting balance."}
            </p>

            {!state ? (
                <p className="text-sm text-[var(--color-text-muted)] py-2">
                    Set an account size to enable.
                </p>
            ) : (
                <div className="flex flex-col">
                    <Row label="Starting balance" value={fmtUSD0.format(state.startBalance)} />
                    <Row label="Peak balance"     value={fmtUSD0.format(state.peakBalance)} />
                    <Row
                        label="Current balance"
                        value={fmtUSD0.format(state.currentBalance)}
                        tone={state.currentBalance >= state.startBalance ? "gain" : "loss"}
                    />
                    <Row label="Trailing stop" value={fmtUSD0.format(state.trailingStop)} />
                    <Row
                        label="Buffer remaining"
                        value={fmtUSD0.format(state.bufferRemaining)}
                        tone={
                            state.bufferRemaining <= 0 ? "loss" :
                            state.bufferRemaining < (state.startBalance - state.trailingStop) * 0.25 ? "warn" :
                            "gain"
                        }
                        last
                    />
                </div>
            )}
        </Card>
    );
}

function Row({
    label, value, tone, last,
}: { label: string; value: string; tone?: "gain" | "loss" | "warn"; last?: boolean }) {
    const color =
        tone === "gain" ? "text-[var(--color-gain)]" :
        tone === "loss" ? "text-[var(--color-loss)]" :
        tone === "warn" ? "text-[var(--color-warn)]" : "";
    return (
        <div className={`flex justify-between items-center py-2.5 text-sm ${last ? "" : "border-b border-[var(--color-border-soft)]"}`}>
            <span className="text-[var(--color-text-muted)]">{label}</span>
            <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
        </div>
    );
}
