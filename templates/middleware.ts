// VibeGuard default-deny auth middleware. (VG-001, VG-005)
// Everything under /app is protected UNLESS explicitly listed as public.
// Auth is enforced on the server here — never rely on client-side checks.

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Explicit allow-list. Everything else requires a session. (VG-005: default-deny)
const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Supabase reads/writes the session via HttpOnly cookies (VG-015: no localStorage).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!isPublic(request.nextUrl.pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return response;
}

// Never run on static assets; do run on everything else.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
