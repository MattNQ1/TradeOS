// Root layout — wraps every page in the app.
// Sets up <html> with dark theme, viewport meta, global CSS, and the help widget.
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HelpWidget } from "@/components/help/help-widget";

export const metadata: Metadata = {
    title: "TradeOS — The trading toolkit for prop firm traders",
    description: "Position sizing, trade journal, drawdown tracking, and analytics — purpose-built for Topstep, Apex, MyFundedFutures, and FTMO accounts.",
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
