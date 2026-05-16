// /settings — protected page. Fetches user info + trades + tier for the view.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTrades } from "@/features/journal/server";
import { getUserTier } from "@/features/billing/tier";
import { SettingsView } from "@/features/settings/settings-view";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

interface SettingsPageProps {
    searchParams: Promise<{ upgraded?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const [trades, tierInfo, sp] = await Promise.all([
        fetchTrades(),
        getUserTier(),
        searchParams,
    ]);

    return (
        <SettingsView
            email={user.email ?? "(no email)"}
            createdAt={user.created_at ?? new Date().toISOString()}
            emailConfirmed={Boolean(user.email_confirmed_at)}
            trades={trades}
            tierInfo={tierInfo}
            upgradedPlan={sp.upgraded}
        />
    );
}
