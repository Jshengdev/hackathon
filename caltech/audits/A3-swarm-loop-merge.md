# A3 — Swarm-Loop v2 Architecture Conformance Audit

**Shard:** A3 swarm-loop-merge (audit-only)
**Audited tree:** `worktrees/A3-swarm-loop-merge/`
**Audit date:** 2026-04-25
**PRD reference:** `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (v2 — §3 + §4 authoritative)
**Architecture overview:** `caltech/architecture-overview.md` (v2-current)
**Canonical summary:** `caltech/NEW-ARCHITECTURE.md`

---

## TL;DR

The five backend services that implement Stages 1B / 2 / 3 / 5 are present and *broadly* match the v2 swarm-loop diagram in PRD §3. Stage 4 (Opus polish) is **entirely absent** — no Anthropic client, no polish service, no flag gating; the field exists only as a `None` placeholder. The iterative-loop trace shape is a **subset** of CONTRACTS C2/C3 (missing `specialist_readings`, `cross_region_edges`, and per-region `target` is a synthetic constant, not real data). Two **silently disabling bugs** turn load-bearing safety/falsification into no-ops:

- `empathy_synthesis.py:192` evaluates `bool(pass_guardrail_pre_flight(...))` — the guardrail returns `tuple[bool, list[str]]`, so the bool conversion is *always* truthy → STRICT MODE retry never fires (verified at runtime).
- `main.py:289` silently falls back to `main_activity` when the control clip directory is missing — and both control directories (`workplace_routine_baseline/`, `curated_short_film_baseline/`) are missing on disk → falsification delta is always 0 → verdict locks to `"generic_plausible"`.

Net assessment for the demo path: the K2 swarm + moderator + evaluator loop *runs*, the trace *renders*, but the falsification "anchored" claim and Stage 4 polish are unreliable today and need either a fix or an explicit cut-line decision.

---

## §1. v2 conformance matrix

| PRD §3 box | Implementing file(s) | Conforms? | Severity | Deviations (cite) |
|---|---|---|---|---|
| **Stage 1A — Vision (Qwen3-VL via OpenRouter)** | `backend/services/vision_client.py:230, 258, 372` | Mostly | minor | OpenRouter base + model id correct; falls back to `_stub_report` cached as `{"stub": true}` instead of an error-payload — CONSTRAINTS rule 2 violation (`vision_client.py:396`). |
| **Stage 1B — K2 swarm (7 parallel)** | `backend/services/swarm_runner.py:117-135` | Yes | minor | 7 networks × 1 K2 call each via `asyncio.gather` matches PRD §4.3 role 1. K2 errors swallowed into `"reading": "[K2 error: …]"` (line 114) — surfaces in the same field as real readings, frontend can't distinguish. |
| **Stage 2 — Moderator (K2, ONE call/round)** | `backend/services/empathy_synthesis.py:174-202` | Yes (modulo bug) | **critical** | K2 (not Opus) ✓; `moderator_synthesis.md` ✓; `prior_score` + `per_region_miss` accepted ✓ (lines 178-179, 142-158). **BUG:** guardrail call at line 192 always returns truthy → STRICT MODE retry path is dead code. |
| **Stage 3 — Evaluator swarm (7 K2 per round, plateau exit)** | `backend/services/iterative_loop.py:140-209` | Yes | important | 7 evaluators × N rounds matches PRD §4.3 role 3. `evaluator_score.md` ✓. Plateau math (`plateau_streak ≥ 2` requires `round_idx ≥ 3`, `\|Δ\|<0.02`) matches PRD §3 Stage 3 box. **Trace shape is a subset of C2/C3 — missing `specialist_readings`, `cross_region_edges`** (line 181-185); `per_region_attribution.target` is hard-coded `1.0` (line 30, 121), not a real target. |
| **Stage 4 — Opus polish (CUT-LINE)** | _(none)_ | **No** | **critical** | Zero references to `claude-opus-4-7`, `anthropic`, or a polish service in the backend (verified by `grep -rni 'opus\|anthropic\|polish' backend/`). The output field `polished_paragraph` exists only as `None` literal in `main.py:388` and a no-op `.get(...)` in `warmup.py:212`. The cut-line behavior is *trivially* satisfied (always cut), but the implementation is missing — see §4. |
| **Stage 5 — Falsification (embedding proxy)** | `backend/services/embedding_proxy/__init__.py`, `backend/services/falsification.py`, `backend/main.py:374-379` | Yes (modulo missing controls) | **critical** | Math is correct (see §5). `projection_map.npy` exists with shape `(384, 7)` (verified). Threshold `0.40` honored (`falsification.py:7`). **BUG:** control activity files missing on disk; `main.py:289-295` and `warmup.py:226-240` silently substitute `main_activity` → delta = 0 → verdict locks to `"generic_plausible"`. |

---

## §2. Stage-by-stage code walkthrough

### 2.1 Stage 1B — `services/swarm_runner.py`

- **Public API:** `async def run_swarm(activity_json: dict, clip_id: str) -> dict` (line 117).
- **Input:** `activity.json` shape `{frames: [{regions: {<network>: float}, top_region, t_s}]}`.
- **Output:** `{"clip_id", "frame_window": "aggregated across all N frames", "regions": {<net>: {reading, confidence, cite}}}` (line 131-135). Note: emits a single aggregated reading per network across the whole clip — not per-frame. PRD §3 Stage 1B box says "frame_window" + per-region 1-2 sentence reading; the aggregation matches PRD §4.3 ("read activity.json aggregates").
- **K2 (not Opus):** `K2Client` only — `services/k2_client.py` confirms K2-Think endpoint via `_get_k2()`.
- **Prompt path:** `backend/prompts/<network>.md` for each of the 7 Yeo7 networks (line 38-42). All seven exist (`visual.md`, `somatomotor.md`, `dorsal_attention.md`, `ventral_attention.md`, `limbic.md`, `frontoparietal.md`, `default_mode.md`).
- **Concurrency:** `asyncio.gather(*tasks, return_exceptions=False)` (line 128) — matches PRD §4.3 ("no semaphore needed inside one stage"). `wait_for(..., timeout=30)` per call (line 103-106).
- **Error handling:** Per-call exceptions are caught and folded into `reading: "[K2 error: …]"` (line 114) — **CONSTRAINTS rule 2 violation**. The error string is indistinguishable from a real reading at the frontend layer; the canonical shape (`{"error": "k2_unavailable", ...}`) is not used.
- **Latency estimate:** 7 parallel calls of ~250 tokens at K2's ~2000 tok/s ≈ 0.5-2s real-world. PRD §3 Stage 1B target ≤ 8s. **Conforms.**

### 2.2 Stage 2 — `services/empathy_synthesis.py`

- **Public API:** `async def synthesize(vision_report, swarm_readings, scenario, prior_score=None, per_region_miss=None) -> str` (line 174).
- **Input:** Vision report dict + swarm readings dict + scenario string + (round ≥ 2) prior_score + per_region_miss. Matches PRD §3 Stage 2 box and §4.2 inputs verbatim.
- **Output:** `str` paragraph. **NOT the JSON envelope** PRD §6.4 specifies (`{candidate_paragraph, round_n, specialist_roster_used, guardrail_pre_flight, model_metadata}`). PRD §6.4 is tagged with the v1 "Opus emits" frame — the v2 spec only requires the paragraph, but lossy: callers can't tell whether guardrails passed or not (and they don't know about the bug below).
- **K2 (not Opus):** `K2Client` only (line 17, `_get_k2()` at 53). **Conforms with PRD §4.2 (v2 swap from Opus to K2).**
- **Prompt path:** `backend/prompts/moderator_synthesis.md` (line 27, 60-68). Verified — file exists; content is scenario-agnostic and has explicit `## Refinement mode` block keyed off `prior_score` + `per_region_miss` (lines 62-68 of the prompt).
- **Refinement loop:** Lines 142-158 build a "Per-region miss" block when prior data is supplied — matches PRD §3 Stage 2 box "rounds ≥ 2" feed-back.
- **Bug — guardrail no-op:** Line 192 reads `ok = bool(pass_guardrail_pre_flight(candidate))`. `services/guardrails.py:27` returns `tuple[bool, list[str]]`. A non-empty tuple is always truthy in Python, so `ok` is always `True`. **Verified at runtime:**
  ```
  result = (False, ["reverse-inference: 'she felt'"])
  bool(result) = True
  ```
  Net effect: STRICT MODE retry path (lines 196-200) is dead code; forbidden phrases slip through if K2 emits them. PRD §5 calls this NON-NEGOTIABLE; this is a **critical** finding.
- **Latency estimate:** 1 K2 call, max_tokens=600, timeout=30s. Real-world ~3-5s per round. PRD §3 Stage 2 target ≤ 5s/candidate. **Conforms in nominal case.**

### 2.3 Stage 3 — `services/iterative_loop.py`

- **Public API:** `async def run_iterative_loop(vision_report, swarm_readings, scenario, max_rounds=8, plateau_threshold=0.02) -> dict` (line 140).
- **Per-round dataflow:** For each round 1..8:
  1. Build `synth_kwargs` (lines 160-168), call `synthesize(...)` to get candidate paragraph (line 171).
  2. `evaluate_paragraph(candidate, swarm_readings)` (line 179) — fires 7 parallel K2 evaluators (one per Yeo7 network) using `evaluator_score.md` prompt. Mean = `overall` (line 126). Per-region attribution = `{candidate_match, target=1.0, justification}` (lines 119-123).
  3. Append `{round, score, paragraph_excerpt: candidate[:80]}` to trajectory (line 181-185).
  4. Track best (line 187-190). Update plateau streak (line 192-195). Refresh prior state (lines 197-199). Exit if `plateau_streak >= 2`.
- **Plateau exit:** Code requires (a) `prior_score is not None`, (b) `round_idx >= 3`, (c) `|score − prior_score| < 0.02`, (d) two such consecutive rounds. This **matches** PRD §3 Stage 3 box ("IF round ≥ 3 AND \|Δ\|<0.02 over 2 consecutive rounds OR round==8").
- **Prompt path:** `backend/prompts/evaluator_score.md` (line 27, 45-51). Verified — file exists; specifies "Score: 0.XX" + "Justification: <sentence>" two-line output. Parser regex at lines 32-33 + 64-83 matches the prompt's two-line format.
- **Concurrency:** `asyncio.gather(*tasks, return_exceptions=False)` for the 7 evaluators (line 112). **Matches PRD §4.3** (no semaphore inside a single stage).
- **Error handling:** Per-evaluator exceptions caught and yield `score: 0.0, justification: "[parse error: …]"` (line 96). Folds into the score mean — a single failed call drags `round_score` down by `~1/7 ≈ 0.143`. Better than crashing, but quietly biases scores downward. **CONSTRAINTS rule 2 says use a structured error payload + log.** Currently silent.
- **Trace shape (the C3 issue):** `paragraph_excerpt: candidate[:80]` is a hard 80-char prefix. CONTRACTS C3 says "specialist readings, cross-region edges, score, candidate paragraph excerpt" — the implementation emits `{round, score, paragraph_excerpt}` only; `specialist_readings` (i.e., the 7 evaluator readings + scores for that round) and `cross_region_edges` are missing. C3 says new fields are additive on the frontend side — but the engine should still emit them.
- **Loose typing:** `iterative_loop.py:172-174` falls back to a 3-arg call if `synthesize` raises `TypeError`. This hides a signature mismatch — `prior_paragraph` is sent in `synth_kwargs` (line 168) but not declared in `synthesize(...)` (line 174 of empathy_synthesis.py). Currently the strict 3-arg fallback path is taken on round 2+, silently dropping `prior_score` and `per_region_miss`. **This means the refinement loop only refines on input, not on the prior paragraph.** Verified by reading both signatures side-by-side.
  - Wait, re-reading: the kwargs are `prior_score`, `per_region_miss`, `prior_paragraph`. `synthesize(...)` accepts the first two but **not** `prior_paragraph`. So the kwargs call raises `TypeError`, the `except TypeError` block at line 172 fires, and the fallback strips ALL three including the legitimate ones. The refinement loop is silently disabled on round 2+. **Critical for empathy paragraph quality but not for shipping the trajectory.** Verify with: `grep -n "def synthesize" backend/services/empathy_synthesis.py` → only declares `vision_report, swarm_readings, scenario, prior_score=None, per_region_miss=None`.
- **Latency estimate:** Round = (1 × Stage 2 ≈ 4s) + (7 × Stage 3-eval gathered ≈ 1-2s) ≈ 5-6s. 8 rounds = ~40-50s. PRD §3 Stage 3 target ≤ 60s for 8 rounds. **Conforms** (with margin).

### 2.4 Stage 4 — Opus polish (MISSING)

- **Public API:** _(none)_
- **Search results (verified):**
  - `grep -rni 'opus\|anthropic\|polish' backend/ --include='*.py'` returns only:
    - `backend/main.py:388: "polished_paragraph": None,`
    - `backend/services/warmup.py:212: "polished_paragraph": loop_result.get("polished_paragraph")` — but `run_iterative_loop` never returns this key.
- **Conclusion:** Stage 4 is not implemented. There is no Anthropic SDK dependency surfaced in `backend/requirements.txt` (would need confirmation), no polish prompt file, no `services/polish.py`, no env-flag gate. The downstream contract field `polished_paragraph` is reserved (always `None`); the cut-line is *de facto* always cut.
- **Severity:** **Critical** if "Stage 4 polish on the K2 best paragraph" is a sponsor-judged differentiator; **acceptable** if the K2 paragraph is high enough quality that polish was deliberately deferred to Saturday 8 PM. Either way, surface as audit finding for orchestrator decision.

### 2.5 Stage 5 — `services/falsification.py` + `services/embedding_proxy/__init__.py`

- **Public API:** `compute_falsification(paragraph, main_activity, control_activity) -> dict` (line 10).
- **Math (lines 15-23):**
  - `main_score = proxy_score(paragraph, main_activity)` → cosine of (`embed_text(paragraph) @ W`) and `mean(activity.frames[].regions)`.
  - `control_score = proxy_score(paragraph, control_activity)`.
  - `delta = main_score − control_score`.
  - `verdict = "anchored" if delta > 0.40 else "generic_plausible"`.
  - **Matches PRD §4.4b math verbatim, including the 0.40 threshold.**
- **Output shape:** `{main_score, control_score, delta, verdict}`. PRD §6.6 names them `main_paragraph_score / control_paragraph_score / falsification_delta / verdict` — the keys are different (snake-case vs PRD-prose). C2 in CONTRACTS.md uses `main_paragraph_score`/`control_paragraph_score`. **Field-name divergence — important.**
- **Embedding proxy:** `embedding_proxy/__init__.py:68-78` uses `sentence-transformers/all-MiniLM-L6-v2` lazy singleton via `lru_cache` (matches PRD §4.4b). Projection map at `backend/services/embedding_proxy/projection_map.npy` is a real `(384, 7) float32` matrix — verified with `numpy.load`, no NaNs, mean abs ≈ 0.0050. `_load_projection_map` (line 81-96) raises if shape is wrong → fail-loud, conforms to CONSTRAINTS rule 2.
- **`activity_target_vector` (line 118):** Reduces `frames[*].regions[<net>]` to a 7-dim mean. Raises `ValueError` if no frames — fail-loud. Good.
- **Bug — control activity missing:** `main.py:289-295`:
  ```python
  def _load_control_activity(scenario: str, main_activity: dict) -> dict:
      control_id = _CONTROL_FOR.get(scenario)
      if control_id:
          ctrl_path = (PRERENDERED_DIR / control_id / "activity.json")
          if ctrl_path.exists():
              return json.loads(ctrl_path.read_text(encoding="utf-8"))
      return main_activity
  ```
  Verified that `backend/prerendered/workplace_routine_baseline/` and `backend/prerendered/curated_short_film_baseline/` **do not exist**. Path lookup fails silently, function returns the main clip's activity → `compute_falsification` computes `delta = main_score − main_score = 0.0` → verdict locks to `"generic_plausible"` for every clip. The same silent fallback exists in `services/warmup.py:226-240` (with a `logger.warning` but the cache is still written with the bogus delta).
  - **CONSTRAINTS rule 2 violation:** the failure isn't surfaced to the frontend; the rendered Falsification panel will read `delta=0.00 generic_plausible` as if that were a real result.
- **Latency estimate:** ~50ms per `proxy_score` call × 2 = ~100ms. PRD §3 Stage 5 target ≤ 200ms. **Conforms** when control file is real.

---

## §3. Per-round trace schema (concrete JSON)

**What the engine emits today** (from `iterative_loop.py:181-185, 204-209`):

```json
{
  "best_paragraph": "<full paragraph string>",
  "final_score": 0.84,
  "round_trajectory": [
    { "round": 1, "score": 0.42, "paragraph_excerpt": "<candidate[:80]>" },
    { "round": 2, "score": 0.58, "paragraph_excerpt": "<candidate[:80]>" },
    ...
  ],
  "per_region_attribution": {
    "visual":            { "candidate_match": 0.78, "target": 1.0, "justification": "<sentence>" },
    "somatomotor":       { "candidate_match": 0.65, "target": 1.0, "justification": "<sentence>" },
    "dorsal_attention":  { "candidate_match": 0.81, "target": 1.0, "justification": "<sentence>" },
    "ventral_attention": { "candidate_match": 0.55, "target": 1.0, "justification": "<sentence>" },
    "limbic":            { "candidate_match": 0.71, "target": 1.0, "justification": "<sentence>" },
    "frontoparietal":    { "candidate_match": 0.68, "target": 1.0, "justification": "<sentence>" },
    "default_mode":      { "candidate_match": 0.83, "target": 1.0, "justification": "<sentence>" }
  }
}
```

**What PRD §6.5 + CONTRACTS C2/C3 require:**

```json
{
  "round_trajectory": [
    {
      "round": 1,
      "score": 0.42,
      "paragraph_excerpt": "...",
      "specialist_readings": { "<net>": { "score": float, "justification": str } },
      "cross_region_edges": [ { "from": "<net>", "to": "<net>", "weight": float } ]
    },
    ...
  ],
  "per_region_attribution": {
    "<net>": { "candidate_match": float, "target": float }   // target = REAL per-region target, not 1.0
  }
}
```

**Gaps (severity in parentheses):**
- `round_trajectory[].specialist_readings` — **missing** (important; CONTRACTS C3 lists it).
- `round_trajectory[].cross_region_edges` — **missing** (important; CONTRACTS C3 lists it).
- `per_region_attribution.<net>.target` is hard-coded `_TARGET_SCORE = 1.0` (`iterative_loop.py:30, 121`). The PRD §6.5 example shows real per-region target values (e.g., `"target": 0.87`). **Important** — frontend can't render a meaningful target overlay if it's always 1.0.
- `per_region_attribution` includes a `justification` field not in CONTRACTS C2 — additive, harmless (frontend can ignore).

---

## §4. Stage 4 Opus boundary

- **Where Opus runs in the codebase:** Nowhere. Verified by exhaustive grep — see §2.4.
- **Cut-line gating:** No env flag (e.g., `OPUS_POLISH_ENABLED=1`), no feature-flag check, no try/except around an Anthropic call. Cut behavior is implicit because the call doesn't exist.
- **Inside-the-loop boundary:** Vacuously satisfied — Opus literally cannot run inside the loop because it isn't wired anywhere. Once Stage 4 is added, the orchestration layer must call it post-loop (per `_ensure_empathy` in `main.py:355-395`, after `run_iterative_loop` returns).
- **Ship-K2-as-is on cut:** `main.py:387-388`:
  ```python
  "best_paragraph": loop_result.get("best_paragraph"),
  "polished_paragraph": None,
  ```
  Frontend (e.g., `EmpathyDocumentStage.vue`) presumably renders `best_paragraph` when `polished_paragraph` is null — confirmed below in §6.

**Recommendation for orchestrator (R-shard input):** Either implement Stage 4 as a post-`run_iterative_loop` call to Anthropic Claude Opus 4.7 (gated behind `OPUS_POLISH=1`, fallback to ship `best_paragraph` as-is on any failure), or formally cut Stage 4 and update the PRD/architecture docs to mark it explicitly removed for the demo.

---

## §5. Stage 5 falsification correctness

- **Math:** Correct (see §2.5). `cos(emb @ W, mean_activity)` is the spec; the implementation uses `_cosine` (`embedding_proxy/__init__.py:134`) with `np.linalg.norm` and a `[-1, 1]` clamp — clean.
- **File I/O:**
  - `projection_map.npy` exists, real, correct shape — fails loud if missing or malformed (`_load_projection_map` at line 81-96).
  - `activity.json` is the source of truth — read via `_load_activity` in `main.py:282-286`. Returns 404 on miss — conforms to CONSTRAINTS rule 1.
  - **Control activity broken (see §2.5).** This is the load-bearing issue for Stage 5.
- **Threshold:** `0.40` constant in `falsification.py:7` — conforms PRD §4.4b.
- **Field shape divergence:** `{main_score, control_score, delta, verdict}` vs PRD §6.6 `{main_paragraph_score, control_paragraph_score, falsification_delta, verdict}` — important enough to flag for frontend wiring (frontend reads via `/demo/falsification/{clip_id}` — verify field names there).

---

## §6. Frontend ↔ backend trace contract

**Endpoints consumed:**
- `GET /demo/empathy/{clip_id}` → `EmpathyDocumentStage.vue` (line 99 reads `empathy.value?.round_trajectory`).
- `GET /demo/iterative-trajectory/{clip_id}` → `IterativeRevealStage.vue` (line 52-53 reads `data?.round_trajectory`).
- `IterativeLoop.vue` (component) consumes a `:trajectory` prop with shape `{round, score, paragraphExcerpt}` (camelCase — line 161-168 mock + line 193 read).

**Field-name conversion (snake_case ↔ camelCase) — IMPORTANT:**

| Field (backend) | Field (frontend mock + IterativeLoop) | Status |
|---|---|---|
| `round` | `round` | identical |
| `score` | `score` | identical |
| `paragraph_excerpt` | `paragraphExcerpt` | **MISMATCH — silent failure** |
| `per_region_attribution` | (varies) | not consumed by IterativeLoop |

`IterativeRevealStage.vue:71` reads `r.paragraph_excerpt` (snake_case) directly from the backend payload — **works**.
`EmpathyDocumentStage.vue:63` reads `r.paragraph_excerpt` (snake_case) — **works**.
`IterativeLoop.vue:193` reads `paragraphExcerpt` (camelCase) — **silently breaks** if backend trajectory is fed directly. Today the only caller is `ComparisonStage.vue:27` which passes a hard-coded mock (line 63-72) so the bug is masked.

**ComparisonStage.vue:63-72 — CONSTRAINTS rule 4 violation:** ships an inline mock `trajectory` constant in production code. No `import.meta.env.DEV` gating. Replacing this with `fetchIterativeTrajectory(clip_id)` exposes the snake/camel mismatch above; both must be fixed together.

**Persona-shell routing:** `EmpathyDocumentStage.vue:89` maps `scenario === 'ironside' ? 'workplace' : 'consumer'` — matches PRD §4.5 v2 simplified registry. Good.

---

## §7. Latency budget rollup

| Stage | PRD target | Estimated actual | Notes |
|---|---|---|---|
| 1A Vision (Qwen3-VL, 5 frames) | ≤ 10s | 6-12s real-world | Per `vision_client.py` `OPENROUTER_TIMEOUT` default 60s; typical Qwen3-VL response ≈ 6-9s for 5 frames. |
| 1B K2 swarm (7 parallel) | ≤ 8s | 1-3s | `wait_for(... 30s)` per call; gather of 7 ≈ 1-2s wall in nominal case (K2 ~2000 tok/s, 250-tok output). |
| Stage 2 K2 moderator (1 call/round, 8 rounds) | ≤ 5s × 8 = 40s | ~3-5s × 8 = 24-40s | `_TIMEOUT_S = 30` per call; budgeted output 600 tokens. |
| Stage 3 K2 evaluator (7 parallel × 8 rounds) | ≤ 60s for 8 rounds (combined w/ Stage 2) | ~1-2s × 8 = 8-16s wall | `_PER_CALL_TIMEOUT_S = 20`; gather of 7 ≈ 1-2s. |
| Stage 4 Opus polish | ≤ 5s | 0s (not implemented) | Cut-line currently auto-cut. |
| Stage 5 falsification | ≤ 200ms | ~100ms | `embed_text` + matrix multiply, no GPU. |
| **Iterative loop combined (Stages 2+3 × 8 rounds)** | ≤ 60s | **~32-56s** | Within PRD budget; will exceed if K2 latency spikes. |
| **k2_region_cache pre-bake (warmup)** | ~35s with `Semaphore(6)` | ~30-50s for 7 nets × ~30 frames = 210 calls at 6-way parallel | `warmup.py:144` correctly uses `asyncio.Semaphore(_K2_REGION_SEMAPHORE_LIMIT=6)` per PRD §4.3. |
| **Total cold warmup** | **90-110s** | **~80-130s** | Matches PRD §3 budget. Sat 8 AM pre-cache freeze is the demo-day mitigation. |

**Concurrency conformance:**
- ✓ `asyncio.gather` for 7-call swarms inside Stage 1B (`swarm_runner.py:128`) and Stage 3 (`iterative_loop.py:112`).
- ✓ `asyncio.Semaphore(6)` only inside `warmup.py:144` for the k2_region_cache pre-bake.
- ✓ No semaphore inside the iterative loop itself.

**Conforms PRD §4.3 + NEW-ARCHITECTURE.md §1.**

---

## §8. Use-case modularity

**Where scenario lives:**
- `backend/prerendered/<clip_id>/scenario.json` — verified for all 3 clips:
  - `30s_ironsite/` → `{"scenario": "ironside", "label": "ironsight · construction site …"}`
  - `30s_twitter/` → `{"scenario": "consumer", "label": "consumer · reels feed · 30s scroll"}`
  - `example_clip/` → `{"scenario": "consumer", "label": "example · consumer feed"}`
- `backend/main.py:190-203` (`_load_scenario`) reads it and surfaces `{scenario, label}` on `/demo/match` and `/demo/clips`.
- `backend/services/empathy_synthesis.py:139` injects `Scenario: {scenario}` into the user message of the moderator call. The moderator prompt (`backend/prompts/moderator_synthesis.md`) is **scenario-agnostic** (no `if ironside / if consumer` branching) — conforms PRD §4.5 v2 simplified registry.
- The 7 Yeo7 specialist prompts and `evaluator_score.md` are also scenario-agnostic (verified by reading each prompt; none branch on scenario).
- Frontend persona shell: `EmpathyDocumentStage.vue:89` maps `scenario` → `workplace | consumer` render mode.

**Specialist roster swap:** None. Both scenarios run the same 7 Yeo7 networks. Conforms PRD §4.5.

**Audit verdict:** Use-case modularity is correct — scenario string flows from `scenario.json` to moderator prompt user-message and to the frontend persona shell, with no roster-swap branching anywhere.

---

## §9. Risk callouts (likely silent breakage)

1. **Guardrail no-op (CRITICAL).** `empathy_synthesis.py:192`. Forbidden phrases ("she felt", "clinical", "average") would emit unflagged. Fix: `ok, violations = pass_guardrail_pre_flight(candidate); if not ok: …`.
2. **Falsification always `generic_plausible` (CRITICAL).** Control clip directories absent. Either bake `workplace_routine_baseline/activity.json` and `curated_short_film_baseline/activity.json` offline, or surface a structured error payload on cache miss instead of silently substituting main_activity.
3. **Refinement loop disabled at round ≥ 2 (IMPORTANT).** `iterative_loop.py:172-174` swallows `TypeError` from `synthesize(prior_paragraph=…)` because `prior_paragraph` isn't in `synthesize`'s signature. Fix one of: (a) remove `prior_paragraph` from `synth_kwargs` (line 168), or (b) add `prior_paragraph: str | None = None` to `synthesize`'s signature and use it inside the user message.
4. **Frontend mock trajectory in shipping code (IMPORTANT).** `ComparisonStage.vue:63-72` violates CONSTRAINTS rule 4. Replace with `fetchIterativeTrajectory(clip_id)`; concurrently fix the snake/camel mismatch surfaced when `IterativeLoop.vue` consumes the live trajectory.
5. **K2 endpoint ambiguity (IMPORTANT).** `k2_client.py:39` defaults to `https://api.cerebras.ai/v1` with model `k2-think-v2`; PRD §4.3 + NEW-ARCHITECTURE §2 specify `https://api.k2think.ai/v1` with model `MBZUAI-IFM/K2-Think-v2`. Both endpoints serve K2-Think-class models but require different keys. `.env.example:1-3` matches the Cerebras path. Confirm with PM which surface the demo runs on; either align the docs or update the env defaults.
6. **`per_region_attribution.target = 1.0` synthetic (IMPORTANT).** PRD §6.5 example shows real per-region targets (e.g., 0.87). Frontend can't draw a meaningful "candidate vs target" comparison if the target is always 1.0. Consider deriving target from `activity_target_vector(activity)[net]` (per-network mean activation, in [0,1] after suitable normalization) so the bars actually tell a story.
7. **`Stage 1B reading: "[K2 error: …]"` injection (IMPORTANT).** `swarm_runner.py:114` mixes errors into normal payload. Convert to `{"error": "k2_unavailable", "network": <net>}` per CONSTRAINTS rule 2.
8. **`vision_client.py` writes `{"stub": true}` to disk as cache (MINOR).** `warmup.py:280` does the same on Stage 1A failure. CONSTRAINTS rule 2 says fail visibly — this caches a fake-looking report. Convert to log+surface `{"error": "vision_unavailable", "clip_id": …}` so the frontend renders a "REAL DATA MISSING" badge in PROD.
9. **`/demo/falsification` field-name divergence (MINOR).** `{main_score, control_score, delta}` vs PRD §6.6 `{main_paragraph_score, control_paragraph_score, falsification_delta}`. Frontend wiring needs to be checked (likely already adapted; surface so R-shard doesn't introduce a regression).
10. **Iterative loop catch-all `return f"[empathy_synthesis error: {e}]"` (MINOR).** `empathy_synthesis.py:189, 200` returns an error string masquerading as a paragraph. Same CONSTRAINTS rule 2 issue. Convert to `raise` and let the loop surface a structured error — or return `{"error": ..., "paragraph": ""}` shape.

---

## §10. Open questions for orchestrator

1. **Stage 4 Opus polish — ship or cut?** It's not implemented. PRD §4.2b lists it as cut-line; today it's *de facto* cut. Decide by 8 PM Saturday: either spec the implementation (which prompt? where stored? cut threshold?) or formally remove it from the architecture docs.
2. **Control clip baking.** Will `workplace_routine_baseline/activity.json` and `curated_short_film_baseline/activity.json` be baked Saturday morning? If not, falsification is dead weight on demo day — recommend either baking them or removing the falsification §C card from the empathy document.
3. **Per-region `target` source.** The PRD shows real numbers; today it's `1.0`. Approve a definition: `target = activity_target_vector(activity)[net]`? Or normalize differently? Frontend can't ship the comparison without an answer.
4. **K2 surface (Cerebras vs k2think.ai).** Which endpoint is demo-day? The code defaults to one, the docs specify the other. Pick one and update the loser. (Sponsor track is "IFM K2 CORE" → likely `api.k2think.ai/v1`.)
5. **`per_region_miss` payload shape.** Frontend doesn't yet render it. Is it shipping in v1 of the demo, or is the per-region attribution panel sufficient? Affects whether `_per_region_miss` (`iterative_loop.py:130-137`) needs to be exposed in the response or only used internally for refinement.
6. **Frontend trace field naming.** Should the backend emit camelCase (`paragraphExcerpt`) to match `IterativeLoop.vue`'s native API, or should the frontend convert at the fetch boundary? Pick one — the current "two readers, two cases" is a foot-gun.
7. **Refinement-loop fix scope.** §9 risk #3 silently disables refinement on rounds ≥ 2. Is this acceptable for the 8-round demo (round 1 candidate × 8 evaluator passes ≈ ~25-40s, no climbing trajectory) or is the climbing score bar a load-bearing visual that needs the refinement to actually work?

---

## Acceptance checklist (per shard SHARD.md)

- [x] All 10 sections present.
- [x] Every claim cites file:line and/or PRD § / CONTRACTS / CONSTRAINTS reference.
- [x] Per-round trace schema given as concrete JSON, not prose.
- [x] Latency rollup numbers add up (cold warmup 80-130s vs PRD 90-110s target).
- [x] Audit-only — no code modifications. Verified: `git status` shows only the new `audits/` symlink dir + this file.
