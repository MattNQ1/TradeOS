// One row per economic event. Clicking opens the detail modal (or paywall, if gated).
"use client";

import { formatEventTime, IMPACT_COLOR, isPast } from "./helpers";
import type { EconomicEvent } from "./types";

interface EventRowProps {
    event: EconomicEvent;
    onSelect: (event: EconomicEvent) => void;
    /** When true, key fields are blurred — the row remains clickable so the
     *  paywall modal explains what they're missing. */
    blurred?: boolean;
}

export function EventRow({ event, onSelect, blurred = false }: EventRowProps) {
    const past = isPast(event.dateISO);
    const impact = IMPACT_COLOR[event.impact];

    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
            className={`relative text-left bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-lg px-3 py-2.5 grid grid-cols-[auto_auto_1fr_auto] gap-x-3 items-center transition-all overflow-hidden ${past ? "opacity-50" : ""}`}
        >
            {/* Time */}
            <div className={`text-xs font-semibold tabular-nums text-[var(--color-text-muted)] w-12 ${blurred ? "blur-[5px] select-none" : ""}`}>
                {formatEventTime(event.dateISO)}
            </div>

            {/* Currency badge */}
            <div className={`text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)] bg-[var(--color-bg-elev)] border border-[var(--color-border)] rounded px-1.5 py-0.5 w-12 text-center ${blurred ? "blur-[5px] select-none" : ""}`}>
                {event.country}
            </div>

            {/* Title + values */}
            <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${blurred ? "blur-[5px] select-none" : ""}`}>
                    {event.title}
                </p>
                {(event.actual || event.forecast || event.previous) && (
                    <p className={`text-[11px] text-[var(--color-text-muted)] tabular-nums mt-0.5 truncate ${blurred ? "blur-[5px] select-none" : ""}`}>
                        {event.actual !== null && (
                            <span>
                                Actual <span className="font-semibold text-[var(--color-text)]">{event.actual}</span>{" "}
                            </span>
                        )}
                        {event.forecast !== null && <span>Fcst {event.forecast} </span>}
                        {event.previous !== null && <span>Prev {event.previous}</span>}
                    </p>
                )}
            </div>

            {/* Impact pill or lock for blurred rows */}
            {blurred ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-accent)] text-white whitespace-nowrap">
                    🔒 Pro
                </div>
            ) : (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${impact.bg} ${impact.text}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${impact.dot}`} />
                    {event.impact === "Medium" ? "Med" : event.impact}
                </div>
            )}
        </button>
    );
}
