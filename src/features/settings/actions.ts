// Server Actions for the settings page.
// Password change, email change, account deletion.
"use server";

import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
    ok: boolean;
    error?: string;
}

// ============================================================
// Change password
// ============================================================
//
// Two-step for security:
// 1. Re-authenticate with the current password (so a stolen session
//    can't change the password without knowing the old one).
// 2. If valid, update to the new password.

export async function changePassword(formData: FormData): Promise<ActionResult> {
    const currentPassword = String(formData.get("current_password") ?? "");
    const newPassword = String(formData.get("new_password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (!currentPassword || !newPassword) {
        return { ok: false, error: "Fill out all fields." };
    }
    if (newPassword.length < 6) {
        return { ok: false, error: "New password must be at least 6 characters." };
    }
    if (newPassword !== confirmPassword) {
        return { ok: false, error: "New passwords don't match." };
    }
    if (newPassword === currentPassword) {
        return { ok: false, error: "New password must be different from the current one." };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return { ok: false, error: "Not signed in." };

    // Re-authenticate to verify the current password.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });
    if (reauthError) {
        return { ok: false, error: "Current password is incorrect." };
    }

    // Now update.
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });
    if (updateError) {
        return { ok: false, error: updateError.message };
    }

    return { ok: true };
}

// ============================================================
// Sign out
// ============================================================

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

// ============================================================
// Delete account
// ============================================================
//
// Requires SUPABASE_SERVICE_ROLE_KEY (server-only secret) because the
// admin.deleteUser API needs elevated permissions. Trades + prop_firm_config
// rows are removed automatically via ON DELETE CASCADE foreign keys.

export async function deleteAccount(): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return {
            ok: false,
            error: "Account deletion is not configured. Add SUPABASE_SERVICE_ROLE_KEY in Supabase → Settings → API and to your .env.local + Vercel env vars.",
        };
    }

    const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) return { ok: false, error: error.message };

    // Clear cookies on this device too.
    await supabase.auth.signOut();
    return { ok: true };
}
