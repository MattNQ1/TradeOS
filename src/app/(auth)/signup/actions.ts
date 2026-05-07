"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (password.length < 6) {
        redirect(`/signup?error=${encodeURIComponent("Password must be at least 6 characters.")}`);
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // After clicking the email confirmation link, the user lands here.
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        },
    });

    if (error) {
        redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }

    // Supabase sends a confirmation email by default — show a "check your email" page.
    redirect("/signup?confirm=1");
}
