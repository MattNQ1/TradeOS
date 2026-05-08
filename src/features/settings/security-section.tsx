// Security card — change password.
"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "./actions";

export function SecuritySection() {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const res = await changePassword(formData);
            if (!res.ok) {
                setError(res.error ?? "Failed to update password.");
                return;
            }
            setSuccess(true);
            (e.target as HTMLFormElement).reset();
            // Auto-close after success.
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 2000);
        });
    };

    return (
        <Card>
            <div className="flex items-center justify-between">
                <CardTitle>Security</CardTitle>
                {!open && (
                    <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                        Change password
                    </Button>
                )}
            </div>

            {!open ? (
                <p className="text-sm text-[var(--color-text-muted)] -mt-1">
                    Update your password. You&apos;ll need to enter your current password to confirm.
                </p>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <Input
                        label="Current password"
                        type="password"
                        name="current_password"
                        autoComplete="current-password"
                        required
                    />
                    <Input
                        label="New password"
                        type="password"
                        name="new_password"
                        autoComplete="new-password"
                        required
                        hint="At least 6 characters."
                    />
                    <Input
                        label="Confirm new password"
                        type="password"
                        name="confirm_password"
                        autoComplete="new-password"
                        required
                    />

                    {error && (
                        <p className="text-sm text-[var(--color-loss)]">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-[var(--color-gain)] font-semibold">
                            ✓ Password updated.
                        </p>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => { setOpen(false); setError(null); setSuccess(false); }}
                            disabled={pending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={pending} className="flex-1">
                            {pending ? "Updating…" : "Update password"}
                        </Button>
                    </div>
                </form>
            )}
        </Card>
    );
}
