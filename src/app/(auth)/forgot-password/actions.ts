// Sends a password-reset email. Always redirects to the success state
// regardless of whether the email exists in our system — this prevents
// account-enumeration attacks (where a malicious actor checks which
// addresses are registered by attempting resets).
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
        redirect(`/forgot-password?error=${encodeURIComponent("Email is required.")}`);
    }

    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Fire and forget. Supabase silently no-ops if the email isn't registered.
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });

    redirect("/forgot-password?sent=1");
}
