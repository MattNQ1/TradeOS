// Server-only fetcher for cached AI insights.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { JournalInsight } from "./types";

/** Most recent insight for the signed-in user, or null. */
export async function fetchLatestInsight(): Promise<JournalInsight | null> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("ai_journal_insights")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    return (data as JournalInsight | null) ?? null;
}

/** How many insights the user has generated in the last 24h (rate-limit input). */
export async function countRecentInsights(userId: string): Promise<number> {
    const supabase = await createClient();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
        .from("ai_journal_insights")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", yesterday);
    return count ?? 0;
}
