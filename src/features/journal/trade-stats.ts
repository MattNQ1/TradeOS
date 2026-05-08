// Pure functions for trade analytics. No side effects, no React.
// Reused by the journal stats card, calendar, and (later) prop firm tracker.
import { CONTRACTS } from "@/features/calculator/contracts";
import type { Trade } from "./types";

/** Realized P&L for a closed trade, after round-turn commissions. */
export function tradePnL(t: Trade): number {
    const spec = CONTRACTS[t.contract];
    if (!spec) return 0;
    const sign = t.direction === "long" ? 1 : -1;
    const priceDelta = (t.exit_price - t.entry_price) * sign;
    const gross = priceDelta * spec.pointValue * t.contracts;
    const fees = (t.commission || 0) * 2 * t.contracts;
    return gross - fees;
}

/** R-multiple = pnl / planned risk. Null if no planned risk recorded. */
export function tradeRMultiple(t: Trade): number | null {
    if (!t.planned_risk || t.planned_risk <= 0) return null;
    return tradePnL(t) / t.planned_risk;
}

export interface JournalStats {
    total: number;
    wins: number;
    losses: number;
    winRate: number | null;        // 0..1
    totalPnL: number;
    avgR: number | null;
    todayPnL: number;
}

export function calcJournalStats(trades: Trade[], today: string): JournalStats {
    const total = trades.length;
    let wins = 0;
    let losses = 0;
    let totalPnL = 0;
    let todayPnL = 0;
    const rs: number[] = [];

    for (const t of trades) {
        const pnl = tradePnL(t);
        totalPnL += pnl;
        if (pnl > 0) wins++;
        else if (pnl < 0) losses++;
        if (t.date === today) todayPnL += pnl;
        const r = tradeRMultiple(t);
        if (r !== null) rs.push(r);
    }

    return {
        total,
        wins,
        losses,
        winRate: total > 0 ? wins / total : null,
        totalPnL,
        avgR: rs.length > 0 ? rs.reduce((a, b) => a + b, 0) / rs.length : null,
        todayPnL,
    };
}

/** Group trades by ISO date string. Used by the calendar. */
export function dailyPnLMap(trades: Trade[]): Record<string, number> {
    const out: Record<string, number> = {};
    for (const t of trades) {
        out[t.date] = (out[t.date] ?? 0) + tradePnL(t);
    }
    return out;
}

// ------------------------------------------------------------
// Date helpers (UTC-stable, no timezone surprises in storage)
// ------------------------------------------------------------

export function todayISO(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

export function currentMonthISO(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

export function shiftMonth(monthISO: string, delta: number): string {
    const [y, m] = monthISO.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yy}-${mm}`;
}

export function formatShortDate(iso: string): string {
    const [y, m, d] = iso.split("-");
    return `${m}/${d}/${y.slice(2)}`;
}

/** Compact $ for calendar cells: $1.2K, $850, -$340. */
export function formatCompactAmount(amount: number): string {
    const sign = amount < 0 ? "-" : "+";
    const abs = Math.abs(amount);
    if (abs >= 10000) return `${sign}$${Math.round(abs / 1000)}K`;
    if (abs >= 1000)  return `${sign}$${(abs / 1000).toFixed(1)}K`;
    return `${sign}$${Math.round(abs)}`;
}
