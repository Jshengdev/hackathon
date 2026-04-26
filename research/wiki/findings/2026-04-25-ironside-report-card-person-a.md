---
file-type: finding
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/017-ironside-report-card-as-junsoo-wrapper.md
  - ../decisions/003-team-role-lanes-locked.md
cites-sources:
  - junsoo/report_card/aggregate_per_action.py
  - junsoo/report_card/smoke_test.py
  - junsoo/papers/prompts/ironside/
cross-links:
  - 2026-04-25-ironside-report-card-person-b.md
  - ../decisions/017-ironside-report-card-as-junsoo-wrapper.md
  - ../patterns/k2-reasoning-plus-instruct-synthesis.md
---

# Person A — Pipeline + Specialist Prompts (work-split, 2026-04-25)

> Owner of: prompt authoring, video pre-render, action chunking, smoke test.
> Sister doc: [`2026-04-25-ironside-report-card-person-b.md`](./2026-04-25-ironside-report-card-person-b.md)
> Why this exists: extending swarm output to match the Ironside-doc spec (8 specialists, structured per-action report card). See `caltech/prd-final.md §6` and the Ironside Define/Develop/Showcase synthesis. Architectural choice locked in [Decision 017](../decisions/017-ironside-report-card-as-junsoo-wrapper.md).

## Your goal

Generate two `ironside_report_<video>.json` files (routine task + novel task, same worker) by the end of the build window. Each report card has 8 specialist evidence strings + 4 numeric cognitive scores per action.

## What's in your lane (and what isn't)

✅ Yours
- Specialist prompt content (8 markdown files)
- Action segmentation JSONs (manual, watch-and-annotate)
- Per-action activation aggregator (Python)
- Pre-rendering 2 construction videos through existing Colab workflow
- End-to-end smoke test

❌ Not yours
- The K2 specialist runner (Person B — `run_specialists.py`)
- The instruct-model synthesizer (Person B — `synthesize.py`)
- The top-level driver (Person B — `run_report_card.py`)
- The live B2C swarm in `_bmad/brain-swarm/backend/services/orchestrator.py` (Tech B's lane — DO NOT TOUCH)

---

## Tasks

### A1 — Author 8 specialist prompts (3–4 hrs)

**Where:** `junsoo/papers/prompts/ironside/` (new subdir; existing `papers/prompts/*.md` stays untouched so the live B2C demo keeps working)

**Files to create:**
| Filename | Composite source | Function |
|---|---|---|
| `visual_attention.md` | `visual` + `dorsal_attention` | Where is the spotlight on the scene |
| `threat_detection.md` | `limbic` + `ventral_attention` + stimulus context | Did the worker register the hazard |
| `spatial_mapping.md` | `dorsal_attention` + `visual` | Environmental layout tracking |
| `motor_planning.md` | `somatomotor` | Action preparation/execution |
| `salience_tracking.md` | `ventral_attention` | What just changed / unexpected onset |
| `prefrontal_engagement.md` | `frontoparietal` | Cognitive control / deliberation |
| `default_mode.md` | `default_mode` | Mind-wandering / self-referential |
| `stress_response.md` | `limbic` HIGH + `frontoparietal` LOW | Dysregulation / amygdala-hijack proxy |

**Each prompt structure** (mirror existing `papers/prompts/visual.md`):
1. **Identity** — one paragraph: who you are, what cognitive function you implement, which Yeo7 networks back you
2. **Grounded neuroscience cite** — one paper or canonical reference
3. **How to read your composite activation** — high / mid / low patterns, with construction-context examples
4. **Cross-network signals you should flag** — what other specialists' outputs change your call
5. **Output format** — `Reading:` (one-sentence call) + `Confidence:` low/med/high

**Critical:** stress-response and threat-detection must use **observational language only** ("activation pattern matches dysregulation signature in TRIBE training data"), never reverse inference ("worker felt panicked"). See `caltech/prd-final.md` forbidden-claim guardrails.

### A2 — Action segmentation JSONs (1 hr, after videos arrive)

**Where:** `junsoo/prerendered/<video_stem>/action_segments.json`

**Format:**
```json
[
  {"start_t": 0,  "end_t": 12, "action": "approach scaffolding"},
  {"start_t": 12, "end_t": 25, "action": "pick up drill"},
  {"start_t": 25, "end_t": 38, "action": "begin drilling overhead"}
]
```

**Method:** watch the video, mark action boundaries by hand, ~30 sec per action. Aim for 3–6 actions per clip. Don't over-segment.

### A3 — Per-action aggregator (1.5–2 hrs)

**File:** `junsoo/report_card/aggregate_per_action.py`

**Inputs:**
- `--activity` path to `activity.json` (per-second from existing pipeline)
- `--segments` path to `action_segments.json`

**Output:** `per_action_activations.json` matching the **shared contract** below.

**Logic:**
1. Load both JSONs
2. For each segment, slice `activity.json["frames"]` by `t_s ∈ [start_t, end_t)`
3. Mean-pool the 7 region values across that slice
4. Pass through `stimulus` text (concat unique transcripts in window if multiple)
5. Write JSON

**Ship as a standalone CLI** mirroring `aggregate.py:159-191` style — same arg-parser, same path-handling.

### A4 — Pre-render 2 construction videos (2–3 hrs after videos arrive)

Already have the workflow — run `colab_prerender.ipynb`. Outputs land in `junsoo/prerendered/<stem>/activity.json`. Two clips: same worker, routine task vs. novel task.

**Blocker:** non-tech teammate must source the 2 clips. Push for this **today**.

**OOD risk:** TRIBE V2 may degrade on construction footage. Pre-screen 5 candidate clips if possible; pick the 2 with most differentiated activation patterns. (See `INTEGRATION_GAPS.md` if you want the OOD numbers.)

### A5 — End-to-end smoke test (1 hr)

**File:** `junsoo/report_card/smoke_test.py` (mirror `junsoo/smoke_test.py` style)

**Test cases:**
1. Synthetic activations (high-load action vs. low-load action) should produce visibly different scores
2. JSON schema validates (use `validate_schema.py` from Person B)
3. All 8 specialists fire (no missing evidence keys)
4. Numeric scores all in [0, 1]

Run it before any commit to `prerendered/`.

---

## Shared hand-off contract

This is the interface between Person A's output and Person B's input. **Lock this together with Person B at the start of the build.**

**File:** `junsoo/prerendered/<video_stem>/per_action_activations.json`

```json
[
  {
    "action": "pick up drill",
    "t_start": 12,
    "t_end": 25,
    "regions": {
      "visual": 0.62,
      "somatomotor": 0.71,
      "dorsal_attention": 0.55,
      "ventral_attention": 0.32,
      "limbic": 0.18,
      "frontoparietal": 0.49,
      "default_mode": 0.08
    },
    "stimulus": "Optional concat of transcript text in the window"
  }
]
```

Rules:
- Region keys are exact Yeo7 snake_case (matches `swarm_contract.md` Contract A)
- Region values are pre-normalized [0, 1] floats (use `aggregate.py`'s normalization, or skip if already done upstream)
- `stimulus` is optional — omit the key if empty

---

## Definition of Done (your checklist)

- [ ] 8 specialist prompts written in `papers/prompts/ironside/`
- [ ] 2 construction videos pre-rendered (`activity.json` × 2 in `prerendered/`)
- [ ] 2 `action_segments.json` files authored
- [ ] `aggregate_per_action.py` runs end-to-end on both videos → 2 `per_action_activations.json` files committed
- [ ] Smoke test passes against synthetic activations
- [ ] Within-subject contrast visible: routine and novel tasks have measurably different region averages (≥0.2 spread on at least 2 networks)

---

## Risks specific to your lane

| Risk | Mitigation |
|---|---|
| Construction videos delayed | A1 (prompts) + A3 (aggregator) work without videos. Lock those first. |
| TRIBE V2 OOD — flat activations on novel footage | Render 5 candidates, pick best 2. If still flat, escalate to non-tech for better clips. |
| Prompt drift (specialists too generic) | Anchor each prompt with a specific construction-context example in the "How to read" section |
| Reverse-inference creep in stress/threat prompts | Self-review against `caltech/prd-final.md §forbidden-claim guardrails` before commit |

---

## Daily ordering

**Day 1 AM:** A1 (prompts) — 3–4 hrs. Lock contract with Person B in 15 min before starting.
**Day 1 PM:** A3 (aggregator) — 1.5–2 hrs.
**Day 2 AM:** A2 (segments) once videos arrive + A4 (render).
**Day 2 PM:** A5 (smoke test) once Person B's runner is ready.
**Day 3:** Iterate on prompts based on actual report card output. Tighten until the routine-vs-novel contrast is convincing.

## First move (today, 15 min)

Sit with Person B and lock the `per_action_activations.json` schema above. Once locked, both of you work in parallel and never block each other.
