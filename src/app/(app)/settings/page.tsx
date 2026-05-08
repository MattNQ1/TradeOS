// /settings — protected page. Fetches user info + trades for export.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchTrades } from "@/features/journal/server";
import { SettingsView } from "@/features/settings/settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const trades = await fetchTrades();

    return (
        <SettingsView
            email={user.email ?? "(no email)"}
            createdAt={user.created_at ?? new Date().toISOString()}
            emailConfirmed={Boolean(user.email_confirmed_at)}
            trades={trades}
        />
    );
}
