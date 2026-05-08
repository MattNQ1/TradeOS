// CSV parser + trade validator. Handles quoted fields, escaped quotes,
// CRLF line endings. Output matches our TradeInput shape so the bulk-import
// Server Action can save the rows directly.
import { CONTRACTS, type ContractSymbol } from "@/features/calculator/contracts";
import type { Direction } from "@/features/calculator/calc";
import type { TradeInput } from "./types";

// ============================================================
// Tiny RFC-ish CSV parser
// ============================================================

function parseCSV(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;

    // Normalize line endings.
    const t = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    for (let i = 0; i < t.length; i++) {
        const c = t[i];
        if (inQuotes) {
            if (c === '"') {
                if (t[i + 1] === '"') { field += '"'; i++; }
                else { inQuotes = false; }
            } else {
                field += c;
            }
        } else {
            if (c === '"' && field === "") {
                inQuotes = true;
            } else if (c === ",") {
                row.push(field); field = "";
            } else if (c === "\n") {
                row.push(field);
                rows.push(row);
                row = []; field = "";
            } else {
                field += c;
            }
        }
    }
    if (field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
    }
    return rows;
}

// ============================================================
// Trade-shaped parser
// ============================================================

const REQUIRED_COLS = ["date", "contract", "direction", "contracts", "entry_price", "exit_price"];

export interface ParseResult {
    /** Successfully validated rows, ready to save. */
    rows: TradeInput[];
    /** Per-row errors. The CSV may still be partially valid. */
    rowErrors: string[];
    /** Fatal errors that block the entire import. */
    fatal: string[];
}

export function parseCSVTrades(content: string): ParseResult {
    const trimmed = content.trim();
    if (!trimmed) return { rows: [], rowErrors: [], fatal: ["File is empty."] };

    const all = parseCSV(trimmed).filter((r) => r.some((c) => c.trim() !== ""));
    if (all.length < 2) {
        return { rows: [], rowErrors: [], fatal: ["CSV needs a header row and at least one data row."] };
    }

    const header = all[0].map((h) => h.trim().toLowerCase());
    const missing = REQUIRED_COLS.filter((col) => !header.includes(col));
    if (missing.length > 0) {
        return {
            rows: [],
            rowErrors: [],
            fatal: [
                `Missing required columns: ${missing.join(", ")}.`,
                `Required columns are: ${REQUIRED_COLS.join(", ")}.`,
            ],
        };
    }

    const idx = (col: string) => header.indexOf(col);
    const dateIdx = idx("date");
    const contractIdx = idx("contract");
    const directionIdx = idx("direction");
    const contractsIdx = idx("contracts");
    const entryIdx = idx("entry_price");
    const exitIdx = idx("exit_price");
    const commissionIdx = idx("commission_per_side"); // may be -1
    const plannedRiskIdx = idx("planned_risk");        // may be -1
    const notesIdx = idx("notes");                      // may be -1

    const rows: TradeInput[] = [];
    const rowErrors: string[] = [];

    for (let i = 1; i < all.length; i++) {
        const r = all[i];
        const rowNum = i + 1;

        const date = (r[dateIdx] ?? "").trim();
        const contractRaw = (r[contractIdx] ?? "").trim().toUpperCase();
        const directionRaw = (r[directionIdx] ?? "").trim().toLowerCase();
        const contractsNum = parseInt((r[contractsIdx] ?? "").trim(), 10);
        const entryPrice = parseFloat((r[entryIdx] ?? "").trim());
        const exitPrice = parseFloat((r[exitIdx] ?? "").trim());

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            rowErrors.push(`Row ${rowNum}: invalid date "${date || "(blank)"}" — use YYYY-MM-DD.`);
            continue;
        }
        if (!(contractRaw in CONTRACTS)) {
            rowErrors.push(`Row ${rowNum}: unknown contract "${contractRaw}". Supported: ${Object.keys(CONTRACTS).join(", ")}.`);
            continue;
        }
        if (directionRaw !== "long" && directionRaw !== "short") {
            rowErrors.push(`Row ${rowNum}: direction "${directionRaw}" must be "long" or "short".`);
            continue;
        }
        if (!Number.isFinite(contractsNum) || contractsNum < 1) {
            rowErrors.push(`Row ${rowNum}: contracts must be a positive integer.`);
            continue;
        }
        if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice)) {
            rowErrors.push(`Row ${rowNum}: entry_price and exit_price must be numbers.`);
            continue;
        }

        const commission = commissionIdx >= 0
            ? Math.max(0, parseFloat((r[commissionIdx] ?? "").trim()) || 0)
            : 0;
        const plannedRiskRaw = plannedRiskIdx >= 0 ? (r[plannedRiskIdx] ?? "").trim() : "";
        const plannedRisk = plannedRiskRaw === "" ? null : (parseFloat(plannedRiskRaw) || null);
        const notes = notesIdx >= 0 ? ((r[notesIdx] ?? "").trim() || null) : null;

        rows.push({
            date,
            contract: contractRaw as ContractSymbol,
            direction: directionRaw as Direction,
            contracts: contractsNum,
            entry_price: entryPrice,
            exit_price: exitPrice,
            commission,
            planned_risk: plannedRisk,
            notes,
        });
    }

    return { rows, rowErrors, fatal: [] };
}
