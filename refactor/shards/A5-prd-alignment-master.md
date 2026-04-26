# SHARD A5 — Master PRD-alignment audit + use-case fidelity

You are an audit-only Claude instance. Do NOT modify code. This shard is the cross-cutting alignment check; you read the most documents.

## Read first
- `refactor/CONSTRAINTS.md` and `refactor/CONTRACTS.md`
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` IN FULL
- `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (strategic; skim for the use-case framing per scenario)
- `caltech/architecture-overview.md` IN FULL
- `caltech/use-cases/ironside.md` (or whatever `caltech/use-cases/` files exist about Ironsight)
- `caltech/use-cases/listenlabs-sideshift.md` (or similar)
- `caltech/demo-script.md` if present

## Investigate
1. **Forbidden-claim guardrails.** PRD §5 lists forbidden phrasings (reverse inference, clinical claims, sub-second predictions, population norms, inflated TRIBE numbers). Read `backend/services/guardrails.py`. Are all 5 categories enforced? Any missed?
2. **Latency budget.** PRD §3 demo end-to-end ≤ 90s. Sum the new pipeline's expected latency: Qwen vision ≤ 10s + cache lookup ≈ 0s + swarm-loop simulation (8 rounds × 7 specialists × K2 latency) + falsification + Opus final. Estimate. Will it fit?
3. **Two-scenario contract** (PRD §2). Does the current backend support `ironsight_workplace` AND `listenlabs_sideshift_consumer` scenarios? Where is the prompt registry that hot-swaps per scenario? (`backend/prerendered/<clip>/scenario.json` exists; how is it consumed?)
4. **Falsification check** (PRD §6.6). The current `services/falsification.py` — does it actually have a control video brain JSON to score against? Is the verdict logic (`> 0.40 = anchored`) honored?
5. **Sponsor-pitch alignment.**
   - Does the swarm-loop simulation make the IFM K2 sponsor pitch obvious? (K2 is doing real load-bearing parallel reasoning, not a side API call.)
   - Does the modular Opus output address Listen Labs's "simulate the consumer industry" angle?
   - Is the Ironsight workplace use case actually demonstrated end-to-end with `30s_ironsite.mp4`?
6. **Use-case modularity check.** The two demo clips are `30s_ironsite` (Ironsight prompt) and `30s_twitter` (Listen Labs prompt). For each, walk the pipeline mentally and document what Opus would say at the end. Is the simulation's extraction rich enough to differentiate? Or would Opus produce roughly the same paragraph for both?
7. **Demo script readiness.** If `caltech/demo-script.md` exists, cross-check: does the current backend produce the artifacts the demo script promises? (e.g., a hero paragraph, a falsification delta, a per-region attribution table.)
8. **Cross-shard coherence.** A1, A2, A3, A4 are auditing specific subsystems. Are there any global concerns NONE of them would catch? (e.g., timing of cache warming on backend boot; race condition between WS swarm events and HTTP empathy fetch.)

## Report (write to `refactor/audits/A5-prd-alignment-master.md`)

Required sections:
- **PRD requirement matrix** — every PRD §3 + §4 + §6 + §10 requirement, current state (✅/⚠️/❌), file ref, gap.
- **Latency budget estimate** — table per stage with current vs PRD target.
- **Forbidden-claim guardrail coverage** — 5 categories × current enforcement.
- **Scenario routing trace** — exact code path from upload → scenario.json → prompt selection → Opus output.
- **Falsification readiness** — control brain JSON present? verdict threshold honored? per-region attribution computed?
- **Sponsor pitch alignment** — IFM K2 / Ironsight / Listen Labs / Best Use of AI / YC stretch — for each, does the current architecture make the pitch obvious to a judge?
- **Use-case differentiation test** — predicted Opus output for each of the 2 clips with current pipeline. Does it differentiate enough?
- **Cross-cutting concerns** — anything A1-A4 would miss.
- **Top-5 priority adjustments** — ranked list of changes that would have the biggest demo-day payoff. Cite PRD section per item.

Do NOT write code. Just the report.

## Acceptance
Report at `refactor/audits/A5-prd-alignment-master.md` with all 9 sections. Every PRD requirement has a current-state and a gap. Latency table totals. Sponsor alignment covers all 5 sponsor tracks.
