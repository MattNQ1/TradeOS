// Public landing page (/). Marketing site for non-authenticated visitors.
// Authenticated users are bounced to /dashboard so they don't re-encounter the pitch.
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
            <ScreenshotGallery />
            <Features />
            <Pricing />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}

// ============================================================
// Header
// ============================================================

function Header() {
    return (
        <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border-soft)]">
            <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg flex items-center gap-2">
                    <span className="text-[var(--color-accent)]">▲</span>
                    TradeOS
                </Link>
                <div className="flex items-center gap-1">
                    <Link
                        href="#pricing"
                        className="hidden sm:inline-flex px-3 py-2 rounded-md text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/login"
                        className="px-3 py-2 rounded-md text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-colors"
                    >
                        Start free trial
                    </Link>
                </div>
            </div>
        </header>
    );
}

// ============================================================
// Hero
// ============================================================

function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Backdrop: emerald top-glow + radial accent behind the phone */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />
            <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-8 items-center">
                {/* Left: copy + CTAs */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] px-2.5 py-1 rounded-full">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                        7-day free trial · no charge to start
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                        The trading toolkit built for{" "}
                        <span className="text-[var(--color-accent)]">prop firm traders</span>
                    </h1>

                    <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
                        Position sizing, trade journal, drawdown tracking, and analytics — purpose-built for Topstep, Apex, MyFundedFutures, and FTMO accounts.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-1 w-full sm:w-auto">
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-colors">
                                Start 7-day free trial
                            </button>
                        </Link>
                        <Link href="#pricing" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold bg-[var(--color-bg-elev-2)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors">
                                See pricing
                            </button>
                        </Link>
                    </div>

                    <p className="text-xs text-[var(--color-text-subtle)]">
                        No credit card to browse · Cancel before day 8 to avoid any charge
                    </p>
                </div>

                {/* Right: hero phone showing the dashboard (with a secondary
                    phone peeking out from behind for App-Store-listing depth) */}
                <div className="relative flex justify-center lg:justify-end items-center min-h-[520px] lg:min-h-[640px]">
                    {/* Back phone — calculator screen, peeking from behind */}
                    <div className="absolute right-1/2 lg:right-auto lg:-left-12 translate-x-[80px] lg:translate-x-0 top-8 lg:top-12 hidden sm:block">
                        <PhoneFrame size="sm" tilt={-8} className="opacity-90">
                            <MockCalculator />
                        </PhoneFrame>
                    </div>

                    {/* Front phone — dashboard */}
                    <div className="relative z-10">
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
// Screenshot gallery — 3 phones at angles, each showing a feature
// ============================================================

function ScreenshotGallery() {
    return (
        <section className="relative overflow-hidden py-16 md:py-20 border-t border-[var(--color-border-soft)]">
            <div className="max-w-6xl mx-auto px-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                    See it in action
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Built for the way traders actually work
                </h2>
                <p className="text-[var(--color-text-muted)] mt-4 max-w-xl mx-auto">
                    Three taps to plan a trade. One to log it. Drawdown math runs itself.
                </p>
            </div>

            {/* Phone row */}
            <div className="relative max-w-5xl mx-auto mt-10 md:mt-14 px-4 hidden md:flex items-end justify-center gap-2">
                <div className="relative">
                    <PhoneFrame size="sm" tilt={-6}>
                        <MockJournal />
                    </PhoneFrame>
                </div>
                <div className="relative -mb-4 z-10">
                    <PhoneFrame size="md" tilt={0}>
                        <MockPropFirm />
                    </PhoneFrame>
                </div>
                <div className="relative">
                    <PhoneFrame size="sm" tilt={6}>
                        <MockEconomicCalendar />
                    </PhoneFrame>
                </div>
            </div>

            {/* Mobile fallback — single phone (the prop firm one) */}
            <div className="md:hidden mt-10 flex justify-center">
                <PhoneFrame size="md">
                    <MockPropFirm />
                </PhoneFrame>
            </div>

            {/* Labels under phones */}
            <div className="hidden md:flex max-w-5xl mx-auto mt-8 px-4 justify-around text-center text-xs text-[var(--color-text-muted)]">
                <span>P&amp;L Journal &amp; Calendar</span>
                <span className="font-semibold text-[var(--color-text)]">Prop Firm Guardrails</span>
                <span>Economic Calendar</span>
            </div>
        </section>
    );
}

// ============================================================
// Features
// ============================================================

const FEATURES = [
    {
        icon: "🎯",
        title: "Position calculator",
        body: "8 contracts, every tick. Dial in exact $ risk and reward before you click buy. Commission-aware. Auto-suggests contracts from account size + risk %.",
    },
    {
        icon: "📓",
        title: "Auto journal + analytics",
        body: "Every trade logs to your equity curve. Profit factor, expectancy, win rate by day-of-week, P&L by contract — all the metrics serious traders track.",
    },
    {
        icon: "🛡️",
        title: "Prop firm guardrails",
        body: "15 firms preset (Topstep, Apex, MFF, FTMO …). Live trailing drawdown, daily loss limits, profit targets. Catch violations before they cost you a funded account.",
    },
    {
        icon: "📅",
        title: "Economic calendar",
        body: "Every release this week + next week, in your timezone. Tap any event for plain-English explanations of NFP, CPI, FOMC, GDP — no more Bloomberg subscriptions.",
    },
] as const;

function Features() {
    return (
        <section className="py-20 md:py-24 border-t border-[var(--color-border-soft)]">
            <div className="max-w-5xl mx-auto px-5">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                        Everything in one place
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Stop juggling 5 spreadsheets
                    </h2>
                    <p className="text-[var(--color-text-muted)] mt-4">
                        Most traders piece together their workflow from a calculator app, an Excel journal, a notes app for prop firm rules, and an economic calendar in another tab. TradeOS replaces all of it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="bg-[var(--color-bg-elev)] border border-[var(--color-border-soft)] rounded-2xl p-6 flex flex-col gap-3"
                        >
                            <div className="text-4xl leading-none">{f.icon}</div>
                            <h3 className="text-lg font-bold">{f.title}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{f.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Pricing
// ============================================================

function Pricing() {
    return (
        <section id="pricing" className="py-20 md:py-24 border-t border-[var(--color-border-soft)]">
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
                        description="The full toolkit. 7-day free trial, no card charged until day 8."
                        features={[
                            "7-day free trial — no charge to start",
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
        ? "border-[color-mix(in_oklab,var(--color-accent)_50%,transparent)] shadow-[0_0_40px_rgba(16,185,129,0.15)]"
        : "border-[var(--color-border-soft)]";
    const gradientClass = highlighted
        ? "bg-gradient-to-br from-emerald-600/8 via-violet-700/4 to-transparent"
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
                    <button
                        className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                            highlighted
                                ? "text-white"
                                : "bg-[var(--color-bg-elev-2)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)]"
                        }`}
                        style={highlighted ? { background: accentColor } : undefined}
                    >
                        {ctaText}
                    </button>
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
        q: "Will you charge me during the free trial?",
        a: "No. Stripe holds your card on file so we can convert you automatically on day 8 if you keep going, but $0 is charged during the trial. Cancel anytime before day 8 to avoid any charge.",
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel from Settings → Manage subscription. Cancellation during the trial = no charge. Cancellation after = your Pro access stays until the end of the period you've already paid for.",
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
        a: "TradeOS works as a Progressive Web App — install to your iPhone or Android home screen and it behaves like a native app, including offline support. Native iOS/Android apps are on the roadmap for after we hit a critical mass of users.",
    },
] as const;

function FAQ() {
    return (
        <section className="py-20 md:py-24 border-t border-[var(--color-border-soft)]">
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
                            className="group bg-[var(--color-bg-elev)] border border-[var(--color-border-soft)] rounded-xl"
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
        <section className="py-20 md:py-24 border-t border-[var(--color-border-soft)]">
            <div className="max-w-3xl mx-auto px-5">
                <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] bg-gradient-to-br from-emerald-600/15 via-violet-700/10 to-transparent p-10 md:p-14 text-center">
                    <div className="absolute -right-8 -top-8 text-[200px] leading-none opacity-5 select-none pointer-events-none">▲</div>
                    <div className="relative flex flex-col items-center gap-5">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Start tracking better trades today
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-md">
                            Free to start. 7-day Pro trial included. Cancel anytime.
                        </p>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-colors">
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
                    <Link href="/login" className="hover:text-[var(--color-text)]">Sign in</Link>
                    <Link href="/signup" className="hover:text-[var(--color-text)]">Get started</Link>
                    <Link href="/privacy" className="hover:text-[var(--color-text)]">Privacy</Link>
                    <Link href="/terms" className="hover:text-[var(--color-text)]">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
