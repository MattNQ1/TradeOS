// Server-side Supabase client.
// Use this in Server Components, Server Actions, and Route Handlers.
// In Next.js 15, cookies() is async — that's why this function is async too.
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Shape of the cookies array that Supabase passes into setAll().
type CookiesToSet = Array<{ name: string; value: string; options: CookieOptions }>;

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: CookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Called from a Server Component — cookies are read-only there.
                        // The middleware already handles session refresh, so this is safe to ignore.
                    }
                },
            },
        }
    );
}
