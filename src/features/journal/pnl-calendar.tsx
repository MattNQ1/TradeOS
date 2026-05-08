// Month-view P&L calendar. Color-coded daily P&L with prev/next nav.
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { fmtUSD, fmtUSD0 } from "@/features/calculator/calc";
import {
    currentMonthISO,
    dailyPnLMap,
    formatCompactAmount,
    shiftMonth,
    todayISO,
} from "./trade-stats";
import type { Trade } from "./types";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

interface PnLCalendarProps {
    trades: Trade[];
}

export function PnLCalendar({ trades }: PnLCalendarProps) {
    const [month, setMonth] = useState<string>(currentMonthISO());

    const dailyPnL = dailyPnLMap(trades);
    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const monthNum = Number(monthStr); // 1..12

    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0..6 Sun..Sat

    interface Cell { day: number | null; iso: string | null; pnl: number; }
    const cells: Cell[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null, iso: null, pnl: 0 });
    for (let d = 1; d <= daysInMonth; d++) {
        const iso = `${year}-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        cells.push({ day: d, iso, pnl: dailyPnL[iso] ?? 0 });
    }
    while (cells.length % 7 !== 0) cells.push({ day: null, iso: null, pnl: 0 });

    let monthlyTotal = 0;
    let tradedDays = 0;
    for (const c of cells) {
        if (c.iso && dailyPnL[c.iso] !== undefined) {
            monthlyTotal += c.pnl;
            tradedDays++;
        }
    }

    const today = todayISO();

    return (
        <Card>
            <div className="flex items-center justify-between gap-2">
                <button
                    type="button"
                    aria-label="Previous month"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)]"
                    onClick={() => setMonth((m) => shiftMonth(m, -1))}
                >
                    ‹
                </button>
                <div className="flex flex-col items-center gap-0.5">
                    <h2 className="text-base font-bold tracking-tight">
                        {MONTH_NAMES[monthNum - 1]} {year}
                    </h2>
                    <span className={`text-xs font-semibold tabular-nums ${
                        tradedDays === 0
                            ? "text-[var(--color-text-muted)]"
                            : monthlyTotal > 0
                                ? "text-[var(--color-gain)]"
                                : monthlyTotal < 0
                                    ? "text-[var(--color-loss)]"
                                    : "text-[var(--color-text-muted)]"
                    }`}>
                        {tradedDays === 0
                            ? "No trades this month"
                            : `${monthlyTotal >= 0 ? "+" : ""}${fmtUSD0.format(monthlyTotal)}`}
                    </span>
                </div>
                <button
                    type="button"
                    aria-label="Next month"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)]"
                    onClick={() => setMonth((m) => shiftMonth(m, 1))}
                >
                    ›
                </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((c, i) => {
                    if (c.iso === null) {
                        return <div key={i} className="aspect-square" />;
                    }
                    const hasTrade = dailyPnL[c.iso] !== undefined;
                    const isToday = c.iso === today;
                    const bg =
                        !hasTrade
                            ? "bg-[var(--color-bg-elev-2)]"
                            : c.pnl > 0
                                ? "bg-[color-mix(in_oklab,var(--color-gain)_12%,transparent)] border-[color-mix(in_oklab,var(--color-gain)_30%,transparent)]"
                                : c.pnl < 0
                                    ? "bg-[color-mix(in_oklab,var(--color-loss)_12%,transparent)] border-[color-mix(in_oklab,var(--color-loss)_30%,transparent)]"
                                    : "bg-[var(--color-bg-elev-2)]";
                    const border = isToday
                        ? "border-2 border-[var(--color-accent)]"
                        : hasTrade ? "border" : "border border-transparent";
                    const pnlColor = c.pnl > 0
                        ? "text-[var(--color-gain)]"
                        : c.pnl < 0
                            ? "text-[var(--color-loss)]"
                            : "text-[var(--color-text-muted)]";
                    return (
                        <div
                            key={i}
                            className={`aspect-square rounded-md p-1 flex flex-col justify-between overflow-hidden ${bg} ${border}`}
                            title={`${c.iso}${hasTrade ? ` • ${fmtUSD.format(c.pnl)}` : ""}`}
                        >
                            <div className="text-[10px] font-semibold leading-none text-[var(--color-text-muted)]">
                                {c.day}
                            </div>
                            {hasTrade && (
                                <div className={`text-[9px] font-bold leading-none text-right tabular-nums truncate ${pnlColor}`}>
                                    {formatCompactAmount(c.pnl)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center gap-3 text-[11px] text-[var(--color-text-muted)] mt-1">
                <Legend label="Win day" tone="gain" />
                <Legend label="Loss day" tone="loss" />
                <Legend label="Today" tone="today" />
            </div>
        </Card>
    );
}

function Legend({ label, tone }: { label: string; tone: "gain" | "loss" | "today" }) {
    const cls =
        tone === "gain"
            ? "bg-[color-mix(in_oklab,var(--color-gain)_15%,transparent)] border-[color-mix(in_oklab,var(--color-gain)_35%,transparent)]"
            : tone === "loss"
                ? "bg-[color-mix(in_oklab,var(--color-loss)_15%,transparent)] border-[color-mix(in_oklab,var(--color-loss)_35%,transparent)]"
                : "border-2 border-[var(--color-accent)]";
    return (
        <span className="flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 rounded ${cls} border`} />
            {label}
        </span>
    );
}
