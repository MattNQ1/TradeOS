// Fetch this-week + next-week economic events from the Forex Factory community feed.
// FF events are timestamped in US Eastern time; we normalize to ISO and let the
// client format in the user's local timezone.
import "server-only";
import type { EconomicEvent, ImpactLevel } from "./types";

const FEEDS = [
    "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
    "https://nfs.faireconomy.media/ff_calendar_nextweek.json",
];

interface RawFFEvent {
    title?: string;
    country?: string;
    date?: string;
    impact?: string;
    forecast?: string;
    previous?: string;
    actual?: string;
}

function normalizeImpact(raw: string | undefined): ImpactLevel {
    const v = (raw ?? "").trim().toLowerCase();
    if (v === "high") return "High";
    if (v === "medium") return "Medium";
    if (v === "holiday") return "Holiday";
    return "Low";
}

function fingerprint(e: RawFFEvent): string {
    return `${e.date ?? ""}|${e.country ?? ""}|${e.title ?? ""}`;
}

export interface FetchResult {
    events: EconomicEvent[];
    error: string | null;
}

export async function fetchEconomicEvents(): Promise<FetchResult> {
    const all: EconomicEvent[] = [];
    const errors: string[] = [];

    for (const url of FEEDS) {
        try {
            // Cache for 1 hour — events don't change frequently and we want fast page loads.
            const res = await fetch(url, { next: { revalidate: 3600 } });
            if (!res.ok) {
                errors.push(`${url} → HTTP ${res.status}`);
                continue;
            }
            const raw = (await res.json()) as RawFFEvent[];
            for (const e of raw) {
                if (!e.date || !e.title || !e.country) continue;
                all.push({
                    id: fingerprint(e),
                    country: e.country.toUpperCase(),
                    title: e.title,
                    dateISO: e.date,
                    impact: normalizeImpact(e.impact),
                    forecast: e.forecast?.trim() || null,
                    previous: e.previous?.trim() || null,
                    actual: e.actual?.trim() || null,
                });
            }
        } catch (err) {
            errors.push(`${url} → ${err instanceof Error ? err.message : "unknown"}`);
        }
    }

    // Dedupe by id (in case events appear in both feeds at week boundary).
    const byId = new Map<string, EconomicEvent>();
    for (const e of all) byId.set(e.id, e);
    const events = Array.from(byId.values()).sort((a, b) => a.dateISO.localeCompare(b.dateISO));

    return {
        events,
        error: events.length === 0 && errors.length > 0 ? errors.join("; ") : null,
    };
}
