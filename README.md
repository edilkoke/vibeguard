# VibeGuard 🛡️

**Research-backed security guardrails for AI-built ("vibe-coded") web apps — embedded in your workflow, not bolted on after.**

> Field studies find that **~75% of vibe-coded apps ship with exploitable vulnerabilities** — exposed secrets, broken access control, vulnerable dependencies. VibeGuard makes the *secure* path the *default* one, so non-specialist builders ship safe-by-default apps without slowing down.

*Status: early development (research artifact for a professional doctorate). The knowledge base and risk-manifest schema are in place; templates, CI, and the packaged skill are in progress. Built and evaluated using Design Science Research.*

---

## What it is

VibeGuard is a **Claude skill + governance package** that closes the most common AI-coding security flaws at the moment of generation. It ships in three forms:

1. a **Claude skill** (`SKILL.md`) that steers the assistant toward secure-by-default code;
2. a **GitHub template repo** with secure starters + CI gates;
3. a **`.cursorrules` / `CLAUDE.md` rules pack** for any AI coding assistant.

## How it works

```
install → declare governance.yaml → AI generates secure-by-default → pre-commit → CI gates → PR review → merge
```

You declare what your app touches in `governance.yaml` (payments? identity? location?), and VibeGuard auto-selects the controls that must apply. The same rules ride inside the AI's context, so the assistant *reviews itself as it writes*.

## The four design principles

- **Proportionality** — controls are matched to declared risk via `governance.yaml`.
- **Embeddedness** — governance lives in the toolchain (AI context + CI), not a committee.
- **Adaptability** — capability tiers; v1 targets the "builder" tier.
- **Sustainability** — runs in your existing GitHub; no dedicated security staff assumed.

## Repository layout

| Path | What's in it |
|------|--------------|
| `rules/catalogue.yaml` | The 21 vulnerability classes as machine-usable rules (the knowledge base). |
| `governance.schema.yaml` | The risk-manifest schema (the proportionality engine). |
| `governance.example.yaml` | A worked example for a Next.js + Supabase app. |
| `docs/` | Design principles and the coverage map. |
| `ai-context/` | The secure-by-default rule pack (`CLAUDE.md`, `.cursorrules`). |
| `templates/`, `ci/` | Secure starters and CI gates (in progress). |

## Scope (v1)

Reference stack: **Next.js (Node/TypeScript) + Supabase (Postgres + RLS)**. VibeGuard reduces common flaws at generation time — it is **not** a replacement for professional penetration testing, and makes **no claim** that an app is "secure." The claim is a *measurable reduction* in common vulnerabilities.

## License

MIT — see [LICENSE](LICENSE).
