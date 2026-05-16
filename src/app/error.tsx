// Global error boundary. Renders when a Server Component throws or
// a client-side render error escapes a more specific boundary.
//
// Must be a Client Component (Next.js requirement for error boundaries).
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log to console so it's visible in Vercel + browser devtools.
        // (Anthropic/Sentry integration would go here later.)
        console.error("Global error boundary caught:", error);
    }, [error]);

    return (
        <main className="min-h-dvh flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <div className="text-center max-w-md">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-warn)] mb-3">
                    Something broke
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    That wasn&rsquo;t supposed to happen.
                </h1>
                <p className="text-[var(--color-text-muted)] mt-3 leading-relaxed">
                    An unexpected error hit this page. We&rsquo;re logging it. Try
                    refreshing &mdash; if it keeps happening, email{" "}
                    <a
                        href="mailto:tradeos.support@gmail.com"
                        className="text-[var(--color-accent)] hover:underline"
                    >
                        tradeos.support@gmail.com
                    </a>{" "}
                    and we&rsquo;ll look at it.
                </p>
                {error.digest && (
                    <p className="text-xs text-[var(--color-text-subtle)] mt-3 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
                    <button
                        type="button"
                        onClick={reset}
                        className="btn-cta-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="btn-cta-secondary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                    >
                        Back to the homepage
                    </Link>
                </div>
            </div>
        </main>
    );
}
