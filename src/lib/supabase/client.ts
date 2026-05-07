// Browser-side Supabase client.
// Use this in Client Components ('use client') to call supabase.auth.getUser(),
// supabase.from(...), etc. — anywhere that runs in the browser.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
