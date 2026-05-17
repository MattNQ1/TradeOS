// Instagram carousel slide generator.
//
// Visit /marketing/slide?n=1 through /marketing/slide?n=5 to view each slide
// as a 1080x1350 PNG. Right-click → "Save image as..." to download.
//
// Then upload all 5 to Instagram as a carousel post. Caption + hashtags
// are in MARKETING_ASSETS.md at the repo root.
//
// 1080x1350 = 4:5 portrait, Instagram's max vertical size for feed posts.
// Takes up the most screen real estate on a phone scroll.
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const n = Math.max(1, Math.min(5, parseInt(url.searchParams.get("n") ?? "1", 10)));
    const slide = SLIDES[n - 1];

    return new ImageResponse(slide, {
        width: 1080,
        height: 1350,
    });
}

// ============================================================
// Shared design tokens — match the OG card / app theme
// ============================================================

const COLORS = {
    bg: "#050505",
    bgGradient:
        "linear-gradient(135deg, #050505 0%, #062e26 70%, #0a3d34 100%)",
    accent: "#10b981",
    accentSoft: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.35)",
    text: "#ffffff",
    textMuted: "#a8b8b3",
    textSubtle: "#6c7771",
    warn: "#f59e0b",
    gain: "#10b981",
    loss: "#ef4444",
};

const FRAME_PADDING = 80;

// Tiny wordmark used in the corner of every slide for brand consistency.
// Every child has display:flex set — Satori (next/og's renderer) requires
// this on every div with children.
function Wordmark({ marginBottom = 60 }: { marginBottom?: number }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom,
            }}
        >
            <div
                style={{
                    display: "flex",
                    fontSize: 36,
                    color: COLORS.accent,
                    lineHeight: 1,
                    marginRight: 14,
                }}
            >
                ▲
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 28,
                    fontWeight: 700,
                    color: COLORS.text,
                    letterSpacing: -1,
                }}
            >
                TradeOS
            </div>
        </div>
    );
}

// Page number indicator in the bottom-right (1/5, 2/5, etc.)
function PageDot({ current }: { current: number }) {
    return (
        <div
            style={{
                position: "absolute",
                right: FRAME_PADDING,
                bottom: FRAME_PADDING - 20,
                fontSize: 20,
                color: COLORS.textSubtle,
                fontWeight: 600,
                letterSpacing: 2,
                display: "flex",
            }}
        >
            {current} / 5
        </div>
    );
}

// ============================================================
// Slides
// ============================================================

const SLIDES = [
    // -------- SLIDE 1 — HOOK --------
    (
        <div
            key="slide-1"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bgGradient,
                display: "flex",
                flexDirection: "column",
                padding: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark />

            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 30,
                        color: COLORS.accent,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 28,
                    }}
                >
                    For prop firm traders
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 86,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: -3,
                    }}
                >
                    You&rsquo;re juggling 4 apps to manage one funded account.
                </div>
            </div>

            <div
                style={{
                    fontSize: 26,
                    color: COLORS.textMuted,
                    fontStyle: "italic",
                    display: "flex",
                }}
            >
                Swipe →
            </div>
            <PageDot current={1} />
        </div>
    ),

    // -------- SLIDE 2 — THE MESS --------
    (
        <div
            key="slide-2"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bg,
                display: "flex",
                flexDirection: "column",
                padding: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={50} />

            <div
                style={{
                    display: "flex",
                    fontSize: 56,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: -1.5,
                    marginBottom: 50,
                }}
            >
                What you&rsquo;re tracking right now:
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                {[
                    { name: "Position size calc", where: "iOS calculator app" },
                    { name: "Trade journal", where: "Excel sheet" },
                    { name: "Prop firm rules", where: "Notes app" },
                    { name: "Economic events", where: "Forex Factory tab" },
                ].map((item, idx) => (
                    <div
                        key={item.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            paddingTop: 26,
                            paddingBottom: 26,
                            paddingLeft: 28,
                            paddingRight: 28,
                            marginTop: idx === 0 ? 0 : 22,
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 18,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "rgba(255,255,255,0.08)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: 14,
                                height: 14,
                                borderRadius: 7,
                                background: COLORS.warn,
                                marginRight: 24,
                                flexShrink: 0,
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 30,
                                    fontWeight: 700,
                                }}
                            >
                                {item.name}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 22,
                                    color: COLORS.textMuted,
                                    marginTop: 4,
                                }}
                            >
                                Lives in: {item.where}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 28,
                    color: COLORS.textMuted,
                    marginTop: 40,
                    fontStyle: "italic",
                }}
            >
                Each one is fine alone. Together they&rsquo;re a focus killer.
            </div>
            <PageDot current={2} />
        </div>
    ),

    // -------- SLIDE 3 — THE SOLUTION --------
    (
        <div
            key="slide-3"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bgGradient,
                display: "flex",
                flexDirection: "column",
                padding: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={50} />

            <div
                style={{
                    display: "flex",
                    fontSize: 72,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: -2,
                    marginBottom: 50,
                }}
            >
                One app does all of it.
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                {[
                    "Position sizing across all 8 main futures",
                    "Journal with auto-calculated stats",
                    "Trailing drawdown tracked to the dollar",
                    "Prop firm presets (Topstep, Apex, MFF, FTMO)",
                    "Economic calendar with explainers",
                ].map((line, idx) => (
                    <div
                        key={line}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: idx === 0 ? 0 : 18,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: 36,
                                color: COLORS.accent,
                                fontWeight: 800,
                                lineHeight: 1,
                                marginRight: 20,
                                flexShrink: 0,
                            }}
                        >
                            ✓
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: 34,
                                fontWeight: 500,
                                color: COLORS.text,
                            }}
                        >
                            {line}
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 26,
                    color: COLORS.textMuted,
                    marginTop: 30,
                }}
            >
                Mobile-first. Designed for the device you actually trade from.
            </div>
            <PageDot current={3} />
        </div>
    ),

    // -------- SLIDE 4 — AI DIFFERENTIATOR --------
    (
        <div
            key="slide-4"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bg,
                display: "flex",
                flexDirection: "column",
                padding: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={40} />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    background: COLORS.accentSoft,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: COLORS.accentBorder,
                    borderRadius: 999,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.accent,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    marginBottom: 28,
                    alignSelf: "flex-start",
                }}
            >
                Pro feature
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 60,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: -1.5,
                    marginBottom: 40,
                }}
            >
                AI that reads your journal back to you.
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                {[
                    {
                        label: "Pattern",
                        color: COLORS.accent,
                        text: "You win 78% of MES longs but only 41% of NQ shorts — drop the NQ shorts.",
                    },
                    {
                        label: "Watch for",
                        color: COLORS.warn,
                        text: "After your −$340 loss on 5/3, you sized up 3× — classic revenge sizing.",
                    },
                    {
                        label: "Strongest setup",
                        color: COLORS.gain,
                        text: "MES longs on Tuesdays — 8/10 wins, +$840 net.",
                    },
                ].map((q, idx) => (
                    <div
                        key={q.label}
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "rgba(255,255,255,0.08)",
                            borderRadius: 16,
                            paddingTop: 22,
                            paddingBottom: 22,
                            paddingLeft: 26,
                            paddingRight: 26,
                            marginTop: idx === 0 ? 0 : 22,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: 18,
                                fontWeight: 700,
                                color: q.color,
                                textTransform: "uppercase",
                                letterSpacing: 1.5,
                                marginBottom: 10,
                            }}
                        >
                            {q.label}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: 24,
                                lineHeight: 1.35,
                                color: COLORS.text,
                            }}
                        >
                            {q.text}
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 22,
                    color: COLORS.textSubtle,
                    marginTop: 30,
                    fontStyle: "italic",
                }}
            >
                Real output from the AI tab.
            </div>
            <PageDot current={4} />
        </div>
    ),

    // -------- SLIDE 5 — CTA --------
    (
        <div
            key="slide-5"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bgGradient,
                display: "flex",
                flexDirection: "column",
                padding: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
                justifyContent: "center",
                alignItems: "flex-start",
            }}
        >
            <Wordmark marginBottom={30} />

            <div
                style={{
                    display: "flex",
                    fontSize: 110,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: -4,
                    marginBottom: 40,
                }}
            >
                Try it free.
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 50,
                }}
            >
                <div style={{ fontSize: 34, fontWeight: 600, display: "flex" }}>
                    <span style={{ color: COLORS.accent, marginRight: 14 }}>Free:</span>
                    <span style={{ color: COLORS.text }}>
                        position calc, 25 trades, prop firm presets
                    </span>
                </div>
                <div style={{ fontSize: 34, fontWeight: 600, display: "flex", marginTop: 18 }}>
                    <span style={{ color: COLORS.accent, marginRight: 14 }}>Pro:</span>
                    <span style={{ color: COLORS.text }}>
                        $19/mo, 7-day trial, AI insights, unlimited
                    </span>
                </div>
            </div>

            <div
                style={{
                    background: COLORS.accent,
                    color: "#03150f",
                    fontSize: 38,
                    fontWeight: 800,
                    paddingTop: 26,
                    paddingBottom: 26,
                    paddingLeft: 48,
                    paddingRight: 48,
                    borderRadius: 18,
                    display: "flex",
                }}
            >
                usetradeos.vercel.app
            </div>

            <div
                style={{
                    marginTop: 30,
                    fontSize: 24,
                    color: COLORS.textMuted,
                    display: "flex",
                }}
            >
                Link in bio. Built by traders, for traders.
            </div>
            <PageDot current={5} />
        </div>
    ),
];
