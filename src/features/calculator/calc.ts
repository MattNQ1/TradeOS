// Pure calculation functions for the futures calculator.
// No React, no DOM — just math. Keeps logic testable and reusable.
//
// Formula at the heart of everything:
//   (ticks or points) × per-unit value × contracts = $ risk/reward
import { CONTRACTS, type ContractSymbol } from "./contracts";

export type Direction = "long" | "short";
export type Unit = "ticks" | "points";

export function perUnitValue(symbol: ContractSymbol, unit: Unit): number {
    const spec = CONTRACTS[symbol];
    return unit === "ticks" ? spec.tickValue : spec.pointValue;
}

// ============================================================
// Risk / reward
// ============================================================

export interface RiskRewardInputs {
    contract: ContractSymbol;
    unit: Unit;
    contracts: number;
    stopLoss: number;
    takeProfit: number;
    commission: number; // $ per contract per side
}

export interface RiskRewardResult {
    grossRisk: number;
    grossReward: number;
    fees: number;
    netRisk: number;
    netReward: number;
    rrRatio: number | null; // null when undefined (e.g. risk = 0)
}

export function calcRiskReward(input: RiskRewardInputs): RiskRewardResult {
    const v = perUnitValue(input.contract, input.unit);
    const grossRisk = input.stopLoss * v * input.contracts;
    const grossReward = input.takeProfit * v * input.contracts;

    // Round-turn commission = 2 sides × per-contract × number of contracts.
    const fees = (input.commission || 0) * 2 * input.contracts;

    const netRisk = grossRisk + fees;       // fees increase loss
    const netReward = Math.max(0, grossReward - fees); // fees reduce gain

    const rrRatio = netRisk > 0 && netReward > 0 ? netReward / netRisk : null;

    return { grossRisk, grossReward, fees, netRisk, netReward, rrRatio };
}

// ============================================================
// Position sizing
// ============================================================

export interface SizingInputs {
    accountSize: number;
    riskPercent: number;
    contract: ContractSymbol;
    unit: Unit;
    stopLoss: number;
    commission: number;
}

export interface SizingResult {
    maxRisk: number;
    riskPerContract: number | null;
    suggestedContracts: number | null;
}

export function calcSizing(input: SizingInputs): SizingResult {
    const maxRisk = (input.accountSize || 0) * (input.riskPercent || 0) / 100;
    if (maxRisk <= 0 || input.stopLoss <= 0) {
        return { maxRisk, riskPerContract: null, suggestedContracts: null };
    }

    const v = perUnitValue(input.contract, input.unit);
    const riskPerContract = input.stopLoss * v + (input.commission || 0) * 2;
    if (riskPerContract <= 0) {
        return { maxRisk, riskPerContract: null, suggestedContracts: null };
    }

    return {
        maxRisk,
        riskPerContract,
        suggestedContracts: Math.floor(maxRisk / riskPerContract),
    };
}

// ============================================================
// Exit price projection
// ============================================================

export interface ExitProjectionInputs {
    contract: ContractSymbol;
    unit: Unit;
    direction: Direction;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
}

export interface ExitProjection {
    slPrice: number | null;
    tpPrice: number | null;
}

export function calcExitProjection(input: ExitProjectionInputs): ExitProjection {
    const { contract, unit, direction, entryPrice, stopLoss, takeProfit } = input;
    if (!entryPrice || entryPrice <= 0) return { slPrice: null, tpPrice: null };

    const spec = CONTRACTS[contract];
    const ptDelta = (units: number) => (unit === "ticks" ? units * spec.tickSize : units);
    const sign = direction === "long" ? 1 : -1;

    return {
        slPrice: stopLoss > 0 ? entryPrice - sign * ptDelta(stopLoss) : null,
        tpPrice: takeProfit > 0 ? entryPrice + sign * ptDelta(takeProfit) : null,
    };
}

// ============================================================
// Formatters (shared across calculator + journal)
// ============================================================

export const fmtUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const fmtUSD0 = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const fmtNum = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });
