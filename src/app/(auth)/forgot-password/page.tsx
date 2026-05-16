// /forgot-password — public page. Sends reset email then shows success state.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { requestPasswordReset } from "./actions";

export const metadata = { title: "Reset password" };

interface ForgotPasswordPageProps {
    searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
    const { error, sent } = await searchParams;

    if (sent) {
        return (
            <main className="min-h-dvh flex items-center justify-center px-4 py-12">
                <Card className="max-w-sm w-full text-center">
                    <div className="text-4xl mb-2">📬</div>
                    <CardTitle>Check your email</CardTitle>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        If an account exists with that email, we just sent a password-reset link. Click it to set a new password.
                    </p>
                    <p className="text-xs text-[var(--color-text-subtle)]">
                        Didn&apos;t get it? Check your spam folder, or wait a minute and try again.
                    </p>
                    <Link href="/login" className="mt-2 inline-block">
                        <Button variant="ghost" className="w-full">Back to sign in</Button>
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
                    <h1 className="text-2xl font-bold mt-1">Reset your password</h1>
                </div>

                <Card>
                    <CardTitle>Forgot password</CardTitle>
                    <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                        Enter your email and we&apos;ll send you a link to set a new password.
                    </p>
                    <form action={requestPasswordReset} className="flex flex-col gap-3">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                        />
                        {error && (
                            <p className="text-sm text-[var(--color-loss)] -mt-1">{error}</p>
                        )}
                        <Button type="submit" className="w-full mt-1">Send reset link</Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-[var(--color-text-muted)]">
                    Remembered it?{" "}
                    <Link href="/login" className="text-[var(--color-accent)] font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
