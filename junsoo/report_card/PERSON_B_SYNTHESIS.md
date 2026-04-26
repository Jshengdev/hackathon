# Person B — Synthesis + Integration

> Owner of: K2 specialist runner, instruct-model JSON synthesis, schema validation, top-level driver.
> Sister doc: [PERSON_A_PIPELINE.md](./PERSON_A_PIPELINE.md)
> Why this exists: extending swarm output to match the Ironside-doc spec (8 specialists, structured per-action report card). See `caltech/prd-final.md §6` and the Ironside Define/Develop/Showcase synthesis.

## Your goal

Working `run_report_card.py` that takes Person A's per-action activations + 8 specialist prompts and emits a validated, schema-correct `ironside_report.json` per video.

## What's in your lane (and what isn't)

✅ Yours
- Specialist runner code (calls K2 in parallel, 8 specialists per action)
- Report-card synthesis prompt (the rubric the instruct model follows)
- Instruct-model integration (Llama-3.3-70B-Instruct via Cerebras, fallback Anthropic Haiku)
- Top-level driver / CLI
- JSON schema validator (reusable by Person A's smoke test)

❌ Not yours
- Prompt content for the 8 specialists (Person A — `papers/prompts/ironside/`)
- Action segmentation JSONs (Person A — manual annotation)
- Per-action activation aggregation (Person A — `aggregate_per_action.py`)
- The live B2C swarm in `_bmad/brain-swarm/backend/services/orchestrator.py` (Tech B's lane — DO NOT TOUCH)

---

## Tasks

### B1 — K2 specialist runner (2–3 hrs)

**File:** `junsoo/report_card/run_specialists.py`

**What it does:**
1. Loads 8 prompts from `junsoo/papers/prompts/ironside/*.md`
2. For each per-action entry from Person A: fan out 8 parallel K2 calls
3. Each call gets: specialist's system prompt + user message containing the action's averaged regions + action label + stimulus context
4. Returns a list of dicts: `[{"action": ..., "t_start": ..., "t_end": ..., "specialists": {"visual_attention": "...", ...}}]`

**Reuse pattern, don't import:** the K2 client at `_bmad/brain-swarm/backend/services/k2_client.py` is Tech B's. **Don't import it across lanes.** Copy the relevant ~30 lines of HTTP/retry/auth into `junsoo/report_card/k2_caller.py`. This keeps `junsoo/` self-contained and avoids cross-lane fragility.

**Concurrency:** use `asyncio.gather` with a semaphore (max 4 in flight) to avoid Cerebras rate limits when running 8 specialists × N actions × 2 videos.

**User message template** for each specialist:
```
Action: {action_label}
Window: t={t_start}s to t={t_end}s
Your composite activation pattern this action:
  visual=0.62, dorsal_attention=0.55  (your composite: visual_attention)
  Other networks: somatomotor=0.71, ventral_attention=0.32, ...
Stimulus context (if any): "{stimulus}"
```

(Each specialist's prompt names which networks back its composite; the user message just provides values.)

### B2 — Report-card synthesis prompt (1.5 hrs)

**File:** `junsoo/papers/prompts/ironside/report_card_synthesis.md`

This is the prompt the **instruct model** sees (NOT K2 Think — see B3 for why).

**Structure:**
1. **Identity** — "You are the report-card synthesizer. You receive 8 specialist observations and convert them to a structured per-action report."
2. **Scoring rubric** — explicit definitions for the 4 scores:
   - `attention_score` (0–1): sustained spotlight on task-relevant region. Cite `visual_attention`, `spatial_mapping`, `prefrontal_engagement`.
   - `threat_engagement` (0–1): visual + cognitive engagement with hazards. Cite `threat_detection`, `salience_tracking`.
   - `cognitive_load` (0–1): how much frontoparietal/prefrontal control is being recruited. Cite `prefrontal_engagement` (HIGH = high load), `default_mode` (HIGH = mind-wandering).
   - `decision_quality` (0–1): composite of attention + threat_engagement + (1 − cognitive_load) gated by stress_response. Compute from above.
3. **Archetype state** — categorical: `focused`, `overloaded`, `complacent`, `panicked`, `wandering`, `routine_engaged`, etc. Pick from this list.
4. **Output schema (strict JSON, no prose):**
   ```json
   {
     "time_window": {"start_t": 12, "end_t": 25},
     "action": "pick up drill",
     "attention_score": 0.74,
     "threat_engagement": 0.31,
     "cognitive_load": 0.58,
     "decision_quality": 0.52,
     "archetype_state": "routine_engaged",
     "supporting_specialist_evidence": {
       "visual_attention": "...",
       "threat_detection": "...",
       "spatial_mapping": "...",
       "motor_planning": "...",
       "salience_tracking": "...",
       "prefrontal_engagement": "...",
       "default_mode": "...",
       "stress_response": "..."
     }
   }
   ```
5. **Forbidden-claim guardrails** — same as specialist prompts: observational language only; no reverse inference; within-subject framing only.

### B3 — Synthesizer with instruct model (3–4 hrs)

**File:** `junsoo/report_card/synthesize.py`

**Why a different model than K2 Think:**
`_bmad/brain-swarm/backend/services/orchestrator.py:26-32` documents the bug: K2 Think (reasoning model) burns its token budget reasoning through structured-JSON rubrics, returning truncated output. We must use a **fast instruct-tuned model** for this step.

**Primary model:** **Llama-3.3-70B-Instruct on Cerebras**
- Same Cerebras endpoint as K2 — just different `model` field
- Free with the team's existing Cerebras key
- Great structured-JSON output

**Fallback:** **Anthropic Claude Haiku 4.5** (`claude-haiku-4-5-20251001`)
- Use the user's `ANTHROPIC_API_KEY` env var
- Cheap, fast, even better structured output
- Useful if Cerebras Llama hits rate limits or is unavailable

**Logic per action:**
1. Build user message: 8 specialist observations + the per-action activations
2. Call instruct model with `report_card_synthesis.md` as system prompt
3. Parse JSON response
4. On parse failure: retry once with feedback message ("your last response was not valid JSON: {error}. Return only valid JSON.")
5. After 2 failures: log + return a placeholder report card with `archetype_state="parse_failure"` so the pipeline doesn't crash mid-render

**Implementation hint:** wrap the model client in an interface so swapping primary/fallback is one config flag:
```python
class Synthesizer:
    def __init__(self, model_provider: str = "cerebras"): ...
    async def synthesize(self, specialist_outputs: dict, action: dict) -> dict: ...
```

### B4 — Top-level driver (1.5 hrs)

**File:** `junsoo/report_card/run_report_card.py`

**CLI:**
```bash
python run_report_card.py \
    --activations prerendered/clip1/per_action_activations.json \
    --out prerendered/clip1/ironside_report.json \
    [--model cerebras|anthropic]
```

**Pipeline:**
1. Load `per_action_activations.json` (Person A's output)
2. For each action: call B1's `run_specialists` → 8 observations
3. For each action: call B3's `synthesize` → 1 report card
4. Validate via B5
5. Wrap in top-level structure:
   ```json
   {
     "video_stem": "clip1",
     "n_actions": 4,
     "model": "cerebras-llama-3.3-70b",
     "actions": [<report card>, <report card>, ...]
   }
   ```
6. Write to `--out`

**Mirror existing junsoo CLI patterns** — argparse style from `aggregate.py:47-75`.

### B5 — Schema validator (0.5 hr)

**File:** `junsoo/report_card/validate_schema.py`

Single function: `validate_report_card(d: dict) -> None` raises `ValueError` on schema mismatch.

**Checks:**
- Top-level: `video_stem`, `n_actions`, `actions` (list)
- Each action: all 9 keys present (`time_window`, `action`, 4 scores, `archetype_state`, `supporting_specialist_evidence`)
- All 4 scores ∈ [0, 1]
- `supporting_specialist_evidence` has all 8 specialist keys with non-empty strings
- `archetype_state` is from the allowed list

Person A imports this into their smoke test.

---

## Shared hand-off contract

You **consume** this from Person A. **Lock the schema together at the start of the build.**

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
    "stimulus": "Optional"
  }
]
```

Rules:
- 7 Yeo7 region keys, snake_case
- Values pre-normalized [0, 1]
- `stimulus` may be missing — handle that

---

## Definition of Done (your checklist)

- [ ] `run_specialists.py` runs end-to-end on a synthetic action → 8 non-empty specialist strings
- [ ] `synthesize.py` returns valid JSON for at least one synthetic action; fallback model path tested
- [ ] `run_report_card.py` runs end-to-end on Person A's `per_action_activations.json` → committed `ironside_report.json`
- [ ] `validate_schema.py` rejects malformed JSONs (verify with deliberately-broken fixture)
- [ ] Both videos' report cards committed and visually inspected — routine and novel actions produce **measurably different** numeric scores

---

## Risks specific to your lane

| Risk | Mitigation |
|---|---|
| Cerebras Llama-3.3-Instruct unavailable / not enabled on team key | Fallback to Anthropic Haiku via `ANTHROPIC_API_KEY`. Test fallback path Day 1. |
| Instruct model returns invalid JSON | Retry-with-feedback once; placeholder on second failure; log for manual review |
| K2 rate limits with 8 × N actions × 2 videos | Semaphore cap at 4 in-flight; pre-render is offline so total latency is fine |
| Synthesis prompt too vague → flat scores | Iterate on rubric numerics. If scores cluster around 0.5 across actions, sharpen rubric with anchor examples ("attention_score ≥ 0.8 means: visual_attention reading explicitly cites a specific scene element AND prefrontal_engagement is mid-or-higher") |
| Cross-lane drift (importing from `_bmad/brain-swarm/`) | **Don't.** Copy the K2 client logic into `junsoo/report_card/k2_caller.py`. Keep junsoo/ self-contained. |

---

## Daily ordering

**Day 1 AM:** B2 (synthesis prompt) — 1.5 hrs. Lock contract with Person A in 15 min before starting.
**Day 1 PM:** B1 (specialist runner) — 2–3 hrs.
**Day 2 AM:** B3 (synthesizer + model integration) — 3–4 hrs. Test fallback path early.
**Day 2 PM:** B4 (driver) + B5 (validator) — 2 hrs.
**Day 3:** Run end-to-end with Person A's outputs. Iterate synthesis prompt if scores are flat.

## First move (today, 15 min)

Sit with Person A and lock the `per_action_activations.json` schema above. Once locked, both of you work in parallel and never block each other.
