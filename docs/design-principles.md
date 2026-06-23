# Design principles

VibeGuard instantiates four principles drawn from qualitative interviews with Australian SMB practitioners. Each is a concrete mechanism, not an aspiration.

| Principle | What it means | Mechanism in VibeGuard |
|-----------|---------------|------------------------|
| **Proportionality** | Match governance intensity to actual risk. | `governance.yaml` declares what the app touches; that selects which rules are mandatory and sets `enforce_level`. |
| **Embeddedness** | Governance lives where the work happens, not in a separate process. | Rules ride inside the AI context (`ai-context/`) and CI gates; the assistant reviews itself at generation time. "An approval path, not a committee." |
| **Adaptability** | Flex to builder capability, sector, and stack. | Capability tiers; v1 targets the *builder* tier on Next.js + Supabase; consumer/power-user tiers are designed extensions. |
| **Sustainability** | Viable within SMB resources. | Runs inside existing GitHub; assumes no dedicated security staff; overhead measured and kept minimal. |

**The one-sentence strategy:** keep the artifact small and the evaluation heavy — a lightweight package that is easy to adopt, paired with measured before/after evidence that makes the contribution credible.
