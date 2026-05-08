// Impact + currency + hide-past filters.
"use client";

import { cn } from "@/lib/utils";
import type { ImpactLevel } from "./types";
import type { CalendarFilters } from "./helpers";

interface FilterBarProps {
    filters: CalendarFilters;
    setFilters: (next: CalendarFilters) => void;
    availableCountries: string[];
}

const IMPACTS: ImpactLevel[] = ["High", "Medium", "Low"];

export function FilterBar({ filters, setFilters, availableCountries }: FilterBarProps) {
    const toggleImpact = (impact: ImpactLevel) => {
        const next = new Set(filters.impacts);
        if (next.has(impact)) next.delete(impact);
        else next.add(impact);
        setFilters({ ...filters, impacts: next });
    };

    const toggleCountry = (country: string) => {
        const next = new Set(filters.countries);
        if (next.has(country)) next.delete(country);
        else next.add(country);
        setFilters({ ...filters, countries: next });
    };

    const clearCountries = () => {
        setFilters({ ...filters, countries: new Set() });
    };

    return (
        <div className="flex flex-col gap-2.5">
            {/* Impact chips */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mr-1">
                    Impact
                </span>
                {IMPACTS.map((imp) => (
                    <Chip
                        key={imp}
                        label={imp}
                        active={filters.impacts.has(imp)}
                        onClick={() => toggleImpact(imp)}
                    />
                ))}
            </div>

            {/* Currency chips */}
            {availableCountries.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mr-1">
                        Currency
                    </span>
                    <Chip label="All" active={filters.countries.size === 0} onClick={clearCountries} />
                    {availableCountries.map((c) => (
                        <Chip
                            key={c}
                            label={c}
                            active={filters.countries.has(c)}
                            onClick={() => toggleCountry(c)}
                        />
                    ))}
                </div>
            )}

            {/* Hide past toggle */}
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={filters.hidePast}
                    onChange={(e) => setFilters({ ...filters, hidePast: e.target.checked })}
                    className="w-4 h-4 accent-[var(--color-accent)]"
                />
                Hide past events
            </label>
        </div>
    );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors",
                active
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-[var(--color-bg-elev-2)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]",
            )}
        >
            {label}
        </button>
    );
}
