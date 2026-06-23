// Browser Supabase client — anon/publishable key ONLY. (VG-008)
// The service_role key must NEVER appear in client code or the bundle.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // public by design
  );
}
