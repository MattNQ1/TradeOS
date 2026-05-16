// AI-style help widget. Floats bottom-right on every page.
//
// Cost-conscious by design: answers are curated, not LLM-generated, so we pay
// $0 per message. The UX feels conversational because:
//   - Suggested questions appear as chips (one-tap answers)
//   - Welcome bubble greets the user proactively after a short delay
//   - "Helper" framing instead of "AI" — we don't claim to be one
//
// To swap in a real LLM later: keep the chat surface, replace the click handler
// on the input with an API call to a Server Action that hits Anthropic / OpenAI.
//
// Skipped on auth pages (login/signup/password reset) so it doesn't compete
// with the sign-up form for the user's attention. Bumped above the (app)
// bottom tab bar when needed.
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ============================================================
// Curated Q&A — easy to extend; just append to this array.
// Order = display order in the suggested chips.
// ============================================================

interface QAEntry {
    q: string;
    /** Display label on the suggestion chip (defaults to the question itself). */
    chip?: string;
    a: string;
}

const QA: ReadonlyArray<QAEntry> = [
    {
        q: "How does the 7-day free trial work?",
        chip: "How does the trial work?",
        a: "You enter your payment method up-front, but $0 is charged for the first 7 days. On day 8 we auto-bill $19/mo unless you cancel. You can cancel anytime from Settings → Manage subscription — one click.",
    },
    {
        q: "What's the difference between Pro and Lifetime?",
        chip: "Pro vs Lifetime?",
        a: "Pro is $19/mo with a 7-day free trial. Lifetime is $199 once, no recurring fees, all Pro features forever — including future upgrades. If you plan to use TradeOS for more than ~10 months, Lifetime pays for itself.",
    },
    {
        q: "How do I cancel my subscription?",
        chip: "How do I cancel?",
        a: "Sign in → Settings → Subscription → Manage subscription. That opens Stripe's secure billing portal where you can cancel in one click. During the trial = no charge. After = your access continues until the end of the period you've already paid for.",
    },
    {
        q: "What brokers do you sync with?",
        chip: "Broker support",
        a: "Auto-sync from Topstep, Apex, MyFundedFutures, NinjaTrader, Tradovate, and Rithmic is in development for Pro/Lifetime users. Until then you can log trades manually in two taps or bulk-import via CSV (Pro).",
    },
    {
        q: "Is my trade data private?",
        chip: "Data privacy",
        a: "Yes. Every trade is stored with Row Level Security — only your account can read it, even via direct database access. We never sell, share, or use your data for advertising. You can export everything as CSV or delete your account anytime from Settings.",
    },
    {
        q: "What's your refund policy?",
        chip: "Refunds",
        a: "Email support within 14 days of any Pro or Lifetime charge and we'll refund — no questions asked. Use the trial first to evaluate; that's exactly what it's for.",
    },
    {
        q: "Can I use TradeOS on mobile?",
        chip: "Mobile app?",
        a: "Yes. TradeOS works as a Progressive Web App — open the site on your iPhone or Android browser, then Add to Home Screen. It'll behave like a native app, including offline support. Dedicated iOS/Android apps are on the roadmap.",
    },
    {
        q: "Still need help?",
        chip: "Contact support",
        a: "Email tradeos.support@gmail.com and we'll get back to you within a day. Include the email on your account so we can find your subscription quickly.",
    },
];

// ============================================================
// Component
// ============================================================

interface Message {
    role: "assistant" | "user";
    text: string;
}

const WELCOME_MESSAGES: Message[] = [
    {
        role: "assistant",
        text: "Got a question? Tap one below for a quick answer. Real answers, written by us, no AI guessing.",
    },
];

const STORAGE_KEY = "tradeos.help.proactive.seen";

export function HelpWidget() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [proactiveOpen, setProactiveOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
    const scrollRef = useRef<HTMLDivElement>(null);

    // ---- Where to show ----
    // Skip on auth pages (so the helper doesn't fight the sign-up form for
    // attention) and on legal pages (which are reading-focused).
    const skipPaths = ["/login", "/signup", "/forgot-password", "/reset-password", "/privacy", "/terms"];
    const skipped = skipPaths.some((p) => pathname.startsWith(p));

    // Bump above (app) bottom tab bar so we don't overlap.
    const appPaths = ["/dashboard", "/calculator", "/journal", "/prop-firm", "/economic-calendar", "/settings"];
    const isAppPage = appPaths.some((p) => pathname.startsWith(p));

    // ---- Proactive prompt ----
    // Show a small "Need help?" bubble 6s after first visit; auto-dismiss after
    // 14s. Don't show again in the same session (localStorage flag).
    useEffect(() => {
        if (skipped) return;
        if (typeof window === "undefined") return;
        try {
            if (localStorage.getItem(STORAGE_KEY) === "1") return;
        } catch {
            // localStorage can be blocked (private mode, etc.) — fail silent.
        }
        const showTimer = setTimeout(() => {
            if (!open) setProactiveOpen(true);
        }, 6000);
        const hideTimer = setTimeout(() => {
            setProactiveOpen(false);
        }, 20000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, skipped]);

    const markProactiveSeen = () => {
        try {
            localStorage.setItem(STORAGE_KEY, "1");
        } catch { /* ignore */ }
    };

    const openChat = () => {
        setOpen(true);
        setProactiveOpen(false);
        markProactiveSeen();
    };

    const closeChat = () => setOpen(false);

    const askQuestion = (entry: QAEntry) => {
        setMessages((prev) => [
            ...prev,
            { role: "user", text: entry.q },
            { role: "assistant", text: entry.a },
        ]);
        // Scroll to bottom after the new message renders.
        setTimeout(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }, 50);
    };

    if (skipped) return null;

    return (
        <div
            className={cn(
                "fixed right-4 sm:right-6 z-50 flex flex-col items-end gap-3",
                isAppPage ? "bottom-[80px] sm:bottom-[80px]" : "bottom-4 sm:bottom-6",
            )}
        >
            {/* Proactive bubble — small "first impression" message */}
            {proactiveOpen && !open && (
                <button
                    type="button"
                    onClick={openChat}
                    className="animate-fade-in-up max-w-[260px] text-left bg-[var(--color-bg-elev)] border border-[color-mix(in_oklab,var(--color-accent)_30%,transparent)] rounded-2xl rounded-br-md px-3.5 py-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:bg-[var(--color-bg-elev-2)] transition-colors"
                >
                    <p className="text-xs font-semibold text-[var(--color-text)] leading-snug">
                        Questions about TradeOS?
                    </p>
                    <p className="text-[11px] text-[var(--color-text-muted)] leading-snug mt-0.5">
                        Tap for a real answer.
                    </p>
                </button>
            )}

            {/* Chat card */}
            {open && (
                <div
                    role="dialog"
                    aria-label="TradeOS helper"
                    className="animate-fade-in-up w-[min(360px,calc(100vw-2rem))] max-h-[min(560px,calc(100dvh-6rem))] bg-[var(--color-bg-elev)] border border-[var(--color-border)] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-emerald-600/30 via-emerald-700/15 to-transparent px-4 py-3 border-b border-[var(--color-border-soft)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    <SparkleIcon />
                                </div>
                                <div>
                                    <p className="text-sm font-bold leading-tight">TradeOS Helper</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)] leading-tight mt-0.5">
                                        Hand-written answers, no chatbot
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeChat}
                                aria-label="Close helper"
                                className="w-7 h-7 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)] flex items-center justify-center transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
                    >
                        {messages.map((m, i) => (
                            <MessageBubble key={i} message={m} />
                        ))}
                    </div>

                    {/* Suggested questions */}
                    <div className="border-t border-[var(--color-border-soft)] px-3 py-2.5 bg-[var(--color-bg-elev-2)]/40">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 px-1">
                            {messages.length > 1 ? "Ask another" : "Suggested questions"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {QA.map((entry) => (
                                <button
                                    key={entry.q}
                                    type="button"
                                    onClick={() => askQuestion(entry)}
                                    className="text-[11px] font-medium px-2.5 py-1.5 rounded-full bg-[var(--color-bg-elev)] hover:bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] text-[var(--color-text)] transition-colors"
                                >
                                    {entry.chip ?? entry.q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating action button */}
            <button
                type="button"
                onClick={open ? closeChat : openChat}
                aria-label={open ? "Close helper" : "Open helper"}
                className={cn(
                    "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
                    "bg-gradient-to-br from-emerald-500 to-emerald-700",
                    "shadow-[0_10px_30px_-5px_rgba(16,185,129,0.45),0_0_0_1px_rgba(255,255,255,0.1)_inset]",
                    "hover:scale-105 hover:shadow-[0_14px_36px_-5px_rgba(16,185,129,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset]",
                    "active:scale-95",
                )}
            >
                {/* Pulsing aura when proactive bubble is up */}
                {proactiveOpen && !open && (
                    <span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-50 animate-ping"
                    />
                )}
                <span className="relative text-white">
                    {open ? <CloseIcon size={22} /> : <ChatIcon size={24} />}
                </span>
            </button>
        </div>
    );
}

// ============================================================
// Sub-components
// ============================================================

function MessageBubble({ message }: { message: Message }) {
    const isAssistant = message.role === "assistant";
    return (
        <div className={cn("flex gap-2 items-start", isAssistant ? "" : "flex-row-reverse")}>
            {isAssistant && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center mt-0.5">
                    <SparkleIcon size={12} />
                </div>
            )}
            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    isAssistant
                        ? "bg-[var(--color-bg-elev-2)] text-[var(--color-text)] rounded-tl-md"
                        : "bg-[var(--color-accent)] text-white rounded-tr-md",
                )}
            >
                {message.text}
            </div>
        </div>
    );
}

// ============================================================
// Inline icons (no extra dependency)
// ============================================================

function ChatIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

function CloseIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function SparkleIcon({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.8" strokeLinejoin="round">
            <path d="M12 2 14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5 12 2Z" />
        </svg>
    );
}
