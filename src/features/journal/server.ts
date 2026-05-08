// Server-only data fetching for the journal.
// Imported by Server Components (the /journal page).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Trade } from "./types";

export async function fetchTrades(): Promise<Trade[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        // Common during initial setup: table doesn't exist yet, RLS not configured, etc.
        console.error("fetchTrades error:", error.message);
        return [];
    }
    return (data ?? []) as Trade[];
}
