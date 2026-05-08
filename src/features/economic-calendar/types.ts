// Shape of a single economic event after we normalize the raw FF feed.

export type ImpactLevel = "High" | "Medium" | "Low" | "Holiday";

export interface EconomicEvent {
    /** Stable hash so React lists key off something unique. */
    id: string;
    /** Currency / country code: USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, etc. */
    country: string;
    /** Event name, e.g. "Non-Farm Employment Change". */
    title: string;
    /** ISO datetime with timezone (parseable by Date()). */
    dateISO: string;
    impact: ImpactLevel;
    forecast: string | null;
    previous: string | null;
    /** Present after release; the FF feed adds it once data is published. */
    actual: string | null;
}
