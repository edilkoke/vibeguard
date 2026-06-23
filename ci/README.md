# VibeGuard CI gates

Enforcement layer for the catalogue. **Red blocks merge.** The workflow lives at
`.github/workflows/vibeguard.yml` and runs on every PR + push to `main`.

| Gate | Tool | Closes |
|------|------|--------|
| Secret scan | gitleaks (`ci/gitleaks.toml`) | VG-007, VG-008 |
| Common-secret blocklist | `ci/check-common-secrets.mjs` | VG-007 |
| SAST | Semgrep (`ci/semgrep/vibeguard.yml`) | VG-006, VG-011–016 |
| Privacy lint | `ci/privacy-lint.mjs` | VG-016, VG-017 |
| Dependency audit | `npm audit` | VG-020 |
| Tests | `npm test` | VG-021 |

## Local use
```bash
node ci/check-common-secrets.mjs
node ci/privacy-lint.mjs
pipx install pre-commit && pre-commit install   # runs gitleaks + the two checks on every commit
```

## Branch protection (the human-review half)
CI alone isn't enough — require a green run **and** one review before merge. Once the repo
exists, apply protection with the GitHub CLI:

```bash
gh api -X PUT repos/OWNER/REPO/branches/main/protection \
  -f "required_status_checks[strict]=true" \
  -f "required_status_checks[contexts][]=gates" \
  -F "enforce_admins=true" \
  -F "required_pull_request_reviews[required_approving_review_count]=1" \
  -F "restrictions=null"
```

This delivers the "approval path, not a committee": no green CI + no review = no merge.

> SAST is noisy and blind to runtime logic flaws. For anything that ships, pair these gates
> with DAST and an LLM/architectural review (P4). VibeGuard reduces risk; it does not certify "secure."
