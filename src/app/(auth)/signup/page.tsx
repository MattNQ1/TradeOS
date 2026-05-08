// /signup — public page.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { signup } from "./actions";

interface SignupPageProps {
    searchParams: Promise<{ error?: string; confirm?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
    const { error, confirm } = await searchParams;

    if (confirm) {
        return (
            <main className="min-h-dvh flex items-center justify-center px-4 py-12">
                <Card className="max-w-sm w-full text-center">
                    <CardTitle>Check your email</CardTitle>
                    <p className="text-[var(--color-text-muted)]">
                        We sent you a confirmation link. Click it to activate your account, then sign in.
                    </p>
                    <Link href="/login">
                        <Button className="w-full">Back to sign in</Button>
                    </Link>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-dvh flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm flex flex-col gap-4">
                <div className="text-center mb-2">
                    <span className="text-[var(--color-accent)] text-2xl">▲</span>
                    <h1 className="text-2xl font-bold mt-1">Create your account</h1>
                </div>

                <Card>
                    <CardTitle>Sign up</CardTitle>
                    <form action={signup} className="flex flex-col gap-3">
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
                            autoComplete="new-password"
                            required
                            hint="At least 6 characters."
                        />
                        {error && (
                            <p className="text-sm text-[var(--color-loss)] -mt-1">
                                {error}
                            </p>
                        )}
                        <Button type="submit" className="w-full mt-1">Create account</Button>
                    </form>
                    <p className="text-center text-[11px] text-[var(--color-text-subtle)] leading-relaxed -mt-1">
                        By creating an account you agree to our{" "}
                        <Link href="/terms" className="text-[var(--color-accent)]">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-[var(--color-accent)]">Privacy Policy</Link>.
                    </p>
                </Card>

                <p className="text-center text-sm text-[var(--color-text-muted)]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[var(--color-accent)] font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
