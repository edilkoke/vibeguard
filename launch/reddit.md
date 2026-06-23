# Reddit copy

Read each sub's rules first. Lead with value, not promotion. Reply to every comment.

---

## r/vibecoding
**Title:** I catalogued the 21 security flaws that keep showing up in vibe-coded apps — and built guardrails that block them

**Body:**
After going through a couple of field studies (one scanned 20k AI-generated apps, another
2,096 across Lovable/Bolt/Replit/v0 — ~75% had exploitable holes), the same flaws kept
recurring: exposed secrets, broken access control / RLS off, secrets in the client bundle,
no rate limiting.

I turned them into a 21-rule catalogue and built VibeGuard around it: an AI rules pack so
the assistant writes secure-by-default code, plus CI gates that block the unsafe stuff before
merge. Next.js + Supabase for now. MIT, early, feedback very welcome — especially on false
positives.

Repo + the full catalogue: <LINK>

---

## r/webdev / r/devsecops
**Title:** VibeGuard: an OWASP-mapped rule catalogue + CI gates for AI-generated Next.js/Supabase code

**Body:**
Open-source, MIT. 21 vulnerability classes mapped to OWASP/ASVS, enforced three ways:
secure-by-default AI context rules, CI gates (gitleaks + Semgrep + privacy lint), and a
`governance.yaml` risk manifest that turns controls on proportional to the data the app
touches. Honest scope: reduces common flaws, doesn't certify "secure." Looking for review
of the Semgrep ruleset and the detection quality. <LINK>

---

## r/SideProject
**Title:** Built a security layer for AI-built apps as part of my doctorate — it's open source

**Body:**
VibeGuard catches the most common security holes in AI-generated web apps (exposed secrets,
broken access control, injection) before they ship. Research-backed (it's my doctoral artifact),
MIT-licensed, works as a Claude skill / Cursor rules / CI gates. Would love feedback. <LINK>
