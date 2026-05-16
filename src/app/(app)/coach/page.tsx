// /coach — the Pro feature home: AI journal insights + pre-trade checklist.
//
// Route stays at /coach (middleware, revalidate paths point here), but the
// user-facing tab label is "AI" with a brain icon. The narrative is "Pro
// gives you the AI tab" — the checklist is a supporting feature on this page.
import { getUserTier } from "@/features/billing/tier";
import { fetchChecklistItems } from "@/features/checklist/server";
import { fetchLatestInsight } from "@/features/ai-insights/server";
import { fetchTrades } from "@/features/journal/server";
import { ChecklistCard } from "@/features/checklist/checklist-card";
import { InsightsSection } from "@/features/ai-insights/insights-section";

export const metadata = { title: "AI" };
export const dynamic = "force-dynamic";

export default async function CoachPage() {
    const [tier, items, insight, trades] = await Promise.all([
        getUserTier(),
        fetchChecklistItems(),
        fetchLatestInsight(),
        fetchTrades(),
    ]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        AI
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Find your patterns. Run the checklist. Don&rsquo;t tilt.
                    </p>
                </div>
                {!tier.isPaid && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[var(--color-accent)] text-white whitespace-nowrap mt-1">
                        Pro
                    </span>
                )}
            </div>

            {/* AI insights — hero feature (analysis users come back for) */}
            <InsightsSection
                isPaid={tier.isPaid}
                latestInsight={insight}
                tradesCount={trades.length}
            />

            {/* Pre-trade checklist — daily discipline ritual */}
            <ChecklistCard items={items} isPaid={tier.isPaid} />
        </div>
    );
}
