// /prop-firm — Server Component fetches both the user's prop config AND their
// trade history (for the trackers). Both queries run in parallel.
import { fetchPropFirmConfig } from "@/features/prop-firm/server";
import { fetchTrades } from "@/features/journal/server";
import { PropFirmView } from "@/features/prop-firm/prop-firm-view";

export const dynamic = "force-dynamic";

export default async function PropFirmPage() {
    const [config, trades] = await Promise.all([
        fetchPropFirmConfig(),
        fetchTrades(),
    ]);
    return <PropFirmView initialConfig={config} trades={trades} />;
}
