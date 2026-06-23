---
name: vibeguard
description: >
  Use when building, reviewing, or hardening a web application with AI assistance —
  especially "vibe-coded" apps on Next.js + Supabase. VibeGuard enforces secure-by-default
  code generation and reviews output against a catalogue of the 21 most common AI-coding
  vulnerabilities (exposed secrets, broken access control, injection, weak auth, missing
  privacy controls, vulnerable dependencies). Trigger on: "build an app", "add auth",
  "is this secure", "review my code", "harden", "deploy", or any handling of payments,
  identity, logins, or customer data.
license: MIT
---

# VibeGuard — secure-by-default for AI-built web apps

## When to apply
Apply whenever generating or reviewing application code, configuration, or deployment
settings — particularly anything touching authentication, payments, identity, location,
customer data, secrets, third-party integrations, or database access.

## How to use it
1. **Read `governance.yaml`** at the project root (scaffold it from `governance.example.yaml`
   if missing). The declared data flags determine which rules are mandatory.
2. **Generate against the rules.** Follow `ai-context/CLAUDE.md` — every applicable rule in
   `rules/catalogue.yaml` must be satisfied by construction (parameterized queries,
   server-side authz with ownership checks, env-managed secrets, HttpOnly cookies, etc.).
3. **Self-review before returning code.** Walk the relevant `rules/catalogue.yaml` entries
   for the files you touched and confirm each `detect` condition is NOT present.
4. **Never** hardcode secrets, ship secret keys to the client, weaken access control, or
   disable a security control to "make it work."

## What it is NOT
Not a guarantee of security and not a substitute for professional testing. VibeGuard
*reduces* common, high-impact flaws at generation time. Pair it with the CI gates and a
human reviewer for anything that ships.

> Knowledge base: `rules/catalogue.yaml` · Risk manifest: `governance.schema.yaml` ·
> Coverage: `docs/coverage-map.md`
