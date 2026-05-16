// /dashboard — the trader's home. Fetches trades + user, hands to analytics view.
import { createClient } from "@/lib/supabase/server";
import { fetchTrades } from "@/features/journal/server";
import { AnalyticsView } from "@/features/analytics/analytics-view";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const [supabase, trades] = await Promise.all([
        createClient(),
        fetchTrades(),
    ]);
    const { data: { user } } = await supabase.auth.getUser();

    return <AnalyticsView trades={trades} userEmail={user?.email ?? "you"} />;
}
