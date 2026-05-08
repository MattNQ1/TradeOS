// Layout for all authenticated pages.
// Even though middleware already gates these routes, we double-check the user
// here so the page can show their email + a sign-out button. Defense in depth.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-dvh flex flex-col">
            {/* Top bar with user + sign out */}
            <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border-soft)]">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="font-bold text-lg flex items-center gap-2">
                        <span className="text-[var(--color-accent)]">▲</span>
                        Futures
                    </Link>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 pb-24">
                {children}
            </main>

            {/* Bottom tab bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-t border-[var(--color-border-soft)]">
                <div className="max-w-md mx-auto grid grid-cols-4">
                    <TabLink href="/dashboard">Dashboard</TabLink>
                    <TabLink href="/calculator">Calc</TabLink>
                    <TabLink href="/journal">Journal</TabLink>
                    <TabLink href="/prop-firm">Prop</TabLink>
                </div>
            </nav>
        </div>
    );
}

function TabLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-center py-3 text-sm font-semibold text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
        >
            {children}
        </Link>
    );
}
