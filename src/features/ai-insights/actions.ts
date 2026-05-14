// AI journal insights — Pro-only, rate-limited Server Action.
//
// Cost profile (Claude Haiku 4.5 as of 2026):
//   ~2,000 input tokens (trades + stats) × $0.25/1M  = $0.0005
//   ~800 output tokens × $1.25/1M                    = $0.001
//   ≈ $0.0015 per analysis
//
// Rate limit: 5 analyses per 24h per user. Even at 100 power users
// running max daily, monthly cost = ~$22.50. Negligible.
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODEL } from "@/lib/anthropic";
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

    const systemPrompt = `You are a senior futures trading coach reviewing one trader's recent trades. Your job is to surface patterns, behavior issues, and edges the trader can't easily see themselves.

Rules:
- Be specific. Reference contract symbols, dollar amounts, day-of-week, win counts. NEVER write generic advice.
- Be blunt but kind. The trader is paying for honest feedback, not flattery.
- Use plain English. No jargon unless it's standard (R-multiple, profit factor are OK).
- Each insight = one tight sentence (max ~25 words). No padding.

Output ONLY valid JSON matching this exact schema, no markdown fences, no preamble:
{
  "summary": "one-sentence headline of what stands out most",
  "patterns": ["2-4 specific patterns. Example: 'You win 78% of MES longs but only 41% of NQ shorts — drop the NQ shorts.'"],
  "emotional_alerts": ["1-3 behavior issues with evidence. Example: 'After your -\\$340 loss on 5/3, you sized up 3× on the next trade — classic revenge.' Empty array if none."],
  "improvements": ["1-3 things they're doing better recently. Empty array if none."],
  "session_comparison": "one sentence comparing recent trades to older ones if both exist, else empty string",
  "strongest_setup": "the contract + direction combo with the best edge, with stats. Example: 'MES longs on Tuesdays — 8/10 wins, +\\$840 net.'"
}`;

    const userPrompt = `Stats summary:
${stats}

Trades (CSV, most recent first):
${csv}

Analyze.`;

    // ---- Call Claude ----
    let payload: InsightPayload;
    let inputTokens = 0;
    let outputTokens = 0;
    try {
        const res = await anthropic.messages.create({
            model: AI_MODEL,
            max_tokens: 1024,
            temperature: 0.4, // Lower = more consistent, factual.
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
        });

        inputTokens = res.usage.input_tokens;
        outputTokens = res.usage.output_tokens;

        const textBlock = res.content.find((b) => b.type === "text");
        if (!textBlock || textBlock.type !== "text") {
            return { ok: false, error: "AI returned an unexpected response shape." };
        }

        const cleaned = textBlock.text.trim().replace(/^```json\s*|\s*```$/g, "");
        payload = JSON.parse(cleaned) as InsightPayload;

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

    revalidatePath("/journal");
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
    let losses = 0;
    let totalPnL = 0;
    let grossWin = 0;
    let grossLoss = 0;
    const byContract = new Map<string, { count: number; pnl: number }>();
    const byDirection = { long: 0, short: 0 };

    for (const t of trades) {
        const pnl = tradePnL(t as never);
        totalPnL += pnl;
        if (pnl > 0) { wins++; grossWin += pnl; }
        else if (pnl < 0) { losses++; grossLoss += Math.abs(pnl); }
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
