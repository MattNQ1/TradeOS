// /economic-calendar — Server Component fetches the FF feed (cached 1h) then
// hands the data to a Client Component for filtering + display.
import { fetchEconomicEvents } from "@/features/economic-calendar/server";
import { CalendarView } from "@/features/economic-calendar/calendar-view";

// We rely on `next: { revalidate: 3600 }` inside fetchEconomicEvents to cache,
// so the page itself can be statically optimized. But because we're behind auth,
// we keep it dynamic so each user request goes through middleware.
export const dynamic = "force-dynamic";

export default async function EconomicCalendarPage() {
    const { events, error } = await fetchEconomicEvents();
    return <CalendarView events={events} error={error} />;
}
