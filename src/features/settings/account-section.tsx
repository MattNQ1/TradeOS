// Account info card — email, member since, sign out.
"use client";

import { useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "./actions";

interface AccountSectionProps {
    email: string;
    createdAt: string;          // ISO datetime
    emailConfirmed: boolean;
}

const dateFmt = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
});

export function AccountSection({ email, createdAt, emailConfirmed }: AccountSectionProps) {
    const [pending, startTransition] = useTransition();

    const handleSignOut = () => {
        startTransition(async () => {
            await signOut();
        });
    };

    return (
        <Card>
            <CardTitle>Account</CardTitle>

            <div className="flex flex-col">
                <Row label="Email">
                    <span className="font-medium text-[var(--color-text)]">{email}</span>
                    {emailConfirmed ? (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,var(--color-gain)_20%,transparent)] text-[var(--color-gain)]">
                            Verified
                        </span>
                    ) : (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,var(--color-warn)_20%,transparent)] text-[var(--color-warn)]">
                            Unverified
                        </span>
                    )}
                </Row>
                <Row label="Member since">
                    <span className="font-medium text-[var(--color-text)]">
                        {dateFmt.format(new Date(createdAt))}
                    </span>
                </Row>
            </div>

            <Button
                variant="secondary"
                className="w-full"
                onClick={handleSignOut}
                disabled={pending}
            >
                {pending ? "Signing out…" : "Sign out"}
            </Button>
        </Card>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between items-center py-2.5 text-sm border-b border-[var(--color-border-soft)] last:border-b-0">
            <span className="text-[var(--color-text-muted)]">{label}</span>
            <span className="text-right">{children}</span>
        </div>
    );
}
