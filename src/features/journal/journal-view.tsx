// Top-level Client Component for /journal.
// Receives initial trades from the Server Component page; orchestrates the rest.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JournalStatsCard } from "./journal-stats";
import { PnLCalendar } from "./pnl-calendar";
import { TradeList } from "./trade-list";
import { TradeModal } from "./trade-modal";
import { calcJournalStats, todayISO } from "./trade-stats";
import { exportTradesToCSV } from "./csv-export";
import type { Trade } from "./types";

interface JournalViewProps {
    initialTrades: Trade[];
}

export function JournalView({ initialTrades }: JournalViewProps) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Trade | null>(null);
    const [syncSoonOpen, setSyncSoonOpen] = useState(false);

    const stats = useMemo(() => calcJournalStats(initialTrades, todayISO()), [initialTrades]);

    const openAdd = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (t: Trade) => { setEditing(t); setModalOpen(true); };
    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        // Pull fresh data from the server (Server Action already revalidated).
        router.refresh();
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Journal</h1>

            <JournalStatsCard stats={stats} />

            <PnLCalendar trades={initialTrades} />

            <Card>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle>Trades</CardTitle>
                    <div className="flex gap-1.5">
                        {/* Broker sync — placeholder, opens a "coming soon" preview modal. */}
                        <button
                            type="button"
                            onClick={() => setSyncSoonOpen(true)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)] transition-colors"
                        >
                            Sync
                            <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-[var(--color-accent)] text-white leading-none">
                                Soon
                            </span>
                        </button>

                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={initialTrades.length === 0}
                            onClick={() => exportTradesToCSV(initialTrades)}
                        >
                            CSV
                        </Button>
                        <Button size="sm" onClick={openAdd}>+ Add</Button>
                    </div>
                </div>
                <TradeList trades={initialTrades} onEdit={openEdit} />
            </Card>

            <TradeModal
                open={modalOpen}
                onClose={closeModal}
                editing={editing}
            />

            <BrokerSyncSoonModal
                open={syncSoonOpen}
                onClose={() => setSyncSoonOpen(false)}
            />
        </div>
    );
}

// ============================================================
// Coming-soon preview modal — gives users a peek at what's planned
// instead of just showing a disabled button.
// ============================================================

interface BrokerSyncSoonModalProps {
    open: boolean;
    onClose: () => void;
}

function BrokerSyncSoonModal({ open, onClose }: BrokerSyncSoonModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (open && !dlg.open) dlg.showModal();
        if (!open && dlg.open) dlg.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm overflow-hidden"
        >
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-emerald-600/40 via-sky-700/20 to-transparent px-5 pt-6 pb-5 overflow-hidden">
                <div className="absolute -right-4 -top-4 text-[120px] leading-none opacity-10 select-none pointer-events-none">
                    🔌
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
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white px-2 py-1 rounded bg-[var(--color-accent)] mb-3">
                        Coming soon
                    </span>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight">
                        Broker &amp; prop firm sync
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                        Connect your trading account once. Trades flow into your journal automatically — no manual entry, no copy-paste.
                    </p>
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5 flex flex-col gap-4">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                        What it&apos;ll do
                    </h3>
                    <ul className="text-sm text-[var(--color-text)] space-y-1.5">
                        <Bullet>Auto-import every trade as it closes</Bullet>
                        <Bullet>Pull real entry/exit prices, contracts, commissions</Bullet>
                        <Bullet>Detect duplicates so you can re-sync safely</Bullet>
                        <Bullet>Live equity curve that updates with every fill</Bullet>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                        Planned integrations
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            "Topstep",
                            "Apex",
                            "MyFundedFutures",
                            "TradeStation",
                            "NinjaTrader",
                            "Tradovate",
                            "Rithmic",
                        ].map((name) => (
                            <span
                                key={name}
                                className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg p-3.5">
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                        <span className="font-semibold text-[var(--color-text)]">In the meantime:</span> log trades manually with <span className="font-semibold text-[var(--color-text)]">+ Add</span>, or import historical data with <span className="font-semibold text-[var(--color-text)]">CSV</span>.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[var(--color-border-soft)] flex justify-end">
                <Button variant="ghost" onClick={onClose}>Got it</Button>
            </div>
        </dialog>
    );
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
            <span>{children}</span>
        </li>
    );
}
