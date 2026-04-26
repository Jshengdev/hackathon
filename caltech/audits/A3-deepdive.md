# A3 Deep-Dive — Stage 4 (Opus 4.7 polish): ship or cut?

**Owner:** A3 audit shard (read-only).
**Decision required from:** orchestrator + Johnny.
**Recommendation up-front:** **SHIP** — implement a thin gated `services/empathy_polish.py` (single Anthropic call, ~140 output tokens, env-flag `OPUS_POLISH=1`, fallback ships K2 best as-is on any failure). The doc surface, the frontend, the SDK dep, and the JSON field already assume polish exists; cutting is *more* doc-work than implementing. See §6 for the conditional cut path.

---

## §1. Internal precedent — what's been said about Opus polish

Pulled with `grep -rln -i "opus|polish|literary|literature.grade" caltech/ archive/ research/wiki/decisions/` — read each hit, kept only load-bearing quotes.

### 1.1 Architecture-overview.md (caltech/architecture-overview.md — v2 canonical, 2026-04-25)

| Line | Quote |
|---|---|
| 25-26 | *"Stage 2 empathy synthesis runs on K2 (moderator role). Anthropic Opus 4.7 is now Stage 4 polish only — cut-line cherry."* |
| 50 | *"… optionally polishes the best paragraph with Claude Opus 4.7 as a 100-word literary pass …"* (the v2 one-paragraph engine summary — Opus polish is named in the canonical sentence) |
| 238-249 | Stage 4 box: *"~100-word literary polish over Stage 3's best paragraph. This is the ONLY place Opus runs in v2. If the team is behind schedule at 8 PM Saturday, Stage 4 is the FIRST cut. K2's `best_paragraph` ships as-is."* |
| 308 | Empathy doc visual spec: *"Magazine-cover-quality typography. Literature-grade prose."* |
| 462 | Cost table row: *"Stage 4 — Polish (optional) … ~100-word literary polish over the K2 best paragraph. Cut-line; first to drop if behind."* |

### 1.2 Build-plan-locked.md (caltech/build-plan-locked.md)

| Line | Quote |
|---|---|
| 11 | *"Claude Opus 4.7 is reserved for final polish only — NOT in the iterative loop."* |
| 83-89 | Stage 4 box, identical cut-line language. |
| 119-120 | *"Claude Opus 4.7: Stage 4 polish only. Cut first if behind."* |
| 277 | Output schema includes **`"polished_paragraph": "..." // null if Stage 4 skipped`**. |
| 489 | Open question (still open): *"Stage 4 polish — Claude Opus or skip? If Opus, what prompt? (Suggestion: a 100-word literary-polish pass over the K2 best_paragraph; cut-line if behind.)"* |
| 509 | *"Opus is a final-polish cherry only."* |

### 1.3 Technical PRD §4.2b (\_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md)

> "**Tool:** Anthropic Claude Opus 4.7 (`claude-opus-4-7`). **Role:** ~100-word literary polish over the K2 best paragraph. Cut-line cherry — first to drop if behind 8 PM Saturday. K2's `best_paragraph` ships as-is when polish is cut. **Latency:** ≤5s."

### 1.4 Story / pitch / video

- `caltech/video-story-empathy-layer.md:103-105` — the Act-4 "the final paragraph reads…" beat is **the closing emotional hit of the launch video**. The actual paragraph is Crimson-Pro-serif, magazine-grade. *"Empathy-layer paragraph reads as literature-grade prose (no academic / clinical jargon)"* is on the self-audit checklist (line 525).
- `caltech/emilie-brief.md:185` — "4-layer architecture (TRIBE → unique inference → K2 swarm → Opus synthesis → viz)" is named as locked in Emilie's brief — Opus is part of the **public framing of the architecture**, not just internal infra.
- `caltech/narration-script-3min.md:24, 207` — pitch deck Round-1 + Round-2 narration explicitly names Opus as the synthesis layer.

### 1.5 prd-final.md row 65 (item 10)

> *"Opus-final-synthesis layer + design-consciousness primes deepening — Carry-forward — Not blocking ship"*

This is the **only place** in the project where Opus polish is explicitly tagged as "Carry-forward / not blocking ship" — i.e., a known cut candidate. Every other doc treats it as part of the architecture.

### 1.6 Wiki decisions

- `research/wiki/decisions/008-k2-think-as-speed-engine.md` — the K2-as-speed-engine decision; positions K2 as *the swarm*, leaves Opus as the polish surface untouched.
- `research/wiki/decisions/011-demo-over-execution.md`, `012-feature-freeze-saturday-8pm.md` — codify the **Saturday 8 PM feature-freeze** and **polish-goes-last** ship-velocity discipline. These are the doctrinal source of the cut-line in §4.2b.

### 1.7 Audit synthesis

The doctrinal record is unambiguous: **Opus polish is part of the v2 architecture, gated behind the Saturday-8-PM cut-line**. The implementation gap is a *build* miss, not a *design* decision. The build-plan even has a §11 open question (line 489) that was never closed — the prompt was never written, the file `services/empathy_polish.py` was never created. The current state — `polished_paragraph: None` placeholder in `main.py:388` and a no-op `.get(...)` in `warmup.py:212` — is a partial wiring that anticipates the call but no caller exists.

The Anthropic SDK is **already a backend dep** (`backend/requirements.txt:14, 27` — `anthropic>=0.40.0`, listed twice). Frontend already prefers `polished_paragraph` over `best_paragraph` (`frontend/src/stages/EmpathyDocumentStage.vue:95`). The `<p class="paragraph">` is rendered with `font-family: var(--serif)` at 1.4rem on a 70ch column (lines 179-186) — the **Crimson-Pro magazine-grade typography that polish was designed to fill** is already in place.

---

## §2. Quality reasoning — what does polish actually add?

### 2.1 The shape of K2 best vs Opus polish

K2's job (Stage 2 + 3): *braid the vision report with the seven per-network readings into 150-300 words of observational, network-level prose, refined across 8 rounds against per-region evaluators.* The optimization target is **fidelity to the swarm readings** — the score climbs because the paragraph captures *more* of each region's contribution. That's an **analytical** loss function. The text reads like a careful, honest research note. Three hallmarks:
- The *grammar* tracks the score: the paragraph the loop converges on is the one that mentions every network in the right tonal balance, not the one that flows.
- The *voice* tilts technical-observational ("the emotional-processing specialist sustained engagement") — which is the **anti-reverse-inference posture the guardrails enforce**. That posture is necessary; it is also dry.
- The *seams* show. K2 stitches each network's reading with conjunctions ("while", "throughout", "the … network briefly receded"); rhythm is sacrificed for coverage.

Opus polish (Stage 4): *take the K2 best paragraph and rewrite as ~100 words of literature-grade prose, preserving every observational claim and every guardrail.* The optimization target is **how the paragraph reads** — sentence music, image density, restraint, weight. Three hallmarks:
- The *grammar* breaks where it should. A short sentence after a long one. A semicolon used as a held breath. K2's score-climbing rewards none of this.
- The *voice* lifts to literary register without crossing into reverse inference — the whole point of "magazine-grade" framing is that the reader feels seen by the writing, not lectured by it.
- The *seams* close. The seven networks become a person.

These are different texts. K2 best is the audit trail; Opus polish is the artifact a human reads and forwards.

### 2.2 Demo emotional impact (Best Use of AI is the hard target)

Read the closing beat of the launch video against itself:

> *"She entered the room and her vital-attention signature shifted immediately. The prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. She did not rush. She did not check out. She held space."*

That's the polish target. The paragraph K2 converges on across 8 rounds will say all the same things — vital-attention signature, prefrontal-sharpness, emotional-processing specialist, twelve-minute window — but it will lack *"She did not rush. She did not check out. She held space."* The K2 evaluator can't reward those three sentences because they don't add coverage of any region. They are pure *cadence*. The judges feel them; the swarm doesn't.

For Best-Use-of-AI judging — where competing demos are TreeHacks-grade polished projects — the difference between a paragraph that reads like a careful report and a paragraph that reads like literature is the difference between "interesting tech" and "this is unsettling, in a good way." Section 1.4 confirms the launch video, the Devpost, and the pitch deck all rely on the polished paragraph being the closing image.

### 2.3 Persona differentiation (Ironsight workplace vs Listen Labs consumer)

The same engine ships two scenarios. The voice each one needs is different:
- **Ironsight (workplace):** the reader is a manager. The paragraph should read like a thoughtful field report a senior peer would write — observational, generous, grounded in context. Slightly clipped. Concerned-but-respectful.
- **Listen Labs (consumer):** the reader is the person whose feed was watched. The paragraph should read like a careful self-portrait someone you trust would write back to you — gentler, more interior, less institutional. Longer beats.

These voices are within Opus 4.7's instruction-following range with a per-scenario polish prompt; they are **not** within K2's range as a single moderator with a constant prompt + per-region evaluator pressure. K2 will produce one voice and bend it slightly with the `Scenario:` line, but the seams will still show. Polish is the cleanest place to do persona voicing without rewiring the prompts upstream.

### 2.4 Cost, latency, risk

- **Cost.** ~$0.005 per call (≈ 700 input tokens × $5/M + 140 output tokens × $25/M). Across 50 demo runs ≈ $0.25 total. Negligible (PRD §4.6 already books this).
- **Latency.** PRD §4.2b spec: ≤ 5s. Real-world Opus 4.7 on 100-token output ≈ 3-6s. Polish runs **once per clip warmup, post-loop, off the live demo path** (warmup is a `BackgroundTask`). Demo-day reads are O(1) cache hits. So polish latency contributes to *cold warmup time*, not *demo response*.
- **Risk.** Polish failure (network blip, 401) must NEVER block the empathy panel. The contract is "ship K2 best as-is on any failure" — the frontend already does this (`empathy.value?.polished_paragraph || empathy.value?.best_paragraph`).

### 2.5 The "ship the K2 best as-is" alternative

Honest read: K2 best is **defensible as a shipped artifact** on its own. The forbidden-claim guardrails make it scientifically careful; the round trajectory makes it auditable; the falsification delta (when the control file exists) makes it grounded. A non-polished paragraph is not an embarrassment. **But the launch video and the empathy-doc typography were both designed assuming the paragraph reads like literature**, and that creates a mismatch the audience will feel without being able to name. The closing beat goes from punching above its weight (polished) to landing exactly its weight (un-polished).

**Verdict for §2:** polish is high-leverage, low-cost, doctrinally locked, and aligned with the docs already on disk. The case to cut would have to argue that K2 best is *literally indistinguishable* from polished output, which the Stage-2 vs Stage-4 division of labor explicitly rejects.

---

## §3. Implementation sketch — `services/empathy_polish.py`

### 3.1 File layout (no code yet — read-only audit)

```
backend/services/empathy_polish.py   ← NEW (this sketch)
backend/prompts/empathy_polish.md    ← NEW (literary-polish system prompt)
```

### 3.2 Public API

```python
async def polish(
    best_paragraph: str,
    scenario: str,                # "ironside" | "consumer"
    *,
    enabled: bool | None = None,  # None → read OPUS_POLISH env flag
) -> dict:
    """
    Returns:
      {"polished_paragraph": str | None,
       "model": "claude-opus-4-7" | None,
       "polish_status": "ok" | "cut" | "error",
       "error": str | None}
    """
```

### 3.3 Behavior

1. **Cut-line gate (env flag, top of function):**
   - If `enabled is False` (explicit cut) OR `enabled is None and os.getenv("OPUS_POLISH", "0") != "1"`:
     return `{"polished_paragraph": None, "model": None, "polish_status": "cut", "error": None}`. Log structurally: `logger.info("opus_polish_cut", extra={"scenario": scenario})`.
2. **Empty input guard:** if `best_paragraph` is empty/whitespace, return `polish_status="cut"` with `"reason": "empty_input"`. Don't call the API on nothing.
3. **Anthropic call (single request, ~140 output tokens, ≤ 5s timeout):**
   - SDK already in `backend/requirements.txt:14, 27` (`anthropic>=0.40.0`).
   - Model: `claude-opus-4-7`.
   - System prompt: load `backend/prompts/empathy_polish.md` (per-scenario tonal switch handled inside the prompt via the `scenario` injection — same pattern `moderator_synthesis.md` already uses).
   - User message: `"Best paragraph (do not add or remove claims; only polish prose):\n\n{best_paragraph}\n\nScenario: {scenario}.\nOutput one paragraph, ~100 words, plain text only."`.
   - `max_tokens=200` (gives headroom over the 100-word target without inviting drift).
   - `timeout=5.0` (PRD §4.2b cap).
4. **Guardrail re-check:** run `services.guardrails.pass_guardrail_pre_flight(polished)` — and **fix the `bool(...)` bug from the main audit while you're here**: unpack the tuple, and if `not ok`, return the K2 paragraph unchanged with `polish_status="error", "error": f"guardrail_violation: {violations}"` (don't ship a polish that introduces forbidden phrases).
5. **Error path (network, 401, 5xx, timeout, parse):**
   - `logger.error("opus_polish_unavailable", extra={"clip": clip_id, "status": status, "body": body[:200]})`.
   - Return `{"polished_paragraph": None, "model": None, "polish_status": "error", "error": "<short tag>"}`.
6. **Success:**
   - Return `{"polished_paragraph": polished.strip(), "model": "claude-opus-4-7", "polish_status": "ok", "error": None}`.

### 3.4 Wiring

Two call sites, both already partially wired:

**`backend/services/warmup.py:_build_empathy` (around line 206-217):**

```python
# AFTER run_iterative_loop, BEFORE returning empathy dict:
from services.empathy_polish import polish

best_paragraph = loop_result.get("best_paragraph", "")
polish_result = await polish(best_paragraph, scenario_name)

return {
    ...
    "best_paragraph": best_paragraph,
    "polished_paragraph": polish_result["polished_paragraph"],
    "polish_status": polish_result["polish_status"],
    "polish_error": polish_result["error"],
    ...
}
```

**`backend/main.py:_ensure_empathy` (around line 368-393):** mirror the same call after `run_iterative_loop`. The existing literal `"polished_paragraph": None` at line 388 becomes `polish_result["polished_paragraph"]`.

### 3.5 Prompt sketch — `backend/prompts/empathy_polish.md` (~25 lines)

```
# Empathy polish — literary pass

You receive ONE paragraph that has already been written by a careful K2
moderator + 8-round evaluator loop. Every observational claim it makes is
anchored to per-region brain readings. Your job is NOT to add information,
remove information, or invent flourishes. Your job is to take the same
claims and rewrite the paragraph as ~100 words of literature-grade prose
that an editor at The New Yorker would let through. Cadence > coverage.

## Rules
- ~100 words. Plain text. One paragraph. No markdown, no headers.
- Preserve every claim. Do not introduce a single fact that is not in
  the input.
- Honor the same forbidden-claim guardrails as the moderator (no "she
  felt", no "clinical", no "average brain", no reverse inference).
- Persona voicing by scenario:
  - "ironside" / workplace → field-report register, generous, slightly
    clipped, concerned-but-respectful (a thoughtful peer writing back).
  - "consumer" → interior register, gentler, longer beats (a trusted
    correspondent writing to the person watched).
- Sentence music matters. A short sentence after a long one is allowed.
  Restraint is the goal, not density.
- No preface, no commentary. Stop after the paragraph ends.
```

### 3.6 Tests (TDD)

- `test_polish_cut_when_flag_off()` — env flag absent ⇒ `polish_status == "cut"`, no Anthropic call. Mock the client to assert `not_called`.
- `test_polish_empty_input()` — empty `best_paragraph` ⇒ `polish_status == "cut"`, no API call.
- `test_polish_success_path()` — flag on, mocked Anthropic returns canned ~100-word reply ⇒ `polish_status == "ok"`, `polished_paragraph` non-empty.
- `test_polish_guardrail_block()` — mocked Opus reply contains "she felt" ⇒ `polish_status == "error"`, `error` references guardrail.
- `test_polish_network_failure()` — mock raises httpx.HTTPError ⇒ `polish_status == "error"`, structured `logger.error` fires.
- `test_warmup_falls_back_to_k2_best()` — warmup integration: when polish returns `polished_paragraph=None`, the empathy dict still ships `best_paragraph` for the frontend.

### 3.7 Surface impact

- New file: `backend/services/empathy_polish.py` (~80 lines).
- New file: `backend/prompts/empathy_polish.md` (~25 lines).
- Modified: `backend/services/warmup.py` (one call site).
- Modified: `backend/main.py` (one call site at `_ensure_empathy`).
- Modified: `backend/services/guardrails.py` *only if you fix the tuple-bool bug at the same time* (recommended; A3 main audit §2.2 risk #1).
- Modified: nothing in the frontend — `EmpathyDocumentStage.vue:95` already prefers `polished_paragraph` over `best_paragraph`.
- New: `backend/.env.example` line `OPUS_POLISH=0` (default off; flip to 1 in prod env).

Total: ~150 lines of new code, ~5 lines of edits, plus tests. Estimated dev time: 60-90 minutes including tests, Saturday-morning slot.

---

## §4. Cut-path — what would have to change in docs if we formally remove Stage 4

The paper trail for "polish is part of the architecture" is dense (see §1). Cutting cleanly means rewriting all of these so the architecture story still parses. List below is exhaustive — every file/section that would need a touch:

### 4.1 `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`

| Section | Action |
|---|---|
| §3 architecture diagram (lines 252-263) | Remove Stage 4 box; redraw arrow Stage 3 → Stage 5; renumber if you want the stages contiguous, OR leave §3 hole and add note. |
| §4.2b (lines 352-357) — entire subsection | Delete OR replace with `~~### 4.2b Stage 4 ...~~ **[v2.1-removed]** — Stage 4 polish was cut on 2026-04-25 because <reason>. K2 `best_paragraph` ships as the final empathy paragraph.` |
| §4.6 cost estimate (line 432) | Remove the `Stage 4 Opus 4.7 polish: ~$0.01` row; recompute total (drops to ~$0.01). |
| §6.4 / §6.7 | The v1-superseded blocks already reference Opus emit; add a `[v2.1-removed]` tag on any sentence about polished output. |
| §10 smoke test #2 (line 721) | Reword "K2 + Opus iterative-loop test" → "K2 iterative-loop test (8 rounds)" to remove Opus from the smoke gate. |
| §13 FR-O4 (line 817) — "Stage 2 Opus 4.7 integration via Anthropic Messages API" | Already v1; add `[v2.1-removed]` if you want belt-and-suspenders. |
| §13 FR-O17 (line 830) — "Guardrail pre-flight regex check on every Opus output" | Reword to "every empathy paragraph output" (the K2 paragraph still needs the guardrail; just isn't Opus-generated). |

### 4.2 `caltech/architecture-overview.md`

| Section | Action |
|---|---|
| Frontmatter `status:` block (lines 25-26) | Remove the "Anthropic Opus 4.7 is now Stage 4 polish only" sentence; replace with "Stage 4 polish was cut from v2 — empathy paragraph ships from Stage 3 K2 best." |
| §1 one-paragraph engine summary (line 50) | Edit "optionally polishes the best paragraph with Claude Opus 4.7 as a 100-word literary pass," → delete that clause. |
| §1 Stage 4 ASCII box (lines 236-249) | Delete the box; renumber the data flow arrow. |
| §1 latency table (line 401) | Remove "Stage 4 Opus polish (optional) — ≤5s — Cut entirely if behind" row. |
| §1 stack table (line 462) | Remove the Stage 4 row. |
| §1 cost line (line 466) | Remove the "+ optional Opus polish" clause. |
| §1 closing one-liner (line 523) | Remove "→ optional Opus polish" link in the verbal pipeline. |

### 4.3 `caltech/build-plan-locked.md`

| Section | Action |
|---|---|
| Header (line 11) | "Claude Opus 4.7 is reserved for final polish only — NOT in the iterative loop." → delete. |
| Stage 4 ASCII box (lines 82-90) | Delete. |
| §1 Claude Opus 4.7 callout (lines 119-120) | Delete. |
| §A output schema (line 277) | Remove `"polished_paragraph": "..." // null if Stage 4 skipped` from the canonical `empathy.json` shape. |
| §11 open question (line 489) | Resolve: change "Stage 4 polish — Claude Opus or skip?" → "**Resolved 2026-04-25: skipped.** K2 best ships as-is." |
| §1 closing summary (line 509) | "Opus is a final-polish cherry only." → delete. |

### 4.4 `caltech/NEW-ARCHITECTURE.md`

| Section | Action |
|---|---|
| §1 pipeline diagram | Remove Stage 4 box, fix arrows. |
| §2 stack table (Stage 4 row) | Delete. |
| §3 cache layout (`empathy.json` "polish?" sub-bullet) | Edit to remove the polish reference. |
| §5 frontend dashboard (the §B pointer to "Stage 4 polished") | Edit to read "Empathy Paragraph (Stage 3 best)". |
| §7 locked rule 3 ("Stage 4 — Opus 4.7 polish") | Delete that paragraph entirely; rule 3 becomes K2-three-roles only. |

### 4.5 `refactor/CONTRACTS.md`

| Section | Action |
|---|---|
| C2 — `EmpathyDocument` heading | "(Opus final-layer output)" → "(K2 final-layer output)". The shape doesn't strictly need to change — `polished_paragraph` is not in the canonical example — but the conceptual heading needs an edit. |
| §C4 line "GET /demo/empathy/{clip_id} ← Opus final layer" (line 69) | Edit to "← empathy final layer". |

### 4.6 `frontend/src/stages/EmpathyDocumentStage.vue`

| Line | Action |
|---|---|
| 94-96 | `empathy.value?.polished_paragraph \|\| empathy.value?.best_paragraph` → `empathy.value?.best_paragraph`. The `polished_paragraph` preference becomes dead code. (Or keep as-is for forward-compat — pure no-op since backend never ships it.) |

### 4.7 `backend/main.py` and `backend/services/warmup.py`

| Line | Action |
|---|---|
| `main.py:388` | `"polished_paragraph": None,` → delete the key entirely. |
| `warmup.py:212` | `"polished_paragraph": loop_result.get("polished_paragraph"),` → delete the key entirely. |

### 4.8 Story / pitch / video — the *expensive* edits

| File | Action |
|---|---|
| `caltech/emilie-brief.md:185` | "4-layer architecture (TRIBE → unique inference → K2 swarm → Opus synthesis → viz)" → rewrite to "K2 swarm → K2 moderator → K2 evaluator loop → viz". This is in the **public framing** Emilie is building the launch video around. |
| `caltech/narration-script-3min.md:24, 207` | Remove "Opus synthesis" beat from pitch-deck Round 1 + Round 2 narration. May force a re-record if VO is already cut. |
| `caltech/video-story-empathy-layer.md:103-105` | The closing-paragraph beat itself doesn't name Opus, but the *prose target* (the magazine-grade quote) was written assuming Opus polish. Either retarget the K2 best paragraph to that quality bar (probably impossible without polish) or accept a softer close. |
| `caltech/pitch-deck/PITCH-STORY.md`, `presenter-notes.md` | Audit for "Opus" references; remove. |
| Devpost draft (if it mentions the 4-layer architecture) | Same. |

### 4.9 Cut-path total cost

- ~12 file edits, scattered across canonical PRD, architecture, build plan, contracts, frontend, backend, and **public-facing pitch + Emilie's launch-video brief**.
- The public-facing edits (§4.8) are the load-bearing cost — re-recording VO, re-cutting the launch video, rebuilding the pitch deck. **Those are 3-6 hours of polish-time work** during the very window (Sat afternoon → 8 PM) that the cut-line was *designed to protect*.
- Implementation cost (§3.7): 60-90 min on Saturday morning before Stage-4 freeze.

**The cut is more expensive than the build.**

---

## §5. Pre-mortem (bmad-advanced-elicitation, mode: pre-mortem)

Two scenarios, two failure modes each, asked: *"It's 11 AM Sunday. The demo failed. Why?"*

### 5.1 Path A: SHIP polish (env-gated, fail-soft)

**Failure mode A1 — Opus polish silently rewrote a forbidden phrase.**
- *How:* Opus 4.7 is more inclined to vivid language than K2; "She did not rush. She did not check out." is fine, but "She felt held in the room" creeps in. The guardrail re-check (§3.3 step 4) is supposed to catch it — but the same `bool(tuple)` bug from the main audit still exists, the re-check evaluates truthy, the polished paragraph ships with a forbidden phrase, a judge with neuroscience training catches it on stage.
- *Mitigation:* fix the guardrail bug **before** wiring polish. The deep-dive sketch §3.3 step 4 says exactly this.
- *Residual risk:* low if the bug fix lands; high if it doesn't. **Mandatory dependency.**

**Failure mode A2 — Anthropic outage during Sat 8 AM cache freeze.**
- *How:* The Sat 8 AM "commit cache JSON to repo" pipeline runs polish for every clip; Anthropic is down for 20 minutes; the pipeline writes `polished_paragraph: null` to repo for half the clips and `polished_paragraph: "<text>"` for the other half. Demo day, half the clips show K2 best, half show polished — visually inconsistent.
- *Mitigation:* polish is idempotent — re-run the bake until all clips ship a polished paragraph. The pipeline must check `polish_status == "error"` and re-attempt before committing JSON. This is a one-line `while` in the bake script, not a pipeline rewrite.
- *Residual risk:* low — the cache-freeze window is 8 AM Sat to 8 PM Sat, plenty of time to retry.

**Failure mode A3 — Polish drifts in tone and the launch video paragraph (which is hand-written) no longer matches the live demo paragraph.**
- *How:* Emilie hand-wrote the closing-beat paragraph for the launch video assuming a specific tone. The polish prompt produces a paragraph in a slightly different register. Audience watches the video, sees one paragraph; a judge clicks the live demo, sees a different one. Cohesion lost.
- *Mitigation:* lock the polish prompt's persona-voicing block (§3.5) to match the launch-video tone. Hand-test on both scenarios Saturday afternoon. Ship the prompt as a frozen artifact.
- *Residual risk:* medium — but no worse than the no-polish path, where K2 best **definitely** doesn't match the launch-video tone.

### 5.2 Path B: CUT polish (formally remove from architecture)

**Failure mode B1 — VO has to be re-recorded, Saturday burns.**
- *How:* `caltech/narration-script-3min.md:24, 207` names "Opus synthesis" twice in the Round-1 + Round-2 pitch narration. If the VO talent has already cut those tracks (per `emilie-brief.md` Friday-night reference compile), removing Opus from the narration means a re-record. Saturday afternoon polish window is consumed.
- *Mitigation:* check whether VO is already cut. If not, edit the script before recording. If yes — implementation is now cheaper than cutting; flip back to Path A.
- *Residual risk:* high — the public framing of the architecture as **TRIBE → swarm → Opus → viz** is repeated across emilie-brief, narration script, and pitch deck. Cutting Opus means re-aligning the public narrative everywhere.

**Failure mode B2 — Closing-beat paragraph no longer reads like literature.**
- *How:* See §2.2. The closing beat of the launch video relies on the polished register; without polish, K2 best lands but doesn't punch. Judge feedback: "interesting tech, the demo was solid, but the *story* didn't quite close."
- *Mitigation:* none. This is the cost of the cut, accepted.
- *Residual risk:* the "Best Use of AI" target rewards story closure. Losing the close is non-trivial.

**Failure mode B3 — Saturday-night doc churn introduces a stale reference that judges find.**
- *How:* The 12+ files in §4 each need a touch. One gets missed. A judge clicks through the Devpost, sees "K2 swarm + Opus synthesis", clicks the live demo, sees only K2. Cohesion lost again — this time with a credibility hit.
- *Mitigation:* a cut-path checklist (which §4 essentially is). Run a `grep -ri "opus\|polish"` before submission and verify every hit is intentional.
- *Residual risk:* medium — doc-churn under deadline pressure is exactly the failure mode `decision-012-feature-freeze-saturday-8pm` was designed to prevent.

### 5.3 Pre-mortem net

| Scenario | Worst case | Recovery cost | Doctrinal alignment |
|---|---|---|---|
| **A. Ship polish** | Forbidden phrase ships → judge catches it | Fix guardrail bug *first* (mandatory, anyway) | Aligns with v2 architecture as written |
| **B. Cut polish** | Public narrative + VO + Devpost all need re-aligning | Saturday afternoon burns; closing-beat softer | Conflicts with 7+ canonical docs |

Path A's failure modes are **localized** (a single function, a single SDK call) and have **clean mitigations** (fix the guardrail; retry on outage; lock the prompt). Path B's failure modes are **distributed** across the entire public narrative and have **no clean mitigation** for the closing-beat softening.

---

## §6. Final recommendation

**SHIP the polish. Implement `services/empathy_polish.py` per §3 sketch. Ship before 8 PM Saturday feature-freeze; cut at runtime via `OPUS_POLISH=0` if anything goes sideways.**

Order of operations (each gate is a hard checkpoint):

1. **Pre-flight (mandatory before polish work):** fix the guardrail tuple-bool bug from A3 main audit §2.2 risk #1. Polish without this fix is *worse* than no polish — a forbidden phrase reads cleaner in literary register.
2. **Build (Saturday morning, 60-90 min):** create `backend/services/empathy_polish.py` + `backend/prompts/empathy_polish.md` per §3. Wire warmup + main.py call sites. TDD per §3.6. Default `OPUS_POLISH=0` in `.env.example`.
3. **Bake (Saturday 12 PM — well before 8 PM freeze):** flip `OPUS_POLISH=1` in the bake env. Re-run warmup for both demo clips (`30s_ironsite`, `30s_twitter`). Hand-read both polished paragraphs against the launch-video closing-beat tone target. If divergent, tune the prompt's persona-voicing block. Re-bake. Commit JSON.
4. **Cut-line decision (Saturday 8 PM):** if anything is broken, **don't roll back the code** — flip `OPUS_POLISH=0` in production env, re-bake the JSON files (now with `polished_paragraph: null`). Frontend already falls back to `best_paragraph`. The architecture docs stay correct because polish *is* a cut-line stage.

**The asymmetry is the whole point:** code+docs treat polish as *optional*. Ship it for the demo; runtime-cut it if it fails. Cutting it from the architecture *now* destroys that asymmetry and forces a doc-rewrite under deadline pressure for no upside.

---

## §7. Decision log entry (proposed)

If/when accepted, write `research/wiki/decisions/018-stage-4-opus-polish-shipped.md`:

> **Decision 018 — Ship Stage 4 Opus polish (gated env flag)**
>
> *Date:* 2026-04-26.
> *Context:* A3 audit found Stage 4 not implemented despite being part of v2 architecture (PRD §4.2b, architecture-overview §1 stage 4 box, build-plan-locked §11 open question 1). A3 deep-dive evaluated ship vs cut; cut required ~12 file edits across PRD/architecture/build-plan/CONTRACTS/frontend + Emilie's launch-video brief and the pitch-deck narration; ship required ~150 lines of new code + a single-line env flag.
> *Decision:* Ship. Implement `services/empathy_polish.py` per A3 deep-dive §3 sketch. Default `OPUS_POLISH=0`; flip to 1 for Saturday-noon cache bake. Cut-line at 8 PM Sat is implemented as `OPUS_POLISH=0` re-bake, not a code rollback.
> *Pre-condition:* fix `pass_guardrail_pre_flight` tuple-bool bug (A3 main §2.2 risk #1) **before** polish ships, so guardrails actually screen Opus output.
> *Source:* `refactor/audits/A3-deepdive.md`.

---

## Acceptance checklist

- [x] (a) internal-research grep across `caltech/`, `archive/`, `research/wiki/decisions/` — see §1 with file:line citations.
- [x] (b) quality reasoning on K2-best vs Opus-polish framed by literature-vs-analytical, demo emotional impact, persona differentiation — see §2.
- [x] (c) implementation sketch — single Anthropic call, ~140 output tokens, env-flag gate, fallback ships K2 best as-is — see §3.
- [x] (d) cut-path doc-update inventory by file/section — see §4.
- [x] pre-mortem on both paths — see §5.
- [x] Final recommendation + ordered next steps — see §6.
- [x] No code modified — verified by `git status` (only `audits/` symlink + this file + `A3-swarm-loop-merge.md` are new).
