// AI journal insights — Pro-only, rate-limited Server Action.
//
// Powered by Google Gemini 2.5 Flash (free tier: 1500 req/day, 15 req/min).
// At early-stage TradeOS scale (10–50 Pro users running 1–5 analyses/week each),
// usage is <0.5% of the free quota — costs $0 indefinitely. Paid tier kicks in
// only if we hit serious scale, and even then it's ~$0.001 per analysis.
//
// Rate limit: 5 analyses per 24h per user (independent of the Gemini quota,
// just to prevent any one user from monopolizing or spamming).
"use server";

import { revalidatePath } from "next/cache";
import { Type, type Schema } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { gemini, AI_MODEL } from "@/lib/gemini";
import { getUserTier } from "@/features/billing/tier";
import { fetchTrades } from "@/features/journal/server";
import { tradePnL, tradeRMultiple } from "@/features/journal/trade-stats";
import { countRecentInsights } from "./server";
import type { InsightPayload } from "./types";

export interface GenerateResult {
    ok: boolean;
    error?: string;
}

const RATE_LIMIT_PER_DAY = 5;
const MIN_TRADES_REQUIRED = 5;
const MAX_TRADES_TO_ANALYZE = 100;

// Strict JSON schema so Gemini's output always parses. No more "AI returned
// markdown fences" failures.
const INSIGHT_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        summary:            { type: Type.STRING },
        patterns:           { type: Type.ARRAY, items: { type: Type.STRING } },
        emotional_alerts:   { type: Type.ARRAY, items: { type: Type.STRING } },
        improvements:       { type: Type.ARRAY, items: { type: Type.STRING } },
        session_comparison: { type: Type.STRING },
        strongest_setup:    { type: Type.STRING },
    },
    required: ["summary", "patterns", "emotional_alerts", "improvements", "session_comparison", "strongest_setup"],
    propertyOrdering: ["summary", "patterns", "emotional_alerts", "improvements", "session_comparison", "strongest_setup"],
};

export async function generateInsight(): Promise<GenerateResult> {
    // ---- Auth + tier gate ----
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const tier = await getUserTier();
    if (!tier.isPaid) {
        return { ok: false, error: "AI insights are a Pro feature. Upgrade to Pro to unlock." };
    }

    // ---- Rate limit ----
    const recentCount = await countRecentInsights(user.id);
    if (recentCount >= RATE_LIMIT_PER_DAY) {
        return {
            ok: false,
            error: `You've used ${RATE_LIMIT_PER_DAY} analyses in the last 24 hours. Resets in a few hours.`,
        };
    }

    // ---- Fetch trades ----
    const allTrades = await fetchTrades();
    if (allTrades.length < MIN_TRADES_REQUIRED) {
        return {
            ok: false,
            error: `Need at least ${MIN_TRADES_REQUIRED} trades to analyze. You have ${allTrades.length}.`,
        };
    }

    // Take most recent N trades for analysis (avoid blowing token budget).
    const trades = allTrades.slice(0, MAX_TRADES_TO_ANALYZE);

    // ---- Build prompt input ----
    const csv = buildTradeCSV(trades);
    const stats = buildStatsSummary(trades);

    const systemInstruction = `You are a senior futures trading coach reviewing one trader's recent trades. Your job is to surface patterns, behavior issues, and edges the trader can't easily see themselves.

Rules:
- Be specific. Reference contract symbols, dollar amounts, day-of-week, win counts. NEVER write generic advice.
- Be blunt but kind. The trader is paying for honest feedback, not flattery.
- Use plain English. No jargon unless it's standard (R-multiple, profit factor are OK).
- Each insight = one tight sentence (max ~25 words). No padding.

Output fields:
- summary: one-sentence headline of what stands out most
- patterns: 2-4 specific patterns. Example: "You win 78% of MES longs but only 41% of NQ shorts — drop the NQ shorts."
- emotional_alerts: 1-3 behavior issues with evidence. Example: "After your -$340 loss on 5/3, you sized up 3× on the next trade — classic revenge." Empty array if none.
- improvements: 1-3 things they're doing better recently. Empty array if none.
- session_comparison: one sentence comparing recent trades to older ones if both exist, else empty string.
- strongest_setup: the contract + direction combo with the best edge, with stats. Example: "MES longs on Tuesdays — 8/10 wins, +$840 net."`;

    const userPrompt = `Stats summary:
${stats}

Trades (CSV, most recent first):
${csv}

Analyze.`;

    // ---- Call Gemini ----
    let payload: InsightPayload;
    let inputTokens = 0;
    let outputTokens = 0;
    try {
        const response = await gemini.models.generateContent({
            model: AI_MODEL,
            contents: userPrompt,
            config: {
                systemInstruction,
                temperature: 0.4, // Lower = more consistent, factual.
                // Gemini 2.5 Flash's "thinking" mode eats tokens BEFORE the
                // actual response — so a low cap truncates the JSON mid-string.
                // 4096 leaves plenty of headroom for our schema (~600 tokens
                // worst case) plus any pre-response yapping.
                maxOutputTokens: 4096,
                // Structured extraction doesn't benefit from chain-of-thought.
                // Disabling thinking = faster + every output token goes to the
                // actual JSON instead of being wasted on reasoning.
                thinkingConfig: { thinkingBudget: 0 },
                responseMimeType: "application/json",
                responseSchema: INSIGHT_SCHEMA,
            },
        });

        inputTokens = response.usageMetadata?.promptTokenCount ?? 0;
        outputTokens = response.usageMetadata?.candidatesTokenCount ?? 0;

        const text = response.text;
        if (!text) {
            return { ok: false, error: "The AI returned an empty response. Try again in a sec." };
        }

        // Surface a clearer error if Gemini hit the output cap mid-response —
        // otherwise the user sees a raw "Unterminated string" parse error.
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason === "MAX_TOKENS") {
            console.error(
                "Gemini truncated at MAX_TOKENS. text preview:",
                text.slice(0, 200),
            );
            return {
                ok: false,
                error: "The analysis ran past the length limit. Try again — usually works on retry.",
            };
        }

        try {
            payload = JSON.parse(text) as InsightPayload;
        } catch (parseErr) {
            console.error(
                "Gemini returned malformed JSON. finishReason=",
                finishReason,
                "raw text:",
                text.slice(0, 500),
                "parse error:",
                parseErr,
            );
            return {
                ok: false,
                error: "The AI's response didn't parse cleanly. Try again in a sec.",
            };
        }

        // Defensive: ensure required fields exist as the right type.
        if (!Array.isArray(payload.patterns)) payload.patterns = [];
        if (!Array.isArray(payload.emotional_alerts)) payload.emotional_alerts = [];
        if (!Array.isArray(payload.improvements)) payload.improvements = [];
        payload.summary = String(payload.summary ?? "").slice(0, 280);
        payload.session_comparison = String(payload.session_comparison ?? "").slice(0, 400);
        payload.strongest_setup = String(payload.strongest_setup ?? "").slice(0, 280);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "AI request failed.";
        console.error("AI insight generation failed:", msg);
        return { ok: false, error: `AI request failed: ${msg}` };
    }

    // ---- Persist ----
    const { error } = await supabase.from("ai_journal_insights").insert({
        user_id: user.id,
        trades_analyzed: trades.length,
        patterns: payload.patterns,
        emotional_alerts: payload.emotional_alerts,
        improvements: payload.improvements,
        session_comparison: payload.session_comparison || null,
        strongest_setup: payload.strongest_setup || null,
        summary: payload.summary || null,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
    });

    if (error) {
        console.error("Failed to persist insight:", error.message);
        return { ok: false, error: "Generated, but failed to save: " + error.message };
    }

    revalidatePath("/coach");
    return { ok: true };
}

// ============================================================
// Prompt helpers
// ============================================================

interface TradeForPrompt {
    date: string;
    contract: string;
    direction: string;
    contracts: number;
    entry_price: number;
    exit_price: number;
    commission: number;
    planned_risk: number | null;
    notes: string | null;
}

function buildTradeCSV(trades: TradeForPrompt[]): string {
    const header = "date,contract,direction,contracts,entry,exit,pnl,r_multiple,notes";
    const rows = trades.map((t) => {
        const pnl = tradePnL(t as never);
        const r = tradeRMultiple(t as never);
        const notes = (t.notes ?? "").replace(/[\r\n,]+/g, " ").slice(0, 100);
        return [
            t.date,
            t.contract,
            t.direction,
            t.contracts,
            t.entry_price,
            t.exit_price,
            pnl.toFixed(2),
            r === null ? "" : r.toFixed(2),
            notes,
        ].join(",");
    });
    return [header, ...rows].join("\n");
}

function buildStatsSummary(trades: TradeForPrompt[]): string {
    let wins = 0;
    let totalPnL = 0;
    let grossWin = 0;
    let grossLoss = 0;
    const byContract = new Map<string, { count: number; pnl: number }>();
    const byDirection = { long: 0, short: 0 };

    for (const t of trades) {
        const pnl = tradePnL(t as never);
        totalPnL += pnl;
        if (pnl > 0) { wins++; grossWin += pnl; }
        else if (pnl < 0) { grossLoss += Math.abs(pnl); }
        const cur = byContract.get(t.contract) ?? { count: 0, pnl: 0 };
        cur.count++; cur.pnl += pnl;
        byContract.set(t.contract, cur);
        if (t.direction === "long" || t.direction === "short") byDirection[t.direction]++;
    }

    const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) + "%" : "—";
    const profitFactor = grossLoss > 0 ? (grossWin / grossLoss).toFixed(2) : "∞";
    const contractBreakdown = Array.from(byContract.entries())
        .map(([c, v]) => `${c} (${v.count}t, $${v.pnl.toFixed(0)})`)
        .join(", ");

    return [
        `Total: ${trades.length} trades · Win rate ${winRate} · Total P&L $${totalPnL.toFixed(0)} · Profit factor ${profitFactor}`,
        `Long ${byDirection.long} / Short ${byDirection.short}`,
        `By contract: ${contractBreakdown}`,
        `Date range: ${trades[trades.length - 1]?.date} → ${trades[0]?.date}`,
    ].join("\n");
}
