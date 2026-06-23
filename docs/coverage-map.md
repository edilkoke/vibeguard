# Coverage map — the 21 flaws → enforcing control

VibeGuard closes each common vibe-coding flaw with one or more controls. Item ids match `rules/catalogue.yaml`.

| Domain | Rules | How VibeGuard enforces it |
|--------|-------|---------------------------|
| **Auth & access** | VG-001 – VG-006 | AI rules force server-side auth + object-level authorization; secure session + Argon2/bcrypt templates; a tenant-isolation / RLS test in CI; the PR checklist asks the ownership question. |
| **Secrets & config** | VG-007 – VG-010 | CSPRNG secrets + secrets manager; `gitleaks` + a common-secret blocklist; built-bundle secret scan; a DTO rule blocks whole-object serialization to the client. |
| **Injection** | VG-011 – VG-014 | AI rules mandate parameterized queries, output encoding + CSP, arg-array shell calls, and safe deserializers; the Semgrep ruleset blocks the dangerous sinks. |
| **Data, privacy & transport** | VG-015 – VG-018 | HttpOnly cookies by default; `helmet` headers + CSRF tokens; log redaction; privacy-as-code requiring a delete endpoint + retention for PII-tagged fields. |
| **Abuse, deps & SDLC** | VG-019 – VG-021 | Rate-limit middleware + budget alerts; SCA (Dependabot + audit) + a package-existence check; SAST + DAST + LLM review + a required human sign-off. |

## Control legend
`ai-rule` secure-by-default generation · `sast` static analysis · `secret-scan` secret detection ·
`sca` dependency scanning · `dast` dynamic testing · `llm-review` AI logic-flaw review ·
`template` secure starter · `ci-test` automated test gate · `privacy-lint` PII checks ·
`pr-check` pull-request checklist.

## Two truths about SAST (why we layer)
SAST on vibe-coded apps is both **noisy** (most "serious" findings are false positives) and **blind** to the worst AI-unique bugs (runtime auth-bypass / IDOR that pass static review). So VibeGuard pairs SAST + secret-scan with **DAST + an LLM review + a human sign-off** for the logic SAST can't see.
