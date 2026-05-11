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

function MockTabBar({ active }: { active: "home" | "calc" | "journal" | "prop" | "econ" }) {
    const tabs: Array<{ id: typeof active; label: string }> = [
        { id: "home", label: "Home" },
        { id: "calc", label: "Calc" },
        { id: "journal", label: "Journal" },
        { id: "prop", label: "Prop" },
        { id: "econ", label: "Econ" },
    ];
    return (
        <div className="absolute bottom-0 inset-x-0 grid grid-cols-5 bg-[var(--color-bg)]/95 border-t border-[var(--color-border-soft)] backdrop-blur">
            {tabs.map((t) => (
                <div
                    key={t.id}
                    className={`text-center py-2.5 text-[10px] font-semibold relative ${
                        t.id === active ? "text-[var(--color-accent)]" : "text-[var(--color-text-subtle)]"
                    }`}
                >
                    {t.id === active && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-[var(--color-accent)] rounded-b-full" />
                    )}
                    {t.label}
                </div>
            ))}
        </div>
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
                                className={`aspect-square rounded text-[7px] flex flex-col items-center justify-between p-0.5 ${
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
                                <span className="text-[8px] text-[var(--color-text-muted)] self-start">{c.day}</span>
                                {c.pnl && (
                                    <span className={`text-[7px] font-bold tabular-nums ${c.kind === "win" ? "text-[var(--color-gain)]" : "text-[var(--color-loss)]"}`}>
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
const CAL_CELLS: Array<{ day?: number; pnl?: string; kind: "win" | "loss" | "neutral" | "today" | "outside" }> = [
    { day: 26, kind: "outside" }, { day: 27, kind: "outside" }, { day: 28, kind: "outside" }, { day: 29, kind: "outside" }, { day: 30, kind: "outside" },
    { day: 1, kind: "neutral" }, { day: 2, kind: "neutral" },
    { day: 3, pnl: "+$240", kind: "win" }, { day: 4, kind: "neutral" }, { day: 5, pnl: "−$80", kind: "loss" }, { day: 6, pnl: "+$540", kind: "win" }, { day: 7, pnl: "+$1.2K", kind: "win" }, { day: 8, kind: "neutral" }, { day: 9, kind: "neutral" },
    { day: 10, pnl: "+$320", kind: "win" }, { day: 11, kind: "today" }, { day: 12, kind: "neutral" }, { day: 13, kind: "neutral" }, { day: 14, kind: "neutral" }, { day: 15, kind: "neutral" }, { day: 16, kind: "neutral" },
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
