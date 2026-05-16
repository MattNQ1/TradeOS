// Layout for all authenticated pages.
// Even though middleware already gates these routes, we double-check the user
// here so the page can show their email + a sign-out button. Defense in depth.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
    NavTabLink,
    HomeIcon,
    CalcIcon,
    JournalIcon,
    AIIcon,
    PropIcon,
    EconIcon,
} from "@/components/nav-tab-link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-dvh flex flex-col">
            {/* Top bar — brand on the left, settings on the right. */}
            <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border-soft)]">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="font-bold text-lg flex items-center gap-2">
                        <span className="text-[var(--color-accent)]">▲</span>
                        TradeOS
                    </Link>
                    <Link
                        href="/settings"
                        aria-label="Settings"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elev-2)] hover:text-[var(--color-text)] transition-colors"
                    >
                        <SettingsIcon />
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 pb-24">
                {children}
            </main>

            {/* Bottom tab bar — icon + label per tab, active-route highlighting */}
            <nav
                aria-label="Primary"
                className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur border-t border-[var(--color-border-soft)] pb-[env(safe-area-inset-bottom)]"
            >
                <div className="max-w-md mx-auto grid grid-cols-6">
                    <NavTabLink href="/dashboard"          label="Home"    icon={<HomeIcon />} />
                    <NavTabLink href="/calculator"         label="Calc"    icon={<CalcIcon />} />
                    <NavTabLink href="/journal"            label="Journal" icon={<JournalIcon />} />
                    <NavTabLink href="/coach"              label="AI"      icon={<AIIcon />} />
                    <NavTabLink href="/prop-firm"          label="Prop"    icon={<PropIcon />} />
                    <NavTabLink href="/economic-calendar"  label="Econ"    icon={<EconIcon />} />
                </div>
            </nav>
        </div>
    );
}

function SettingsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
