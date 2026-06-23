# Contributing to VibeGuard

Thanks for helping make AI-built apps safer. VibeGuard is an open, research-backed project — contributions of rules, detections, fixes, and field evidence are all welcome.

## Ways to contribute

- **Propose a rule.** Add or refine an entry in `rules/catalogue.yaml`. Each rule needs: a clear `detect` description, the `enforce` control, a concrete `fix`, and an OWASP/standard reference.
- **Improve a detection.** Sharpen a Semgrep pattern, a secret-scan rule, or a privacy-lint check (in `ci/`, in progress).
- **Strengthen a template.** Make a secure starter more secure-by-default without adding friction.
- **Share evidence.** Real before/after findings on vibe-coded apps help validate (and improve) the catalogue.

## Ground rules

- **No security overclaiming.** Frame everything as *risk reduction*, never as "makes apps secure."
- **Lightweight beats thorough-but-ignored.** A control that slows builders down won't get used — keep it embedded and proportional.
- **Cite the standard.** Tie each rule to OWASP / ASVS / NIST where possible.

## Good first issues

Look for the `good-first-issue` label — usually new catalogue entries, doc fixes, or additional Semgrep patterns.
