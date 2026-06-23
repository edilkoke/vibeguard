// VibeGuard server-side validation. (VG-019: never trust the client)
// Always parse request bodies against a schema on the server — client-side
// validation is UX only. Parsed, typed output prevents mass-assignment too.

import { z } from "zod";

export async function parseBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; error: string }> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return { ok: false, error: "Invalid JSON body" };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    // Return a generic message; do not leak schema internals or values. (VG-016)
    return { ok: false, error: "Invalid request" };
  }
  return { ok: true, data: result.data };
}

// Example schema — whitelist exactly the fields you accept (prevents mass assignment).
export const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  note: z.string().max(2000).optional(),
});
