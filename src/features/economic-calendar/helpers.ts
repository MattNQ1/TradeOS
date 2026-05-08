// Pure helpers for grouping, formatting, and filtering events.
import type { EconomicEvent, ImpactLevel } from "./types";

/** Returns YYYY-MM-DD in the local timezone. */
function localDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

export function groupByLocalDate(events: EconomicEvent[]): Map<string, EconomicEvent[]> {
    const map = new Map<string, EconomicEvent[]>();
    for (const e of events) {
        const key = localDateKey(new Date(e.dateISO));
        const list = map.get(key) ?? [];
        list.push(e);
        map.set(key, list);
    }
    return map;
}

const dayLabelFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
});

const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
});

export function formatDayLabel(dateKey: string): string {
    // Build a Date from local date components so "today/tomorrow" comparison
    // is timezone-stable.
    const [y, m, d] = dateKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) return `Today · ${dayLabelFmt.format(date)}`;
    if (dayDiff === 1) return `Tomorrow · ${dayLabelFmt.format(date)}`;
    if (dayDiff === -1) return `Yesterday · ${dayLabelFmt.format(date)}`;
    return dayLabelFmt.format(date);
}

export function formatEventTime(iso: string): string {
    return timeFmt.format(new Date(iso));
}

export function isPast(iso: string): boolean {
    return new Date(iso).getTime() < Date.now();
}

// ---------- Filtering ----------

export interface CalendarFilters {
    impacts: Set<ImpactLevel>;
    countries: Set<string>;       // empty = all
    hidePast: boolean;
}

export function applyFilters(events: EconomicEvent[], f: CalendarFilters): EconomicEvent[] {
    const now = Date.now();
    return events.filter((e) => {
        if (!f.impacts.has(e.impact)) return false;
        if (f.countries.size > 0 && !f.countries.has(e.country)) return false;
        if (f.hidePast && new Date(e.dateISO).getTime() < now) return false;
        return true;
    });
}

export function uniqueCountries(events: EconomicEvent[]): string[] {
    const set = new Set<string>();
    for (const e of events) set.add(e.country);
    return Array.from(set).sort();
}

// ---------- Display tokens ----------

export const IMPACT_COLOR: Record<ImpactLevel, { bg: string; text: string; dot: string }> = {
    High:    { bg: "bg-[color-mix(in_oklab,var(--color-loss)_15%,transparent)]", text: "text-[var(--color-loss)]",  dot: "bg-[var(--color-loss)]" },
    Medium:  { bg: "bg-[color-mix(in_oklab,var(--color-warn)_15%,transparent)]", text: "text-[var(--color-warn)]",  dot: "bg-[var(--color-warn)]" },
    Low:     { bg: "bg-[color-mix(in_oklab,var(--color-text-muted)_15%,transparent)]", text: "text-[var(--color-text-muted)]", dot: "bg-[var(--color-text-muted)]" },
    Holiday: { bg: "bg-[color-mix(in_oklab,var(--color-accent)_10%,transparent)]", text: "text-[var(--color-accent)]", dot: "bg-[var(--color-accent)]" },
};
