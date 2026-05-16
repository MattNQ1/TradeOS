// Auto-served as /robots.txt by Next.js.
// Keep crawlers out of the authenticated app routes; they won't render
// anything useful (just redirects to /login).
import type { MetadataRoute } from "next";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://usetradeos.vercel.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/auth/",
                "/dashboard",
                "/calculator",
                "/journal",
                "/coach",
                "/prop-firm",
                "/economic-calendar",
                "/settings",
                "/forgot-password",
                "/reset-password",
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
