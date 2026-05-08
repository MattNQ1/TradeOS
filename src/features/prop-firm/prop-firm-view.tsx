// Top-level Client Component for /prop-firm.
// Handles state for the preset selector + custom rules editor.
// Auto-saves with a 400ms debounce so we don't hammer the DB on every keystroke.
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fmtUSD0 } from "@/features/calculator/calc";
import { PROP_FIRM_PRESETS } from "./presets";
import {
    calcDailyTracker,
    calcProfitTarget,
    calcTrailingDrawdown,
    getActiveRules,
} from "./tracker";
import type { PropFirmConfig } from "./types";
import { savePropFirmConfig } from "./actions";
import { DailyTrackerCard } from "./daily-tracker";
import { TrailingDrawdownCard } from "./trailing-drawdown";
import { ProfitTargetCard } from "./profit-target";
import type { Trade } from "@/features/journal/types";

interface PropFirmViewProps {
    initialConfig: PropFirmConfig;
    trades: Trade[];
}

export function PropFirmView({ initialConfig, trades }: PropFirmViewProps) {
    const [config, setConfig] = useState<PropFirmConfig>(initialConfig);
    const [, startTransition] = useTransition();
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced auto-save: 400ms after the last edit, persist to DB.
    const scheduleSave = (next: PropFirmConfig) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            startTransition(async () => {
                await savePropFirmConfig({
                    preset: next.preset,
                    custom_account_size: next.custom_account_size,
                    custom_target: next.custom_target,
                    custom_max_loss: next.custom_max_loss,
                    custom_daily: next.custom_daily,
                    custom_trailing: next.custom_trailing,
                });
            });
        }, 400);
    };

    // Cleanup on unmount.
    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, []);

    const updateConfig = (patch: Partial<PropFirmConfig>) => {
        const next = { ...config, ...patch };
        setConfig(next);
        scheduleSave(next);
    };

    const num = (raw: string) => {
        const n = parseFloat(raw);
        return Number.isFinite(n) && n >= 0 ? n : 0;
    };

    // Derived
    const rules = useMemo(() => getActiveRules(config), [config]);
    const daily = useMemo(() => rules ? calcDailyTracker(trades, rules) : null, [rules, trades]);
    const drawdown = useMemo(() => rules ? calcTrailingDrawdown(trades, rules) : null, [rules, trades]);
    const target = useMemo(() => rules ? calcProfitTarget(trades, rules) : null, [rules, trades]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Prop firm</h1>

            {/* ---------- Preset selector + rules summary ---------- */}
            <Card>
                <CardTitle>Prop firm preset</CardTitle>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="preset" className="text-sm font-medium">Select firm + account</label>
                    <select
                        id="preset"
                        value={config.preset}
                        onChange={(e) => updateConfig({ preset: e.target.value })}
                        className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-base text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    >
                        <option value="none">— No preset —</option>
                        <option value="custom">✎ Custom (your own rules)</option>
                        {PROP_FIRM_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.firm} • {p.account}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <RuleRow label="Account size" value={rules?.accountSize ? fmtUSD0.format(rules.accountSize) : "—"} />
                    <RuleRow label="Profit target" value={rules?.target ? fmtUSD0.format(rules.target) : "—"} />
                    <RuleRow
                        label="Max loss / trailing"
                        value={
                            rules?.maxLoss
                                ? `${fmtUSD0.format(rules.maxLoss)}${rules.trailing ? " (trailing)" : ""}`
                                : "—"
                        }
                    />
                    <RuleRow label="Daily loss limit" value={rules?.daily ? fmtUSD0.format(rules.daily) : "—"} last />
                </div>
            </Card>

            {/* ---------- Custom rules editor ---------- */}
            {config.preset === "custom" && (
                <Card>
                    <CardTitle>Custom rules</CardTitle>
                    <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                        Enter your firm&apos;s exact rules. They apply immediately to the trackers below and auto-save.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Account size ($)"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="50000"
                            value={config.custom_account_size || ""}
                            onChange={(e) => updateConfig({ custom_account_size: num(e.target.value) })}
                        />
                        <Input
                            label="Profit target ($)"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="3000"
                            value={config.custom_target || ""}
                            onChange={(e) => updateConfig({ custom_target: num(e.target.value) })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Max loss ($)"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="2000"
                            value={config.custom_max_loss || ""}
                            onChange={(e) => updateConfig({ custom_max_loss: num(e.target.value) })}
                        />
                        <Input
                            label="Daily loss limit ($)"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="1000"
                            value={config.custom_daily || ""}
                            onChange={(e) => updateConfig({ custom_daily: num(e.target.value) })}
                        />
                    </div>

                    <Input
                        label="Trailing distance ($)"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        placeholder="0"
                        value={config.custom_trailing || ""}
                        onChange={(e) => updateConfig({ custom_trailing: num(e.target.value) })}
                        hint="Leave 0 for static drawdown. Otherwise, the trailing stop sits this far below your peak balance."
                    />
                </Card>
            )}

            {/* ---------- Trackers ---------- */}
            {rules && daily && (
                <DailyTrackerCard state={daily} />
            )}
            {rules && (
                <TrailingDrawdownCard state={drawdown} />
            )}
            {rules && (
                <ProfitTargetCard state={target} />
            )}

            {!rules && (
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] text-center py-2">
                        Pick a preset or choose &quot;Custom&quot; above to enable the trackers.
                    </p>
                </Card>
            )}
        </div>
    );
}

function RuleRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
    return (
        <div className={`flex justify-between items-center py-2.5 text-sm ${last ? "" : "border-b border-[var(--color-border-soft)]"}`}>
            <span className="text-[var(--color-text-muted)]">{label}</span>
            <span className="font-semibold tabular-nums">{value}</span>
        </div>
    );
}
