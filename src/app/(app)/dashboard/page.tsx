// Protected /dashboard page. The middleware + layout both ensure the user is signed in.
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Signed in as <span className="text-[var(--color-text)]">{user?.email}</span>
                </p>
            </div>

            <Card>
                <CardTitle>Today</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Your daily P&amp;L, win rate, and prop firm status will appear here once we wire up the journal.
                </p>
            </Card>

            <Card>
                <CardTitle>Coming next</CardTitle>
                <ul className="text-sm text-[var(--color-text-muted)] space-y-1.5 list-disc pl-5">
                    <li>Port the futures calculator</li>
                    <li>Sync trade journal to Supabase</li>
                    <li>Economic calendar</li>
                    <li>AI news explanations</li>
                    <li>Trade analytics</li>
                </ul>
            </Card>
        </div>
    );
}
