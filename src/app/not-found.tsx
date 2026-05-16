// Global 404 page. Auto-served by Next.js when no route matches.
// Default Next.js 404 is unbranded — this one matches the TradeOS aesthetic
// and gives the user a clear path back.
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-dvh flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <div className="text-center max-w-md">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                    404
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Wrong tab.
                </h1>
                <p className="text-[var(--color-text-muted)] mt-3 leading-relaxed">
                    This page doesn&rsquo;t exist, or it used to and we moved it. Either
                    way, nothing to do here.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
                    <Link
                        href="/"
                        className="btn-cta-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                    >
                        Back to the homepage
                    </Link>
                    <Link
                        href="/dashboard"
                        className="btn-cta-secondary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                    >
                        Go to my dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
