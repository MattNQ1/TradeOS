import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Security headers applied to every response. These are baseline
    // best-practices, not bleeding-edge — enough to pass most security
    // scanners and to mitigate the obvious attack surface (clickjacking,
    // MIME sniffing, referrer leakage, etc.).
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        // Prevents the page from being iframed by other sites
                        // — kills clickjacking attempts.
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        // Browsers won't try to guess content types — they
                        // must honour the Content-Type header.
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        // Send the origin (not the full URL) on cross-origin
                        // requests. Protects against query-string leakage to
                        // third-party analytics / ad networks.
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        // We don't use camera / mic / geolocation in
                        // TradeOS — explicitly turn them off so future
                        // dependencies can't quietly enable them.
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
