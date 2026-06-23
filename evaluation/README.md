# VibeGuard evaluation harness

Reproducible measurement of VibeGuard's effect: scan apps built **without** it (`corpus/baseline`)
vs **with** it (`corpus/treated`), count findings per vulnerability class, and compute the
**reduction rate** — the headline metric from the development plan.

## Run
```bash
node evaluation/run-eval.mjs
```
Outputs `evaluation/results/report.md` and `findings.json`, and prints a summary.

## How it works
- `scanners.mjs` applies self-contained VG detectors (no external deps) to each app's source.
- `run-eval.mjs` aggregates baseline vs treated totals per `VG-NNN` and computes
  `reduction = (baseline − treated) / baseline`.

## Adding to the corpus
Drop an app folder under `corpus/baseline/<name>` and its treated counterpart under
`corpus/treated/<name>`, then re-run. For the full study, generate the corpus across varied
prompts on the reference stack (Next.js + Supabase) and pair each baseline with a VibeGuard build.

## Scope & honesty
The bundled corpus is a **demo pair (N = 1)** that validates the *pipeline*, not the *claim*.
The substantive evaluation (larger N, manual triage of true positives, a DAST sample, and
expert ratings) is P4–P5 and needs real API budget + practitioner participants. Detector counts
are a proxy; VibeGuard reduces common flaws — it does not certify an app "secure."
