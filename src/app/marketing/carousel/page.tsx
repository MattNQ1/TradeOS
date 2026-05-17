// Instagram carousel slide preview page.
//
// Renders 5 real Instagram-carousel slides (1080x1350) using the ACTUAL
// landing-page phone mockup components — same look as the live site.
// Matt opens this in Chrome and screenshots each slide.
//
// Two ways to capture each slide:
//   A. Easiest: macOS Cmd+Shift+4 (or Windows Snipping Tool) — drag a
//      box over the slide. Good enough quality for Instagram.
//   B. Best quality: Chrome DevTools (right-click → Inspect → right-click
//      the slide element in the Elements panel → "Capture node screenshot").
//      Produces a true 1080x1350 PNG at the slide's native resolution.
//
// Page is gated from search engines by robots.txt (/marketing/* disallowed).
import Link from "next/link";
import { PhoneFrame } from "@/components/landing/phone-frame";
import {
    MockDashboard,
    MockAI,
    MockJournal,
} from "@/components/landing/mock-screens";

export const metadata = { title: "Carousel preview", robots: { index: false } };

// 1080x1350 = Instagram 4:5 portrait, max vertical real estate on phone scroll.
const SLIDE_W = 1080;
const SLIDE_H = 1350;

export default function CarouselPreviewPage() {
    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            {/* Instructions banner */}
            <div className="sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800 px-6 py-4">
                <h1 className="text-lg font-bold mb-1">
                    Instagram carousel — 5 slides ready to screenshot
                </h1>
                <p className="text-xs text-neutral-400 leading-relaxed">
                    Each slide below is rendered at native 1080×1350. Right-click any slide → <strong className="text-white">Inspect</strong> →
                    in DevTools Elements panel right-click the <code className="text-emerald-400">{"<section data-slide=\"N\">"}</code> element →
                    <strong className="text-white"> &ldquo;Capture node screenshot&rdquo;</strong> to download as PNG.
                    {" "}Or just use macOS <kbd className="text-white">⌘⇧4</kbd> to box-select.
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                    Caption + hashtags live in <Link href="/" className="text-emerald-400">MARKETING_ASSETS.md</Link>.
                </p>
            </div>

            <div className="flex flex-col items-center gap-16 py-12 px-6">
                {/* SLIDE 1 — Hook with dashboard phone */}
                <Slide n={1}>
                    <SlideBackground gradient />
                    <SlideTopRow>
                        <Brandmark />
                        <span className="text-sm text-neutral-400">1 / 5</span>
                    </SlideTopRow>
                    <div className="relative z-10 flex flex-col items-center text-center px-20 mt-8">
                        <SlideEyebrow>For prop firm traders</SlideEyebrow>
                        <h2 className="text-7xl font-extrabold tracking-tight leading-[1.05] mt-5 max-w-3xl">
                            You&rsquo;re juggling 4 apps to manage 1 funded account.
                        </h2>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center -mt-8">
                        <PhoneFrame size="lg" tilt={-3}>
                            <MockDashboard />
                        </PhoneFrame>
                    </div>
                </Slide>

                {/* SLIDE 2 — The mess: 4 competing apps */}
                <Slide n={2}>
                    <SlideBackground />
                    <SlideTopRow>
                        <Brandmark />
                        <span className="text-sm text-neutral-400">2 / 5</span>
                    </SlideTopRow>
                    <div className="relative z-10 flex flex-col px-20 mt-12">
                        <h2 className="text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
                            Most prop firm traders right now:
                        </h2>
                        <p className="text-2xl text-neutral-400 mt-4">
                            Four different apps. One funded account.
                        </p>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center px-20">
                        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                            <AppIconCard name="Calculator" subtitle="Position size" bg="#1f2937" icon="=" />
                            <AppIconCard name="Excel" subtitle="Trade journal" bg="#15803d" icon="X" />
                            <AppIconCard name="Notes" subtitle="Prop firm rules" bg="#a16207" icon="✎" />
                            <AppIconCard name="Forex Factory" subtitle="Econ calendar" bg="#7e22ce" icon="FF" />
                        </div>
                    </div>
                    <div className="relative z-10 px-20 pb-12">
                        <p className="text-xl text-neutral-400 italic">
                            Each is fine alone. Together they&rsquo;re a focus killer.
                        </p>
                    </div>
                </Slide>

                {/* SLIDE 3 — Solution with dashboard phone */}
                <Slide n={3}>
                    <SlideBackground gradient />
                    <SlideTopRow>
                        <Brandmark />
                        <span className="text-sm text-neutral-400">3 / 5</span>
                    </SlideTopRow>
                    <div className="relative z-10 flex flex-col items-center text-center px-20 mt-8">
                        <h2 className="text-7xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
                            One app. Everything you need.
                        </h2>
                        <p className="text-2xl text-neutral-400 mt-5">
                            Position math · Journal · Drawdown · Econ · AI
                        </p>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center">
                        <PhoneFrame size="lg" tilt={3}>
                            <MockJournal />
                        </PhoneFrame>
                    </div>
                </Slide>

                {/* SLIDE 4 — AI feature with AI phone */}
                <Slide n={4}>
                    <SlideBackground />
                    <SlideTopRow>
                        <Brandmark />
                        <span className="text-sm text-neutral-400">4 / 5</span>
                    </SlideTopRow>
                    <div className="relative z-10 flex flex-col items-center text-center px-20 mt-8">
                        <span className="inline-flex self-center items-center text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] bg-emerald-500/10 border border-emerald-500/40 px-4 py-2 rounded-full">
                            Pro feature
                        </span>
                        <h2 className="text-6xl font-extrabold tracking-tight leading-[1.05] mt-5 max-w-3xl">
                            AI that reads your trades back to you.
                        </h2>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center">
                        <PhoneFrame size="lg" tilt={-3}>
                            <MockAI />
                        </PhoneFrame>
                    </div>
                </Slide>

                {/* SLIDE 5 — CTA */}
                <Slide n={5}>
                    <SlideBackground gradient />
                    <SlideTopRow>
                        <Brandmark />
                        <span className="text-sm text-neutral-400">5 / 5</span>
                    </SlideTopRow>
                    <div className="relative z-10 flex flex-col items-center text-center px-20 mt-12">
                        <h2 className="text-9xl font-extrabold tracking-tight leading-none">
                            Try it free.
                        </h2>
                        <p className="text-2xl text-neutral-300 mt-5 max-w-2xl">
                            Free tier covers most of it. Pro is $19/mo with a 7-day trial.
                        </p>
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center -mt-4">
                        <PhoneFrame size="lg" tilt={0}>
                            <MockDashboard />
                        </PhoneFrame>
                    </div>
                    <div className="relative z-10 flex justify-center pb-16">
                        <div className="bg-emerald-500 text-emerald-950 text-3xl font-extrabold px-10 py-5 rounded-2xl">
                            usetradeos.vercel.app
                        </div>
                    </div>
                </Slide>
            </div>
        </div>
    );
}

// ============================================================
// Slide primitives
// ============================================================

function Slide({ n, children }: { n: number; children: React.ReactNode }) {
    return (
        <section
            data-slide={n}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
                width: SLIDE_W,
                height: SLIDE_H,
                background: "#050505",
            }}
        >
            {children}
        </section>
    );
}

function SlideBackground({ gradient = false }: { gradient?: boolean }) {
    return (
        <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={
                gradient
                    ? {
                          background:
                              "linear-gradient(135deg, #050505 0%, #062e26 65%, #0a3d34 100%)",
                      }
                    : { background: "#050505" }
            }
        />
    );
}

function SlideTopRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative z-10 flex items-center justify-between px-20 pt-16">
            {children}
        </div>
    );
}

function Brandmark() {
    return (
        <div className="flex items-center gap-3">
            <span className="text-emerald-500 text-4xl leading-none">▲</span>
            <span className="text-3xl font-bold tracking-tight">TradeOS</span>
        </div>
    );
}

function SlideEyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            {children}
        </span>
    );
}

function AppIconCard({
    name,
    subtitle,
    bg,
    icon,
}: {
    name: string;
    subtitle: string;
    bg: string;
    icon: string;
}) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center">
            <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-5xl font-extrabold mb-4"
                style={{ background: bg }}
            >
                {icon}
            </div>
            <p className="text-2xl font-bold">{name}</p>
            <p className="text-base text-neutral-400 mt-1">{subtitle}</p>
        </div>
    );
}
