// iPhone-style frame for marketing screenshots.
// Dark bezel + Dynamic Island notch. Inner area fills with whatever children render.
// Use `tilt` for App-Store-listing-style rotation.
//
// Visual polish for the premium feel:
//   - Layered drop shadow + inset highlight on the bezel
//   - Optional soft emerald glow ring behind the phone (so it reads as "lit")
//   - Subtle top-down screen reflection
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

interface PhoneFrameProps {
    children: React.ReactNode;
    size?: Size;
    /** Degrees of Z rotation for that App-Store-listing tilt. */
    tilt?: number;
    /** Optional extra className on the outer wrapper (e.g. animate-float-slow). */
    className?: string;
    /** Toggle the soft emerald glow ring behind the phone. */
    glow?: boolean;
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

export function PhoneFrame({ children, size = "md", tilt = 0, className, glow = true }: PhoneFrameProps) {
    const s = sizeClasses[size];

    // Stronger drop shadow + optional emerald aura + inset bezel highlight.
    const phoneShadow = glow
        ? "shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_0_50px_-10px_rgba(16,185,129,0.22),0_0_0_2px_rgba(255,255,255,0.06)_inset,0_2px_0_rgba(255,255,255,0.08)_inset]"
        : "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),0_0_0_2px_rgba(255,255,255,0.04)_inset]";

    return (
        <div
            className={cn("relative", className)}
            style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
        >
            {/* Soft glow ring behind the phone */}
            {glow && (
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 blur-3xl"
                    style={{
                        background:
                            "radial-gradient(closest-side, rgba(16,185,129,0.35), transparent 70%)",
                    }}
                />
            )}

            <div className={cn("relative bg-neutral-900", s.frame, phoneShadow)}>
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

                {/* Top-down screen reflection */}
                <div
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute inset-[9px] bg-gradient-to-b from-white/[0.07] via-transparent to-transparent",
                        s.screen,
                    )}
                />
            </div>
        </div>
    );
}
