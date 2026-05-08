// Top-level Client Component that orchestrates filters + grouped event list.
// Free users see a teaser (first 1-2 events) with the rest blurred behind a paywall.
"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { UpgradePrompt } from "@/features/billing/upgrade-prompt";
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
    /** True for paid users (Pro or Lifetime). Free users see the gated UX. */
    isPaid: boolean;
}

/** How many events a Free user can see un-blurred (the teaser). */
const FREE_TEASER_COUNT = 2;

export function CalendarView({ events, error, isPaid }: CalendarViewProps) {
    const [filters, setFilters] = useState<CalendarFilters>({
        impacts: new Set(["High", "Medium"]),
        countries: new Set(),
        hidePast: true,
    });
    const [selected, setSelected] = useState<EconomicEvent | null>(null);

    const availableCountries = useMemo(() => uniqueCountries(events), [events]);
    const filtered = useMemo(() => applyFilters(events, filters), [events, filters]);
    const grouped = useMemo(() => groupByLocalDate(filtered), [filtered]);
    const dayKeys = useMemo(() => Array.from(grouped.keys()).sort(), [grouped]);

    // Track whether each event is past the free teaser cutoff (gated for free users).
    const isGated = (eventId: string): boolean => {
        if (isPaid) return false;
        let count = 0;
        for (const key of dayKeys) {
            for (const e of grouped.get(key)!) {
                if (e.id === eventId) return count >= FREE_TEASER_COUNT;
                count++;
            }
        }
        return true;
    };

    const onEventSelect = (e: EconomicEvent) => {
        if (!isPaid && isGated(e.id)) {
            // Show paywall modal instead of detail.
            setSelected({ ...e, __paywalled: true } as EconomicEvent & { __paywalled?: boolean });
            return;
        }
        setSelected(e);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Economic Calendar</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        This week + next week. Times shown in your local timezone.
                    </p>
                </div>
                {!isPaid && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-1 rounded bg-[var(--color-accent)] whitespace-nowrap mt-1">
                        Pro feature
                    </span>
                )}
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
                                        <EventRow
                                            key={e.id}
                                            event={e}
                                            onSelect={onEventSelect}
                                            blurred={!isPaid && isGated(e.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {!isPaid && (
                        <UpgradePrompt
                            title="Unlock the full economic calendar"
                            description="Free accounts see only the next 2 events. Upgrade to see every release for this week + next week, plus tap any event for plain-English explanations."
                            features={[
                                "Every economic release this week + next week",
                                "Plain-English explanations for every event (NFP, CPI, FOMC, GDP, ISM, …)",
                                "How to interpret each release for trading",
                                "Live values: forecast, previous, actual",
                            ]}
                        />
                    )}
                </div>
            )}

            <EventModal
                event={selected}
                onClose={() => setSelected(null)}
                isPaid={isPaid}
            />
        </div>
    );
}
