// Pure analytics functions. No React, no DOM.
// All charts and stats derive from these.
import { tradePnL, tradeRMultiple } from "@/features/journal/trade-stats";
import type { Trade } from "@/features/journal/types";

// ============================================================
// Advanced stats — what serious traders track
// ============================================================

export interface AdvancedStats {
    total: number;
    wins: number;
    losses: number;
    breakeven: number;
    winRate: number | null;       // 0..1

    totalPnL: number;
    grossProfit: number;          // sum of all winners
    grossLoss: number;            // sum of all losers (positive number)

    /** Gross profit / gross loss. >1 means net profitable. Industry standard. */
    profitFactor: number | null;

    /** Average $ per trade. Positive expectancy = edge. */
    expectancy: number | null;

    avgWin: number | null;
    avgLoss: number | null;       // positive number

    /** Average winner / Average loser. >1 = winners bigger than losers. */
    payoffRatio: number | null;

    bestTrade: number;
    worstTrade: number;

    /** Largest peak-to-trough drawdown in $ on the equity curve. */
    maxDrawdown: number;

    /** Longest win streak. */
    maxWinStreak: number;
    /** Longest loss streak. */
    maxLossStreak: number;
}

export function calcAdvancedStats(trades: Trade[]): AdvancedStats {
    if (trades.length === 0) {
        return {
            total: 0, wins: 0, losses: 0, breakeven: 0, winRate: null,
            totalPnL: 0, grossProfit: 0, grossLoss: 0,
            profitFactor: null, expectancy: null,
            avgWin: null, avgLoss: null, payoffRatio: null,
            bestTrade: 0, worstTrade: 0,
            maxDrawdown: 0, maxWinStreak: 0, maxLossStreak: 0,
        };
    }

    const sorted = [...trades].sort((a, b) =>
        a.date === b.date ? a.created_at.localeCompare(b.created_at) : a.date.localeCompare(b.date)
    );

    let wins = 0, losses = 0, breakeven = 0;
    let grossProfit = 0, grossLoss = 0;
    let bestTrade = -Infinity, worstTrade = Infinity;
    let totalPnL = 0;

    // For drawdown + streaks we walk in chronological order.
    let runningEquity = 0;
    let peakEquity = 0;
    let maxDrawdown = 0;

    let curWinStreak = 0, curLossStreak = 0;
    let maxWinStreak = 0, maxLossStreak = 0;

    for (const t of sorted) {
        const pnl = tradePnL(t);
        totalPnL += pnl;
        runningEquity += pnl;
        if (runningEquity > peakEquity) peakEquity = runningEquity;
        const drawdown = peakEquity - runningEquity;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;

        if (pnl > 0) {
            wins++;
            grossProfit += pnl;
            curWinStreak++;
            curLossStreak = 0;
            if (curWinStreak > maxWinStreak) maxWinStreak = curWinStreak;
        } else if (pnl < 0) {
            losses++;
            grossLoss += Math.abs(pnl);
            curLossStreak++;
            curWinStreak = 0;
            if (curLossStreak > maxLossStreak) maxLossStreak = curLossStreak;
        } else {
            breakeven++;
            curWinStreak = 0;
            curLossStreak = 0;
        }

        if (pnl > bestTrade) bestTrade = pnl;
        if (pnl < worstTrade) worstTrade = pnl;
    }

    const total = sorted.length;
    const winRate = total > 0 ? wins / total : null;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : null);
    const expectancy = total > 0 ? totalPnL / total : null;
    const avgWin = wins > 0 ? grossProfit / wins : null;
    const avgLoss = losses > 0 ? grossLoss / losses : null;
    const payoffRatio = avgWin !== null && avgLoss !== null && avgLoss > 0 ? avgWin / avgLoss : null;

    return {
        total, wins, losses, breakeven, winRate,
        totalPnL, grossProfit, grossLoss,
        profitFactor, expectancy,
        avgWin, avgLoss, payoffRatio,
        bestTrade: bestTrade === -Infinity ? 0 : bestTrade,
        worstTrade: worstTrade === Infinity ? 0 : worstTrade,
        maxDrawdown, maxWinStreak, maxLossStreak,
    };
}

// ============================================================
// Equity curve — end-of-day cumulative P&L
// ============================================================

export interface EquityPoint {
    date: string;     // YYYY-MM-DD
    equity: number;   // cumulative P&L through this date
    pnl: number;      // P&L on this specific date
}

export function calcEquityCurve(trades: Trade[]): EquityPoint[] {
    if (trades.length === 0) return [];

    // Sum P&L per date.
    const perDay = new Map<string, number>();
    for (const t of trades) {
        perDay.set(t.date, (perDay.get(t.date) ?? 0) + tradePnL(t));
    }

    // Sort dates and walk chronologically.
    const dates = Array.from(perDay.keys()).sort();
    let equity = 0;
    return dates.map((date) => {
        const pnl = perDay.get(date)!;
        equity += pnl;
        return { date, equity, pnl };
    });
}

// ============================================================
// Performance breakdowns
// ============================================================

export interface DayOfWeekStat {
    /** 0=Sun .. 6=Sat */
    dayIdx: number;
    label: string;
    pnl: number;
    trades: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function calcPnLByDayOfWeek(trades: Trade[]): DayOfWeekStat[] {
    const buckets = new Map<number, { pnl: number; trades: number }>();
    for (let i = 0; i < 7; i++) buckets.set(i, { pnl: 0, trades: 0 });

    for (const t of trades) {
        // Parse YYYY-MM-DD as a local date.
        const [y, m, d] = t.date.split("-").map(Number);
        const dayIdx = new Date(y, m - 1, d).getDay();
        const bucket = buckets.get(dayIdx)!;
        bucket.pnl += tradePnL(t);
        bucket.trades++;
    }

    // Return Mon-Fri primarily (futures markets aren't open weekends),
    // but include weekends if there's data.
    const all: DayOfWeekStat[] = [];
    for (let i = 0; i < 7; i++) {
        const b = buckets.get(i)!;
        all.push({ dayIdx: i, label: DAY_LABELS[i], pnl: b.pnl, trades: b.trades });
    }
    // Reorder Mon-first, append Sat/Sun only if they have trades.
    const ordered = [
        all[1], all[2], all[3], all[4], all[5],
        ...(all[6].trades > 0 ? [all[6]] : []),
        ...(all[0].trades > 0 ? [all[0]] : []),
    ];
    return ordered;
}

export interface ContractStat {
    contract: string;
    pnl: number;
    trades: number;
    wins: number;
    winRate: number | null;
}

export function calcPnLByContract(trades: Trade[]): ContractStat[] {
    const buckets = new Map<string, { pnl: number; trades: number; wins: number }>();
    for (const t of trades) {
        const b = buckets.get(t.contract) ?? { pnl: 0, trades: 0, wins: 0 };
        const pnl = tradePnL(t);
        b.pnl += pnl;
        b.trades++;
        if (pnl > 0) b.wins++;
        buckets.set(t.contract, b);
    }
    return Array.from(buckets.entries())
        .map(([contract, b]) => ({
            contract,
            pnl: b.pnl,
            trades: b.trades,
            wins: b.wins,
            winRate: b.trades > 0 ? b.wins / b.trades : null,
        }))
        .sort((a, b) => b.pnl - a.pnl); // Best to worst.
}

export interface DirectionStat {
    direction: "long" | "short";
    pnl: number;
    trades: number;
    wins: number;
    winRate: number | null;
}

export function calcPnLByDirection(trades: Trade[]): { long: DirectionStat; short: DirectionStat } {
    const make = (dir: "long" | "short"): DirectionStat => ({
        direction: dir, pnl: 0, trades: 0, wins: 0, winRate: null,
    });
    const out = { long: make("long"), short: make("short") };

    for (const t of trades) {
        const pnl = tradePnL(t);
        const bucket = out[t.direction];
        bucket.pnl += pnl;
        bucket.trades++;
        if (pnl > 0) bucket.wins++;
    }
    out.long.winRate = out.long.trades > 0 ? out.long.wins / out.long.trades : null;
    out.short.winRate = out.short.trades > 0 ? out.short.wins / out.short.trades : null;
    return out;
}

// ============================================================
// R-multiple distribution (for the histogram)
// ============================================================

export interface RMultipleBucket {
    label: string;          // "≤-2R", "-1R", "0R", "+1R", "+2R", "+3R", "≥+4R"
    count: number;
    /** Center of the bucket in R for sort/display ordering. */
    center: number;
}

export function calcRMultipleDistribution(trades: Trade[]): RMultipleBucket[] {
    const ranges = [
        { label: "≤-2R", min: -Infinity, max: -1.5, center: -2 },
        { label: "-1R",  min: -1.5,      max: -0.5, center: -1 },
        { label: "0R",   min: -0.5,      max: 0.5,  center: 0  },
        { label: "+1R",  min: 0.5,       max: 1.5,  center: 1  },
        { label: "+2R",  min: 1.5,       max: 2.5,  center: 2  },
        { label: "+3R",  min: 2.5,       max: 3.5,  center: 3  },
        { label: "≥+4R", min: 3.5,       max: Infinity, center: 4 },
    ];
    const counts = ranges.map((r) => ({ label: r.label, count: 0, center: r.center }));

    let hasAny = false;
    for (const t of trades) {
        const r = tradeRMultiple(t);
        if (r === null) continue;
        hasAny = true;
        for (let i = 0; i < ranges.length; i++) {
            if (r >= ranges[i].min && r < ranges[i].max) {
                counts[i].count++;
                break;
            }
        }
    }
    return hasAny ? counts : [];
}
