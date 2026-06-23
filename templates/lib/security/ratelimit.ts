// VibeGuard rate limiter. (VG-019)
// In-memory sliding window for dev/single-instance. For production / serverless,
// swap the store for Upstash Redis or your platform's KV — the interface is the same.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * @param key      stable identifier — prefer userId, else IP. (per-account + per-IP)
 * @param limit    max requests per window (e.g. 5 for login)
 * @param windowMs window length in ms (e.g. 15 * 60_000)
 */
export function rateLimit(key: string, limit = 5, windowMs = 15 * 60_000): RateLimitResult {
  const now = Date.now();
  const b = store.get(key);

  if (!b || now > b.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfterSeconds: 0 };
}

// Returns the 429 response when a limit is hit. (VG-019: 429 + Retry-After)
export function tooManyRequests(retryAfterSeconds: number): Response {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) },
  });
}
