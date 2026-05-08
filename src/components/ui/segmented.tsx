// Two-or-more option toggle (Long/Short, Ticks/Points, etc.).
// `tone` lets the active state pick a color: green/red for direction,
// neutral for plain choices.
"use client";

import { cn } from "@/lib/utils";

type Tone = "neutral" | "directional";

interface SegmentedOption<T extends string> {
    value: T;
    label: string;
    /** Override the active background color for this specific option (used by directional toggles). */
    activeColor?: "gain" | "loss";
}

interface SegmentedProps<T extends string> {
    options: ReadonlyArray<SegmentedOption<T>>;
    value: T;
    onChange: (value: T) => void;
    tone?: Tone;
    "aria-label"?: string;
}

export function Segmented<T extends string>({
    options,
    value,
    onChange,
    "aria-label": ariaLabel,
}: SegmentedProps<T>) {
    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={cn(
                "grid gap-1 p-1 rounded-lg",
                "bg-[var(--color-bg-elev-2)] border border-[var(--color-border)]",
            )}
            style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        >
            {options.map((opt) => {
                const isActive = opt.value === value;
                const activeBg =
                    opt.activeColor === "gain"
                        ? "bg-[var(--color-gain)] text-white"
                        : opt.activeColor === "loss"
                            ? "bg-[var(--color-loss)] text-white"
                            : "bg-[var(--color-bg-elev)] text-[var(--color-text)] shadow";
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "py-2.5 rounded-md text-sm font-semibold transition-colors",
                            isActive
                                ? activeBg
                                : "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                        )}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
