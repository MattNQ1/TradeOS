// /economic-calendar — Server Component fetches the FF feed (cached 1h) +
// the user's tier in parallel, then hands the data to a Client Component.
import { fetchEconomicEvents } from "@/features/economic-calendar/server";
import { CalendarView } from "@/features/economic-calendar/calendar-view";
import { getUserTier } from "@/features/billing/tier";

export const metadata = { title: "Economic calendar" };
export const dynamic = "force-dynamic";

export default async function EconomicCalendarPage() {
    const [{ events, error }, tierInfo] = await Promise.all([
        fetchEconomicEvents(),
        getUserTier(),
    ]);
    return <CalendarView events={events} error={error} isPaid={tierInfo.isPaid} />;
}
