// Main calculator UI. Client Component because every input updates state.
//
// State persists to localStorage so values survive a refresh — same UX as
// the vanilla version. We don't sync to Supabase yet (that's Phase 4 territory
// for prop firm config). Calculator input is ephemeral by nature.
"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import {
    CONTRACTS,
    CONTRACT_SYMBOLS,
    type ContractSymbol,
} from "./contracts";
import {
    calcRiskReward,
    calcSizing,
    calcExitProjection,
    fmtUSD,
    fmtUSD0,
    fmtNum,
    type Direction,
    type Unit,
} from "./calc";

// ============================================================
// State shape + persistence
// ============================================================

interface CalculatorState {
    contract: ContractSymbol;
    direction: Direction;
    unit: Unit;
    contracts: number;
    stopLoss: number;
    takeProfit: number;
    entryPrice: number;
    accountSize: number;
    riskPercent: number;
    commission: number;
}

const DEFAULT_STATE: CalculatorState = {
    contract: "MES",
    direction: "long",
    unit: "ticks",
    contracts: 1,
    stopLoss: 0,
    takeProfit: 0,
    entryPrice: 0,
    accountSize: 0,
    riskPercent: 1,
    commission: 0,
};

const STORAGE_KEY = "tradeos.calc.v1";

function loadState(): CalculatorState {
    if (typeof window === "undefined") return DEFAULT_STATE;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_STATE;
        const parsed = JSON.parse(raw) as Partial<CalculatorState>;
        // Merge over defaults so new fields added later don't break existing storage.
        return { ...DEFAULT_STATE, ...parsed };
    } catch {
        return DEFAULT_STATE;
    }
}

// ============================================================
// Component
// ============================================================

export function CalculatorForm() {
    // Initial state from localStorage. We hydrate inside an effect so the
    // server-rendered HTML matches the client (no hydration mismatch).
    const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setState(loadState());
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Storage may be unavailable (private mode, full quota) — fail silently.
        }
    }, [state, hydrated]);

    // Helper that takes a partial update and merges into state.
    const update = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) =>
        setState((prev) => ({ ...prev, [key]: value }));

    // Numeric input -> non-negative number; empty string => 0
    const num = (raw: string, min = 0) => {
        const n = parseFloat(raw);
        return Number.isFinite(n) ? Math.max(min, n) : 0;
    };

    // Derived calculations
    const spec = CONTRACTS[state.contract];
    const rr = calcRiskReward({
        contract: state.contract,
        unit: state.unit,
        contracts: state.contracts,
        stopLoss: state.stopLoss,
        takeProfit: state.takeProfit,
        commission: state.commission,
    });
    const sizing = calcSizing({
        accountSize: state.accountSize,
        riskPercent: state.riskPercent,
        contract: state.contract,
        unit: state.unit,
        stopLoss: state.stopLoss,
        commission: state.commission,
    });
    const exits = calcExitProjection({
        contract: state.contract,
        unit: state.unit,
        direction: state.direction,
        entryPrice: state.entryPrice,
        stopLoss: state.stopLoss,
        takeProfit: state.takeProfit,
    });

    const exitParts: string[] = [];
    if (exits.slPrice !== null) exitParts.push(`SL ${fmtNum.format(exits.slPrice)}`);
    if (exits.tpPrice !== null) exitParts.push(`TP ${fmtNum.format(exits.tpPrice)}`);

    const applySuggested = () => {
        if (sizing.suggestedContracts && sizing.suggestedContracts > 0) {
            update("contracts", sizing.suggestedContracts);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Calculator</h1>

            {/* ---------- Trade setup ---------- */}
            <Card>
                <CardTitle>Trade setup</CardTitle>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="contract" className="text-sm font-medium">Contract</label>
                    <select
                        id="contract"
                        value={state.contract}
                        onChange={(e) => update("contract", e.target.value as ContractSymbol)}
                        className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-base text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    >
                        {CONTRACT_SYMBOLS.map((sym) => (
                            <option key={sym} value={sym}>
                                {sym} — {CONTRACTS[sym].name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        ${spec.pointValue}/pt • ${spec.tickValue.toFixed(2)}/tick • {spec.tickSize} pt tick size
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Direction</label>
                    <Segmented<Direction>
                        aria-label="Direction"
                        options={[
                            { value: "long",  label: "Long",  activeColor: "gain" },
                            { value: "short", label: "Short", activeColor: "loss" },
                        ]}
                        value={state.direction}
                        onChange={(v) => update("direction", v)}
                    />
                </div>

                <Input
                    label="Number of contracts"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={state.contracts || ""}
                    onChange={(e) => update("contracts", Math.max(1, parseInt(e.target.value, 10) || 1))}
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Stop / target unit</label>
                    <Segmented<Unit>
                        aria-label="Unit"
                        options={[
                            { value: "ticks",  label: "Ticks" },
                            { value: "points", label: "Points" },
                        ]}
                        value={state.unit}
                        onChange={(v) => update("unit", v)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="sl" className="text-sm font-medium text-[var(--color-loss)]">Stop loss</label>
                        <input
                            id="sl"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="0"
                            value={state.stopLoss || ""}
                            onChange={(e) => update("stopLoss", num(e.target.value))}
                            className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-base text-[var(--color-text)] focus:outline-none focus:border-[var(--color-loss)]"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="tp" className="text-sm font-medium text-[var(--color-gain)]">Take profit</label>
                        <input
                            id="tp"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="0"
                            value={state.takeProfit || ""}
                            onChange={(e) => update("takeProfit", num(e.target.value))}
                            className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-base text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gain)]"
                        />
                    </div>
                </div>

                <Input
                    label="Entry price"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    placeholder="e.g. 5000.25"
                    value={state.entryPrice || ""}
                    onChange={(e) => update("entryPrice", num(e.target.value))}
                    hint={exitParts.length ? exitParts.join("  •  ") : "Optional — projects SL/TP prices when filled."}
                />
            </Card>

            {/* ---------- Result ---------- */}
            <Card>
                <CardTitle>Result</CardTitle>
                <div className="grid grid-cols-2 gap-3">
                    <ResultStat
                        label="Risk"
                        value={fmtUSD.format(rr.netRisk)}
                        sub={rr.fees > 0 ? `Gross ${fmtUSD.format(rr.grossRisk)} + ${fmtUSD.format(rr.fees)} fees` : undefined}
                        variant="loss"
                    />
                    <ResultStat
                        label="Reward"
                        value={fmtUSD.format(rr.netReward)}
                        sub={rr.fees > 0 ? `Gross ${fmtUSD.format(rr.grossReward)} − ${fmtUSD.format(rr.fees)} fees` : undefined}
                        variant="gain"
                    />
                </div>
                <ResultStat
                    label="Risk / Reward"
                    value={rr.rrRatio === null ? "—" : `1 : ${rr.rrRatio.toFixed(2)}`}
                    variant="neutral"
                />
            </Card>

            {/* ---------- Position sizing ---------- */}
            <Card>
                <CardTitle>Position sizing</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                    Find the max contracts you can trade for your account-risk %.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Account size ($)"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        placeholder="50000"
                        value={state.accountSize || ""}
                        onChange={(e) => update("accountSize", num(e.target.value))}
                    />
                    <Input
                        label="Risk per trade (%)"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={state.riskPercent || ""}
                        onChange={(e) => update("riskPercent", num(e.target.value))}
                    />
                </div>

                <ResultStat
                    label="Max risk this trade"
                    value={sizing.maxRisk > 0 ? fmtUSD.format(sizing.maxRisk) : "—"}
                    variant="neutral"
                />

                <ResultStat
                    label="Suggested contracts"
                    value={
                        sizing.suggestedContracts === null
                            ? "—"
                            : String(sizing.suggestedContracts)
                    }
                    sub={sizingHint(sizing)}
                    variant="accent"
                />

                <Button
                    variant="secondary"
                    className="w-full"
                    disabled={!sizing.suggestedContracts || sizing.suggestedContracts <= 0}
                    onClick={applySuggested}
                >
                    Use suggested contracts
                </Button>
            </Card>

            {/* ---------- Settings ---------- */}
            <Card>
                <CardTitle>Trading costs</CardTitle>
                <Input
                    label="Commission per contract per side ($)"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    placeholder="0"
                    value={state.commission || ""}
                    onChange={(e) => update("commission", num(e.target.value))}
                    hint="Round-turn = 2× this. Typical: $0.50–$2.50 per side."
                />
            </Card>
        </div>
    );
}

// ============================================================
// Helper components
// ============================================================

interface ResultStatProps {
    label: string;
    value: string;
    sub?: string;
    variant: "loss" | "gain" | "neutral" | "accent";
}

function ResultStat({ label, value, sub, variant }: ResultStatProps) {
    const styles =
        variant === "loss"
            ? "bg-[color-mix(in_oklab,var(--color-loss)_12%,transparent)] border-[color-mix(in_oklab,var(--color-loss)_25%,transparent)] text-[var(--color-loss)]"
            : variant === "gain"
                ? "bg-[color-mix(in_oklab,var(--color-gain)_12%,transparent)] border-[color-mix(in_oklab,var(--color-gain)_25%,transparent)] text-[var(--color-gain)]"
                : variant === "accent"
                    ? "bg-[color-mix(in_oklab,var(--color-accent)_10%,transparent)] border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] text-[var(--color-accent)]"
                    : "bg-[var(--color-bg-elev-2)] border-[var(--color-border)] text-[var(--color-text)]";

    return (
        <div className={`rounded-xl p-3.5 border ${styles}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
            <p className="text-xl font-bold tabular-nums leading-tight mt-1">{value}</p>
            {sub && <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>}
        </div>
    );
}

function sizingHint(sizing: ReturnType<typeof calcSizing>): string {
    if (sizing.maxRisk <= 0) return "Enter account size to size positions.";
    if (sizing.suggestedContracts === null) return "Set a stop loss in ticks/points first.";
    if (sizing.suggestedContracts === 0 && sizing.riskPerContract !== null) {
        return `Risk per contract (${fmtUSD.format(sizing.riskPerContract)}) exceeds your max risk.`;
    }
    if (sizing.riskPerContract !== null) {
        return `Risk per contract: ${fmtUSD.format(sizing.riskPerContract)} • ${sizing.suggestedContracts} × = ${fmtUSD0.format(sizing.suggestedContracts! * sizing.riskPerContract)}`;
    }
    return "";
}
