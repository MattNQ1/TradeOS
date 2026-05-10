// /prop-firm — Server Component fetches the user's prop config, trade history,
// AND tier (custom rules are Pro-only). All in parallel.
import { fetchPropFirmConfig } from "@/features/prop-firm/server";
import { fetchTrades } from "@/features/journal/server";
import { getUserTier } from "@/features/billing/tier";
import { PropFirmView } from "@/features/prop-firm/prop-firm-view";

export const dynamic = "force-dynamic";

export default async function PropFirmPage() {
    const [config, trades, tierInfo] = await Promise.all([
        fetchPropFirmConfig(),
        fetchTrades(),
        getUserTier(),
    ]);
    return <PropFirmView initialConfig={config} trades={trades} isPaid={tierInfo.isPaid} />;
}
