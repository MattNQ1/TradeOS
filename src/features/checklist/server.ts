// Server-only fetch for the user's checklist items.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ChecklistItem } from "./types";

export async function fetchChecklistItems(): Promise<ChecklistItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("user_checklist_items")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });

    if (error) {
        console.error("fetchChecklistItems error:", error.message);
        return [];
    }
    return (data ?? []) as ChecklistItem[];
}
