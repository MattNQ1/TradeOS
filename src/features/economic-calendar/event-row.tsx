// One row per economic event. Clicking opens the detail modal.
"use client";

import { formatEventTime, IMPACT_COLOR, isPast } from "./helpers";
import type { EconomicEvent } from "./types";

interface EventRowProps {
    event: EconomicEvent;
    onSelect: (event: EconomicEvent) => void;
}

export function EventRow({ event, onSelect }: EventRowProps) {
    const past = isPast(event.dateISO);
    const impact = IMPACT_COLOR[event.impact];

    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
            className={`text-left bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-lg px-3 py-2.5 grid grid-cols-[auto_auto_1fr_auto] gap-x-3 items-center transition-all ${past ? "opacity-50" : ""}`}
        >
            {/* Time */}
            <div className="text-xs font-semibold tabular-nums text-[var(--color-text-muted)] w-12">
                {formatEventTime(event.dateISO)}
            </div>

            {/* Currency badge */}
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)] bg-[var(--color-bg-elev)] border border-[var(--color-border)] rounded px-1.5 py-0.5 w-12 text-center">
                {event.country}
            </div>

            {/* Title + values */}
            <div className="min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                {(event.actual || event.forecast || event.previous) && (
                    <p className="text-[11px] text-[var(--color-text-muted)] tabular-nums mt-0.5 truncate">
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

            {/* Impact pill */}
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${impact.bg} ${impact.text}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${impact.dot}`} />
                {event.impact === "Medium" ? "Med" : event.impact}
            </div>
        </button>
    );
}
