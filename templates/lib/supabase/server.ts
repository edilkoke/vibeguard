// Server Supabase clients. (VG-008)
// - createClient(): request-scoped, uses the user's session via HttpOnly cookies.
//   RLS applies, so the user only ever sees their own rows. PREFER THIS.
// - createAdminClient(): service_role, BYPASSES RLS. Server-only, use sparingly,
//   never with unvalidated user input, never returned to the client.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createRawClient } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* called from a Server Component; safe to ignore */
          }
        },
      },
    }
  );
}

// service_role — bypasses RLS. Keep server-side only. (VG-008)
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set (server-only).");
  return createRawClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
