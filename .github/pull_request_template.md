<!-- VibeGuard PR checklist — the approval path, not a committee. Tick what applies. -->

## What & why


## Security checklist (VibeGuard)

- [ ] **No secrets** added to code, client bundle, or `NEXT_PUBLIC_` vars (VG-007, VG-008)
- [ ] Every record read/write has an **ownership/authorization check**; Supabase **RLS** on for new tables (VG-002, VG-003)
- [ ] Auth/authorization enforced **server-side**; passwords via Argon2/bcrypt (VG-001, VG-006)
- [ ] Inputs **validated server-side**; queries parameterized; no raw-HTML/shell sinks (VG-011, VG-012, VG-013)
- [ ] Session tokens in **HttpOnly cookies**, not localStorage; security headers present (VG-015, VG-018)
- [ ] No **PII/secrets in logs or URLs**; PII fields have a delete path + retention (VG-016, VG-017)
- [ ] New dependencies **verified to exist** and current; lockfile updated (VG-020)
- [ ] Tests cover the change incl. an **abuse/authorization case** (VG-021)

## Overrides
<!-- If waiving any rule, record it in governance.yaml with a reason. -->

> CI gates must be green. A human reviewer is required — functional ≠ production-safe.
