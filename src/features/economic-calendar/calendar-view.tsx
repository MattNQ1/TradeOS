// Top-level Client Component that orchestrates filters + grouped event list.
"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { EventRow } from "./event-row";
import { EventModal } from "./event-modal";
import { FilterBar } from "./filter-bar";
import {
    applyFilters,
    formatDayLabel,
    groupByLocalDate,
    uniqueCountries,
    type CalendarFilters,
} from "./helpers";
import type { EconomicEvent } from "./types";

interface CalendarViewProps {
    events: EconomicEvent[];
    error: string | null;
}

export function CalendarView({ events, error }: CalendarViewProps) {
    const [filters, setFilters] = useState<CalendarFilters>({
        impacts: new Set(["High", "Medium"]),
        countries: new Set(),
        hidePast: true,
    });
    const [selected, setSelected] = useState<EconomicEvent | null>(null);

    // Available currencies — derived from raw events, not filtered ones,
    // so users can always reach all currencies even with strict impact filter.
    const availableCountries = useMemo(() => uniqueCountries(events), [events]);

    const filtered = useMemo(() => applyFilters(events, filters), [events, filters]);
    const grouped = useMemo(() => groupByLocalDate(filtered), [filtered]);
    const dayKeys = useMemo(() => Array.from(grouped.keys()).sort(), [grouped]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">Economic Calendar</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    This week + next week. Times shown in your local timezone.
                </p>
            </div>

            <Card>
                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    availableCountries={availableCountries}
                />
            </Card>

            {error && events.length === 0 ? (
                <Card>
                    <div className="text-center py-6">
                        <div className="text-3xl mb-2 opacity-50">📡</div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Couldn&apos;t load economic events. The data feed may be temporarily down.
                        </p>
                        <p className="text-xs text-[var(--color-text-subtle)] mt-2 break-all">{error}</p>
                    </div>
                </Card>
            ) : dayKeys.length === 0 ? (
                <Card>
                    <div className="text-center py-6">
                        <div className="text-3xl mb-2 opacity-50">📅</div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            No events match your filters.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col gap-4">
                    {dayKeys.map((key) => {
                        const dayEvents = grouped.get(key)!;
                        return (
                            <div key={key} className="flex flex-col gap-2">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-1">
                                    {formatDayLabel(key)}
                                </h2>
                                <div className="flex flex-col gap-1.5">
                                    {dayEvents.map((e) => (
                                        <EventRow key={e.id} event={e} onSelect={setSelected} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <EventModal event={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
