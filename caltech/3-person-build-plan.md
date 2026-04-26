---
title: "Empathy Layer — 3-Person Build Plan (Caltech HackTech 2026)"
codename: Empathy Layer
event: Caltech HackTech 2026
soft_freeze: 2026-04-26 8 PM PDT
submit: 2026-04-26 11 PM PDT (Saturday)
hard_deadline: 2026-04-27 9 AM PDT (Sunday)
submitter: Johnny Sheng (Devpost)
authors: Junsoo Kim, Jacob Cho, Johnny Sheng (+ Emilie Duran on UI)
status: canonical build plan; supersedes the 4-lane decomposition for execution purposes
parent_docs:
  architecture: ./architecture-overview.md
  strategic_prd: ../_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
  technical_prd: ../_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md
  handoff_contract: ./engine/HANDOFF_CONTRACT.md
  engine_module_readme: ./engine/README.md
  brain_module_readme: ../junsoo/brain/README.md
---

# Empathy Layer — 3-Person Build Plan

> One engine. Two demo scenarios. Three humans, two days, ~48 person-hour budget.
> We collapse the original 4-lane split (Junsoo / Jacob / Johnny / Emilie) into
> **3 execution lanes** by merging Johnny + Emilie into a single "Stages 1+2 + UI"
> lane: they share the frontend integration touch-point and Emilie's UI consumes
> exactly the artifacts Johnny's runner emits. Cleaner ownership, fewer hand-offs.

---

## 1. Engine Summary (one paragraph)

The Empathy Layer engine takes a 30–90s video of a human, runs Meta's TRIBE V2
reverse-direction model to predict per-second per-region brain activation
across ~20,000 cortical vertices on the fsaverage5 mesh, runs a swarm of
per-region specialist agents on Cerebras K2 to interpret what each region was
contributing, generates a candidate empathy paragraph using Claude Opus 4.7,
then iteratively rewrites and re-scores that paragraph for up to 8 rounds —
each round scoring the candidate's TEXT through TRIBE V2 forward-direction and
comparing the predicted brain pattern against the actual video's brain pattern
via cosine similarity. The loop stops on plateau (delta < 0.02 over 2 rounds)
or at round 8. The winning paragraph is falsified against a **control video**'s
brain pattern; a large delta (≥ 0.40) proves the description is anchored to
this specific scene, not generically plausible. Output is a three-section
empathy-layer document (Vision Report / Empathy Paragraph / Falsification
Evidence) rendered for the decision-maker. **Pre-cache everything for demo-day.**

---

## 2. The 3 Lanes (ownership table)

| Lane | Owner | Primary deliverables | Key files |
|---|---|---|---|
| **Brain Encoding** | Junsoo Kim | TRIBE V2 reverse + forward; pre-cached brain JSON for all demo + control videos; brain schema | `junsoo/brain/{schema.py, reverse.py, forward.py}`, `junsoo/prerendered/*.json` |
| **Swarm + Iterative Loop** | Jacob Cho | K2 per-region specialist swarm (2-pass cross-talk); iterative scoring loop (8 rounds, plateau detection); cosine sim; falsification delta; per-region attribution | `caltech/engine/{swarm.py, iterative_loop.py, score.py, falsification.py, registry.py}` |
| **Stages 1+2 + UI** | Johnny Sheng (engine) + Emilie Duran (UI) | Stage 1 Qwen3-VL via OpenRouter; Stage 2 Claude Opus 4.7; prompt registry hot-swap; guardrails; orchestrator runner; empathy-layer document UI (3 framing modes); demo-day runbook | `caltech/engine/{stage1.py, stage2.py, guardrails.py, runner.py}`, `caltech/pitch-deck/app/components/*.tsx` |

Cross-lane interfaces (single source of truth): `caltech/engine/HANDOFF_CONTRACT.md`.

---

## 3. Person 1 — Brain Encoding (Junsoo)

Junsoo owns the data layer that the rest of the engine scores against.
Without his forward-direction callable, Jacob's iterative loop cannot run.

| # | Task | Target file | Hours | IN | OUT |
|---|---|---|---|---|---|
| J1 | TRIBE V2 reverse pre-cache for ALL demo videos | `junsoo/brain/reverse.py` + `junsoo/prerendered/<video_id>.json` | 2.5 | MP4 (≥720p, 30–90s) | `BrainPattern` JSON per `caltech/engine/HANDOFF_CONTRACT.md` §1 |
| J2 | TRIBE V2 forward implementation (text → predicted brain) — **the load-bearing new capability** | `junsoo/brain/forward.py`, exposes `predict_brain_from_text(paragraph) -> PredictedBrainPattern` | 4.0 | candidate paragraph (str) | `PredictedBrainPattern` JSON per HANDOFF_CONTRACT §2 |
| J3 | Control video brain pattern pre-cache (one workplace + one consumer) | `junsoo/prerendered/control_*.json` | 1.0 | control MP4 | `BrainPattern` JSON, identical schema to J1 |
| J4 | Pydantic schema (already drafted; finalize + lock) | `junsoo/brain/schema.py` | 0.5 | — | `BrainPattern`, `PredictedBrainPattern`, `RegionActivation`, `BrainFrame` |
| J5 | `MOCK_FORWARD=1` offline mode for forward path (deterministic seeded fixture so Jacob can develop without GPU) | `junsoo/brain/forward.py` | 1.0 | env flag | identical schema, deterministic stub output |
| J6 | Hand-off contract docs + smoke test | `junsoo/brain/test_brain_offline.py` + this plan + HANDOFF_CONTRACT.md | 1.0 | — | passing pytest |
| J7 | Buffer / GPU-deploy / Vultr glue / debugging | n/a | 2.0 | — | working live mode |
| | **Total** | | **12.0 hrs** | | |

**Critical detail:** J2 (TRIBE V2 forward) is the **single biggest unknown**
in the build. Meta released TRIBE V2 reverse-direction inference; the forward
direction (text → brain) has to be implemented by Junsoo on top of TRIBE V2's
shared encoder. If forward fails, the entire iterative loop collapses. **Mitigation:**
ship a deterministic seeded mock first (`MOCK_FORWARD=1`) so Jacob can build
the loop in parallel; promote to live forward inference only when J2 is green.

---

## 4. Person 2 — Swarm + Iterative Loop (Jacob)

Jacob owns the K2 surface in **two roles** (per architecture-overview.md):
the per-region specialist swarm AND the iterative-loop orchestrator. Same K2
endpoint, two distinct prompt configurations.

| # | Task | Target file | Hours | IN | OUT |
|---|---|---|---|---|---|
| K1 | K2 client base (already integrated; verify endpoint + retry pattern from `research/wiki/tools/k2-think.md`) | `caltech/engine/swarm.py` (k2 client init) | 0.5 | env: `K2_API_KEY`, `K2_BASE_URL` | working OpenAI-compat client |
| K2 | Per-scenario specialist roster registry (workplace vs. consumer roster) | `caltech/engine/registry.py` | 1.0 | scenario tag (str) | list[SpecialistConfig] |
| K3 | Extend swarm to **2-pass cross-talk** (Round 1 independent hypotheses; Round 2 each specialist re-evaluates given other specialists' Round-1 outputs) | `caltech/engine/swarm.py` | 3.0 | `BrainPattern` + roster | per-region semantic interpretation + cross-region edge weights (`SwarmOutput`) |
| K4 | Iterative scoring loop (8 rounds, plateau detection, per-round logging) | `caltech/engine/iterative_loop.py` | 3.0 | `BrainPattern` (target) + Stage 2 callable + `predict_brain_from_text` callable | `EmpathyDocument.iterative_loop` payload (round trajectory + best paragraph + final score) |
| K5 | Cosine similarity scorer (target vs. predicted) — uses `BrainPattern.flatten_regions()` and `PredictedBrainPattern.flatten_regions()` | `caltech/engine/score.py` | 0.5 | two flattened vectors | float in [-1, 1] (clipped to [0, 1] for display) |
| K6 | Falsification delta computation | `caltech/engine/falsification.py` | 1.0 | best paragraph + control `BrainPattern` | `FalsificationCheck` (main_score, control_score, delta, verdict) |
| K7 | Round trajectory logging + per-region attribution observability (cross-talk-soup defense) | `caltech/engine/iterative_loop.py` (extension) | 1.5 | every round | structured JSON log per round |
| K8 | Pre-cache iterative-loop trajectory bake (Saturday 8 AM) | `caltech/engine/iterative_loop.py` (cache mode) | 1.0 | demo BrainPattern | trajectory JSON committed to repo |
| K9 | Buffer / asyncio.Semaphore tuning / K2 rate limit handling | n/a | 1.5 | — | hardened loop |
| | **Total** | | **13.0 hrs** | | |

**Critical detail:** Jacob can build K3–K7 **without Junsoo's live forward**
by depending on `MOCK_FORWARD=1`. As soon as J2 lands, Jacob flips the env
flag and runs end-to-end live.

---

## 5. Person 3 — Stages 1+2 + UI (Johnny + Emilie merged)

The merged lane owns the engine's bookends (Stage 1 in, Stage 2 out, plus the
runner that wires everything to the UI) AND the user-facing surface that
displays the result. Johnny drives the Python engine glue; Emilie drives the
TSX/Tailwind components. They share `EmpathyDocument` as the contract.

| # | Task | Target file | Owner | Hours | IN | OUT |
|---|---|---|---|---|---|---|
| O1 | Stage 1 vision: Qwen3-VL via OpenRouter (`qwen/qwen3-vl-235b-a22b-instruct`) | `caltech/engine/stage1.py` | Johnny | 1.5 | MP4 path | `VisionReport` JSON (scene, actions, tools, temporal sequence) |
| O2 | Stage 2 empathy synthesis: Claude Opus 4.7 (`claude-opus-4-7`) | `caltech/engine/stage2.py` | Johnny | 1.5 | VisionReport + BrainPattern + SwarmOutput + (round N feedback) | candidate paragraph (str) |
| O3 | Prompt registry hot-swap (Ironsight ↔ Listen Labs framing) | `caltech/engine/registry.py` (shared with Jacob's roster registry) | Johnny | 1.0 | scenario tag | prompt template + specialist roster |
| O4 | Forbidden-claim guardrails (regex pre-flight on every Opus output, per architecture §6) | `caltech/engine/guardrails.py` | Johnny | 1.0 | candidate paragraph | passed/violation list (auto-retry with stricter prompt on violation) |
| O5 | End-to-end orchestrator runner (CLI) — wires reverse → swarm → loop → falsification → emits `EmpathyDocument` | `caltech/engine/runner.py` | Johnny | 2.0 | MP4 path + scenario tag | `EmpathyDocument` JSON |
| O6 | Demo-day runner with pre-cache fallback (per-stage swap-in if any live call exceeds latency budget) | `caltech/engine/runner.py` (`MOCK_*` env vars + per-stage cache lookup) | Johnny | 1.5 | demo input + cache dir | guaranteed sub-90s output |
| O7 | Empathy-layer document UI (3-section render: §A Vision Report / §B Empathy Paragraph / §C Falsification Evidence) | `caltech/pitch-deck/app/components/EmpathyDocument.tsx` (new) | Emilie | 2.5 | `EmpathyDocument` JSON | rendered React view |
| O8 | Round trajectory visualization (the BEAT-3 hero reveal — score climbing 0.42 → 0.84 as fillable bar across ~25s) | `caltech/pitch-deck/app/components/RoundTrajectory.tsx` (new) | Emilie | 2.0 | `iterative_loop.round_trajectory[]` | animated bar/timeline |
| O9 | Three framing-mode toggle (workplace / consumer / pavilion typography + copy variants) | `caltech/pitch-deck/app/components/EmpathyDocument.tsx` (extension) | Emilie | 1.5 | `EmpathyDocument` + mode | mode-correct render |
| O10 | Demo runbook (sequence BEAT-0 → BEAT-5 with absolute time anchors, fallback decision logs) | `caltech/demo-script.md` (extend) + `caltech/engine/runner.py` (`--runbook`) | Johnny | 1.0 | — | runnable script |
| O11 | Buffer / Wi-Fi backup MP4 / cross-browser checks | n/a | shared | 1.5 | — | hardened demo |
| | **Total (Johnny portion)** | | | **9.5 hrs** | | |
| | **Total (Emilie portion)** | | | **6.0 hrs** | | |
| | **Total (combined lane)** | | | **15.5 hrs** | | |

---

## 6. Hand-Off Contracts (the 3 cross-lane interfaces)

Single-page reference: `caltech/engine/HANDOFF_CONTRACT.md`.

### Contract 1 — `BrainPattern`

- **Producer:** Junsoo (J1, J3) — both demo videos and control videos.
- **Consumers:** Jacob's iterative loop (target reference); Jacob's swarm (per-region activation input); Johnny's runner (input to Stage 2).
- **Schema location:** `junsoo/brain/schema.py` (`BrainPattern`).
- **Wire format:** JSON file in `junsoo/prerendered/<video_id>.json`.

### Contract 2 — `predict_brain_from_text(paragraph) -> PredictedBrainPattern`

- **Producer:** Junsoo (J2, J5) — implements the callable.
- **Consumer:** Jacob's iterative loop calls it **once per round** (up to 8 calls per video).
- **Signature:** `predict_brain_from_text(paragraph: str) -> PredictedBrainPattern` (Pydantic model).
- **Schema location:** `junsoo/brain/schema.py` (`PredictedBrainPattern`).
- **Implementation file:** `junsoo/brain/forward.py`. Honors `MOCK_FORWARD=1` for offline development.

### Contract 3 — `EmpathyDocument`

- **Producers:** Jacob's loop (`iterative_loop.round_trajectory`, `final_score`, `per_region_attribution`) + Johnny's runner (assembles all three sections, wraps with `VisionReport` + `FalsificationCheck`).
- **Consumer:** Emilie's UI (`caltech/pitch-deck/app/components/EmpathyDocument.tsx`).
- **Schema location:** `caltech/engine/runner.py` (Pydantic model `EmpathyDocument`).
- **Wire format:** JSON emitted by the CLI runner; ingested by Next.js page via fetch or pre-baked static import.

Full JSON examples for all three contracts: see `caltech/engine/HANDOFF_CONTRACT.md`.

---

## 7. Critical Path / Dependency Graph

```
            J1 reverse pre-cache  ───┐
                                     │
            J4 schema lock ──────────┼──> Jacob can start K3 swarm
                                     │
            J5 MOCK_FORWARD=1  ──────┴──> Jacob can start K4 iterative loop
                                              │
                                              ├──> K5 cosine + K6 falsification + K7 attribution
                                              │
            J2 LIVE forward ─────────────────────> flip MOCK_FORWARD=0; live mode unlocked

            O1 stage1 + O2 stage2 ──> O5 runner ──┐
                                                  │
            K4 iterative loop ────────────────────┴──> EmpathyDocument JSON ──> O7 UI
                                                                                  │
                                                                                  └──> O8 round trajectory viz

            J3 control pre-cache ────────────────> K6 falsification delta ─────> §C of UI

            ALL OF THE ABOVE ───────────────> O6 demo-day runner with cache fallback ──> stage
```

**Single biggest blocking dependency:** J2 (TRIBE V2 forward). It blocks live
mode for the entire iterative loop. **Mitigation:** J5 (`MOCK_FORWARD=1`)
unblocks Jacob immediately so K3–K7 can land in parallel. The live promotion
is a one-line env-var flip late on Day 2.

---

## 8. Daily Ordering

### Day 1 — Friday 2026-04-25

**Morning (9 AM – 1 PM):**

- Junsoo: J4 (lock schema) → J1 (reverse pre-cache, first demo video).
- Jacob: K1 (K2 client) → K2 (specialist roster registry) → K5 (cosine scorer; can be developed against synthetic vectors).
- Johnny: O1 (Stage 1 Qwen3-VL) → O2 (Stage 2 Opus skeleton).
- Emilie: wireframes for empathy-layer document (3 framing modes); typography spec.

**Afternoon (1 PM – 8 PM):**

- Junsoo: J2 (forward implementation start) → J5 (MOCK_FORWARD landed and committed by 6 PM so Jacob unblocks).
- Jacob: K3 (2-pass swarm against pre-cached BrainPattern) → K4 (iterative loop scaffolding using MOCK_FORWARD).
- Johnny: O3 (registry hot-swap) → O4 (guardrails) → O5 (runner skeleton wiring stage1 + stage2).
- Emilie: O7 (empathy doc component scaffold) using sample fixture from `caltech/engine/sample_fixture.py`.

**Friday 8–11 PM smoke gate:** all 8 smoke tests in `_bmad-output/.../technical-prd.md` §10. Goal: end-to-end on MOCK_FORWARD passes for one demo video.

### Day 2 — Saturday 2026-04-26

**Morning (8 AM – 1 PM):**

- Junsoo: J3 (control video pre-cache, both scenarios) → J2 finalize (live forward inference).
- Jacob: K6 (falsification delta) → K7 (per-region attribution logging) → K8 (pre-cache iterative-loop trajectory bake — 8 AM target).
- Johnny: O5 finalize → O6 (demo-day runner with per-stage fallback).
- Emilie: O7 finalize → O8 (round trajectory viz — the BEAT-3 hero) → O9 (3 framing modes).

**Afternoon (1 PM – 8 PM):**

- Junsoo: live-mode flip (MOCK_FORWARD=0) → debug any forward inference quality drift → standby for hot-fix.
- Jacob: end-to-end live runs across all demo + control videos; tune asyncio.Semaphore concurrency; lock pre-cache trajectory.
- Johnny: O10 (demo runbook) → O11 (Wi-Fi backup MP4 + cross-browser).
- Emilie: launch video assembly (Acts 1+4 cinematic) + Devpost copy + pitch deck final.
- **6 PM checkpoint:** pre-cache assembly test — entire 90s demo runs on pre-recorded only.
- **8 PM:** feature freeze.
- **8–11 PM:** Devpost upload, video upload, pitch deck final, dry-run on stage hardware.
- **11 PM:** Devpost submit. (Hard deadline 9 AM Sunday.)

---

## 9. Pre-Cache Asset Bundle (mandatory before demo)

Every JSON / MP4 below must exist on disk before Saturday 6 PM. The runner
falls back to these in order if any live call exceeds budget.

| Asset | Path | Owner | Size |
|---|---|---|---|
| Demo video brain pattern (workplace) | `junsoo/prerendered/workplace_demo.json` | Junsoo | ~2-5 MB |
| Demo video brain pattern (consumer) | `junsoo/prerendered/consumer_demo.json` | Junsoo | ~2-5 MB |
| Control video brain pattern (workplace baseline) | `junsoo/prerendered/control_workplace.json` | Junsoo | ~2-5 MB |
| Control video brain pattern (consumer baseline) | `junsoo/prerendered/control_consumer.json` | Junsoo | ~2-5 MB |
| Stage 1 vision report (workplace) | `caltech/engine/cache/vision_workplace.json` | Johnny | ~5 KB |
| Stage 1 vision report (consumer) | `caltech/engine/cache/vision_consumer.json` | Johnny | ~5 KB |
| Per-region swarm output (workplace) | `caltech/engine/cache/swarm_workplace.json` | Jacob | ~20 KB |
| Per-region swarm output (consumer) | `caltech/engine/cache/swarm_consumer.json` | Jacob | ~20 KB |
| Iterative-loop round trajectory (workplace) | `caltech/engine/cache/loop_workplace.json` | Jacob | ~50 KB |
| Iterative-loop round trajectory (consumer) | `caltech/engine/cache/loop_consumer.json` | Jacob | ~50 KB |
| Falsification check output (workplace) | `caltech/engine/cache/falsify_workplace.json` | Jacob | ~1 KB |
| Falsification check output (consumer) | `caltech/engine/cache/falsify_consumer.json` | Jacob | ~1 KB |
| Final EmpathyDocument (workplace) | `caltech/engine/cache/document_workplace.json` | Johnny | ~10 KB |
| Final EmpathyDocument (consumer) | `caltech/engine/cache/document_consumer.json` | Johnny | ~10 KB |
| Per-beat fallback MP4s (BEAT-1 / 2 / 3 / 4 / 5) | `caltech/pitch-deck/public/beats/*.mp4` | Emilie | ~10–30 MB ea. |
| Voiceover WAV (Acts 1+4) | `caltech/pitch-deck/public/voiceover.wav` | Emilie | ~5 MB |
| Full 90s backup MP4 (Wi-Fi-loss contingency) | `caltech/pitch-deck/public/full_demo_backup.mp4` | Johnny + Emilie | ~50 MB |

---

## 10. Definition of Done (the win condition)

Submission counts as DONE when **every** box below is checked:

- [ ] `caltech/engine/runner.py --scenario workplace --video <demo.mp4>` emits a valid `EmpathyDocument` JSON in ≤ 90s (live mode) OR ≤ 5s (full pre-cache mode).
- [ ] `caltech/engine/runner.py --scenario consumer --video <demo.mp4>` does the same.
- [ ] All 14 pre-cache assets in §9 exist and are committed.
- [ ] Iterative-loop final score ≥ 0.75 on at least one demo video.
- [ ] Falsification delta ≥ 0.40 on at least one demo video.
- [ ] Empathy paragraph passes guardrail regex pre-flight (no forbidden claims per architecture §6).
- [ ] UI renders `EmpathyDocument` in all 3 framing modes (workplace / consumer / pavilion).
- [ ] Round trajectory visualization plays the score climb in ≤ 25s.
- [ ] 8 smoke tests in technical-PRD §10 all green.
- [ ] Wi-Fi backup MP4 plays the full 90s demo from disk.
- [ ] Devpost writeup submitted by 11 PM Saturday.
- [ ] At least one team member has rehearsed the 90s pitch on stage hardware before 11 PM Saturday.

---

## 11. Risks + Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **TRIBE V2 forward (J2) fails or produces poor scores** | Medium | Catastrophic — kills iterative loop | (1) Build `MOCK_FORWARD=1` on Day 1 morning so Jacob is never blocked. (2) Fallback to scoring against TRIBE V2 reverse on text re-rendered as a static frame (degenerate but legal). (3) Worst case: pre-bake the round trajectory and run loop in "replay" mode — honest framing per architecture §8. |
| **K2 rate limits / 401s / endpoint instability** (per `project_k2_endpoint_issue.md`) | Medium | High — breaks swarm + loop | Use IFM-prefixed key with IFM host (NOT api.cerebras.ai). 3-attempt retry with exponential backoff. Pre-cache swarm + loop outputs Saturday 8 AM. Swap to mocked specialists if K2 down at demo time. |
| **Claude Opus 4.7 latency exceeds 5s/candidate** | Low-Medium | Medium — extends iterative loop past 60s | Use Sonnet 4.5 for early rounds (cheaper, faster); Opus only for final candidate refinement. Pre-cache full trajectory. Show 5-round shortened loop (≤ 35s) instead of 8-round if needed. |
| **Video sourcing delay** (we don't have demo MP4s yet) | Medium | High — blocks J1 reverse pre-cache | Source 4 videos by Friday 6 PM (2 demo + 2 control); fallback to publicly-licensed footage from Pexels / Pond5. Junsoo runs J1 in batch overnight Friday → Saturday morning. |
| **Vultr GPU sourcing / OOM on TRIBE V2 reverse** | Low-Medium | High — blocks J1 + J3 | Vultr H100 instance pre-provisioned; TRIBE V2 batch script tested on a 10s clip first; pre-cache outputs immediately to avoid re-running. |
| **Demo Wi-Fi failure** | Medium (venue) | High — kills live mode entirely | Full 90s backup MP4 (§9). Demo runbook (`O10`) defaults to pre-cache mode; live mode runs in the background only. |
| **Forbidden-claim guardrail false positives** | Low | Low — annoying not fatal | Auto-retry with stricter prompt; manual paragraph override committed to `cache/document_*.json`. |

---

## 12. What This Gets Us at HackTech

Sponsor-track confidence ranking (highest first):

1. **IFM K2 Think (CORE)** — K2 IS the swarm voice + loop orchestrator; per-region specialist fan-out at ~2000 tok/s is exactly what the K2 brief asks for.
2. **Best Use of AI (HARD TARGET)** — the engine enacts the YEA rubric: surface evidence (brain pattern + falsification), let the user judge (empathy paragraph reads as observation not diagnosis), system never recommends.
3. **Ironsight (CORE)** — workplace scenario maps directly to spatial-intelligence brief; TRIBE V2 + per-region swarm IS the spatial-intelligence layer.
4. **Listen Labs (CORE)** — same engine simulates humanity across industries; "one engine, N scenarios" is the Listen Labs proof.
5. **Sideshift (CORE substrate)** — consumer day-to-day footage scenario; brain-grounded journal = Sideshift's substrate use case.
6. **Creativity** — Clair de Lune protocol inverted (90.4% precedent cited verbatim) — methodology re-use is the creativity story.
7. **YC stretch** — defensible because the brain-encoding ground truth + falsification delta is something no LLM-only competitor can replicate.

---

*End of build plan. For schema details see `caltech/engine/HANDOFF_CONTRACT.md`.
For module structure see `caltech/engine/README.md` and `junsoo/brain/README.md`.*
