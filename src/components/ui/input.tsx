// Reusable Input component, optionally with a label and hint.
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

export function Input({ label, hint, error, id, className, ...props }: InputProps) {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text)]">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    "w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)]",
                    "rounded-lg px-3.5 py-3 text-base text-[var(--color-text)]",
                    "focus:outline-none focus:border-[var(--color-accent)]",
                    "focus:ring-3 focus:ring-[var(--color-accent)]/20",
                    "transition-colors",
                    error && "border-[var(--color-loss)]",
                    className,
                )}
                {...props}
            />
            {error ? (
                <p className="text-xs text-[var(--color-loss)]">{error}</p>
            ) : hint ? (
                <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
            ) : null}
        </div>
    );
}
