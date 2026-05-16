// Public landing page (/). Marketing site for non-authenticated visitors.
// Authenticated users are bounced to /dashboard so they don't re-encounter the pitch.
//
// Design references: Linear, Vercel, Hyperliquid. Premium dark fintech aesthetic.
// Visual depth = layered radial gradients + dot grid + emerald glow on phones.
// Motion = fade-in-up on hero load + slow float on phones + smooth hover transitions.
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PhoneFrame } from "@/components/landing/phone-frame";
import {
    MockDashboard,
    MockCalculator,
    MockJournal,
    MockPropFirm,
    MockEconomicCalendar,
} from "@/components/landing/mock-screens";

// Metadata for / is inherited from the root layout (so it doesn't get
// the "%s · TradeOS" template suffix and stays clean for the homepage).

export default async function Home() {
    // Bounce signed-in users straight to their dashboard.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");

    return (
        <div className="bg-[var(--color-bg)]">
            <Header />
            <Hero />
            <WhyWeBuiltThis />
            <BuiltForTraders />
            <ScreenshotGallery />
            <Pricing />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}

// ============================================================
// Header — taller, smoother hovers, cleaner spacing
// ============================================================

function Header() {
    return (
        <header className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border-soft)]">
            <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg flex items-center gap-2 group">
                    <span className="text-[var(--color-accent)] transition-transform group-hover:scale-110">▲</span>
                    <span className="tracking-tight">TradeOS</span>
                </Link>
                <nav className="flex items-center gap-1 sm:gap-2">
                    <Link
                        href="#pricing"
                        className="hidden sm:inline-flex px-3.5 py-2 rounded-md text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elev-2)] transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#faq"
                        className="hidden md:inline-flex px-3.5 py-2 rounded-md text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elev-2)] transition-colors"
                    >
                        FAQ
                    </Link>
                    <Link
                        href="/login"
                        className="px-3.5 py-2 rounded-md text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elev-2)] transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="btn-cta-primary inline-flex px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        Start free trial
                    </Link>
                </nav>
            </div>
        </header>
    );
}

// ============================================================
// Hero — layered gradients, dot grid, fade-in-up, floating phones
// ============================================================

function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Layered backdrop for depth */}
            <div className="absolute inset-0 bg-grid-dots opacity-50 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/0 via-[var(--color-bg)]/40 to-[var(--color-bg)] pointer-events-none" />

            {/* Emerald aura behind the phones, static */}
            <div
                aria-hidden
                className="absolute -right-[15%] top-[10%] w-[700px] h-[700px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(16,185,129,0.18), transparent 60%)",
                }}
            />

            <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
                {/* Left: copy + CTAs */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] px-2.5 py-1 rounded-full">
                        Built by traders, for traders
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                        The trading toolkit prop firms hope you don&rsquo;t have.
                    </h1>

                    <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
                        Position math that&rsquo;s impossible to skip. A journal that catches the patterns you keep missing. Trailing drawdown to the dollar. Built for Topstep, Apex, MFF, and FTMO accounts.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-1 w-full sm:w-auto">
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="btn-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg text-base font-semibold">
                                Try it free for 7 days
                                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        </Link>
                        <Link href="#pricing" className="w-full sm:w-auto">
                            <button className="btn-cta-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-base font-semibold">
                                See what it costs
                            </button>
                        </Link>
                    </div>

                    <p className="text-xs text-[var(--color-text-subtle)]">
                        $0 today. $19/mo after. Cancel before day 8 if you hate it.
                    </p>
                </div>

                {/* Right: hero phone pair */}
                <div className="relative flex justify-center lg:justify-end items-center min-h-[520px] lg:min-h-[640px]">
                    {/* Back phone — calculator, peeking behind */}
                    <div className="absolute right-1/2 lg:right-auto lg:-left-12 translate-x-[80px] lg:translate-x-0 top-8 lg:top-12 hidden sm:block animate-float-slow-reverse">
                        <PhoneFrame size="sm" tilt={-8} glow={false}>
                            <MockCalculator />
                        </PhoneFrame>
                    </div>

                    {/* Front phone — dashboard, gently floats */}
                    <div className="relative z-10 animate-float-slow">
                        <PhoneFrame size="md" tilt={4}>
                            <MockDashboard />
                        </PhoneFrame>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Why we built this — founder-voice note, kept short
// ============================================================

function WhyWeBuiltThis() {
    return (
        <section className="relative border-t border-[var(--color-border-soft)] py-20 md:py-24">
            <div className="max-w-2xl mx-auto px-5">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                    Why we built this
                </h2>
                <div className="space-y-4 text-[15px] md:text-base text-[var(--color-text-muted)] leading-relaxed">
                    <p>We&rsquo;re prop firm traders.</p>
                    <p>
                        We&rsquo;ve passed accounts. We&rsquo;ve blown up accounts. We&rsquo;ve passed
                        them again.
                    </p>
                    <p>
                        Every trading tool out there is built for stock traders, built for
                        institutions, or built by people who&rsquo;ve never had a Topstep eval
                        auto-fail because the trailing drawdown ratcheted up after taking 2R
                        off a winner.
                    </p>
                    <p>
                        So we built one for ourselves. Spreadsheets, three different apps, a
                        notes file full of prop firm rules &mdash; all replaced with one
                        toolkit, on the phone, ready before the next trade.
                    </p>
                    <p className="text-[var(--color-text)]">
                        We figured you might want it too.
                    </p>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Built for futures traders — 6 feature cards
// ============================================================

const TRADER_FEATURES = [
    {
        icon: PositionIcon,
        title: "Position sizing",
        body: "Tell it your account, your stop, your risk %. It tells you the exact number of contracts. No menu-diving, no spreadsheet.",
    },
    {
        icon: ShieldIcon,
        title: "Drawdown tracking",
        body: "Trailing drawdown to the dollar. Warns you before you violate. Not after, when it's too late to unwind.",
    },
    {
        icon: JournalIcon,
        title: "Trade journal",
        body: "Two taps to log a fill. Equity curve, P&L calendar, and the stats that actually matter, all auto-built behind it.",
    },
    {
        icon: CalendarIcon,
        title: "Economic calendar",
        body: "NFP, CPI, FOMC, GDP. What they are, when they hit, why you should care. Or stay flat through them, your call.",
    },
    {
        icon: ChartIcon,
        title: "Performance analytics",
        body: "Profit factor, expectancy, win rate by day, P&L by contract. The stats your edge actually shows up in. Or doesn't.",
    },
    {
        icon: BuildingIcon,
        title: "Prop firm rules",
        body: "Topstep, Apex, MFF, FTMO presets baked in. Track daily limits and profit targets per account, zero manual setup.",
    },
];

function BuiltForTraders() {
    return (
        <section className="relative py-20 md:py-28 border-t border-[var(--color-border-soft)]">
            <div className="max-w-6xl mx-auto px-5">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        What&rsquo;s actually in it
                    </h2>
                    <p className="text-[var(--color-text-muted)] mt-4">
                        Six tools, one tab. Replaces the calculator app, the Excel journal, the notes file full of prop firm rules, and the econ calendar you forgot to check.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TRADER_FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="group relative bg-[var(--color-bg-elev)] border border-[var(--color-border-soft)] rounded-2xl p-6 flex flex-col gap-3 transition-all hover:border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] hover:-translate-y-1 hover:shadow-[0_10px_40px_-12px_rgba(16,185,129,0.3)]"
                                style={{ transitionDuration: "240ms" }}
                            >
                                {/* Hover glow */}
                                <div
                                    aria-hidden
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    style={{
                                        background:
                                            "radial-gradient(circle at top, rgba(16,185,129,0.06), transparent 60%)",
                                    }}
                                />
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-xl bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] flex items-center justify-center text-[var(--color-accent)] mb-3">
                                        <Icon />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1.5">{f.title}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{f.body}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Screenshot gallery — 3 phones at angles
// ============================================================

function ScreenshotGallery() {
    return (
        <section className="relative overflow-hidden py-20 md:py-28 border-t border-[var(--color-border-soft)]">
            {/* Subtle backdrop */}
            <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Made for the device you actually trade from
                </h2>
                <p className="text-[var(--color-text-muted)] mt-4 max-w-xl mx-auto">
                    Three taps to plan a trade. One to log it. The drawdown math runs itself in the background, every time.
                </p>
            </div>

            {/* Phone row — desktop */}
            <div className="relative max-w-5xl mx-auto mt-12 md:mt-16 px-4 hidden md:flex items-end justify-center gap-2">
                <div>
                    <PhoneFrame size="sm" tilt={-6} glow={false}>
                        <MockJournal />
                    </PhoneFrame>
                </div>
                <div className="-mb-6 z-10">
                    <PhoneFrame size="md" tilt={0}>
                        <MockPropFirm />
                    </PhoneFrame>
                </div>
                <div>
                    <PhoneFrame size="sm" tilt={6} glow={false}>
                        <MockEconomicCalendar />
                    </PhoneFrame>
                </div>
            </div>

            {/* Mobile fallback */}
            <div className="md:hidden mt-10 flex justify-center">
                <PhoneFrame size="md">
                    <MockPropFirm />
                </PhoneFrame>
            </div>

            <div className="hidden md:flex max-w-5xl mx-auto mt-10 px-4 justify-around text-center text-xs text-[var(--color-text-muted)]">
                <span>P&amp;L Journal &amp; Calendar</span>
                <span className="font-semibold text-[var(--color-text)]">Prop Firm Guardrails</span>
                <span>Economic Calendar</span>
            </div>
        </section>
    );
}

// ============================================================
// Pricing
// ============================================================

function Pricing() {
    return (
        <section id="pricing" className="relative py-20 md:py-28 border-t border-[var(--color-border-soft)]">
            <div className="max-w-5xl mx-auto px-5">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Cheaper than one bad trade
                    </h2>
                    <p className="text-[var(--color-text-muted)] mt-4">
                        One drawdown violation you didn&rsquo;t take pays for a year of Pro. Three pays for Lifetime. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    <PricingCard
                        name="Free"
                        price="$0"
                        priceSuffix="forever"
                        description="The calculator and a starter journal. Good for someone testing the waters."
                        features={[
                            "Position calculator, all 8 contracts",
                            "Up to 25 logged trades",
                            "Basic stats + P&L calendar",
                            "15 prop firm presets",
                            "Today's economic events",
                        ]}
                        ctaHref="/signup"
                        ctaText="Start free"
                        highlighted={false}
                    />

                    <PricingCard
                        name="Pro"
                        badge="Most popular"
                        price="$19"
                        priceSuffix="/mo"
                        description="The full toolkit. Free for 7 days, $19/mo after. Cancel any time, no questions."
                        features={[
                            "7-day free trial",
                            "Unlimited trades + history",
                            "Full economic calendar with explainers",
                            "Custom prop firm rules",
                            "CSV bulk import + export",
                            "Priority support from real humans",
                        ]}
                        ctaHref="/signup"
                        ctaText="Try Pro free"
                        highlighted
                    />

                    <PricingCard
                        name="Lifetime"
                        badge="Best value"
                        price="$199"
                        priceSuffix="once"
                        description="Pay once. Every Pro feature, forever. Founders pricing, only until public launch."
                        features={[
                            "Everything in Pro",
                            "Pay once, never again",
                            "All future features included",
                            "Lifetime updates",
                            "Founders pricing — going up at launch",
                        ]}
                        ctaHref="/signup"
                        ctaText="Buy once, done"
                        highlighted={false}
                        accent="warn"
                    />
                </div>

                <p className="text-center text-xs text-[var(--color-text-subtle)] mt-8">
                    Every plan includes one-click account deletion and full data export. We don&rsquo;t sell your trades to anyone.
                </p>
            </div>
        </section>
    );
}

interface PricingCardProps {
    name: string;
    badge?: string;
    price: string;
    priceSuffix: string;
    description: string;
    features: string[];
    ctaHref: string;
    ctaText: string;
    highlighted: boolean;
    accent?: "accent" | "warn";
}

function PricingCard({
    name, badge, price, priceSuffix, description, features, ctaHref, ctaText, highlighted, accent = "accent",
}: PricingCardProps) {
    const accentColor = accent === "warn" ? "var(--color-warn)" : "var(--color-accent)";
    const borderClass = highlighted
        ? "border-[color-mix(in_oklab,var(--color-accent)_50%,transparent)] shadow-[0_0_60px_rgba(16,185,129,0.18)]"
        : "border-[var(--color-border-soft)]";
    const gradientClass = highlighted
        ? "bg-gradient-to-br from-emerald-600/10 via-violet-700/5 to-transparent"
        : accent === "warn"
            ? "bg-gradient-to-br from-amber-600/8 via-orange-700/4 to-transparent"
            : "";

    return (
        <div className={`relative rounded-2xl border ${borderClass} ${gradientClass} bg-[var(--color-bg-elev)] flex flex-col`}>
            {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                        className="text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ background: accentColor }}
                    >
                        {badge}
                    </span>
                </div>
            )}

            <div className="p-6 flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-[var(--color-text-muted)]">{name}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight tabular-nums">{price}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{priceSuffix}</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">{description}</p>
            </div>

            <div className="px-6 pb-2 flex-1">
                <ul className="space-y-2">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <span style={{ color: accentColor }} className="font-bold leading-tight pt-0.5">✓</span>
                            <span className="text-[var(--color-text)]">{f}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-6">
                <Link href={ctaHref}>
                    {highlighted ? (
                        <button className="btn-cta-primary w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold">
                            {ctaText}
                        </button>
                    ) : (
                        <button
                            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold bg-[var(--color-bg-elev-2)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors"
                            style={accent === "warn" ? { borderColor: `color-mix(in oklab, ${accentColor} 40%, transparent)`, color: accentColor } : undefined}
                        >
                            {ctaText}
                        </button>
                    )}
                </Link>
            </div>
        </div>
    );
}

// ============================================================
// FAQ
// ============================================================

const FAQS = [
    {
        q: "How does the free trial work?",
        a: "You enter a card up-front but $0 is charged for the first 7 days. On day 8 we auto-bill $19/mo, unless you cancel first. Cancellation is one click in Settings — no email back-and-forth, no retention guilt trip.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel in Settings → Manage subscription. If you cancel during the trial, you're never charged. If you cancel after, you keep Pro until the end of the period you already paid for, then drop to Free.",
    },
    {
        q: "What brokers do you sync with?",
        a: "Auto-sync from brokers and prop firms (Topstep, Apex, MFF, NinjaTrader, Tradovate, Rithmic) is in the works for Pro and Lifetime users. Until then, log trades by tapping once or bulk-import via CSV.",
    },
    {
        q: "Is my data private?",
        a: "Yes. Your trades are stored in your own row in our database with strict access rules — only your account can read them. We don't sell, share, or train models on your data. Ever.",
    },
    {
        q: "What's the refund policy?",
        a: "Email us within 14 days of any Pro charge or Lifetime purchase and we refund, no questions asked. Use the free trial first if you're unsure — that's literally what it's for.",
    },
    {
        q: "Is there a mobile app?",
        a: "TradeOS installs to your iPhone or Android home screen as a Progressive Web App. It behaves like a native app (offline support, no browser chrome) without the app store delay. Native apps are on the roadmap.",
    },
] as const;

function FAQ() {
    return (
        <section id="faq" className="py-20 md:py-28 border-t border-[var(--color-border-soft)]">
            <div className="max-w-2xl mx-auto px-5">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Questions before you commit
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    {FAQS.map((f, i) => (
                        <details
                            key={i}
                            className="group bg-[var(--color-bg-elev)] border border-[var(--color-border-soft)] rounded-xl hover:border-[color-mix(in_oklab,var(--color-accent)_25%,transparent)] transition-colors"
                        >
                            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
                                <span className="text-[15px] font-semibold">{f.q}</span>
                                <span className="text-[var(--color-text-muted)] group-open:rotate-180 transition-transform">
                                    ▾
                                </span>
                            </summary>
                            <div className="px-5 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                                {f.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Final CTA
// ============================================================

function FinalCTA() {
    return (
        <section className="relative py-20 md:py-28 border-t border-[var(--color-border-soft)] overflow-hidden">
            {/* Backdrop glow */}
            <div
                aria-hidden
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[800px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(closest-side, rgba(16,185,129,0.15), transparent 70%)",
                }}
            />
            <div className="relative max-w-3xl mx-auto px-5">
                <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] bg-gradient-to-br from-emerald-600/10 via-emerald-700/5 to-transparent p-10 md:p-14 text-center">
                    <div className="absolute -right-8 -top-8 text-[200px] leading-none opacity-5 select-none pointer-events-none">▲</div>
                    <div className="relative flex flex-col items-center gap-5">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Stop blowing up accounts. Start tracking the math.
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-md">
                            7 days free. $19/mo after. Cancel before day 8 if you hate it.
                        </p>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="btn-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base font-semibold">
                                Get TradeOS →
                            </button>
                        </Link>
                        <p className="text-xs text-[var(--color-text-subtle)]">
                            Not financial advice. Verify all calculations against your broker.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Footer
// ============================================================

function Footer() {
    return (
        <footer className="border-t border-[var(--color-border-soft)] py-10">
            <div className="max-w-5xl mx-auto px-5 flex flex-col items-center gap-5 text-sm text-[var(--color-text-muted)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--color-accent)]">▲</span>
                        <span className="font-bold text-[var(--color-text)]">TradeOS</span>
                        <span className="text-xs text-[var(--color-text-subtle)] ml-1">v0.1.0</span>
                    </div>
                    <div className="flex items-center gap-5 text-xs">
                        <Link href="/login" className="hover:text-[var(--color-text)] transition-colors">Sign in</Link>
                        <Link href="/signup" className="hover:text-[var(--color-text)] transition-colors">Get started</Link>
                        <Link href="/privacy" className="hover:text-[var(--color-text)] transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-[var(--color-text)] transition-colors">Terms</Link>
                    </div>
                </div>
                <p className="text-xs text-[var(--color-text-subtle)] text-center max-w-md">
                    Built by prop firm traders, in the gaps between sessions, because nobody else was going to.
                </p>
            </div>
        </footer>
    );
}

// ============================================================
// Inline SVG icons (Lucide-style, kept inline to avoid an extra dep)
// ============================================================

function PositionIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

function JournalIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="3" y1="20" x2="21" y2="20" />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v.01" />
            <path d="M9 12v.01" />
            <path d="M9 15v.01" />
            <path d="M9 18v.01" />
        </svg>
    );
}
