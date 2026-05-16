// Root layout — wraps every page in the app.
// Sets up <html> with dark theme, viewport meta, global CSS, and the help widget.
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HelpWidget } from "@/components/help/help-widget";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://usetradeos.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "TradeOS — Built by traders, for traders",
        template: "%s · TradeOS",
    },
    description:
        "Position math, a journal that catches your patterns, and drawdown tracked to the dollar. Built for prop firm traders on Topstep, Apex, MFF, and FTMO.",
    applicationName: "TradeOS",
    keywords: [
        "prop firm",
        "futures trading",
        "Topstep",
        "Apex",
        "MyFundedFutures",
        "FTMO",
        "trade journal",
        "position size calculator",
        "drawdown tracker",
    ],
    openGraph: {
        title: "TradeOS — Built by traders, for traders",
        description:
            "Position math, a journal that catches your patterns, and drawdown tracked to the dollar. Built for prop firm traders.",
        url: SITE_URL,
        siteName: "TradeOS",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "TradeOS — Built by traders, for traders",
        description:
            "Position math, a journal that catches your patterns, and drawdown tracked to the dollar. Built for prop firm traders.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    themeColor: "#059669",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
                <HelpWidget />
            </body>
        </html>
    );
}
