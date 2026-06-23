// DEMO FIXTURE — secure equivalent (built WITH VibeGuard).
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ id: z.string().uuid() });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

  // Parameterized via the client; RLS guarantees owner-only access.
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", parsed.data.id)
    .single();

  if (error) {
    console.error("users.read failed", { code: error.code }); // opaque, no PII
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ user: data });
}
