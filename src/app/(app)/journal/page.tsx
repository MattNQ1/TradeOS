// /journal — Server Component fetches trades + tier.
// (AI insights moved to /coach.)
import { fetchTrades } from "@/features/journal/server";
import { getUserTier } from "@/features/billing/tier";
import { JournalView } from "@/features/journal/journal-view";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
    const [trades, tierInfo] = await Promise.all([
        fetchTrades(),
        getUserTier(),
    ]);
    return <JournalView initialTrades={trades} isPaid={tierInfo.isPaid} />;
}
