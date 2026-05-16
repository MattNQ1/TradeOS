// /reset-password — user lands here after clicking the email link.
// They have a temporary session at this point; they set a new password
// and get redirected to /dashboard.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { updatePassword } from "./actions";

export const metadata = { title: "Set new password" };

interface ResetPasswordPageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { error } = await searchParams;

    // Verify session — if the user got here without clicking a valid email link,
    // there's nothing to reset.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <main className="min-h-dvh flex items-center justify-center px-4 py-12">
                <Card className="max-w-sm w-full text-center">
                    <div className="text-4xl mb-2">🔗</div>
                    <CardTitle>Link expired or invalid</CardTitle>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Reset links expire after a short time. Request a new one and click it within a few minutes.
                    </p>
                    <Link href="/forgot-password" className="mt-2 inline-block">
                        <Button className="w-full">Get a new reset link</Button>
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
                    <h1 className="text-2xl font-bold mt-1">Set a new password</h1>
                </div>

                <Card>
                    <CardTitle>New password</CardTitle>
                    <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                        Choose something different from your previous password.
                    </p>
                    <form action={updatePassword} className="flex flex-col gap-3">
                        <Input
                            label="New password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            required
                            hint="At least 6 characters."
                        />
                        <Input
                            label="Confirm new password"
                            type="password"
                            name="confirm"
                            autoComplete="new-password"
                            required
                        />
                        {error && (
                            <p className="text-sm text-[var(--color-loss)] -mt-1">{error}</p>
                        )}
                        <Button type="submit" className="w-full mt-1">Update password</Button>
                    </form>
                </Card>
            </div>
        </main>
    );
}
