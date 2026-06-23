# Demo GIF script (the single biggest star driver)

Goal: in ~15 seconds, show VibeGuard *catching a real flaw*. Record with a screen recorder
(e.g. Kap / LICEcap), keep it <8 MB so it inlines in the README.

## Option A — the CI gate blocks a bad commit (most convincing)
1. Show a file with a planted flaw on screen:
   ```ts
   const JWT_SECRET = "supersecretjwt";
   db.query("SELECT * FROM users WHERE id = " + req.params.id);
   ```
2. Run the gate in the terminal:
   ```bash
   node ci/check-common-secrets.mjs
   node ci/privacy-lint.mjs
   ```
3. Show the red FAIL output naming the VG rule. Cut.

## Option B — the eval report (shows the headline number)
```bash
npm run eval
```
Capture the summary: `baseline 10 → treated 0 → reduction 100%`, then the report table.

## Option C — the AI self-correcting (best if you use Cursor/Claude)
Prompt "add a login endpoint" in a repo with `ai-context/CLAUDE.md` present; show the
assistant using Argon2, server-side auth, and HttpOnly cookies by default.

## After recording
- Save as `docs/demo.gif`, then add to the README under the title:
  `![VibeGuard demo](docs/demo.gif)`
- Commit + push (GitHub Desktop). The GIF is what turns a visit into a star.
