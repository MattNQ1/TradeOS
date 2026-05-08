// Custom SVG equity curve. No charting library dependency.
"use client";

import { useMemo } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { fmtUSD0 } from "@/features/calculator/calc";
import type { EquityPoint } from "./calc";

interface EquityCurveCardProps {
    points: EquityPoint[];
}

export function EquityCurveCard({ points }: EquityCurveCardProps) {
    // Always run the hook at the top — Rules of Hooks. buildPath handles short input.
    const { pathD, areaD, gridLines, finalEquity, isPositive } = useMemo(
        () => buildPath(points),
        [points],
    );

    if (points.length < 2) {
        return (
            <Card>
                <CardTitle>Equity curve</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)] py-6 text-center">
                    Log at least 2 trade days to see your equity curve.
                </p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-baseline justify-between">
                <CardTitle>Equity curve</CardTitle>
                <span
                    className={`text-base font-bold tabular-nums ${
                        isPositive ? "text-[var(--color-gain)]" : "text-[var(--color-loss)]"
                    }`}
                >
                    {finalEquity >= 0 ? "+" : ""}
                    {fmtUSD0.format(finalEquity)}
                </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] -mt-2">
                Cumulative P&amp;L over {points.length} trading day{points.length === 1 ? "" : "s"}
            </p>

            <div className="w-full -mx-1">
                <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    preserveAspectRatio="none"
                    className="w-full h-44"
                    role="img"
                    aria-label="Equity curve over time"
                >
                    <defs>
                        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor={isPositive ? "var(--color-gain)" : "var(--color-loss)"}
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor={isPositive ? "var(--color-gain)" : "var(--color-loss)"}
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {gridLines.map((y, i) => (
                        <line
                            key={i}
                            x1="0"
                            x2={VIEW_W}
                            y1={y}
                            y2={y}
                            stroke="var(--color-border-soft)"
                            strokeWidth="1"
                            strokeDasharray="2 4"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}

                    {/* Area fill */}
                    <path d={areaD} fill="url(#equityFill)" />

                    {/* Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke={isPositive ? "var(--color-gain)" : "var(--color-loss)"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            <div className="flex justify-between text-[10px] text-[var(--color-text-subtle)] -mt-2 px-1 tabular-nums">
                <span>{shortDate(points[0].date)}</span>
                <span>{shortDate(points[points.length - 1].date)}</span>
            </div>
        </Card>
    );
}

// ============================================================
// Geometry
// ============================================================

const VIEW_W = 600;
const VIEW_H = 200;
const PADDING = 8;

function buildPath(points: EquityPoint[]): {
    pathD: string;
    areaD: string;
    gridLines: number[];
    finalEquity: number;
    isPositive: boolean;
} {
    if (points.length < 2) {
        return { pathD: "", areaD: "", gridLines: [], finalEquity: 0, isPositive: true };
    }

    const equities = points.map((p) => p.equity);
    let minE = Math.min(...equities, 0);
    let maxE = Math.max(...equities, 0);
    if (minE === maxE) {
        // Avoid division by zero — give 1 unit of headroom.
        minE -= 1;
        maxE += 1;
    }

    const xScale = (i: number) =>
        PADDING + (i / (points.length - 1)) * (VIEW_W - 2 * PADDING);
    const yScale = (e: number) =>
        VIEW_H - PADDING - ((e - minE) / (maxE - minE)) * (VIEW_H - 2 * PADDING);

    const pathD = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(2)} ${yScale(p.equity).toFixed(2)}`)
        .join(" ");

    const lastX = xScale(points.length - 1);
    const firstX = xScale(0);
    const areaD = `${pathD} L ${lastX.toFixed(2)} ${(VIEW_H - PADDING).toFixed(2)} L ${firstX.toFixed(2)} ${(VIEW_H - PADDING).toFixed(2)} Z`;

    const gridLines = [VIEW_H * 0.25, VIEW_H * 0.5, VIEW_H * 0.75];

    const finalEquity = equities[equities.length - 1];
    return { pathD, areaD, gridLines, finalEquity, isPositive: finalEquity >= 0 };
}

function shortDate(iso: string): string {
    const [y, m, d] = iso.split("-");
    return `${m}/${d}/${y.slice(2)}`;
}
