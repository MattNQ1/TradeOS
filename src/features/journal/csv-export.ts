// Browser-only CSV export. Builds a CSV string and downloads via Blob.
import type { Trade } from "./types";
import { tradePnL, tradeRMultiple, todayISO } from "./trade-stats";

const HEADER = [
    "date", "contract", "direction", "contracts",
    "entry_price", "exit_price", "commission_per_side",
    "planned_risk", "pnl", "r_multiple", "notes",
];

function escapeCsv(v: string | number | null | undefined): string {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
}

export function exportTradesToCSV(trades: Trade[]): void {
    const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
    const rows = sorted.map((t) => {
        const pnl = tradePnL(t);
        const r = tradeRMultiple(t);
        return [
            t.date,
            t.contract,
            t.direction,
            t.contracts,
            t.entry_price,
            t.exit_price,
            t.commission ?? 0,
            t.planned_risk ?? "",
            pnl.toFixed(2),
            r === null ? "" : r.toFixed(4),
            t.notes ?? "",
        ].map(escapeCsv).join(",");
    });

    const csv = [HEADER.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradeos-trades-${todayISO()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
