// Middleware-side Supabase client.
// This refreshes the auth session on every request and gates protected routes.
// Called from src/middleware.ts.
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Shape of the cookies array that Supabase passes into setAll().
type CookiesToSet = Array<{ name: string; value: string; options: CookieOptions }>;

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: CookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: do not put any code between createServerClient and getUser.
    // getUser revalidates the auth token and refreshes cookies on the response.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes: redirect to /login if no user.
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/calculator") ||
        request.nextUrl.pathname.startsWith("/journal") ||
        request.nextUrl.pathname.startsWith("/coach") ||
        request.nextUrl.pathname.startsWith("/prop-firm") ||
        request.nextUrl.pathname.startsWith("/economic-calendar") ||
        request.nextUrl.pathname.startsWith("/settings");

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // If signed in and visiting login/signup, send them to dashboard.
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
