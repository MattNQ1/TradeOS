// Server Actions for trade CRUD.
// Called from Client Components via <form action> or directly.
// All write paths revalidate /journal so the page Server Component re-fetches.
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TradeInput } from "./types";

export interface ActionResult {
    ok: boolean;
    error?: string;
}

async function getUserId(): Promise<{ userId: string | null; error?: string }> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { userId: null, error: "Not signed in." };
    return { userId: user.id };
}

function validate(input: TradeInput): string | null {
    if (!input.date) return "Date is required.";
    if (!input.contract) return "Contract is required.";
    if (input.direction !== "long" && input.direction !== "short") return "Direction must be long or short.";
    if (!input.contracts || input.contracts < 1) return "Contracts must be at least 1.";
    if (!Number.isFinite(input.entry_price) || !Number.isFinite(input.exit_price)) {
        return "Entry and exit prices are required.";
    }
    return null;
}

export async function saveTrade(input: TradeInput): Promise<ActionResult> {
    const err = validate(input);
    if (err) return { ok: false, error: err };

    const { userId, error: authErr } = await getUserId();
    if (!userId) return { ok: false, error: authErr };

    const supabase = await createClient();
    const row = {
        user_id: userId,
        date: input.date,
        contract: input.contract,
        direction: input.direction,
        contracts: input.contracts,
        entry_price: input.entry_price,
        exit_price: input.exit_price,
        commission: input.commission,
        planned_risk: input.planned_risk,
        notes: input.notes,
    };

    const { error } = input.id
        ? await supabase.from("trades").update(row).eq("id", input.id).eq("user_id", userId)
        : await supabase.from("trades").insert(row);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/journal");
    revalidatePath("/dashboard");
    return { ok: true };
}

export async function deleteTrade(id: string): Promise<ActionResult> {
    const { userId, error: authErr } = await getUserId();
    if (!userId) return { ok: false, error: authErr };

    const supabase = await createClient();
    const { error } = await supabase.from("trades").delete().eq("id", id).eq("user_id", userId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/journal");
    revalidatePath("/dashboard");
    return { ok: true };
}

export interface BulkImportResult {
    ok: boolean;
    imported: number;
    error?: string;
}

/** Bulk-insert a batch of validated trades. Used by the CSV importer. */
export async function bulkImportTrades(inputs: TradeInput[]): Promise<BulkImportResult> {
    if (!inputs.length) return { ok: false, imported: 0, error: "No trades to import." };

    const { userId, error: authErr } = await getUserId();
    if (!userId) return { ok: false, imported: 0, error: authErr };

    const supabase = await createClient();
    const rows = inputs.map((t) => ({
        user_id: userId,
        date: t.date,
        contract: t.contract,
        direction: t.direction,
        contracts: t.contracts,
        entry_price: t.entry_price,
        exit_price: t.exit_price,
        commission: t.commission,
        planned_risk: t.planned_risk,
        notes: t.notes,
    }));

    const { error } = await supabase.from("trades").insert(rows);
    if (error) return { ok: false, imported: 0, error: error.message };

    revalidatePath("/journal");
    revalidatePath("/dashboard");
    return { ok: true, imported: rows.length };
}
