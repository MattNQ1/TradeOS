// Shared layout for Privacy / Terms pages. Simple header + scrollable content.
import Link from "next/link";

interface LegalPageProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
    return (
        <div className="min-h-dvh">
            <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border-soft)]">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="font-bold text-lg flex items-center gap-2">
                        <span className="text-[var(--color-accent)]">▲</span>
                        TradeOS
                    </Link>
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                        Sign in
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-5 py-8">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                    Last updated: <span className="font-medium text-[var(--color-text)]">{lastUpdated}</span>
                </p>
                <article className="legal-prose mt-6">
                    {children}
                </article>
                <footer className="mt-12 pt-6 border-t border-[var(--color-border-soft)] text-xs text-[var(--color-text-subtle)] flex flex-wrap gap-3 justify-between">
                    <div className="flex gap-3">
                        <Link href="/privacy" className="hover:text-[var(--color-text-muted)]">Privacy</Link>
                        <Link href="/terms" className="hover:text-[var(--color-text-muted)]">Terms</Link>
                    </div>
                    <span>TradeOS · v0.1.0</span>
                </footer>
            </main>
        </div>
    );
}
