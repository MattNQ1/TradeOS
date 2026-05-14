// Server-only Anthropic client. Lazy-initialized via Proxy so a missing
// ANTHROPIC_API_KEY doesn't break the build — only fails at request time
// with a clear error message.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null = null;

function getClient(): Anthropic {
    if (cached) return cached;
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
        throw new Error(
            "ANTHROPIC_API_KEY is not set. Get one at https://console.anthropic.com/settings/keys and add it to .env.local + Vercel.",
        );
    }
    cached = new Anthropic({ apiKey: key });
    return cached;
}

export const anthropic = new Proxy({} as Anthropic, {
    get(_target, prop) {
        const client = getClient();
        const value = client[prop as keyof Anthropic];
        return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(client) : value;
    },
});

// Model pinned: Haiku is dirt cheap and plenty smart for trading journal
// analysis. ~$0.0015 per analysis. Update when intentionally upgrading.
export const AI_MODEL = "claude-haiku-4-5-20251001";
