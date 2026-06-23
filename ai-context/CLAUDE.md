# VibeGuard — secure-by-default rules for AI-assisted development

You are building/maintaining a web app on **Next.js + Supabase**. Before returning code,
satisfy every applicable rule below by construction, then self-review the files you touched
against `rules/catalogue.yaml`. Read `governance.yaml` first — its data flags decide which
rules are mandatory. **Never disable a security control to "make it work."**

## Always (baseline)

- **Secrets** — never hardcode or inline secrets; read from environment. Never expose secret
  keys (Supabase `service_role`, Stripe secret, OpenAI) to the client. Only `anon`/publishable
  keys may reach the browser. Generate signing secrets with a CSPRNG; never reuse a default. *(VG-007, VG-008)*
- **Access control** — every record query and every mutation checks ownership/authorization;
  deny by default. Enable Supabase Row-Level Security with per-user policies. Use non-guessable
  IDs. *(VG-002, VG-003)*
- **Injection** — parameterized queries / ORM only, never string-concatenated SQL; keep
  auto-escaping on and avoid `dangerouslySetInnerHTML`; never pass user input to a shell as a
  string; never `pickle.loads` / unsafe `yaml.load` untrusted data. *(VG-011 – VG-014)*
- **Transport & headers** — set HSTS, CSP, X-Frame-Options, X-Content-Type-Options (use
  `helmet` or Next config); SameSite cookies + CSRF tokens on state-changing routes. *(VG-018)*
- **Logging** — never log secrets/PII or full requests; keep tokens out of URLs. *(VG-016)*
- **Serialization** — pass only explicit fields (DTOs) to Client Components; never the whole
  server object/config. *(VG-010)*
- **Dependencies** — verify a package actually exists before importing it; prefer maintained,
  current versions; pin via lockfile. *(VG-020)*
- **Abuse** — rate-limit auth and costly endpoints; re-validate everything server-side; never
  trust client-side validation alone. *(VG-019)*

## When `authentication: true`

- Enforce auth/authorization on the **server**; the client holds only a post-verification
  session token. *(VG-001)*
- Hash passwords with **Argon2id** or **bcrypt (cost >= 12)**; never plaintext/md5/sha1. *(VG-006)*
- Short-lived rotating sessions, invalidated on logout. Store tokens in **HttpOnly + Secure +
  SameSite cookies**, never `localStorage`. *(VG-004, VG-015)*
- No seeded/default credentials; no leftover test/debug routes in production. *(VG-005, VG-009)*

## When PII / identity / payments / health are present

- Data minimization; send only required fields to third parties; a DPA must exist per processor.
- Ship a working data-deletion path and a retention setting for PII-tagged fields. *(VG-017)*

## Before returning code
State which rules applied and confirm each `detect` condition is **absent**. Functional output
is not the same as production-safe output — especially around payments, identity, permissions,
location, and customer data.
