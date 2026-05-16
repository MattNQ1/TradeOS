// Data card — export all + delete account.
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportTradesToCSV } from "@/features/journal/csv-export";
import { deleteAccount } from "./actions";
import type { Trade } from "@/features/journal/types";

interface DataSectionProps {
    trades: Trade[];
}

export function DataSection({ trades }: DataSectionProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <Card>
                <CardTitle>Your data</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                    Your trades live in our database, scoped to your account only. Export them as CSV any time.
                </p>

                <Button
                    variant="secondary"
                    onClick={() => exportTradesToCSV(trades)}
                    disabled={trades.length === 0}
                >
                    ↓ Export {trades.length} {trades.length === 1 ? "trade" : "trades"} as CSV
                </Button>
            </Card>

            <Card>
                <CardTitle>Danger zone</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                    Deleting your account permanently removes your trades, prop firm config, and login. <span className="font-semibold text-[var(--color-text)]">This cannot be undone.</span>
                </p>

                <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                    Delete account
                </Button>
            </Card>

            <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
        </>
    );
}

// ============================================================
// Delete account confirmation modal — typed-confirmation pattern
// ============================================================

interface DeleteAccountModalProps {
    open: boolean;
    onClose: () => void;
}

function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();
    const [confirmText, setConfirmText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (open && !dlg.open) dlg.showModal();
        if (!open && dlg.open) dlg.close();
    }, [open]);

    useEffect(() => {
        if (open) {
            setConfirmText("");
            setError(null);
        }
    }, [open]);

    const onConfirm = () => {
        setError(null);
        startTransition(async () => {
            const res = await deleteAccount();
            if (!res.ok) {
                setError(res.error ?? "Failed to delete account.");
                return;
            }
            // Hard reload to /login — clears all client state.
            router.push("/login");
            router.refresh();
        });
    };

    const isMatch = confirmText.trim().toUpperCase() === "DELETE";

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm overflow-hidden"
        >
            <div className="relative bg-gradient-to-br from-rose-600/40 via-red-700/20 to-transparent px-5 pt-6 pb-5 overflow-hidden">
                <div className="absolute -right-4 -top-4 text-[120px] leading-none opacity-10 select-none pointer-events-none">
                    ⚠️
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
                    <h2 className="text-2xl font-bold leading-tight tracking-tight">
                        Delete your account?
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                        This permanently removes:
                    </p>
                </div>
            </div>

            <div className="px-5 py-5 flex flex-col gap-4">
                <ul className="space-y-1.5">
                    <Item>All your trades + journal history</Item>
                    <Item>Your prop firm configuration</Item>
                    <Item>Your account &amp; login</Item>
                </ul>

                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
                        Type <span className="text-[var(--color-loss)] font-bold">DELETE</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        autoComplete="off"
                        autoCapitalize="characters"
                        placeholder="DELETE"
                        className="w-full bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-base text-[var(--color-text)] focus:outline-none focus:border-[var(--color-loss)]"
                    />
                </div>

                {error && (
                    <p className="text-sm text-[var(--color-loss)]">{error}</p>
                )}
            </div>

            <div className="px-5 py-4 border-t border-[var(--color-border-soft)] flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} disabled={pending}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={!isMatch || pending}>
                    {pending ? "Deleting…" : "Permanently delete"}
                </Button>
            </div>
        </dialog>
    );
}

function Item({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span className="text-[var(--color-loss)] font-bold leading-tight pt-0.5">✕</span>
            <span>{children}</span>
        </li>
    );
}
