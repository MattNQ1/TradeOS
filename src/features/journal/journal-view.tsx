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
import { CSVModal } from "./csv-modal";
import { calcJournalStats, todayISO } from "./trade-stats";
import type { Trade } from "./types";

interface JournalViewProps {
    initialTrades: Trade[];
}

export function JournalView({ initialTrades }: JournalViewProps) {
    const router = useRouter();
    const [tradeModalOpen, setTradeModalOpen] = useState(false);
    const [editing, setEditing] = useState<Trade | null>(null);
    const [csvOpen, setCsvOpen] = useState(false);
    const [syncSoonOpen, setSyncSoonOpen] = useState(false);

    const stats = useMemo(() => calcJournalStats(initialTrades, todayISO()), [initialTrades]);

    const openAdd = () => { setEditing(null); setTradeModalOpen(true); };
    const openEdit = (t: Trade) => { setEditing(t); setTradeModalOpen(true); };
    const closeTradeModal = () => {
        setTradeModalOpen(false);
        setEditing(null);
        router.refresh();
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Journal</h1>

            <JournalStatsCard stats={stats} />

            <PnLCalendar trades={initialTrades} />

            <Card>
                {/* Header — title on its own row, actions on the next row.
                    Cleaner than cramming title + 3 buttons across one row. */}
                <div className="flex items-center justify-between">
                    <CardTitle>Trades</CardTitle>
                    <Button size="sm" onClick={openAdd}>+ Add trade</Button>
                </div>
                <div className="flex items-center gap-1.5 -mt-1">
                    <ToolbarButton
                        label="Import/Export CSV"
                        icon={<UploadIcon />}
                        onClick={() => setCsvOpen(true)}
                    />
                    <ToolbarButton
                        label="Broker sync"
                        icon={<SyncIcon />}
                        badge="Soon"
                        onClick={() => setSyncSoonOpen(true)}
                    />
                </div>

                <TradeList trades={initialTrades} onEdit={openEdit} />
            </Card>

            <TradeModal open={tradeModalOpen} onClose={closeTradeModal} editing={editing} />
            <CSVModal open={csvOpen} onClose={() => setCsvOpen(false)} trades={initialTrades} />
            <BrokerSyncSoonModal open={syncSoonOpen} onClose={() => setSyncSoonOpen(false)} />
        </div>
    );
}

// ============================================================
// Toolbar button — small, ghost-styled, optional badge
// ============================================================

interface ToolbarButtonProps {
    label: string;
    icon: React.ReactNode;
    badge?: string;
    onClick: () => void;
}

function ToolbarButton({ label, icon, badge, onClick }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)] transition-colors"
        >
            <span className="opacity-70">{icon}</span>
            {label}
            {badge && (
                <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-[var(--color-accent)] text-white leading-none">
                    {badge}
                </span>
            )}
        </button>
    );
}

function UploadIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

function SyncIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
        </svg>
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
                            "Topstep", "Apex", "MyFundedFutures",
                            "TradeStation", "NinjaTrader", "Tradovate", "Rithmic",
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
                        <span className="font-semibold text-[var(--color-text)]">In the meantime:</span> log trades manually with <span className="font-semibold text-[var(--color-text)]">+ Add trade</span>, or bulk-load with <span className="font-semibold text-[var(--color-text)]">Import CSV</span>.
                    </p>
                </div>
            </div>

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
