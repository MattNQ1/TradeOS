// Top-level Client orchestrator for /settings.
// Sections are independent so each can manage its own form/modal state.
"use client";

import { AccountSection } from "./account-section";
import { SecuritySection } from "./security-section";
import { SubscriptionSection } from "./subscription-section";
import { DataSection } from "./data-section";
import type { Trade } from "@/features/journal/types";

interface SettingsViewProps {
    email: string;
    createdAt: string;
    emailConfirmed: boolean;
    trades: Trade[];
}

export function SettingsView({ email, createdAt, emailConfirmed, trades }: SettingsViewProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Settings</h1>

            <AccountSection email={email} createdAt={createdAt} emailConfirmed={emailConfirmed} />

            <SecuritySection />

            <SubscriptionSection />

            <DataSection trades={trades} />

            <footer className="text-center text-xs text-[var(--color-text-subtle)] pt-2 pb-4 space-y-1">
                <p>
                    <a href="/privacy" className="hover:text-[var(--color-text-muted)]">Privacy</a>
                    <span className="mx-1.5">·</span>
                    <a href="/terms" className="hover:text-[var(--color-text-muted)]">Terms</a>
                </p>
                <p>TradeOS · v0.1.0</p>
                <p>Not financial advice. Verify all calculations against your broker.</p>
            </footer>
        </div>
    );
}
