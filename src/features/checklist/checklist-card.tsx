// Pre-trade checklist card. Sits on the Calculator page right above
// position sizing — the moment before "click buy" is the highest-value
// place to enforce discipline.
//
// Pro-gated. Free users see the value proposition + upgrade CTA.
// Pro users with no items get a one-tap "Use suggested defaults" seeder.
// Pro users with items get interactive checkboxes with inline add/edit/delete.
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradePrompt } from "@/features/billing/upgrade-prompt";
import {
    addChecklistItem,
    deleteChecklistItem,
    seedDefaultChecklist,
    updateChecklistItem,
} from "./actions";
import type { ChecklistItem } from "./types";

interface ChecklistCardProps {
    items: ChecklistItem[];
    isPaid: boolean;
}

export function ChecklistCard({ items, isPaid }: ChecklistCardProps) {
    // Per-session check state — resets on reload (deliberate; you should
    // re-check before every trade).
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [newItemText, setNewItemText] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const allChecked = items.length > 0 && items.every((it) => checked.has(it.id));
    const checkedCount = items.filter((it) => checked.has(it.id)).length;

    const toggle = (id: string) => {
        const next = new Set(checked);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setChecked(next);
    };

    const resetChecks = () => setChecked(new Set());

    const onAddItem = () => {
        const text = newItemText.trim();
        if (!text) return;
        setError(null);
        startTransition(async () => {
            const res = await addChecklistItem(text);
            if (!res.ok) {
                setError(res.error ?? "Failed to add.");
                return;
            }
            setNewItemText("");
            router.refresh();
        });
    };

    const onSaveEdit = (id: string) => {
        const text = editText.trim();
        if (!text) return;
        setError(null);
        startTransition(async () => {
            const res = await updateChecklistItem(id, text);
            if (!res.ok) {
                setError(res.error ?? "Failed to update.");
                return;
            }
            setEditingId(null);
            setEditText("");
            router.refresh();
        });
    };

    const onDelete = (id: string) => {
        setError(null);
        // Remove from check state too.
        const nextChecked = new Set(checked);
        nextChecked.delete(id);
        setChecked(nextChecked);
        startTransition(async () => {
            const res = await deleteChecklistItem(id);
            if (!res.ok) {
                setError(res.error ?? "Failed to delete.");
                return;
            }
            router.refresh();
        });
    };

    const onSeed = () => {
        setError(null);
        startTransition(async () => {
            const res = await seedDefaultChecklist();
            if (!res.ok) {
                setError(res.error ?? "Failed to seed defaults.");
                return;
            }
            router.refresh();
        });
    };

    // ---- Free tier: show the value pitch ----
    if (!isPaid) {
        return (
            <Card>
                <div className="flex items-center justify-between">
                    <CardTitle>Pre-trade checklist</CardTitle>
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)] text-white">
                        Pro
                    </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                    Lock in your rules. Tap through your own checklist before every click — the 5-second pause between FOMO and buy that saves accounts.
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                    {[
                        "Custom checklist tailored to your strategy",
                        "Visual 'safe to trade' confirmation when all checks pass",
                        "Resets between trades so discipline stays sharp",
                    ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--color-accent)] font-bold leading-tight pt-0.5">✓</span>
                            <span className="text-[var(--color-text)]">{f}</span>
                        </div>
                    ))}
                </div>
                <Link href="/settings">
                    <Button className="w-full mt-2">Upgrade to Pro</Button>
                </Link>
            </Card>
        );
    }

    // ---- Pro tier, empty state ----
    if (items.length === 0) {
        return (
            <Card>
                <CardTitle>Pre-trade checklist</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                    Lock in your rules. Tap through this list before every trade — the 5-second pause that saves accounts.
                </p>

                <Button variant="secondary" className="w-full" onClick={onSeed} disabled={pending}>
                    {pending ? "Setting up…" : "Use 6 recommended defaults"}
                </Button>

                <div className="flex flex-col gap-2">
                    <p className="text-xs text-[var(--color-text-muted)] text-center">— or add your own —</p>
                    <ItemInput
                        value={newItemText}
                        onChange={setNewItemText}
                        onSubmit={onAddItem}
                        placeholder="Risk less than 1% of account"
                        disabled={pending}
                    />
                </div>
                {error && <p className="text-xs text-[var(--color-loss)]">{error}</p>}
            </Card>
        );
    }

    // ---- Pro tier, populated ----
    return (
        <Card>
            <div className="flex items-center justify-between">
                <CardTitle>Pre-trade checklist</CardTitle>
                <span className="text-xs tabular-nums text-[var(--color-text-muted)]">
                    {checkedCount}/{items.length}
                </span>
            </div>

            <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                    <li key={item.id}>
                        {editingId === item.id ? (
                            <div className="flex gap-1.5">
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") onSaveEdit(item.id);
                                        if (e.key === "Escape") { setEditingId(null); setEditText(""); }
                                    }}
                                    autoFocus
                                    className="flex-1 bg-[var(--color-bg-elev-2)] border border-[var(--color-accent)] rounded-md px-2.5 py-1.5 text-sm focus:outline-none"
                                />
                                <Button size="sm" onClick={() => onSaveEdit(item.id)} disabled={pending}>Save</Button>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditText(""); }}>×</Button>
                            </div>
                        ) : (
                            <label className="group flex items-start gap-2.5 cursor-pointer select-none px-2 py-2 rounded-md hover:bg-[var(--color-bg-elev-2)] transition-colors">
                                <input
                                    type="checkbox"
                                    checked={checked.has(item.id)}
                                    onChange={() => toggle(item.id)}
                                    className="mt-0.5 w-4 h-4 accent-[var(--color-accent)] flex-shrink-0"
                                />
                                <span className={`flex-1 text-sm leading-snug ${checked.has(item.id) ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
                                    {item.text}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setEditingId(item.id); setEditText(item.text); }}
                                    className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs px-1 transition-opacity"
                                    aria-label="Edit"
                                >
                                    edit
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); onDelete(item.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-loss)] text-xs px-1 transition-opacity"
                                    aria-label="Delete"
                                >
                                    ×
                                </button>
                            </label>
                        )}
                    </li>
                ))}
            </ul>

            {/* Status banner */}
            {allChecked ? (
                <div className="bg-[color-mix(in_oklab,var(--color-gain)_15%,transparent)] border border-[color-mix(in_oklab,var(--color-gain)_30%,transparent)] rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--color-gain)]">
                        ✓ Safe to trade — every check passed
                    </p>
                    <Button variant="ghost" size="sm" onClick={resetChecks}>Reset</Button>
                </div>
            ) : checkedCount > 0 ? (
                <div className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {items.length - checkedCount} {items.length - checkedCount === 1 ? "check" : "checks"} remaining
                    </p>
                    <Button variant="ghost" size="sm" onClick={resetChecks}>Reset</Button>
                </div>
            ) : null}

            {/* Inline add */}
            <details className="mt-1">
                <summary className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] cursor-pointer list-none flex items-center gap-1 hover:text-[var(--color-text)]">
                    <span>+ Add item</span>
                </summary>
                <div className="mt-2">
                    <ItemInput
                        value={newItemText}
                        onChange={setNewItemText}
                        onSubmit={onAddItem}
                        placeholder="e.g. Volume confirms trend"
                        disabled={pending}
                    />
                </div>
            </details>

            {error && <p className="text-xs text-[var(--color-loss)]">{error}</p>}
        </Card>
    );
}

interface ItemInputProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    placeholder: string;
    disabled?: boolean;
}

function ItemInput({ value, onChange, onSubmit, placeholder, disabled }: ItemInputProps) {
    return (
        <div className="flex gap-1.5">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={200}
                className="flex-1 bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            />
            <Button size="sm" onClick={onSubmit} disabled={disabled || !value.trim()}>
                Add
            </Button>
        </div>
    );
}
