// Profit target progress bar.
"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { fmtUSD0 } from "@/features/calculator/calc";
import type { ProfitTargetState } from "./tracker";

interface Props {
    state: ProfitTargetState | null;
}

export function ProfitTargetCard({ state }: Props) {
    return (
        <Card>
            <CardTitle>Profit target</CardTitle>

            {!state ? (
                <p className="text-sm text-[var(--color-text-muted)] py-2">
                    No profit target set.
                </p>
            ) : (
                <ProgressBlock state={state} />
            )}
        </Card>
    );
}

function ProgressBlock({ state }: { state: ProfitTargetState }) {
    const status = state.reached
        ? "🎉 Profit target reached!"
        : state.current <= 0
            ? "Get into profit to start working the target."
            : `${fmtUSD0.format(state.remaining)} to go.`;

    const statusClass = state.reached
        ? "text-[var(--color-gain)] font-semibold"
        : "text-[var(--color-text-muted)]";

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm tabular-nums text-[var(--color-text-muted)]">
                <span>{fmtUSD0.format(state.current)}</span>
                <span>{fmtUSD0.format(state.target)}</span>
            </div>
            <div className="h-2 bg-[var(--color-bg-elev-2)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--color-gain)] transition-all"
                    style={{ width: `${state.pct}%` }}
                />
            </div>
            <p className={`text-xs mt-1 ${statusClass}`}>{status}</p>
        </div>
    );
}
