// Root layout — wraps every page in the app.
// Sets up <html> with dark theme, viewport meta, and global CSS.
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Futures Calculator",
    description: "Free futures trading calculator with journal, prop firm tools, and economic calendar.",
};

export const viewport: Viewport = {
    themeColor: "#059669",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
