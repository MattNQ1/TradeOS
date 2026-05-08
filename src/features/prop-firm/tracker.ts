// Pure functions that turn the user's config + trade history into tracker numbers.
import { tradePnL, todayISO } from "@/features/journal/trade-stats";
import type { Trade } from "@/features/journal/types";
import { findPreset } from "./presets";
import type { ActiveRules, PropFirmConfig } from "./types";

/** Resolve the user's selection into the rules the trackers actually use. */
export function getActiveRules(config: PropFirmConfig): ActiveRules | null {
    if (config.preset === "none") return null;

    if (config.preset === "custom") {
        return {
            label: "Custom",
            accountSize: config.custom_account_size,
            target: config.custom_target,
            maxLoss: config.custom_max_loss,
            daily: config.custom_daily,
            trailing: config.custom_trailing,
        };
    }

    const preset = findPreset(config.preset);
    if (!preset) return null;
    return {
        label: `${preset.firm} • ${preset.account}`,
        accountSize: preset.accountSize,
        target: preset.target,
        maxLoss: preset.maxLoss,
        daily: preset.daily,
        trailing: preset.trailing,
    };
}

// ============================================================
// Daily loss tracker
// ============================================================

export interface DailyTrackerState {
    /** Today's net P&L (can be positive or negative). */
    todayPnL: number;
    /** Today's loss as a positive number (0 if not at a loss). */
    todayLoss: number;
    /** Daily limit, or 0 if not set. */
    limit: number;
    /** Percent of the limit consumed (0..100). 0 if no limit. */
    pct: number;
    /** Buffer remaining in dollars. 0 if no limit or limit hit. */
    bufferRemaining: number;
    /** "ok" | "warn" (>=75%) | "danger" (>=100%) | "none" (no limit set) */
    status: "ok" | "warn" | "danger" | "none";
}

export function calcDailyTracker(trades: Trade[], rules: ActiveRules): DailyTrackerState {
    const today = todayISO();
    let todayPnL = 0;
    for (const t of trades) {
        if (t.date === today) todayPnL += tradePnL(t);
    }
    const todayLoss = Math.max(0, -todayPnL);

    if (!rules.daily) {
        return { todayPnL, todayLoss, limit: 0, pct: 0, bufferRemaining: 0, status: "none" };
    }

    const pct = Math.min(100, (todayLoss / rules.daily) * 100);
    const bufferRemaining = Math.max(0, rules.daily - todayLoss);
    const status = pct >= 100 ? "danger" : pct >= 75 ? "warn" : "ok";
    return { todayPnL, todayLoss, limit: rules.daily, pct, bufferRemaining, status };
}

// ============================================================
// Trailing drawdown
// ============================================================

export interface TrailingDrawdownState {
    startBalance: number;
    peakBalance: number;
    currentBalance: number;
    trailingStop: number;
    bufferRemaining: number;
    isTrailing: boolean;
}

export function calcTrailingDrawdown(trades: Trade[], rules: ActiveRules): TrailingDrawdownState | null {
    if (!rules.accountSize) return null;

    // Walk trades chronologically to track balance + peak.
    const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
    let balance = rules.accountSize;
    let peak = rules.accountSize;
    for (const t of sorted) {
        balance += tradePnL(t);
        if (balance > peak) peak = balance;
    }

    const isTrailing = rules.trailing > 0;
    const trailingStop = isTrailing
        ? Math.max(rules.accountSize - rules.maxLoss, peak - rules.trailing)
        : rules.accountSize - rules.maxLoss;

    const bufferRemaining = balance - trailingStop;

    return {
        startBalance: rules.accountSize,
        peakBalance: peak,
        currentBalance: balance,
        trailingStop,
        bufferRemaining,
        isTrailing,
    };
}

// ============================================================
// Profit target
// ============================================================

export interface ProfitTargetState {
    current: number;
    target: number;
    pct: number;            // 0..100
    remaining: number;      // dollars to go (negative = exceeded)
    reached: boolean;
}

export function calcProfitTarget(trades: Trade[], rules: ActiveRules): ProfitTargetState | null {
    if (!rules.target) return null;
    const totalPnL = trades.reduce((sum, t) => sum + tradePnL(t), 0);
    const pct = Math.max(0, Math.min(100, (totalPnL / rules.target) * 100));
    return {
        current: totalPnL,
        target: rules.target,
        pct,
        remaining: rules.target - totalPnL,
        reached: totalPnL >= rules.target,
    };
}
