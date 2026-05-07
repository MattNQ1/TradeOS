// OAuth + email-confirmation callback.
// Supabase redirects here with a `code` query param after email verification.
// We exchange it for a session, then send the user to the dashboard.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Failure: send them to login with a generic message.
    return NextResponse.redirect(`${origin}/login?error=Could+not+verify+email`);
}
