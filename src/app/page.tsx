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

export const metadata = {
    title: "TradeOS — The trading toolkit for prop firm traders",
    description:
        "Position sizing, trade journal, drawdown tracking, and analytics — purpose-built for Topstep, Apex, MyFundedFutures, and FTMO accounts.",
};

export default async function Home() {
    // Bounce signed-in users straight to their dashboard.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");

    return (
        <div className="bg-[var(--color-bg)]">
            <Header />
            <Hero />
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

            {/* Emerald aura behind the phones, pulsing softly */}
            <div
                aria-hidden
                className="absolute -right-[15%] top-[10%] w-[700px] h-[700px] rounded-full pointer-events-none animate-pulse-glow"
                style={{
                    background:
                        "radial-gradient(circle, rgba(16,185,129,0.20), transparent 60%)",
                }}
            />
            {/* Secondary violet wash bottom-left */}
            <div
                aria-hidden
                className="absolute -left-[10%] bottom-[10%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-60"
                style={{
                    background:
                        "radial-gradient(circle, rgba(124,58,237,0.15), transparent 60%)",
                }}
            />

            <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
                {/* Left: copy + CTAs */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                    <span className="animate-fade-in-up inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] px-2.5 py-1 rounded-full">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                        Built for prop firm traders
                    </span>

                    <h1 className="animate-fade-in-up-1 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                        The trading toolkit built to{" "}
                        <span className="bg-gradient-to-r from-[var(--color-accent)] via-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                            keep your account alive
                        </span>
                    </h1>

                    <p className="animate-fade-in-up-2 text-base md:text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
                        Position sizing, trade journal, drawdown tracking, and analytics — purpose-built for Topstep, Apex, MyFundedFutures, and FTMO accounts.
                    </p>

                    <div className="animate-fade-in-up-3 flex flex-col sm:flex-row gap-3 mt-1 w-full sm:w-auto">
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="btn-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg text-base font-semibold">
                                Start 7-day free trial
                                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        </Link>
                        <Link href="#pricing" className="w-full sm:w-auto">
                            <button className="btn-cta-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-base font-semibold">
                                See pricing
                            </button>
                        </Link>
                    </div>

                    <p className="animate-fade-in-up-4 text-xs text-[var(--color-text-subtle)]">
                        $0 today · $19/mo after trial · Cancel anytime before renewal
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
// Built for futures traders — 6 feature cards
// ============================================================

const TRADER_FEATURES = [
    {
        icon: PositionIcon,
        title: "Position sizing",
        body: "Risk-based sizing across 8 contracts. Tell us your account % at risk; we tell you the exact contracts to trade.",
    },
    {
        icon: ShieldIcon,
        title: "Drawdown tracking",
        body: "Trailing drawdown math runs in real time. Catch violations before they cost you a funded account.",
    },
    {
        icon: JournalIcon,
        title: "Trade journaling",
        body: "Log trades in two taps. Auto-flows into stats, equity curve, and the color-coded P&L calendar.",
    },
    {
        icon: CalendarIcon,
        title: "Economic calendar",
        body: "Every release this week + next. Plain-English explanations for NFP, CPI, FOMC, GDP, ISM, and more.",
    },
    {
        icon: ChartIcon,
        title: "Performance analytics",
        body: "Profit factor, expectancy, win rate by day-of-week, P&L by contract. See your real edge — not vibes.",
    },
    {
        icon: BuildingIcon,
        title: "Prop firm tools",
        body: "Topstep, Apex, MyFundedFutures, FTMO presets. Track daily limits + profit targets per firm.",
    },
];

function BuiltForTraders() {
    return (
        <section className="relative py-20 md:py-28 border-t border-[var(--color-border-soft)]">
            <div className="max-w-6xl mx-auto px-5">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                        Built for futures traders
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Everything a serious trader actually needs
                    </h2>
                    <p className="text-[var(--color-text-muted)] mt-4">
                        Stop juggling a calculator app, an Excel journal, a notes app for prop firm rules, and an economic calendar in another tab. TradeOS replaces all of it.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TRADER_FEATURES.map((f, i) => {
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
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                    See it in action
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    The way trading software{" "}
                    <span className="bg-gradient-to-r from-[var(--color-accent)] to-emerald-300 bg-clip-text text-transparent">
                        should
                    </span>{" "}
                    look
                </h2>
                <p className="text-[var(--color-text-muted)] mt-4 max-w-xl mx-auto">
                    Three taps to plan a trade. One to log it. Drawdown math runs itself.
                </p>
            </div>

            {/* Phone row — desktop */}
            <div className="relative max-w-5xl mx-auto mt-12 md:mt-16 px-4 hidden md:flex items-end justify-center gap-2">
                <div className="animate-float-slow">
                    <PhoneFrame size="sm" tilt={-6} glow={false}>
                        <MockJournal />
                    </PhoneFrame>
                </div>
                <div className="-mb-6 z-10 animate-float-slow-reverse">
                    <PhoneFrame size="md" tilt={0}>
                        <MockPropFirm />
                    </PhoneFrame>
                </div>
                <div className="animate-float-slow">
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
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                        Simple pricing
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Start free. Upgrade when it pays for itself.
                    </h2>
                    <p className="text-[var(--color-text-muted)] mt-4">
                        One avoided drawdown violation pays for a year of Pro. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    <PricingCard
                        name="Free"
                        price="$0"
                        priceSuffix="forever"
                        description="The calculator + a basic journal. Good for casual traders."
                        features={[
                            "Position calculator (all 8 contracts)",
                            "Up to 25 logged trades",
                            "Basic stats + P&L calendar",
                            "15 prop firm presets",
                            "Today's economic events",
                        ]}
                        ctaHref="/signup"
                        ctaText="Get started free"
                        highlighted={false}
                    />

                    <PricingCard
                        name="Pro"
                        badge="Most popular"
                        price="$19"
                        priceSuffix="/mo"
                        description="The full toolkit. 7-day free trial, $19/mo after — cancel anytime before renewal."
                        features={[
                            "7-day free trial",
                            "Unlimited trades + history",
                            "Full economic calendar with explanations",
                            "Custom prop firm rules",
                            "CSV bulk import + export",
                            "Priority support",
                        ]}
                        ctaHref="/signup"
                        ctaText="Start 7-day free trial"
                        highlighted
                    />

                    <PricingCard
                        name="Lifetime"
                        badge="Best value"
                        price="$199"
                        priceSuffix="once"
                        description="One payment, every Pro feature, forever. Founders pricing — locks in before public launch."
                        features={[
                            "Everything in Pro",
                            "Pay once, never again",
                            "All future features included",
                            "Lifetime updates",
                            "Founders pricing — limited time",
                        ]}
                        ctaHref="/signup"
                        ctaText="Get Lifetime"
                        highlighted={false}
                        accent="warn"
                    />
                </div>

                <p className="text-center text-xs text-[var(--color-text-subtle)] mt-8">
                    All plans include account deletion + full data export. We never sell your data.
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
        q: "How does the 7-day free trial work?",
        a: "You enter your payment method up-front, but $0 is charged for the first 7 days. On day 8, we auto-bill $19/mo unless you cancel before then. You can cancel anytime from Settings → Manage subscription with one click.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel from Settings → Manage subscription. Cancellation during the trial means no charge. Cancellation after means your Pro access stays until the end of the period you've already paid for, then drops to Free.",
    },
    {
        q: "What brokers do you sync with?",
        a: "Auto-sync from brokers and prop firms (Topstep, Apex, MFF, NinjaTrader, Tradovate, Rithmic) is in development and ships to Pro/Lifetime users when launched. Until then, log trades manually with one tap or bulk-import via CSV (Pro).",
    },
    {
        q: "Is my trade data private?",
        a: "Yes. Trades are stored in Supabase with Row Level Security — only your account can read or write them, even via direct database access. We never sell, share, or use your data for anything but providing the service.",
    },
    {
        q: "Refund policy?",
        a: "Email us within 14 days of any Pro charge or Lifetime purchase and we'll refund, no questions asked. Use the trial first if you're unsure — that's exactly what it's for.",
    },
    {
        q: "Do you have a mobile app?",
        a: "TradeOS works as a Progressive Web App — install to your iPhone or Android home screen and it behaves like a native app, including offline support. Native iOS/Android apps are on the roadmap.",
    },
] as const;

function FAQ() {
    return (
        <section id="faq" className="py-20 md:py-28 border-t border-[var(--color-border-soft)]">
            <div className="max-w-2xl mx-auto px-5">
                <div className="text-center mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                        Common questions
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Before you sign up
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
                <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] bg-gradient-to-br from-emerald-600/10 via-violet-700/5 to-transparent p-10 md:p-14 text-center">
                    <div className="absolute -right-8 -top-8 text-[200px] leading-none opacity-5 select-none pointer-events-none">▲</div>
                    <div className="relative flex flex-col items-center gap-5">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Start tracking better trades today
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-md">
                            7-day free trial. $19/mo after — cancel anytime before renewal.
                        </p>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="btn-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base font-semibold">
                                Start your free trial →
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
            <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
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
