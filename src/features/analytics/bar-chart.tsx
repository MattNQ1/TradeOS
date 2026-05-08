// Reusable SVG bar chart for $ values. Bars above zero = green, below = red.
// Optional secondary text under each bar (e.g., # trades or win rate).
"use client";

import { fmtUSD0 } from "@/features/calculator/calc";

export interface BarDatum {
    label: string;          // x-axis label
    value: number;          // $ value (signed)
    sublabel?: string;      // small text under bar (optional)
}

interface BarChartProps {
    data: BarDatum[];
    height?: number;
    /** Format the value above each bar. Defaults to fmtUSD0. */
    formatValue?: (v: number) => string;
}

export function BarChart({ data, height = 180, formatValue = fmtUSD0.format }: BarChartProps) {
    if (data.length === 0) {
        return (
            <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                No data to chart yet.
            </p>
        );
    }

    const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);
    const allPositive = data.every((d) => d.value >= 0);
    const allNegative = data.every((d) => d.value <= 0);
    const single = allPositive || allNegative;

    // For all-positive we can use the full chart height; otherwise we split at the zero line.
    const chartHeight = height - 40; // reserve space for labels

    return (
        <div className="w-full">
            <div
                className="flex items-end justify-between gap-1.5"
                style={{ height: `${height}px` }}
            >
                {data.map((d, i) => {
                    const ratio = Math.abs(d.value) / max;
                    const barH = single
                        ? Math.max(2, ratio * chartHeight)
                        : Math.max(2, ratio * (chartHeight / 2));
                    const isPositive = d.value >= 0;

                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center min-w-0"
                            style={{ height: `${height}px` }}
                        >
                            {/* Bar container — flex column reverses for negative bars */}
                            {single ? (
                                <SingleBar
                                    value={d.value}
                                    barH={barH}
                                    chartHeight={chartHeight}
                                    isPositive={isPositive}
                                    formatValue={formatValue}
                                />
                            ) : (
                                <SplitBar
                                    value={d.value}
                                    barH={barH}
                                    chartHeight={chartHeight}
                                    isPositive={isPositive}
                                    formatValue={formatValue}
                                />
                            )}

                            {/* Label */}
                            <div className="mt-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] truncate w-full text-center">
                                {d.label}
                            </div>
                            {d.sublabel && (
                                <div className="text-[9px] text-[var(--color-text-subtle)] truncate w-full text-center">
                                    {d.sublabel}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SingleBar({
    value, barH, chartHeight, isPositive, formatValue,
}: {
    value: number; barH: number; chartHeight: number; isPositive: boolean;
    formatValue: (v: number) => string;
}) {
    return (
        <div
            className="w-full flex flex-col items-center justify-end"
            style={{ height: `${chartHeight}px` }}
        >
            <div className="text-[10px] font-bold tabular-nums text-[var(--color-text)] mb-0.5">
                {value === 0 ? "—" : formatValue(value)}
            </div>
            <div
                className="w-full max-w-[36px] rounded-t-md transition-all"
                style={{
                    height: `${barH}px`,
                    background: isPositive
                        ? "linear-gradient(to top, color-mix(in oklab, var(--color-gain) 60%, transparent), var(--color-gain))"
                        : "linear-gradient(to top, color-mix(in oklab, var(--color-loss) 60%, transparent), var(--color-loss))",
                }}
            />
        </div>
    );
}

function SplitBar({
    value, barH, chartHeight, isPositive, formatValue,
}: {
    value: number; barH: number; chartHeight: number; isPositive: boolean;
    formatValue: (v: number) => string;
}) {
    const halfH = chartHeight / 2;
    return (
        <div className="w-full flex flex-col items-center" style={{ height: `${chartHeight}px` }}>
            {/* Top half (positive bars) */}
            <div className="w-full flex flex-col items-center justify-end" style={{ height: `${halfH}px` }}>
                {isPositive && (
                    <>
                        <div className="text-[10px] font-bold tabular-nums text-[var(--color-gain)] mb-0.5">
                            {formatValue(value)}
                        </div>
                        <div
                            className="w-full max-w-[36px] rounded-t-md"
                            style={{
                                height: `${barH}px`,
                                background:
                                    "linear-gradient(to top, color-mix(in oklab, var(--color-gain) 60%, transparent), var(--color-gain))",
                            }}
                        />
                    </>
                )}
            </div>
            {/* Zero line */}
            <div className="w-full h-px bg-[var(--color-border)]" />
            {/* Bottom half (negative bars) */}
            <div className="w-full flex flex-col items-center justify-start" style={{ height: `${halfH}px` }}>
                {!isPositive && value < 0 && (
                    <>
                        <div
                            className="w-full max-w-[36px] rounded-b-md"
                            style={{
                                height: `${barH}px`,
                                background:
                                    "linear-gradient(to bottom, color-mix(in oklab, var(--color-loss) 60%, transparent), var(--color-loss))",
                            }}
                        />
                        <div className="text-[10px] font-bold tabular-nums text-[var(--color-loss)] mt-0.5">
                            {formatValue(value)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
