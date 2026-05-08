// Beautiful event detail modal — gradient hero, data viz, descriptions.
// Uses native <dialog> for free focus management + ESC handling.
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
    CATEGORY_STYLES,
    matchEvent,
} from "./descriptions";
import { formatEventTime, IMPACT_COLOR } from "./helpers";
import { Button } from "@/components/ui/button";
import type { EconomicEvent } from "./types";

interface EventModalProps {
    event: (EconomicEvent & { __paywalled?: boolean }) | null;
    onClose: () => void;
    /** When false, gated event clicks show the paywall variant. */
    isPaid?: boolean;
}

const dayFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
});

export function EventModal({ event, onClose }: EventModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (event && !dlg.open) dlg.showModal();
        if (!event && dlg.open) dlg.close();
    }, [event]);

    if (!event) {
        // Render the dialog element so the ref always exists, but with no inner content.
        return (
            <dialog
                ref={dialogRef}
                onClose={onClose}
                className="bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
            />
        );
    }

    // Paywall variant: shown when a free user taps a gated event.
    if (event.__paywalled) {
        return (
            <dialog
                ref={dialogRef}
                onClose={onClose}
                className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm overflow-hidden"
            >
                <div className="relative bg-gradient-to-br from-emerald-600/40 via-violet-700/20 to-transparent px-5 pt-6 pb-5 overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-[120px] leading-none opacity-10 select-none pointer-events-none">🔒</div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-3 top-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center hover:bg-black/50"
                    >✕</button>
                    <div className="relative">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white px-2 py-1 rounded bg-[var(--color-accent)] mb-3">
                            Pro feature
                        </span>
                        <h2 className="text-2xl font-bold leading-tight tracking-tight">
                            Unlock the full economic calendar
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)] mt-2">
                            Free accounts see only the next 2 events. Upgrade to read every release with plain-English explanations.
                        </p>
                    </div>
                </div>

                <div className="px-5 py-5 flex flex-col gap-4">
                    <ul className="space-y-1.5">
                        <PaywallFeature>Every economic release this week + next week</PaywallFeature>
                        <PaywallFeature>Plain-English explanations (NFP, CPI, FOMC, GDP…)</PaywallFeature>
                        <PaywallFeature>How to interpret each release for trading</PaywallFeature>
                        <PaywallFeature>Live forecast / previous / actual values</PaywallFeature>
                    </ul>

                    <div className="flex flex-col gap-2">
                        <Link href="/settings" className="w-full">
                            <Button className="w-full">Upgrade to Pro · $19/mo</Button>
                        </Link>
                        <Link href="/settings" className="w-full">
                            <Button variant="secondary" className="w-full">Lifetime · $199 once</Button>
                        </Link>
                    </div>
                </div>
            </dialog>
        );
    }

    const match = matchEvent(event.title);
    const style = CATEGORY_STYLES[match.category];
    const impact = IMPACT_COLOR[event.impact];
    const dateLabel = dayFmt.format(new Date(event.dateISO));

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm overflow-hidden"
        >
            {/* ---------- HERO ---------- */}
            <div className={`relative bg-gradient-to-br ${style.gradient} px-5 pt-6 pb-5 overflow-hidden`}>
                <div className="absolute -right-4 -top-4 text-[120px] leading-none opacity-10 select-none pointer-events-none">
                    {style.icon}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center hover:bg-black/50"
                >
                    ✕
                </button>

                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <span
                            className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-1 rounded"
                            style={{ background: style.accent }}
                        >
                            {style.icon} {style.label}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1.5 ${impact.bg} ${impact.text}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${impact.dot}`} />
                            {event.impact}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold leading-tight tracking-tight">
                        {event.title}
                    </h2>
                    {match.description?.aka && (
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            Also known as <span className="font-semibold text-[var(--color-text)]">{match.description.aka}</span>
                        </p>
                    )}

                    <div className="flex items-center gap-3 mt-4 text-sm">
                        <span className="font-bold text-[var(--color-text)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-0.5">
                            {event.country}
                        </span>
                        <span className="text-[var(--color-text-muted)]">{dateLabel}</span>
                        <span className="text-[var(--color-text-muted)]">·</span>
                        <span className="text-[var(--color-text)] font-semibold tabular-nums">
                            {formatEventTime(event.dateISO)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ---------- BODY ---------- */}
            <div className="px-5 py-5 max-h-[55vh] overflow-y-auto">
                {/* Data values */}
                {(event.actual || event.forecast || event.previous) && (
                    <DataGrid event={event} />
                )}

                {/* Description content */}
                {match.isSpeaker ? (
                    <SpeakerNotice />
                ) : match.description ? (
                    <DescriptionSections desc={match.description} accent={style.accent} />
                ) : (
                    <NoDescriptionFallback category={style.label} />
                )}
            </div>
        </dialog>
    );
}

// ============================================================
// Sub-components
// ============================================================

function DataGrid({ event }: { event: EconomicEvent }) {
    return (
        <div className="grid grid-cols-3 gap-2 mb-5">
            <Stat label="Previous" value={event.previous ?? "—"} muted />
            <Stat label="Forecast" value={event.forecast ?? "—"} muted />
            <Stat
                label="Actual"
                value={event.actual ?? "—"}
                highlight={event.actual !== null}
            />
        </div>
    );
}

function Stat({
    label, value, muted, highlight,
}: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
    return (
        <div
            className={`rounded-lg p-3 border ${
                highlight
                    ? "bg-[color-mix(in_oklab,var(--color-accent)_10%,transparent)] border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]"
                    : "bg-[var(--color-bg-elev-2)] border-[var(--color-border)]"
            }`}
        >
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted && !highlight ? "text-[var(--color-text-muted)]" : "text-[var(--color-accent)]"}`}>
                {label}
            </p>
            <p className="text-base font-bold tabular-nums leading-tight mt-1">{value}</p>
        </div>
    );
}

function DescriptionSections({
    desc, accent,
}: { desc: NonNullable<ReturnType<typeof matchEvent>["description"]>; accent: string }) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed -mt-1">
                {desc.summary}
            </p>

            <Section title="What it is" accent={accent}>
                {desc.explanation}
            </Section>

            <Section title="Why it matters" accent={accent}>
                {desc.whyItMatters}
            </Section>

            <Section title="How to interpret" accent={accent}>
                {desc.howToInterpret}
            </Section>
        </div>
    );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
    return (
        <div>
            <h3
                className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: accent }}
            >
                {title}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-text)]">{children}</p>
        </div>
    );
}

function SpeakerNotice() {
    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg p-4">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                This is a <span className="font-semibold text-[var(--color-text)]">speaker event</span>. The market impact depends entirely on what&apos;s said in real time — there&apos;s no fixed indicator value to interpret in advance.
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-2">
                Watch the live wire (Bloomberg, Reuters) for headlines. Hawkish remarks typically strengthen the currency; dovish remarks weaken it.
            </p>
        </div>
    );
}

function NoDescriptionFallback({ category }: { category: string }) {
    return (
        <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg p-4">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                This event falls under <span className="font-semibold text-[var(--color-text)]">{category}</span>, but we don&apos;t yet have a detailed write-up for it.
            </p>
            <p className="text-xs text-[var(--color-text-subtle)] mt-2">
                Generally: higher than forecast tends to be bullish for the country&apos;s currency; lower tends to be bearish. Watch the actual vs forecast above.
            </p>
        </div>
    );
}

function PaywallFeature({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
            <span className="text-[var(--color-text)]">{children}</span>
        </li>
    );
}
