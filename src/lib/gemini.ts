// Server-only Gemini client. Lazy-initialized via Proxy so a missing
// GEMINI_API_KEY doesn't break the build — only fails at request time
// with a clear error message.
//
// Why Gemini: Flash 2.5 has a generous free tier (1500 req/day, 15 req/min,
// 1M tokens/min) — plenty for early-stage TradeOS. Quality is on par with
// Claude Haiku for structured trade-journal analysis. Cost ceiling at scale
// is also competitive ($0.30/M input, $2.50/M output as of late 2025).
import "server-only";
import { GoogleGenAI } from "@google/genai";

let cached: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
    if (cached) return cached;
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error(
            "GEMINI_API_KEY is not set. Get a free one at https://aistudio.google.com/app/apikey and add it to .env.local + Vercel.",
        );
    }
    cached = new GoogleGenAI({ apiKey: key });
    return cached;
}

export const gemini = new Proxy({} as GoogleGenAI, {
    get(_target, prop) {
        const client = getClient();
        const value = client[prop as keyof GoogleGenAI];
        return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(client) : value;
    },
});

// Model pinned. gemini-2.5-flash is the current free-tier workhorse.
// Update when intentionally upgrading.
export const AI_MODEL = "gemini-2.5-flash";
