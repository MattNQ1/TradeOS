// Reusable Card component.
// Use Card as the wrapper, CardTitle for the heading.
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "bg-[var(--color-bg-elev)] border border-[var(--color-border-soft)]",
                "rounded-2xl p-4 shadow-lg flex flex-col gap-3",
                className,
            )}
            {...props}
        />
    );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "text-xs font-semibold text-[var(--color-text-muted)]",
                "uppercase tracking-wider m-0",
                className,
            )}
            {...props}
        />
    );
}
