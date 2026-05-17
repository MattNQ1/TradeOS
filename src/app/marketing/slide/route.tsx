// Instagram carousel slide generator — visual version with inline phone
// mockups of the actual TradeOS app (dashboard + AI insights screens).
//
// Visit /marketing/slide?n=1 through /marketing/slide?n=5 to view each
// slide as a 1080x1350 PNG. Right-click → "Save image as..." to download.
//
// Then upload all 5 to Instagram as a carousel post. Caption + hashtags
// are in MARKETING_ASSETS.md at the repo root.
//
// Important: Satori (next/og's renderer) is stricter than the browser.
// Every <div> with children must have display:flex set, and CSS shorthand
// properties (padding: "10px 20px", flex: 1) are unreliable across edge
// vs node runtimes — always use individual properties.
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
// Design tokens — match the app theme
// ============================================================

const COLORS = {
    bg: "#050505",
    bgGradient:
        "linear-gradient(135deg, #050505 0%, #062e26 70%, #0a3d34 100%)",
    bgPhone: "#0a0a0a",
    bgCard: "#141414",
    bgCardElev: "#1c1c1c",
    accent: "#10b981",
    accentSoft: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.35)",
    text: "#ffffff",
    textMuted: "#a8b8b3",
    textSubtle: "#6c7771",
    border: "rgba(255,255,255,0.08)",
    warn: "#f59e0b",
    gain: "#10b981",
    loss: "#ef4444",
};

const FRAME_PADDING = 80;

// ============================================================
// Shared components
// ============================================================

function Wordmark({ marginBottom = 40 }: { marginBottom?: number }) {
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
// Phone mockup — outer iPhone-style shell
// ============================================================

function PhoneShell({
    children,
    width = 440,
}: {
    children: React.ReactNode;
    width?: number;
}) {
    const height = Math.round(width * 2.05);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width,
                height,
                background: "#000",
                borderRadius: 56,
                borderWidth: 10,
                borderStyle: "solid",
                borderColor: "#1f1f1f",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                    "0 50px 100px rgba(0,0,0,0.7), 0 0 80px rgba(16,185,129,0.25)",
            }}
        >
            {/* Notch */}
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    top: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 110,
                    height: 28,
                    background: "#000",
                    borderRadius: 999,
                    zIndex: 10,
                }}
            />
            {children}
        </div>
    );
}

// In-phone header (TradeOS bar + page title)
function PhoneHeader({ tab }: { tab: string }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 52,
                paddingBottom: 14,
                paddingLeft: 22,
                paddingRight: 22,
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: COLORS.border,
                background: COLORS.bg,
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        display: "flex",
                        color: COLORS.accent,
                        fontSize: 22,
                        marginRight: 8,
                    }}
                >
                    ▲
                </div>
                <div
                    style={{
                        display: "flex",
                        color: COLORS.text,
                        fontSize: 18,
                        fontWeight: 700,
                    }}
                >
                    TradeOS
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    color: COLORS.textMuted,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                }}
            >
                {tab}
            </div>
        </div>
    );
}

// Bottom nav with 6 tabs
function PhoneNav({ active }: { active: string }) {
    const tabs = ["Home", "Calc", "Journal", "AI", "Prop", "Econ"];
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-around",
                paddingTop: 10,
                paddingBottom: 18,
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: COLORS.border,
                background: COLORS.bg,
            }}
        >
            {tabs.map((t) => (
                <div
                    key={t}
                    style={{
                        display: "flex",
                        fontSize: 11,
                        fontWeight: 600,
                        color: t === active ? COLORS.accent : COLORS.textSubtle,
                    }}
                >
                    {t}
                </div>
            ))}
        </div>
    );
}

// ============================================================
// Dashboard screen contents (for inside a phone)
// ============================================================

function DashboardContent() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                background: COLORS.bg,
                paddingTop: 16,
                paddingBottom: 10,
                paddingLeft: 16,
                paddingRight: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    color: COLORS.text,
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 12,
                }}
            >
                Dashboard
            </div>

            {/* Hero P&L card */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    background: COLORS.bgCard,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: COLORS.border,
                    paddingTop: 14,
                    paddingBottom: 14,
                    paddingLeft: 14,
                    paddingRight: 14,
                    marginBottom: 10,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORS.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 6,
                    }}
                >
                    Total P&L
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 36,
                        fontWeight: 800,
                        color: COLORS.gain,
                        lineHeight: 1,
                    }}
                >
                    +$2,840
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 12,
                        color: COLORS.textMuted,
                        marginTop: 8,
                    }}
                >
                    42 trades · 28 wins · 14 losses
                </div>
            </div>

            {/* 2x2 metric grid */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 10,
                }}
            >
                <div style={{ display: "flex", marginBottom: 8 }}>
                    <MetricCard label="Win rate" value="67%" />
                    <div style={{ display: "flex", width: 8 }} />
                    <MetricCard label="Profit factor" value="2.34" />
                </div>
                <div style={{ display: "flex" }}>
                    <MetricCard label="Avg win" value="$152" color={COLORS.gain} />
                    <div style={{ display: "flex", width: 8 }} />
                    <MetricCard label="Avg loss" value="-$65" color={COLORS.loss} />
                </div>
            </div>

            {/* Equity curve card */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    background: COLORS.bgCard,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: COLORS.border,
                    paddingTop: 14,
                    paddingBottom: 14,
                    paddingLeft: 14,
                    paddingRight: 14,
                    flexGrow: 1,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 8,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 11,
                            fontWeight: 700,
                            color: COLORS.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        Equity curve
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 12,
                            fontWeight: 700,
                            color: COLORS.gain,
                        }}
                    >
                        +$2,840
                    </div>
                </div>
                {/* SVG line chart */}
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        flexGrow: 1,
                    }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 200 80"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 0 66 L 18 60 L 32 62 L 48 54 L 62 48 L 78 42 L 92 38 L 108 28 L 122 30 L 138 22 L 154 16 L 172 12 L 200 6"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M 0 66 L 18 60 L 32 62 L 48 54 L 62 48 L 78 42 L 92 38 L 108 28 L 122 30 L 138 22 L 154 16 L 172 12 L 200 6 L 200 80 L 0 80 Z"
                            fill="url(#eqFill)"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: COLORS.bgCard,
                borderRadius: 12,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: COLORS.border,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 12,
                paddingRight: 12,
                flexGrow: 1,
                flexBasis: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    fontSize: 10,
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 18,
                    fontWeight: 800,
                    color: color ?? COLORS.text,
                    lineHeight: 1,
                }}
            >
                {value}
            </div>
        </div>
    );
}

// ============================================================
// AI insights screen contents (for inside a phone)
// ============================================================

function AIContent() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                background: COLORS.bg,
                paddingTop: 16,
                paddingBottom: 10,
                paddingLeft: 16,
                paddingRight: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    color: COLORS.text,
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 4,
                }}
            >
                AI
            </div>
            <div
                style={{
                    display: "flex",
                    color: COLORS.textMuted,
                    fontSize: 11,
                    marginBottom: 14,
                }}
            >
                Find your patterns. Run the checklist.
            </div>

            {/* AI Insights card header */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    background: COLORS.bgCard,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: COLORS.border,
                    paddingTop: 14,
                    paddingBottom: 14,
                    paddingLeft: 14,
                    paddingRight: 14,
                    marginBottom: 10,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                display: "flex",
                                fontSize: 12,
                                fontWeight: 700,
                                color: COLORS.text,
                            }}
                        >
                            AI insights
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: 10,
                                color: COLORS.textSubtle,
                                marginTop: 2,
                            }}
                        >
                            Last analyzed today · 84 trades
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            background: COLORS.accent,
                            color: "#03150f",
                            fontSize: 11,
                            fontWeight: 700,
                            paddingTop: 6,
                            paddingBottom: 6,
                            paddingLeft: 12,
                            paddingRight: 12,
                            borderRadius: 8,
                        }}
                    >
                        Re-analyze
                    </div>
                </div>

                {/* Headline card */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(16,185,129,0.12)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: COLORS.accentBorder,
                        borderRadius: 10,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 12,
                        paddingRight: 12,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 9,
                            fontWeight: 700,
                            color: COLORS.accent,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 4,
                        }}
                    >
                        Headline
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 12,
                            color: COLORS.text,
                            lineHeight: 1.4,
                        }}
                    >
                        Crushing MES longs on Tuesdays. NQ shorts bleeding $1,200/wk.
                    </div>
                </div>
            </div>

            {/* Patterns block */}
            <InsightBlock
                label="Patterns"
                color={COLORS.accent}
                lines={[
                    "78% win rate on MES longs, 41% on NQ shorts.",
                    "8 of last 10 winners came Tue/Wed.",
                ]}
            />

            {/* Watch-for block */}
            <InsightBlock
                label="Watch for"
                color={COLORS.warn}
                lines={[
                    "Sized up 3× after -$340 loss. Revenge.",
                ]}
            />
        </div>
    );
}

function InsightBlock({
    label,
    color,
    lines,
}: {
    label: string;
    color: string;
    lines: string[];
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: COLORS.bgCardElev,
                borderRadius: 12,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: COLORS.border,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 12,
                paddingRight: 12,
                marginBottom: 8,
            }}
        >
            <div
                style={{
                    display: "flex",
                    fontSize: 9,
                    fontWeight: 700,
                    color,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 6,
                }}
            >
                {label}
            </div>
            {lines.map((line, idx) => (
                <div
                    key={idx}
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginTop: idx === 0 ? 0 : 4,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            color,
                            fontSize: 12,
                            fontWeight: 800,
                            marginRight: 6,
                            lineHeight: 1.3,
                        }}
                    >
                        •
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 11,
                            color: COLORS.text,
                            lineHeight: 1.35,
                        }}
                    >
                        {line}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// Slides
// ============================================================

const SLIDES = [
    // -------- SLIDE 1 — HOOK with dashboard phone --------
    (
        <div
            key="slide-1"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bgGradient,
                display: "flex",
                flexDirection: "column",
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={20} />

            <div
                style={{
                    display: "flex",
                    fontSize: 30,
                    color: COLORS.accent,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 16,
                }}
            >
                For prop firm traders
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 74,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: -2,
                    marginBottom: 30,
                }}
            >
                You&rsquo;re juggling 4 apps to manage 1 funded account.
            </div>

            {/* Phone mockup as visual centerpiece */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexGrow: 1,
                    alignItems: "flex-start",
                }}
            >
                <PhoneShell width={420}>
                    <PhoneHeader tab="Dashboard" />
                    <DashboardContent />
                    <PhoneNav active="Home" />
                </PhoneShell>
            </div>

            <PageDot current={1} />
        </div>
    ),

    // -------- SLIDE 2 — THE MESS (visual app card grid) --------
    (
        <div
            key="slide-2"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bg,
                display: "flex",
                flexDirection: "column",
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={40} />

            <div
                style={{
                    display: "flex",
                    fontSize: 56,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: -1.5,
                    marginBottom: 12,
                }}
            >
                Most prop firm traders right now:
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 22,
                    color: COLORS.textMuted,
                    marginBottom: 36,
                }}
            >
                Four different apps, one funded account.
            </div>

            {/* 2x2 grid of "apps" */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                <div style={{ display: "flex", marginBottom: 18 }}>
                    <AppCard
                        title="Calculator"
                        subtitle="Position size"
                        iconBg="#1f2937"
                        iconText="="
                    />
                    <div style={{ display: "flex", width: 18 }} />
                    <AppCard
                        title="Excel"
                        subtitle="Trade journal"
                        iconBg="#15803d"
                        iconText="X"
                    />
                </div>
                <div style={{ display: "flex" }}>
                    <AppCard
                        title="Notes"
                        subtitle="Prop firm rules"
                        iconBg="#a16207"
                        iconText="✎"
                    />
                    <div style={{ display: "flex", width: 18 }} />
                    <AppCard
                        title="Forex Factory"
                        subtitle="Econ calendar"
                        iconBg="#7e22ce"
                        iconText="FF"
                    />
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 26,
                    color: COLORS.textMuted,
                    marginTop: 30,
                    fontStyle: "italic",
                }}
            >
                Each app is fine alone. Together they&rsquo;re a focus killer.
            </div>
            <PageDot current={2} />
        </div>
    ),

    // -------- SLIDE 3 — THE SOLUTION with AI insights phone --------
    (
        <div
            key="slide-3"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bgGradient,
                display: "flex",
                flexDirection: "column",
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={20} />

            <div
                style={{
                    display: "flex",
                    fontSize: 64,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: -2,
                    marginBottom: 12,
                }}
            >
                One app. Everything you need.
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 24,
                    color: COLORS.textMuted,
                    marginBottom: 30,
                }}
            >
                Position math · Journal · Drawdown · Econ · AI
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexGrow: 1,
                    alignItems: "flex-start",
                }}
            >
                <PhoneShell width={420}>
                    <PhoneHeader tab="Dashboard" />
                    <DashboardContent />
                    <PhoneNav active="Home" />
                </PhoneShell>
            </div>

            <PageDot current={3} />
        </div>
    ),

    // -------- SLIDE 4 — AI feature with AI phone --------
    (
        <div
            key="slide-4"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bg,
                display: "flex",
                flexDirection: "column",
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={16} />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: COLORS.accentSoft,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: COLORS.accentBorder,
                    borderRadius: 999,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 18,
                    paddingRight: 18,
                    fontSize: 20,
                    fontWeight: 700,
                    color: COLORS.accent,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    marginBottom: 16,
                    alignSelf: "flex-start",
                }}
            >
                Pro feature
            </div>

            <div
                style={{
                    display: "flex",
                    fontSize: 58,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: -1.5,
                    marginBottom: 24,
                }}
            >
                AI reads your trades back to you.
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexGrow: 1,
                    alignItems: "flex-start",
                }}
            >
                <PhoneShell width={420}>
                    <PhoneHeader tab="AI" />
                    <AIContent />
                    <PhoneNav active="AI" />
                </PhoneShell>
            </div>

            <PageDot current={4} />
        </div>
    ),

    // -------- SLIDE 5 — CTA with dashboard phone --------
    (
        <div
            key="slide-5"
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.bgGradient,
                display: "flex",
                flexDirection: "column",
                paddingTop: FRAME_PADDING,
                paddingBottom: FRAME_PADDING,
                paddingLeft: FRAME_PADDING,
                paddingRight: FRAME_PADDING,
                position: "relative",
                color: COLORS.text,
                fontFamily: "sans-serif",
            }}
        >
            <Wordmark marginBottom={20} />

            <div
                style={{
                    display: "flex",
                    fontSize: 96,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: -3,
                    marginBottom: 16,
                }}
            >
                Try it free.
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 24,
                    color: COLORS.textMuted,
                    marginBottom: 24,
                }}
            >
                Free tier covers most of it. Pro is $19/mo, 7-day trial.
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexGrow: 1,
                    alignItems: "flex-start",
                }}
            >
                <PhoneShell width={380}>
                    <PhoneHeader tab="Dashboard" />
                    <DashboardContent />
                    <PhoneNav active="Home" />
                </PhoneShell>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: COLORS.accent,
                    color: "#03150f",
                    fontSize: 32,
                    fontWeight: 800,
                    paddingTop: 20,
                    paddingBottom: 20,
                    paddingLeft: 30,
                    paddingRight: 30,
                    borderRadius: 16,
                    marginTop: 24,
                    alignSelf: "center",
                }}
            >
                usetradeos.vercel.app
            </div>

            <PageDot current={5} />
        </div>
    ),
];

// ============================================================
// Slide 2 helper — "competing app" card
// ============================================================

function AppCard({
    title,
    subtitle,
    iconBg,
    iconText,
}: {
    title: string;
    subtitle: string;
    iconBg: string;
    iconText: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: COLORS.bgCard,
                borderRadius: 24,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: COLORS.border,
                paddingTop: 36,
                paddingBottom: 36,
                paddingLeft: 30,
                paddingRight: 30,
                flexGrow: 1,
                flexBasis: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 96,
                    height: 96,
                    background: iconBg,
                    color: "#fff",
                    fontSize: 50,
                    fontWeight: 800,
                    borderRadius: 22,
                    marginBottom: 18,
                }}
            >
                {iconText}
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 28,
                    fontWeight: 700,
                    color: COLORS.text,
                    marginBottom: 4,
                }}
            >
                {title}
            </div>
            <div
                style={{
                    display: "flex",
                    fontSize: 18,
                    color: COLORS.textMuted,
                }}
            >
                {subtitle}
            </div>
        </div>
    );
}
