// Add/edit trade modal. Uses native <dialog> for free focus management + ESC handling.
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { CONTRACTS, CONTRACT_SYMBOLS, type ContractSymbol } from "@/features/calculator/contracts";
import { fmtUSD, type Direction } from "@/features/calculator/calc";
import { tradePnL } from "./trade-stats";
import type { Trade, TradeInput } from "./types";
import { saveTrade, deleteTrade } from "./actions";

interface TradeModalProps {
    open: boolean;
    onClose: () => void;
    /** Trade being edited; null = new trade. */
    editing: Trade | null;
    /** Pre-fill defaults for new trades (e.g. today's date). */
    defaults?: Partial<TradeInput>;
}

interface FormState {
    date: string;
    contract: ContractSymbol;
    direction: Direction;
    contracts: number;
    entryPrice: number;
    exitPrice: number;
    plannedRisk: number;
    notes: string;
}

const EMPTY: FormState = {
    date: "",
    contract: "MES",
    direction: "long",
    contracts: 1,
    entryPrice: 0,
    exitPrice: 0,
    plannedRisk: 0,
    notes: "",
};

export function TradeModal({ open, onClose, editing, defaults }: TradeModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    // Sync open/close to native <dialog>.
    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (open && !dlg.open) dlg.showModal();
        if (!open && dlg.open) dlg.close();
    }, [open]);

    // Hydrate form when modal opens.
    useEffect(() => {
        if (!open) return;
        if (editing) {
            setForm({
                date: editing.date,
                contract: editing.contract,
                direction: editing.direction,
                contracts: editing.contracts,
                entryPrice: editing.entry_price,
                exitPrice: editing.exit_price,
                plannedRisk: editing.planned_risk ?? 0,
                notes: editing.notes ?? "",
            });
        } else {
            setForm({ ...EMPTY, ...{
                date: defaults?.date ?? todayLocalISO(),
                contract: (defaults?.contract as ContractSymbol) ?? "MES",
                direction: (defaults?.direction as Direction) ?? "long",
                contracts: defaults?.contracts ?? 1,
                entryPrice: defaults?.entry_price ?? 0,
                exitPrice: defaults?.exit_price ?? 0,
                plannedRisk: defaults?.planned_risk ?? 0,
                notes: defaults?.notes ?? "",
            }});
        }
        setError(null);
    }, [open, editing, defaults]);

    const num = (raw: string, min = 0) => {
        const n = parseFloat(raw);
        return Number.isFinite(n) ? Math.max(min, n) : 0;
    };

    // Live P&L preview
    const previewPnL = (() => {
        if (!form.entryPrice || !form.exitPrice) return null;
        return tradePnL({
            id: "", user_id: "",
            date: form.date, contract: form.contract, direction: form.direction,
            contracts: form.contracts, entry_price: form.entryPrice, exit_price: form.exitPrice,
            commission: 0, planned_risk: null, notes: null,
            created_at: "", updated_at: "",
        });
    })();

    const onSave = () => {
        setError(null);
        startTransition(async () => {
            const input: TradeInput = {
                id: editing?.id,
                date: form.date,
                contract: form.contract,
                direction: form.direction,
                contracts: form.contracts,
                entry_price: form.entryPrice,
                exit_price: form.exitPrice,
                commission: editing?.commission ?? 0,
                planned_risk: form.plannedRisk > 0 ? form.plannedRisk : null,
                notes: form.notes.trim() || null,
            };
            const res = await saveTrade(input);
            if (!res.ok) { setError(res.error ?? "Failed to save."); return; }
            onClose();
        });
    };

    const onDelete = () => {
        if (!editing) return;
        if (!confirm("Delete this trade?")) return;
        setError(null);
        startTransition(async () => {
            const res = await deleteTrade(editing.id);
            if (!res.ok) { setError(res.error ?? "Failed to delete."); return; }
            onClose();
        });
    };

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        >
            <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--color-border-soft)]">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {editing ? "Edit trade" : "Log trade"}
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)]"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
                <Input
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Contract</label>
                        <select
                            value={form.contract}
                            onChange={(e) => setForm({ ...form, contract: e.target.value as ContractSymbol })}
                            className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3 py-3 text-base focus:outline-none focus:border-[var(--color-accent)]"
                        >
                            {CONTRACT_SYMBOLS.map((s) => (
                                <option key={s} value={s}>{s} — {CONTRACTS[s].name}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Contracts"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={form.contracts || ""}
                        onChange={(e) => setForm({ ...form, contracts: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Direction</label>
                    <Segmented<Direction>
                        options={[
                            { value: "long",  label: "Long",  activeColor: "gain" },
                            { value: "short", label: "Short", activeColor: "loss" },
                        ]}
                        value={form.direction}
                        onChange={(v) => setForm({ ...form, direction: v })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Entry price"
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={form.entryPrice || ""}
                        onChange={(e) => setForm({ ...form, entryPrice: num(e.target.value) })}
                    />
                    <Input
                        label="Exit price"
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={form.exitPrice || ""}
                        onChange={(e) => setForm({ ...form, exitPrice: num(e.target.value) })}
                    />
                </div>

                <Input
                    label="Planned risk in $ (optional)"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={form.plannedRisk || ""}
                    onChange={(e) => setForm({ ...form, plannedRisk: num(e.target.value) })}
                    hint="Used to compute the R-multiple."
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Notes</label>
                    <textarea
                        rows={2}
                        placeholder="Setup, mistakes, lessons…"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] resize-y"
                    />
                </div>

                <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Calculated P&amp;L
                    </span>
                    <span className={`text-sm font-bold tabular-nums ${
                        previewPnL === null ? "" : previewPnL >= 0 ? "text-[var(--color-gain)]" : "text-[var(--color-loss)]"
                    }`}>
                        {previewPnL === null ? "—" : fmtUSD.format(previewPnL)}
                    </span>
                </div>

                {error && <p className="text-sm text-[var(--color-loss)]">{error}</p>}
            </div>

            <div className="px-4 py-3 border-t border-[var(--color-border-soft)] flex items-center justify-between gap-2">
                {editing ? (
                    <Button variant="danger" size="sm" onClick={onDelete} disabled={pending}>
                        Delete
                    </Button>
                ) : <span />}
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={pending}>Cancel</Button>
                    <Button onClick={onSave} disabled={pending}>
                        {pending ? "Saving…" : "Save"}
                    </Button>
                </div>
            </div>
        </dialog>
    );
}

function todayLocalISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
