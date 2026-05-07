// Root middleware. Runs on every request matched by `config.matcher`.
// Delegates to updateSession in lib/supabase/middleware.ts so the cookie/session
// logic stays colocated with the rest of the Supabase setup.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Run on everything except static assets, images, and Next.js internals.
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
