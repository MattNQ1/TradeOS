// AI journal insight shape. Mirrors the `ai_journal_insights` table.

export interface JournalInsight {
    id: string;
    user_id: string;
    trades_analyzed: number;
    patterns: string[];
    emotional_alerts: string[];
    improvements: string[];
    session_comparison: string | null;
    strongest_setup: string | null;
    summary: string | null;
    input_tokens: number | null;
    output_tokens: number | null;
    created_at: string;
}

/** Parsed JSON shape we ask Claude to produce. */
export interface InsightPayload {
    summary: string;
    patterns: string[];
    emotional_alerts: string[];
    improvements: string[];
    session_comparison: string;
    strongest_setup: string;
}
