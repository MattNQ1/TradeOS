// Updates the signed-in user's password. The user gets a session via the
// /auth/callback exchange after clicking the reset link in their email.
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 6) {
        redirect(`/reset-password?error=${encodeURIComponent("Password must be at least 6 characters.")}`);
    }
    if (password !== confirm) {
        redirect(`/reset-password?error=${encodeURIComponent("Passwords don't match.")}`);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/reset-password?error=${encodeURIComponent("Your reset link has expired. Request a new one.")}`);
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
        redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/dashboard?password_reset=1");
}
