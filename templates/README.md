# VibeGuard secure starters (Next.js + Supabase)

Drop-in, secure-by-default building blocks. Each file demonstrates the controls from
`rules/catalogue.yaml`. They are reference implementations — adapt paths/imports to your app.

| File | Closes | What it does |
|------|--------|--------------|
| `.env.example` | VG-007, VG-008 | Splits public vs server-only env; keeps `service_role`/secrets off the client. |
| `next.config.js` | VG-018 | HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer/Permissions policies. |
| `middleware.ts` | VG-001, VG-005 | Server-side, default-deny auth gate; session via HttpOnly cookies. |
| `lib/supabase/client.ts` | VG-008 | Browser client with anon key only. |
| `lib/supabase/server.ts` | VG-008 | Session-scoped server client (RLS applies) + guarded `service_role` admin client. |
| `lib/security/ratelimit.ts` | VG-019 | Sliding-window limiter; 429 + Retry-After. |
| `lib/security/validation.ts` | VG-019 | Server-side zod parsing; whitelists fields (anti mass-assignment). |
| `lib/auth/password.ts` | VG-006 | Argon2id hashing (for custom auth; prefer Supabase Auth). |
| `supabase/migrations/0001_enable_rls.sql` | VG-002, VG-003 | Enables RLS + owner-only policies; non-guessable IDs. |
| `app/api/items/route.ts` | VG-001/002/003/011/016/019 | Full secure chain: rate-limit → auth → validate → RLS write. |

## Dependencies
`@supabase/ssr`, `@supabase/supabase-js`, `zod`, `argon2` (only if you use custom auth).

> These reduce common flaws at generation time. Pair with the CI gates (P3) and a human
> reviewer — VibeGuard does not certify an app as "secure."
