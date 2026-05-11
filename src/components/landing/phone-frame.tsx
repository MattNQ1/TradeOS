// iPhone-style frame for marketing screenshots.
// Dark bezel + Dynamic Island notch. Inner area fills with whatever children render.
// Use `tilt` for App-Store-listing-style rotation.
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

interface PhoneFrameProps {
    children: React.ReactNode;
    size?: Size;
    /** Degrees of Z rotation for that App-Store-listing tilt. */
    tilt?: number;
    className?: string;
}

const sizeClasses: Record<Size, { frame: string; screen: string; notchW: string; notchH: string }> = {
    sm: {
        frame: "w-[220px] h-[460px] p-[7px] rounded-[2.5rem]",
        screen: "rounded-[2rem]",
        notchW: "w-20",
        notchH: "h-5",
    },
    md: {
        frame: "w-[280px] h-[580px] p-[9px] rounded-[3rem]",
        screen: "rounded-[2.4rem]",
        notchW: "w-24",
        notchH: "h-6",
    },
    lg: {
        frame: "w-[320px] h-[660px] p-[10px] rounded-[3.25rem]",
        screen: "rounded-[2.6rem]",
        notchW: "w-28",
        notchH: "h-7",
    },
};

export function PhoneFrame({ children, size = "md", tilt = 0, className }: PhoneFrameProps) {
    const s = sizeClasses[size];
    return (
        <div
            className={cn(
                "relative bg-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_2px_rgba(255,255,255,0.04)_inset]",
                s.frame,
                className,
            )}
            style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
        >
            {/* Dynamic Island notch */}
            <div
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 top-[14px] bg-black rounded-full z-20",
                    s.notchW,
                    s.notchH,
                )}
            />

            {/* Screen */}
            <div className={cn("relative w-full h-full overflow-hidden bg-[var(--color-bg)]", s.screen)}>
                {children}
            </div>

            {/* Subtle screen highlight (top reflection) */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent",
                    s.screen,
                )}
                style={{ padding: "inherit" }}
            />
        </div>
    );
}
