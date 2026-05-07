// Reusable Button component.
// Variants: primary (emerald), secondary (slate), ghost (transparent), danger (rose).
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

const variants: Record<Variant, string> = {
    primary:   "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white",
    secondary: "bg-[var(--color-bg-elev-2)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)]",
    ghost:     "bg-transparent hover:bg-[var(--color-bg-elev-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
    danger:    "bg-transparent hover:bg-[var(--color-loss)] hover:text-white text-[var(--color-loss)] border border-[var(--color-loss)]",
};

const sizes: Record<Size, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
                "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    );
}
