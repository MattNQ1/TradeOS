// Top-level Client Component for /journal.
// Receives initial trades from the Server Component page; orchestrates the rest.
"use client";

import { useMemo, useState } from "react";
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
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={initialTrades.length === 0}
                            onClick={() => exportTradesToCSV(initialTrades)}
                        >
                            Export CSV
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
        </div>
    );
}
