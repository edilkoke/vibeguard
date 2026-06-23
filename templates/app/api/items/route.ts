// VibeGuard secure API route — the full chain in one place.
// Order: rate-limit -> authenticate (server) -> validate -> authorize (RLS) -> respond.
// Touches: VG-001, VG-002, VG-003, VG-011, VG-016, VG-019.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, tooManyRequests } from "@/lib/security/ratelimit";
import { parseBody, createItemSchema } from "@/lib/security/validation";

export async function POST(request: NextRequest) {
  // 1) Authenticate on the SERVER. No client-side trust. (VG-001)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) Rate-limit per user (and you can add per-IP). (VG-019)
  const rl = rateLimit(`items:create:${user.id}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSeconds);

  // 3) Validate the body server-side; whitelist fields (prevents mass assignment). (VG-019)
  const parsed = await parseBody(request, createItemSchema);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  // 4) Write through the user's session client. RLS guarantees owner-only access,
  //    and the Supabase client uses parameterized queries (no SQL injection). (VG-002, VG-011)
  const { data, error } = await supabase
    .from("items")
    .insert({ ...parsed.data, owner_id: user.id }) // ownership set server-side (VG-003)
    .select("id, title, note, created_at")
    .single();

  if (error) {
    // Log an opaque message, never the secret/PII or the raw error to the client. (VG-016)
    console.error("items.create failed", { code: error.code });
    return NextResponse.json({ error: "Could not create item" }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}
