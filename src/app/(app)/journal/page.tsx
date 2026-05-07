// Placeholder. We'll port the journal + calendar in Phase 3 (with Supabase persistence).
import { Card, CardTitle } from "@/components/ui/card";

export default function JournalPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Journal</h1>
            <Card>
                <CardTitle>Coming in Phase 3</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Trades, stats, and the P&amp;L calendar will live here — synced to Supabase so they&apos;re available across all your devices.
                </p>
            </Card>
        </div>
    );
}
