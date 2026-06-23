# Show HN copy

**Title (keep under 80 chars; HN dislikes hype):**
Show HN: VibeGuard – catch the 21 most common security flaws in AI-generated apps

**First comment (post immediately after submitting):**

I kept seeing the same result in the field studies: ~75% of "vibe-coded" apps ship
with exploitable vulnerabilities — usually exposed secrets and broken access control.
The AI writes code that runs, not code that's safe, and the person who built it can't
see the difference.

VibeGuard is my attempt to fix that at the point of generation rather than after. It's
three things sharing one rule catalogue (21 vulnerability classes mapped to OWASP/ASVS):

1. a rules pack (CLAUDE.md / .cursorrules) so the AI generates secure-by-default code;
2. CI gates (gitleaks + a Semgrep set + a privacy lint + a common-secret blocklist) that
   block the unsafe stuff before merge;
3. secure Next.js + Supabase starters (RLS on, HttpOnly cookies, helmet headers, rate limits).

A `governance.yaml` manifest lets you declare what the app touches (payments? identity?)
and only then turns on the heavier controls — so it stays proportional and lightweight.

It's early and honest about scope: it *reduces* common flaws, it doesn't certify an app
"secure," and the reference stack is Next.js + Supabase for now. On a demo corpus the
harness removed 10/10 planted bugs; a larger, triaged evaluation (with a DAST pass) is
in progress — it's part of a doctoral Design Science Research project, so the evaluation
is the point, not an afterthought.

Repo: <LINK>. Feedback on the rule catalogue and the false-positive rate especially welcome.

**Notes for posting**
- Post Tue–Thu, ~8–10am ET. Be around for 3–4 hours to answer every comment.
- Don't editorialize the title. Let the work speak.
