// /journal — Server Component fetches trades + tier + latest AI insight in parallel.
import { fetchTrades } from "@/features/journal/server";
import { getUserTier } from "@/features/billing/tier";
import { fetchLatestInsight } from "@/features/ai-insights/server";
import { JournalView } from "@/features/journal/journal-view";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
    const [trades, tierInfo, latestInsight] = await Promise.all([
        fetchTrades(),
        getUserTier(),
        fetchLatestInsight(),
    ]);
    return (
        <JournalView
            initialTrades={trades}
            isPaid={tierInfo.isPaid}
            latestInsight={latestInsight}
        />
    );
}
