// Trade row shape — mirrors the public.trades table in Supabase exactly.
// Snake_case because Supabase returns snake_case from the DB.
import type { ContractSymbol } from "@/features/calculator/contracts";
import type { Direction } from "@/features/calculator/calc";

export interface Trade {
    id: string;
    user_id: string;
    date: string;          // ISO date 'YYYY-MM-DD'
    contract: ContractSymbol;
    direction: Direction;
    contracts: number;
    entry_price: number;
    exit_price: number;
    commission: number;
    planned_risk: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// Input shape for creating/updating a trade — only user-controllable fields.
export interface TradeInput {
    id?: string;
    date: string;
    contract: ContractSymbol;
    direction: Direction;
    contracts: number;
    entry_price: number;
    exit_price: number;
    commission: number;
    planned_risk: number | null;
    notes: string | null;
}
