# VibeGuard 🛡️

**Catches the 21 most common security flaws in AI-generated web apps — exposed secrets, broken access control, missing RLS, injection — before they ship. A Claude skill + CI gates for Next.js + Supabase.**

![license](https://img.shields.io/badge/license-MIT-green)
![status](https://img.shields.io/badge/status-early%20access-orange)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-blue)
![built with Claude](https://img.shields.io/badge/built%20with-Claude-8A63D2)

> Independent scans find **~75% of "vibe-coded" apps ship with exploitable vulnerabilities** — most often exposed secrets and broken access control. The AI writes code that *runs*, not code that's *safe*. VibeGuard makes the secure path the default one, and blocks the unsafe one in CI.

---

## What it catches

| Area | Examples it stops |
|------|-------------------|
| **Auth & access** | client-side auth, IDOR, missing Supabase RLS, weak sessions, md5/sha1 passwords |
| **Secrets** | hardcoded/reused secrets, `service_role`/Stripe keys leaking into the client bundle |
| **Injection** | SQL injection, XSS, command injection, unsafe deserialization |
| **Data & privacy** | tokens in `localStorage`, PII in logs/URLs, missing security headers + CSRF |
| **Deps & ship** | hallucinated/vulnerable packages, no rate limiting, untested AI edits |

Full list: [`rules/catalogue.yaml`](rules/catalogue.yaml) (21 rules, mapped to OWASP / ASVS).

## How it works

```
declare governance.yaml  →  AI generates secure-by-default  →  pre-commit  →  CI gates  →  PR review  →  merge
```

You declare what your app touches (`payments? identity? location?`) in `governance.yaml`; VibeGuard selects the controls that must apply. The same rules ride inside the AI's context, so the assistant **reviews itself as it writes** — then CI is the bouncer.

## Install (pick what you need)

**Fastest path — Claude Code (gives you `/vibeguard`):**
```bash
git clone https://github.com/edilkoke/vibeguard ~/.claude/skills/vibeguard
```
Restart Claude Code — the skill loads automatically and is callable as `/vibeguard`. Clone into
`.claude/skills/vibeguard` instead to scope it to one project and commit it with your repo.

| Tool | One-time setup |
|------|----------------|
| **Claude Code** (skill → `/vibeguard`) | `git clone https://github.com/edilkoke/vibeguard ~/.claude/skills/vibeguard` |
| **Cursor** (rules) | `curl -o .cursorrules https://raw.githubusercontent.com/edilkoke/vibeguard/main/ai-context/.cursorrules` |
| **Any AI assistant** (rules) | copy [`ai-context/CLAUDE.md`](ai-context/CLAUDE.md) to your repo root |
| **CI gates** | copy [`ci/`](ci/) + [`.github/workflows/vibeguard.yml`](.github/workflows/vibeguard.yml), add a `governance.yaml` |
| **Secure starters** | copy what you need from [`templates/`](templates/) |

Run the checks locally any time:
```bash
npm run check:secrets   # known-common secret blocklist
npm run check:privacy   # PII in logs / tokens in URLs
npm run eval            # baseline-vs-treated reduction report
```

> No `curl | bash` installer on purpose — for a security tool, piping a remote script straight into
> your shell is exactly the habit we're trying to break.

## Does it actually work?

On the bundled demo corpus (a vulnerable app vs its VibeGuard-built twin), the harness removed **10 of 10 planted vulnerabilities (100%)**. That validates the *pipeline* — a larger, triaged evaluation with a DAST pass is in progress. Reproduce it: `npm run eval` → [`evaluation/results/report.md`](evaluation/results/report.md).

## Before / after

```ts
// ❌ before — what AI often generates
const sql = "SELECT * FROM users WHERE id = " + req.params.id;   // SQL injection
const key = "supersecretjwt";                                    // hardcoded secret
console.log("req", req, body.password);                          // PII in logs

// ✅ after — what VibeGuard steers toward
const { data } = await supabase.from("users").select("id,name").eq("id", id); // parameterized + RLS
const secret = process.env.SESSION_SECRET;                                     // env, CSPRNG, rotated
console.error("users.read failed", { code: error.code });                      // opaque, no PII
```

## Honest scope

VibeGuard **reduces** common, high-impact flaws at generation time. It is **not** a guarantee that an app is "secure" and **not** a substitute for professional testing. Reference stack today: **Next.js + Supabase**. Built and evaluated as a Design Science Research artifact.

## Contributing

New rules, detections, and field evidence welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Look for `good-first-issue`.

## License

MIT — see [LICENSE](LICENSE).
