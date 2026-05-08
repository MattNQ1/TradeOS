// /login — public page.
// Submits to a Server Action (no client JS needed for the form to work).
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { login } from "./actions";

interface LoginPageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const { error } = await searchParams;

    return (
        <main className="min-h-dvh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm flex flex-col gap-4">
                <div className="text-center mb-2">
                    <span className="text-[var(--color-accent)] text-2xl">▲</span>
                    <h1 className="text-2xl font-bold mt-1">Welcome back</h1>
                </div>

                <Card>
                    <CardTitle>Sign in</CardTitle>
                    <form action={login} className="flex flex-col gap-3">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            required
                        />
                        {error && (
                            <p className="text-sm text-[var(--color-loss)] -mt-1">
                                {error}
                            </p>
                        )}
                        <Button type="submit" className="w-full mt-1">Sign in</Button>
                    </form>
                    <Link
                        href="/forgot-password"
                        className="text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] -mt-1"
                    >
                        Forgot your password?
                    </Link>
                </Card>

                <p className="text-center text-sm text-[var(--color-text-muted)]">
                    No account?{" "}
                    <Link href="/signup" className="text-[var(--color-accent)] font-semibold">
                        Sign up
                    </Link>
                </p>

                <p className="text-center text-xs text-[var(--color-text-subtle)]">
                    <Link href="/privacy" className="hover:text-[var(--color-text-muted)]">Privacy</Link>
                    <span className="mx-1.5">·</span>
                    <Link href="/terms" className="hover:text-[var(--color-text-muted)]">Terms</Link>
                </p>
            </div>
        </main>
    );
}
