// Sorted trade list. Click a trade to edit it.
"use client";

import { fmtUSD0, fmtNum } from "@/features/calculator/calc";
import { tradePnL, tradeRMultiple, formatShortDate } from "./trade-stats";
import type { Trade } from "./types";

interface TradeListProps {
    trades: Trade[];
    onEdit: (trade: Trade) => void;
}

export function TradeList({ trades, onEdit }: TradeListProps) {
    if (trades.length === 0) {
        return (
            <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">
                <p>Nothing logged yet.</p>
                <p className="mt-1">Hit <strong className="text-[var(--color-text)]">+ Add trade</strong> when you take your next one.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {trades.map((t) => {
                const pnl = tradePnL(t);
                const r = tradeRMultiple(t);
                const noteSnippet = t.notes ? ` • ${t.notes.slice(0, 40)}${t.notes.length > 40 ? "…" : ""}` : "";
                return (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => onEdit(t)}
                        className="text-left bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-lg px-3 py-2.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span>{t.contract}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    t.direction === "long"
                                        ? "bg-[color-mix(in_oklab,var(--color-gain)_15%,transparent)] text-[var(--color-gain)]"
                                        : "bg-[color-mix(in_oklab,var(--color-loss)_15%,transparent)] text-[var(--color-loss)]"
                                }`}>
                                    {t.direction}
                                </span>
                                <span className="text-[var(--color-text-muted)] font-normal text-xs">{t.contracts}×</span>
                            </div>
                            <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {formatShortDate(t.date)} • {fmtNum.format(t.entry_price)} → {fmtNum.format(t.exit_price)}
                                {noteSnippet}
                            </div>
                        </div>
                        <div className="self-center text-right">
                            <div className={`text-base font-bold tabular-nums ${pnl >= 0 ? "text-[var(--color-gain)]" : "text-[var(--color-loss)]"}`}>
                                {fmtUSD0.format(pnl)}
                            </div>
                            {r !== null && (
                                <div className="text-[11px] text-[var(--color-text-muted)] tabular-nums">
                                    {r >= 0 ? "+" : ""}{r.toFixed(2)}R
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
