// /journal — Server Component fetches the user's trades, then hands them to
// the Client Component which renders + handles all interaction.
import { fetchTrades } from "@/features/journal/server";
import { JournalView } from "@/features/journal/journal-view";

// Always render fresh — the Server Action revalidates this path on writes anyway,
// but during dev we never want stale data.
export const dynamic = "force-dynamic";

export default async function JournalPage() {
    const trades = await fetchTrades();
    return <JournalView initialTrades={trades} />;
}
