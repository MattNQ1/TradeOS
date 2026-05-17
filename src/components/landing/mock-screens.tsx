// Mock app screens for the landing page. Each is a simplified, marketing-friendly
// rendering of an actual TradeOS screen. They use the same theme tokens as the real
// app so they always feel authentic, even at a glance.
//
// These are intentionally static (no state, no fetch) — pure visual.

// ============================================================
// Shared mini-components
// ============================================================

function MockHeader({ title }: { title: string }) {
    return (
        <div className="px-4 pt-9 pb-2 flex items-center justify-between border-b border-[var(--color-border-soft)]">
            <div className="flex items-center gap-1.5">
                <span className="text-[var(--color-accent)] text-base">▲</span>
                <span className="font-bold text-sm">TradeOS</span>
            </div>
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)]">{title}</span>
        </div>
    );
}

type TabId = "home" | "calc" | "journal" | "ai" | "prop" | "econ";

function MockTabBar({ active }: { active: TabId }) {
    const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
        { id: "home",    label: "Home",    icon: <TinyHomeIcon /> },
        { id: "calc",    label: "Calc",    icon: <TinyCalcIcon /> },
        { id: "journal", label: "Journal", icon: <TinyJournalIcon /> },
        { id: "ai",      label: "AI",      icon: <TinyAIIcon /> },
        { id: "prop",    label: "Prop",    icon: <TinyShieldIcon /> },
        { id: "econ",    label: "Econ",    icon: <TinyCalendarIcon /> },
    ];
    return (
        <div className="absolute bottom-0 inset-x-0 grid grid-cols-6 bg-[var(--color-bg)]/95 border-t border-[var(--color-border-soft)] backdrop-blur">
            {tabs.map((t) => (
                <div
                    key={t.id}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 text-[8px] font-semibold relative ${
                        t.id === active ? "text-[var(--color-accent)]" : "text-[var(--color-text-subtle)]"
                    }`}
                >
                    {t.id === active && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-[var(--color-accent)] rounded-b-full" />
                    )}
                    {t.icon}
                    {t.label}
                </div>
            ))}
        </div>
    );
}

// ============================================================
// Tiny tab icons — 12px versions of the real nav icons, optimized
// for the phone-mockup width on the landing page
// ============================================================

const TINY_ICON_PROPS = {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

function TinyHomeIcon() {
    return (
        <svg {...TINY_ICON_PROPS}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function TinyCalcIcon() {
    return (
        <svg {...TINY_ICON_PROPS}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
    );
}

function TinyJournalIcon() {
    return (
        <svg {...TINY_ICON_PROPS}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

function TinyAIIcon() {
    return (
        <svg {...TINY_ICON_PROPS}>
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    );
}

function TinyShieldIcon() {
    return (
        <svg {...TINY_ICON_PROPS}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

function TinyCalendarIcon() {
    return (
        <svg {...TINY_ICON_PROPS}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function MockCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-[var(--color-bg-elev)] border border-[var(--color-border-soft)] rounded-xl p-2.5 ${className}`}>
            {children}
        </div>
    );
}

function MockCardTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
            {children}
        </p>
    );
}

// ============================================================
// 0. AI tab — Pro feature with mock insights output
// ============================================================

export function MockAI() {
    return (
        <>
            <MockHeader title="AI" />
            <div className="px-3 pt-3 pb-16 flex flex-col gap-2 text-[var(--color-text)]">
                <div>
                    <h1 className="text-base font-bold">AI</h1>
                    <p className="text-[9px] text-[var(--color-text-muted)]">
                        Find your patterns. Run the checklist.
                    </p>
                </div>

                {/* AI Insights main card with headline */}
                <MockCard>
                    <div className="flex items-start justify-between mb-1.5">
                        <div>
                            <MockCardTitle>AI insights</MockCardTitle>
                            <p className="text-[8px] text-[var(--color-text-subtle)] -mt-1">
                                Last analyzed today · 84 trades
                            </p>
                        </div>
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--color-accent)] text-white whitespace-nowrap">
                            Re-analyze
                        </span>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-600/15 via-emerald-700/5 to-transparent border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] rounded p-2">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1">
                            Headline
                        </p>
                        <p className="text-[10px] font-medium leading-snug">
                            Crushing MES longs on Tuesdays. NQ shorts bleeding $1,200/wk.
                        </p>
                    </div>
                </MockCard>

                {/* Patterns block */}
                <MockCard>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1">
                        Patterns
                    </p>
                    <ul className="flex flex-col gap-1 text-[10px] leading-snug">
                        <li className="flex items-start gap-1.5">
                            <span className="text-[var(--color-accent)] font-bold leading-none pt-0.5">•</span>
                            <span>78% win rate on MES longs, 41% on NQ shorts.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                            <span className="text-[var(--color-accent)] font-bold leading-none pt-0.5">•</span>
                            <span>8 of last 10 winners came Tue/Wed.</span>
                        </li>
                    </ul>
                </MockCard>

                {/* Watch-for block */}
                <MockCard>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-warn)] mb-1">
                        Watch for
                    </p>
                    <ul className="flex flex-col gap-1 text-[10px] leading-snug">
                        <li className="flex items-start gap-1.5">
                            <span className="text-[var(--color-warn)] font-bold leading-none pt-0.5">•</span>
                            <span>Sized up 3× after −$340 loss. Classic revenge.</span>
                        </li>
                    </ul>
                </MockCard>
            </div>
            <MockTabBar active="ai" />
        </>
    );
}

// ============================================================
// 1. Dashboard — analytics with equity curve
// ============================================================

export function MockDashboard() {
    return (
        <>
            <MockHeader title="Dashboard" />
            <div className="px-3 pt-3 pb-16 flex flex-col gap-2 text-[var(--color-text)]">
                <h1 className="text-base font-bold">Dashboard</h1>

                {/* Hero P&L */}
                <MockCard>
                    <MockCardTitle>Total P&amp;L</MockCardTitle>
                    <p className="text-2xl font-bold text-[var(--color-gain)] tabular-nums leading-none">+$2,840</p>
                    <p className="text-[9px] text-[var(--color-text-muted)] mt-1">42 trades · 28 wins · 14 losses</p>
                </MockCard>

                {/* 2x2 metrics */}
                <div className="grid grid-cols-2 gap-1.5">
                    <MockCard>
                        <MockCardTitle>Win rate</MockCardTitle>
                        <p className="text-sm font-bold tabular-nums leading-none">67%</p>
                    </MockCard>
                    <MockCard>
                        <MockCardTitle>Profit factor</MockCardTitle>
                        <p className="text-sm font-bold tabular-nums leading-none">2.34</p>
                    </MockCard>
                    <MockCard>
                        <MockCardTitle>Avg win</MockCardTitle>
                        <p className="text-sm font-bold text-[var(--color-gain)] tabular-nums leading-none">$152</p>
                    </MockCard>
                    <MockCard>
                        <MockCardTitle>Avg loss</MockCardTitle>
                        <p className="text-sm font-bold text-[var(--color-loss)] tabular-nums leading-none">−$65</p>
                    </MockCard>
                </div>

                {/* Equity curve */}
                <MockCard>
                    <div className="flex items-baseline justify-between">
                        <MockCardTitle>Equity curve</MockCardTitle>
                        <span className="text-[10px] font-bold text-[var(--color-gain)] tabular-nums">+$2,840</span>
                    </div>
                    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-14">
                        <defs>
                            <linearGradient id="mockEquityFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-gain)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="var(--color-gain)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 0 50 L 18 46 L 32 48 L 48 42 L 62 38 L 78 34 L 92 32 L 108 22 L 122 24 L 138 18 L 154 14 L 172 10 L 200 6"
                            fill="none"
                            stroke="var(--color-gain)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M 0 50 L 18 46 L 32 48 L 48 42 L 62 38 L 78 34 L 92 32 L 108 22 L 122 24 L 138 18 L 154 14 L 172 10 L 200 6 L 200 60 L 0 60 Z"
                            fill="url(#mockEquityFill)"
                        />
                    </svg>
                </MockCard>
            </div>
            <MockTabBar active="home" />
        </>
    );
}

// ============================================================
// 2. Calculator — inputs + result
// ============================================================

export function MockCalculator() {
    return (
        <>
            <MockHeader title="Calculator" />
            <div className="px-3 pt-3 pb-16 flex flex-col gap-2 text-[var(--color-text)]">
                <h1 className="text-base font-bold">Calculator</h1>

                <MockCard>
                    <MockCardTitle>Trade setup</MockCardTitle>
                    <p className="text-xs font-medium">Contract</p>
                    <div className="mt-1 bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-md px-2 py-1.5 text-xs">
                        MES — Micro E-mini S&amp;P 500
                    </div>
                    <p className="text-[9px] text-[var(--color-text-muted)] mt-1">$5/pt · $1.25/tick</p>

                    <p className="text-xs font-medium mt-2">Direction</p>
                    <div className="mt-1 grid grid-cols-2 gap-1 bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-md p-0.5">
                        <div className="text-center py-1 rounded text-[10px] font-bold bg-[var(--color-gain)] text-white">Long</div>
                        <div className="text-center py-1 text-[10px] font-bold text-[var(--color-text-muted)]">Short</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                            <p className="text-[10px] font-semibold text-[var(--color-loss)]">Stop loss</p>
                            <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded px-2 py-1 text-xs">8</div>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-[var(--color-gain)]">Take profit</p>
                            <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded px-2 py-1 text-xs">16</div>
                        </div>
                    </div>
                </MockCard>

                <MockCard>
                    <MockCardTitle>Result</MockCardTitle>
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="rounded-md p-2 bg-[color-mix(in_oklab,var(--color-loss)_12%,transparent)] border border-[color-mix(in_oklab,var(--color-loss)_25%,transparent)]">
                            <p className="text-[9px] font-bold uppercase text-[var(--color-text-muted)]">Risk</p>
                            <p className="text-base font-bold text-[var(--color-loss)] tabular-nums leading-none mt-0.5">$20.00</p>
                        </div>
                        <div className="rounded-md p-2 bg-[color-mix(in_oklab,var(--color-gain)_12%,transparent)] border border-[color-mix(in_oklab,var(--color-gain)_25%,transparent)]">
                            <p className="text-[9px] font-bold uppercase text-[var(--color-text-muted)]">Reward</p>
                            <p className="text-base font-bold text-[var(--color-gain)] tabular-nums leading-none mt-0.5">$40.00</p>
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-md p-2 mt-1.5">
                        <p className="text-[9px] font-bold uppercase text-[var(--color-text-muted)]">Risk / Reward</p>
                        <p className="text-base font-bold tabular-nums leading-none mt-0.5">1 : 2.00</p>
                    </div>
                </MockCard>
            </div>
            <MockTabBar active="calc" />
        </>
    );
}

// ============================================================
// 3. Journal — P&L calendar
// ============================================================

export function MockJournal() {
    return (
        <>
            <MockHeader title="Journal" />
            <div className="px-3 pt-3 pb-16 flex flex-col gap-2 text-[var(--color-text)]">
                <h1 className="text-base font-bold">Journal</h1>

                <MockCard>
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-bold">May 2026</p>
                        <span className="text-[10px] font-bold text-[var(--color-gain)] tabular-nums">+$2,840</span>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 text-center text-[8px] text-[var(--color-text-subtle)] mb-1">
                        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                        {CAL_CELLS.map((c, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded flex flex-col items-stretch justify-between px-0.5 py-0.5 overflow-hidden ${
                                    c.kind === "win"
                                        ? "bg-[color-mix(in_oklab,var(--color-gain)_15%,transparent)] border border-[color-mix(in_oklab,var(--color-gain)_30%,transparent)]"
                                        : c.kind === "loss"
                                            ? "bg-[color-mix(in_oklab,var(--color-loss)_15%,transparent)] border border-[color-mix(in_oklab,var(--color-loss)_30%,transparent)]"
                                            : c.kind === "today"
                                                ? "bg-[var(--color-bg-elev-2)] border-2 border-[var(--color-accent)]"
                                                : c.kind === "outside"
                                                    ? ""
                                                    : "bg-[var(--color-bg-elev-2)]"
                                }`}
                            >
                                <span className="text-[7px] leading-none text-[var(--color-text-muted)]">{c.day}</span>
                                {c.pnl && (
                                    <span className={`text-[7px] font-bold tabular-nums whitespace-nowrap leading-none text-right ${c.kind === "win" ? "text-[var(--color-gain)]" : "text-[var(--color-loss)]"}`}>
                                        {c.pnl}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </MockCard>

                <MockCard>
                    <MockCardTitle>Recent trades</MockCardTitle>
                    {[
                        { sym: "MES", dir: "long", pnl: "+$240", win: true },
                        { sym: "NQ", dir: "short", pnl: "−$80", win: false },
                        { sym: "ES", dir: "long", pnl: "+$1,250", win: true },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-[var(--color-border-soft)] last:border-b-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold">{t.sym}</span>
                                <span className={`text-[8px] font-bold uppercase px-1 rounded ${t.dir === "long" ? "bg-[color-mix(in_oklab,var(--color-gain)_15%,transparent)] text-[var(--color-gain)]" : "bg-[color-mix(in_oklab,var(--color-loss)_15%,transparent)] text-[var(--color-loss)]"}`}>
                                    {t.dir}
                                </span>
                            </div>
                            <span className={`text-xs font-bold tabular-nums ${t.win ? "text-[var(--color-gain)]" : "text-[var(--color-loss)]"}`}>
                                {t.pnl}
                            </span>
                        </div>
                    ))}
                </MockCard>
            </div>
            <MockTabBar active="journal" />
        </>
    );
}

// Calendar cell layout: 35 cells, varied pattern.
// P&L strings are intentionally compact ("+240" / "-80" / "+1.2K") because the
// 7-col mini-calendar gives each cell only ~26px — anything longer wraps and
// looks broken. Color tints + the +/- prefix carry the meaning.
const CAL_CELLS: Array<{ day?: number; pnl?: string; kind: "win" | "loss" | "neutral" | "today" | "outside" }> = [
    { day: 26, kind: "outside" }, { day: 27, kind: "outside" }, { day: 28, kind: "outside" }, { day: 29, kind: "outside" }, { day: 30, kind: "outside" },
    { day: 1, kind: "neutral" }, { day: 2, kind: "neutral" },
    { day: 3, pnl: "+240", kind: "win" }, { day: 4, kind: "neutral" }, { day: 5, pnl: "-80", kind: "loss" }, { day: 6, pnl: "+540", kind: "win" }, { day: 7, pnl: "+1.2K", kind: "win" }, { day: 8, kind: "neutral" }, { day: 9, kind: "neutral" },
    { day: 10, pnl: "+320", kind: "win" }, { day: 11, kind: "today" }, { day: 12, kind: "neutral" }, { day: 13, kind: "neutral" }, { day: 14, kind: "neutral" }, { day: 15, kind: "neutral" }, { day: 16, kind: "neutral" },
    { day: 17, kind: "neutral" }, { day: 18, kind: "neutral" }, { day: 19, kind: "neutral" }, { day: 20, kind: "neutral" }, { day: 21, kind: "neutral" }, { day: 22, kind: "neutral" }, { day: 23, kind: "neutral" },
    { day: 24, kind: "neutral" }, { day: 25, kind: "neutral" }, { day: 26, kind: "neutral" }, { day: 27, kind: "neutral" }, { day: 28, kind: "neutral" }, { day: 29, kind: "neutral" }, { day: 30, kind: "neutral" },
];

// ============================================================
// 4. Prop firm — rules + progress bars
// ============================================================

export function MockPropFirm() {
    return (
        <>
            <MockHeader title="Prop firm" />
            <div className="px-3 pt-3 pb-16 flex flex-col gap-2 text-[var(--color-text)]">
                <h1 className="text-base font-bold">Prop firm</h1>

                <MockCard>
                    <MockCardTitle>Active preset</MockCardTitle>
                    <p className="text-xs font-bold mt-0.5">Topstep · $50K Combine</p>
                    <div className="mt-1.5 space-y-1 text-[10px]">
                        <Row label="Account size" value="$50,000" />
                        <Row label="Profit target" value="$3,000" />
                        <Row label="Max loss / trailing" value="$2,000 (trailing)" />
                        <Row label="Daily loss limit" value="$1,000" />
                    </div>
                </MockCard>

                <MockCard>
                    <div className="flex items-center justify-between mb-1.5">
                        <MockCardTitle>Daily loss limit</MockCardTitle>
                        <span className="text-[9px] font-semibold text-[var(--color-text-muted)] tabular-nums">−$180 / −$1,000</span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-bg-elev-2)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-loss)] rounded-full" style={{ width: "18%" }} />
                    </div>
                    <p className="text-[9px] text-[var(--color-text-muted)] mt-1">$820 of daily buffer remaining.</p>
                </MockCard>

                <MockCard>
                    <div className="flex items-center justify-between mb-1.5">
                        <MockCardTitle>Profit target</MockCardTitle>
                        <span className="text-[9px] font-semibold text-[var(--color-gain)] tabular-nums">$2,840 / $3,000</span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-bg-elev-2)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-gain)] rounded-full" style={{ width: "94%" }} />
                    </div>
                    <p className="text-[9px] text-[var(--color-gain)] font-semibold mt-1">$160 to go.</p>
                </MockCard>
            </div>
            <MockTabBar active="prop" />
        </>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-[var(--color-border-soft)] pb-0.5 last:border-b-0">
            <span className="text-[var(--color-text-muted)]">{label}</span>
            <span className="font-semibold tabular-nums">{value}</span>
        </div>
    );
}

// ============================================================
// 5. Economic calendar
// ============================================================

export function MockEconomicCalendar() {
    return (
        <>
            <MockHeader title="Economic" />
            <div className="px-3 pt-3 pb-16 flex flex-col gap-2 text-[var(--color-text)]">
                <div className="flex items-start justify-between">
                    <h1 className="text-base font-bold">Economic Calendar</h1>
                    <span className="text-[8px] font-bold uppercase text-white px-1.5 py-0.5 rounded bg-[var(--color-accent)]">Pro</span>
                </div>

                <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-0.5 mb-1">
                        Today · Mon May 11
                    </p>
                    <div className="flex flex-col gap-1">
                        <EventRow time="8:30" code="USD" title="Non-Farm Employment Change" impact="High" />
                        <EventRow time="10:00" code="USD" title="ISM Manufacturing PMI" impact="High" />
                    </div>
                </div>

                <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-0.5 mb-1">
                        Tomorrow · Tue May 12
                    </p>
                    <div className="flex flex-col gap-1">
                        <EventRow time="8:30" code="USD" title="CPI m/m" impact="High" />
                        <EventRow time="14:00" code="USD" title="FOMC Statement" impact="High" />
                        <EventRow time="10:00" code="EUR" title="ECB Press Conf" impact="Med" />
                    </div>
                </div>
            </div>
            <MockTabBar active="econ" />
        </>
    );
}

function EventRow({ time, code, title, impact }: { time: string; code: string; title: string; impact: "High" | "Med" | "Low" }) {
    const impactClass =
        impact === "High"
            ? "bg-[color-mix(in_oklab,var(--color-loss)_15%,transparent)] text-[var(--color-loss)]"
            : impact === "Med"
                ? "bg-[color-mix(in_oklab,var(--color-warn)_15%,transparent)] text-[var(--color-warn)]"
                : "bg-[color-mix(in_oklab,var(--color-text-muted)_15%,transparent)] text-[var(--color-text-muted)]";
    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded px-1.5 py-1 grid grid-cols-[auto_auto_1fr_auto] gap-x-1.5 items-center">
            <span className="text-[8px] font-semibold tabular-nums text-[var(--color-text-muted)]">{time}</span>
            <span className="text-[7px] font-bold uppercase bg-[var(--color-bg-elev)] border border-[var(--color-border)] rounded px-1 py-0.5">
                {code}
            </span>
            <span className="text-[9px] font-medium truncate">{title}</span>
            <span className={`text-[7px] font-bold uppercase px-1 py-0.5 rounded ${impactClass}`}>{impact}</span>
        </div>
    );
}

// ============================================================
// Desktop dashboard mock — exactly what /dashboard looks like in
// a desktop browser. Same mobile-width content centered in the
// viewport, with full-width header + nav bar.
// ============================================================

export function MockDesktopDashboard() {
    return (
        <div className="relative w-full rounded-xl overflow-hidden bg-neutral-900 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.7),0_0_50px_-10px_rgba(16,185,129,0.18),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-white/5 bg-neutral-950">
                <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 max-w-md mx-auto">
                    <div className="bg-neutral-800 rounded-md px-3 py-1 text-[11px] text-neutral-400 font-mono text-center truncate">
                        usetradeos.vercel.app/dashboard
                    </div>
                </div>
                <div className="w-12 hidden sm:block" />
            </div>

            {/* App viewport */}
            <div className="bg-[var(--color-bg)] h-[420px] md:h-[480px] flex flex-col text-[var(--color-text)]">
                {/* TradeOS top bar — full width, like the real (app) layout */}
                <div className="flex-shrink-0 border-b border-[var(--color-border-soft)]">
                    <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--color-accent)] text-lg">▲</span>
                            <span className="font-bold text-sm">TradeOS</span>
                        </div>
                        <div className="w-7 h-7 rounded-md bg-[var(--color-bg-elev-2)] border border-[var(--color-border-soft)] flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-muted)]">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Dashboard content — same mobile-width column as the real app */}
                <div className="flex-1 overflow-hidden">
                    <div className="max-w-md mx-auto px-4 py-3 flex flex-col gap-2">
                        <h1 className="text-base font-bold">Dashboard</h1>

                        {/* Hero P&L */}
                        <MockCard>
                            <MockCardTitle>Total P&amp;L</MockCardTitle>
                            <p className="text-2xl font-bold text-[var(--color-gain)] tabular-nums leading-none">+$2,840</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">42 trades · 28 wins · 14 losses</p>
                        </MockCard>

                        {/* 2x2 metrics */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <MockCard>
                                <MockCardTitle>Win rate</MockCardTitle>
                                <p className="text-sm font-bold tabular-nums leading-none">67%</p>
                            </MockCard>
                            <MockCard>
                                <MockCardTitle>Profit factor</MockCardTitle>
                                <p className="text-sm font-bold tabular-nums leading-none">2.34</p>
                            </MockCard>
                            <MockCard>
                                <MockCardTitle>Avg win</MockCardTitle>
                                <p className="text-sm font-bold text-[var(--color-gain)] tabular-nums leading-none">$152</p>
                            </MockCard>
                            <MockCard>
                                <MockCardTitle>Avg loss</MockCardTitle>
                                <p className="text-sm font-bold text-[var(--color-loss)] tabular-nums leading-none">−$65</p>
                            </MockCard>
                        </div>

                        {/* Equity curve */}
                        <MockCard>
                            <div className="flex items-baseline justify-between">
                                <MockCardTitle>Equity curve</MockCardTitle>
                                <span className="text-[10px] font-bold text-[var(--color-gain)] tabular-nums">+$2,840</span>
                            </div>
                            <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-14">
                                <defs>
                                    <linearGradient id="mockDesktopEquityFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-gain)" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="var(--color-gain)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 0 50 L 18 46 L 32 48 L 48 42 L 62 38 L 78 34 L 92 32 L 108 22 L 122 24 L 138 18 L 154 14 L 172 10 L 200 6"
                                    fill="none"
                                    stroke="var(--color-gain)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M 0 50 L 18 46 L 32 48 L 48 42 L 62 38 L 78 34 L 92 32 L 108 22 L 122 24 L 138 18 L 154 14 L 172 10 L 200 6 L 200 60 L 0 60 Z"
                                    fill="url(#mockDesktopEquityFill)"
                                />
                            </svg>
                        </MockCard>
                    </div>
                </div>

                {/* Bottom nav — full width, 6 tabs centered in max-w-md grid */}
                <div className="flex-shrink-0 border-t border-[var(--color-border-soft)] bg-[var(--color-bg)]">
                    <div className="max-w-md mx-auto">
                        <MockTabBarInline active="home" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline variant of the tab bar — not absolutely positioned, since the
// desktop frame uses flexbox to push the nav to the bottom.
function MockTabBarInline({ active }: { active: TabId }) {
    const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
        { id: "home",    label: "Home",    icon: <TinyHomeIcon /> },
        { id: "calc",    label: "Calc",    icon: <TinyCalcIcon /> },
        { id: "journal", label: "Journal", icon: <TinyJournalIcon /> },
        { id: "ai",      label: "AI",      icon: <TinyAIIcon /> },
        { id: "prop",    label: "Prop",    icon: <TinyShieldIcon /> },
        { id: "econ",    label: "Econ",    icon: <TinyCalendarIcon /> },
    ];
    return (
        <div className="grid grid-cols-6">
            {tabs.map((t) => (
                <div
                    key={t.id}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 text-[8px] font-semibold relative ${
                        t.id === active ? "text-[var(--color-accent)]" : "text-[var(--color-text-subtle)]"
                    }`}
                >
                    {t.id === active && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-[var(--color-accent)] rounded-b-full" />
                    )}
                    {t.icon}
                    {t.label}
                </div>
            ))}
        </div>
    );
}
