// CSV import modal. Same hero treatment as the broker-sync modal so the
// journal has a consistent look. Inside: file picker → live validation
// preview → confirm import. Export option lives at the bottom as a
// secondary action.
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { parseCSVTrades, type ParseResult } from "./csv-import";
import { bulkImportTrades } from "./actions";
import { exportTradesToCSV } from "./csv-export";
import type { Trade } from "./types";

interface CSVModalProps {
    open: boolean;
    onClose: () => void;
    /** Used by the export action — current trades in the journal. */
    trades: Trade[];
}

type ImportStage = "idle" | "parsed" | "saving" | "done" | "error";

export function CSVModal({ open, onClose, trades }: CSVModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [parseResult, setParseResult] = useState<ParseResult | null>(null);
    const [stage, setStage] = useState<ImportStage>("idle");
    const [serverError, setServerError] = useState<string | null>(null);
    const [importedCount, setImportedCount] = useState(0);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (open && !dlg.open) dlg.showModal();
        if (!open && dlg.open) dlg.close();
    }, [open]);

    // Reset state when modal opens fresh.
    useEffect(() => {
        if (open) {
            setParseResult(null);
            setStage("idle");
            setServerError(null);
            setImportedCount(0);
        }
    }, [open]);

    const onFile = async (file: File) => {
        setServerError(null);
        const text = await file.text();
        const result = parseCSVTrades(text);
        setParseResult(result);
        setStage(result.fatal.length > 0 ? "error" : "parsed");
    };

    const onConfirmImport = () => {
        if (!parseResult || parseResult.rows.length === 0) return;
        setStage("saving");
        startTransition(async () => {
            const res = await bulkImportTrades(parseResult.rows);
            if (!res.ok) {
                setServerError(res.error ?? "Import failed.");
                setStage("error");
                return;
            }
            setImportedCount(res.imported);
            setStage("done");
            router.refresh();
        });
    };

    const onPickFile = () => fileInputRef.current?.click();

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="bg-[var(--color-bg-elev)] text-[var(--color-text)] rounded-2xl p-0 w-full max-w-md backdrop:bg-black/60 backdrop:backdrop-blur-sm overflow-hidden"
        >
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-violet-600/40 via-indigo-700/20 to-transparent px-5 pt-6 pb-5 overflow-hidden">
                <div className="absolute -right-4 -top-4 text-[120px] leading-none opacity-10 select-none pointer-events-none">
                    📥
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
                        Bulk import
                    </span>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight">
                        Import trades from CSV
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                        Bring in trades from a spreadsheet, your broker&apos;s export, or a backup. Your existing trades won&apos;t be touched.
                    </p>
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5 max-h-[55vh] overflow-y-auto flex flex-col gap-4">
                {stage === "idle" && (
                    <IdleStage onPickFile={onPickFile} fileInputRef={fileInputRef} onFile={onFile} />
                )}

                {stage === "parsed" && parseResult && (
                    <ParsedStage
                        result={parseResult}
                        onPickFile={onPickFile}
                        fileInputRef={fileInputRef}
                        onFile={onFile}
                    />
                )}

                {stage === "saving" && <SavingStage />}

                {stage === "done" && <DoneStage count={importedCount} />}

                {stage === "error" && (
                    <ErrorStage
                        result={parseResult}
                        serverError={serverError}
                        onPickFile={onPickFile}
                        fileInputRef={fileInputRef}
                        onFile={onFile}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[var(--color-border-soft)] flex items-center justify-between gap-2">
                {/* Secondary: export */}
                <button
                    type="button"
                    onClick={() => exportTradesToCSV(trades)}
                    disabled={trades.length === 0}
                    className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    ↓ Export current trades
                </button>

                <div className="flex gap-2">
                    {stage === "parsed" && parseResult && parseResult.rows.length > 0 ? (
                        <>
                            <Button variant="ghost" onClick={onClose} disabled={pending}>Cancel</Button>
                            <Button onClick={onConfirmImport} disabled={pending}>
                                Import {parseResult.rows.length} {parseResult.rows.length === 1 ? "trade" : "trades"}
                            </Button>
                        </>
                    ) : (
                        <Button variant="ghost" onClick={onClose}>
                            {stage === "done" ? "Done" : "Close"}
                        </Button>
                    )}
                </div>
            </div>
        </dialog>
    );
}

// ============================================================
// Stages
// ============================================================

interface FilePickerProps {
    onPickFile: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFile: (f: File) => void;
}

function FilePickerArea({ onPickFile, fileInputRef, onFile }: FilePickerProps) {
    return (
        <div
            onClick={onPickFile}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) onFile(file);
            }}
            className="border-2 border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-elev-2)] transition-colors"
        >
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Drop a CSV here, or tap to choose</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">.csv files only</p>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFile(file);
                    // Allow re-selecting the same file later.
                    e.target.value = "";
                }}
            />
        </div>
    );
}

function IdleStage({ onPickFile, fileInputRef, onFile }: FilePickerProps) {
    return (
        <FilePickerArea onPickFile={onPickFile} fileInputRef={fileInputRef} onFile={onFile} />
    );
}

function ParsedStage({
    result, onPickFile, fileInputRef, onFile,
}: { result: ParseResult } & FilePickerProps) {
    const valid = result.rows.length;
    const skipped = result.rowErrors.length;
    return (
        <>
            <div className="bg-[color-mix(in_oklab,var(--color-gain)_8%,transparent)] border border-[color-mix(in_oklab,var(--color-gain)_30%,transparent)] rounded-lg p-3.5">
                <p className="text-sm">
                    <span className="font-bold text-[var(--color-gain)]">{valid}</span> valid trade{valid === 1 ? "" : "s"} ready to import
                    {skipped > 0 && <> · <span className="font-bold text-[var(--color-warn)]">{skipped}</span> skipped</>}
                </p>
            </div>

            {result.rowErrors.length > 0 && (
                <details className="bg-[var(--color-bg-elev-2)] border border-[var(--color-border)] rounded-lg">
                    <summary className="cursor-pointer px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        {result.rowErrors.length} validation issue{result.rowErrors.length === 1 ? "" : "s"}
                    </summary>
                    <ul className="px-3.5 py-2 text-xs text-[var(--color-text-muted)] space-y-1 max-h-40 overflow-y-auto">
                        {result.rowErrors.map((e, i) => <li key={i}>• {e}</li>)}
                    </ul>
                </details>
            )}

            <button
                type="button"
                onClick={onPickFile}
                className="text-xs font-semibold text-[var(--color-accent)] hover:underline self-start"
            >
                Choose a different file
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFile(file);
                    e.target.value = "";
                }}
            />
        </>
    );
}

function SavingStage() {
    return (
        <div className="text-center py-6">
            <div className="text-3xl mb-2 animate-pulse">📥</div>
            <p className="text-sm text-[var(--color-text-muted)]">Saving trades to your journal…</p>
        </div>
    );
}

function DoneStage({ count }: { count: number }) {
    return (
        <div className="text-center py-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-base font-bold text-[var(--color-gain)]">
                Imported {count} trade{count === 1 ? "" : "s"}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Your journal, calendar, and analytics now reflect these trades.
            </p>
        </div>
    );
}

function ErrorStage({
    result, serverError, onPickFile, fileInputRef, onFile,
}: { result: ParseResult | null; serverError: string | null } & FilePickerProps) {
    return (
        <>
            <div className="bg-[color-mix(in_oklab,var(--color-loss)_8%,transparent)] border border-[color-mix(in_oklab,var(--color-loss)_30%,transparent)] rounded-lg p-3.5">
                <p className="text-sm font-semibold text-[var(--color-loss)] mb-1">
                    Couldn&apos;t import this file
                </p>
                {serverError && <p className="text-xs text-[var(--color-text-muted)]">{serverError}</p>}
                {result?.fatal.map((msg, i) => (
                    <p key={i} className="text-xs text-[var(--color-text-muted)] mt-1">{msg}</p>
                ))}
            </div>

            <FilePickerArea onPickFile={onPickFile} fileInputRef={fileInputRef} onFile={onFile} />
        </>
    );
}
