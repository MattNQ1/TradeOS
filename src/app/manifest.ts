// Auto-served as /manifest.webmanifest by Next.js.
// This is what makes TradeOS installable as a PWA on iPhone / Android home
// screens — Safari and Chrome both read this file to render the "Add to
// Home Screen" prompt with the right icon, name, and theme color.
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "TradeOS — Built by traders, for traders",
        short_name: "TradeOS",
        description:
            "Position math, a journal that catches your patterns, and drawdown tracked to the dollar. Built for prop firm traders.",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#050505",
        theme_color: "#059669",
        orientation: "portrait",
        icons: [
            {
                src: "/icon",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/apple-icon",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
