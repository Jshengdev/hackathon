---
title: Archived v1 sections from `ironsight-listenlabs-prd.md`
archived_by: R-DOCS shard (refactor/docs branch)
archived_at: 2026-04-25 (post-audit DOCS-FROZEN PHASE 1)
why: Strategic PRD §1 + §2 + §3 narrative + Architecture Diagram + Data Transfer Spec + Demo Visualization were rewritten to v2 framing (post-TRIBE-cut, K2-three-roles, Stage-4-Opus-polish-only, embedding-proxy falsification). The v1 prose is preserved here for traceability per R-DOCS preservation discipline. Authoritative v2 source-of-truth is the technical PRD v2.1 (../ironsight-listenlabs-technical-prd.md §3 + §4) and the canonical summary (../../../caltech/NEW-ARCHITECTURE.md).
canonical_v2: ../../../caltech/NEW-ARCHITECTURE.md
---

# Archived v1 strategic-PRD sections

> Read this file ONLY for historical traceability. Every claim below is superseded by the v2 architecture. The strikethrough lines in the live strategic PRD point at this archive.

## Architecture Diagram (v1 — Two-Stage Agent Pipeline with Live TRIBE Forward + Reverse)

```
                          [INPUT: Video of human action]
                                          │
                                          ▼
              ┌───────────────────────────────────────────────┐
              │              STAGE 1                          │
              │      Vision Classification Agent              │
              │                                               │
              │  Tool: Gemini 2.5 Pro (via OpenRouter)        │
              │        OR Claude vision API                   │
              │                                               │
              │  Job: Describe what happened in the scene     │
              │       — actions, environment, tools, temporal │
              │       sequence, spatial relationships         │
              │                                               │
              │  Output: Vision Report JSON                   │
              │          { scene_summary, actions[],          │
              │            temporal_sequence[],               │
              │            spatial_relationships[] }          │
              └───────────────────────┬───────────────────────┘
                                      │
                      ┌───────────────┴───────────────┐
                      │                               │
                      ▼                               │
        ┌─────────────────────────────┐               │
        │   TRIBE V2 (REVERSE)        │               │
        │   Brain-Encoding Inference  │               │
        │                             │               │
        │   Tool: Junsoo's pipeline   │               │
        │   (Meta FAIR research)      │               │
        │                             │               │
        │   Job: Run input video      │               │
        │   through TRIBE V2          │               │
        │   → per-second per-region   │               │
        │   brain-response data       │               │
        │   layer (~20K vertices,     │               │
        │   fsaverage5 mesh, 1Hz,     │               │
        │   5s HRF lag)               │               │
        │                             │               │
        │   Output: BRAIN-PATTERN     │               │
        │           TARGET (json)     │               │
        │   { time_s, region_id,      │               │
        │     activation, vertices[]} │               │
        └────────────┬────────────────┘               │
                     │                                │
                     │      ┌─────────────────────────┘
                     │      │
                     ▼      ▼
              ┌─────────────────────────────────────────────┐
              │              STAGE 2                        │
              │     Empathy Synthesis Agent                 │
              │                                             │
              │  Tool: Claude Opus (per Decision 008)       │
              │                                             │
              │  Inputs:                                    │
              │   1. Vision Report (Stage 1)                │
              │   2. BRAIN-PATTERN TARGET (TRIBE)           │
              │   3. (Optional) Other Ironside data layers  │
              │   4. Prior round score + per-region miss    │
              │      (if iterative round > 1)               │
              │                                             │
              │  Job: Generate emotionally-intelligent      │
              │       paragraph describing what the         │
              │       human felt during the footage,        │
              │       grounded in brain-pattern evidence    │
              │                                             │
              │  Output: Candidate Paragraph #N             │
              └────────────────────┬────────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────────┐
              │       ITERATIVE SCORING LOOP                │
              │   (Clair de Lune protocol INVERTED)         │
              │                                             │
              │   Orchestrator: K2 Cerebras                 │
              │       (~1,300 tok/s)                        │
              │                                             │
              │   For up to 8 rounds:                       │
              │                                             │
              │   ┌───────────────────────────────────┐     │
              │   │ a) Score Candidate #N via         │     │
              │   │    TRIBE V2 (FORWARD direction):  │     │
              │   │    paragraph text → predicted     │     │
              │   │    brain-pattern                  │     │
              │   │                                   │     │
              │   │ b) Cosine similarity:             │     │
              │   │    candidate_brain_pattern vs.    │     │
              │   │    BRAIN-PATTERN TARGET           │     │
              │   │    = SCORE                        │     │
              │   │                                   │     │
              │   │ c) IF score plateaus (delta < 0.02 │    │
              │   │    over 2 rounds) OR round == 8:  │     │
              │   │      RETURN best paragraph        │     │
              │   │    ELSE:                          │     │
              │   │      Pass score + per-region miss │     │
              │   │      back to Stage 2;             │     │
              │   │      generate Candidate #N+1      │     │
              │   └───────────────────────────────────┘     │
              │                                             │
              │   Output: BEST PARAGRAPH + FINAL SCORE      │
              └────────────────────┬────────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────────┐
              │        FALSIFICATION CHECK                  │
              │                                             │
              │   Score the BEST PARAGRAPH against a        │
              │   CONTROL VIDEO's brain-pattern (different  │
              │   human or same human on different scene).  │
              │                                             │
              │   If FALSIFICATION DELTA (= main_score      │
              │   - control_score) is large (e.g., > 0.40), │
              │   the paragraph is PROVABLY ANCHORED to     │
              │   the original scene, not generically       │
              │   plausible.                                │
              │                                             │
              │   Output: FALSIFICATION DELTA               │
              └────────────────────┬────────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────────┐
              │         OUTPUT DOCUMENT                     │
              │      (The Empathy-Layer Document)           │
              │                                             │
              │   Three sections, rendered for the          │
              │   decision-maker (manager / consumer):      │
              │                                             │
              │   §1. Vision Report                         │
              │       (action-data baseline; what action    │
              │        data alone would have told you)      │
              │                                             │
              │   §2. Empathy Layer Paragraph               │
              │       (best paragraph from iterative loop;  │
              │        the empathy translation of what the  │
              │        human felt during the action)        │
              │                                             │
              │   §3. Falsification Evidence                │
              │       (similarity score + control delta +   │
              │        per-region attribution; proves the   │
              │        empathy layer is grounded)           │
              │                                             │
              │   Persona-driven framing:                   │
              │   • Workplace (boss-facing): preserves      │
              │     action data + adds context              │
              │   • Consumer (user-facing): daily journal   │
              │     entry; vault accumulation               │
              │   • Pavilion (judge-facing): demo artifact  │
              └─────────────────────────────────────────────┘
                                   │
                                   ▼
                        [DECISION-MAKER reads]
                            │             │
                  ┌─────────┘             └─────────┐
                  │                                 │
                  ▼                                 ▼
          [B2B Manager]                    [B2C User]
        Reads paragraph                  Saves daily entry
        before cutting corner            Knowledge graph grows
        Patient experience preserved     Future-Obsidian B2C
        Worker context-aware managed     Vault is theirs (Sideshift)
```

## Data Transfer Spec (v1)

| Stage | Input | Tool | Output | Latency target |
|---|---|---|---|---|
| Stage 1 | Video file (MP4, H.264, ≥720p, 30-90s) | Gemini 2.5 Pro (via OpenRouter) OR Claude vision API | Vision Report JSON | ≤ 10s |
| TRIBE V2 reverse | Same video file | Junsoo's pipeline (Meta FAIR research) | BRAIN-PATTERN TARGET JSON (~20K vertices/sec) | ≤ 30s for 30s clip |
| Stage 2 (Round 1) | Vision Report + BRAIN-PATTERN TARGET | Claude Opus | Candidate Paragraph #1 (~150-300 words) | ≤ 5s |
| TRIBE V2 forward (per round) | Candidate Paragraph text | Junsoo's forward-direction pipeline | Predicted brain-pattern JSON | ≤ 2s |
| Cosine similarity (per round) | Candidate vs. TARGET brain-pattern | Local computation | Score [0.0, 1.0] | ≤ 0.5s |
| Stage 2 (Round N+1) | Vision Report + TARGET + Round N score + per-region miss | Claude Opus | Candidate Paragraph #N+1 | ≤ 5s |
| Iterative loop total | (8 rounds × Stage 2 ~5s + TRIBE forward ~2s + scoring ~0.5s) = ~60s | K2 Cerebras orchestration | Best paragraph + final score + all-round trajectory | ≤ 60s |
| Falsification check | Best paragraph + control video TRIBE inference | Junsoo's pipeline | Falsification delta | ≤ 3s |
| Output document rendering | All upstream outputs | Frontend (Three.js + React) | Empathy-Layer Document UI | ≤ 1s |
| **Total end-to-end (live)** | Video file | All stages | Empathy-Layer Document | **~104s** (within 90s budget when iterative loop is shortened to 5 rounds OR pre-cached) |

**Live-vs-pre-cache strategy:** Live attempt for Stage 1 + TRIBE reverse + Stage 2 + iterative loop. If any stage exceeds budget, swap to pre-cached output for that stage. Saturday 8 AM bake includes pre-cached intermediate outputs at every stage boundary.

## The Demo Visualization (v1 — 90 Seconds On Stage)

```
TIME      WHAT THE JUDGE SEES                           ENGINE STAGE RUNNING
─────     ──────────────────────────────────────        ─────────────────────
0:00      Workplace footage plays                        Stage 1 (Gemini)
          Vision Report appears as text overlay:
          "Nurse entered room. Sat 30 min."
0:15      3D cortical mesh appears alongside footage     TRIBE V2 (reverse)
          ~20K vertices visible, rendering ≥30 FPS
          Regions glow in sync with footage
0:35      Iterative-loop reveal begins:                  K2 + Stage 2 + TRIBE forward
          • Round 1: Candidate paragraph #1 appears
            (text fades in)
            Score bar fills: 0.42
          • Round 2: Paragraph rewrites
            Score: 0.58 (bar grows)
          • Round 3: 0.65
          • Round 5: 0.71
          • Round 8: 0.84 (bar full, paragraph crystallizes)
          ★ THE SCORE CLIMBING IS THE VISUAL REVEAL ★
1:00      Final empathy-layer paragraph in full           Output document rendering
          Voiceover reads it aloud
          Similarity 0.84 displayed
          Falsification delta 0.27 displayed             Falsification check
1:25      Side-by-side:                                   Comparison rendering
          LEFT: action-data report ("over threshold,
                cut to 10 min")
          RIGHT: empathy-layer document ("she held
                 space; brain-grounded; falsified")
          The decision-maker would call this differently
1:30      Sponsor close swap-slide                       Static
          (Ironside / Listen Labs / Sideshift / YC)
```

## Why these v1 sections were retired

The v1 architecture relied on (a) live TRIBE forward + reverse inference per demo run; (b) Anthropic Opus 4.7 as the Stage-2 synthesizer fired once per iterative-loop round; (c) cosine similarity computed against TRIBE-forward-predicted brain patterns. v2 (locked 2026-04-25 evening with the team) ships:

1. **TRIBE V2 pre-rendered offline only.** activity.json on disk is the canonical brain artifact; runtime never invokes TRIBE in any direction.
2. **K2 plays three roles on one surface.** Stage 1B specialists × 7, Stage 2 moderator × 1, Stage 3 evaluator-swarm × 7 per iterative-loop round. Same K2 OpenAI-compatible chat-completions surface; three prompt files.
3. **Stage 4 Opus polish only, gated.** `OPUS_POLISH=1` env flag enables a single Anthropic Messages API call (~140 output tokens) post-loop. Cut-line cherry — drops first if behind 8 PM Saturday.
4. **Stage 5 embedding-proxy falsification.** `sentence-transformers/all-MiniLM-L6-v2` + a 384×7 Yeo7 projection W (fit offline from `training_pairs.yaml`) replaces TRIBE forward inference for the cosine number. Real numbers, ≤ 200ms, CPU-only.

See `caltech/NEW-ARCHITECTURE.md` §1 for the v2 architecture diagram, technical PRD v2.1 §3 + §4 + §6.6 + §13 + §14 for the engineering spec, and `architecture-overview.md` for the prose walk-through.
