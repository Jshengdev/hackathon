# A1 Deep-Dives — Falsification Baseline + Empathy Guardrail Bug

**Author:** A1-prerender-cache audit (continuation of `A1-prerender-cache.md`)
**Date:** 2026-04-25
**Scope:** Two follow-up dives requested by the orchestrator. Audit-only; no source modifications.

> The two findings are linked. Both are *silent-failure-class* violations of CONSTRAINTS rule 2 ("a failure must be visible"). One disables the falsification number that BEAT-4/§C of the empathy doc is built around (DEEP-DIVE-1). The other lets PRD §5 forbidden phrases ship unfiltered (DEEP-DIVE-2). Either alone would be a demo-day risk; together they break the "anchored & guardrailed" half of the rubric closer.

---

## DEEP-DIVE-1 — Where should the falsification control clip data come from?

### 1.1 Problem statement (verified)

`backend/services/falsification.py:10-23` requires a `control_activity` dict to compute `delta = main_score - control_score`. The lookup chain is:

```
main.py:_load_control_activity (line 289)  ─┐
warmup.py:_load_control_activity (line 226) ─┴─ both consult _CONTROL_FOR =
                                                {"ironside": "workplace_routine_baseline",
                                                 "consumer": "curated_short_film_baseline"}
                                              and read backend/prerendered/<control_id>/activity.json
                                              → file does not exist on disk for either control_id
                                              → silently substitute main_activity itself
                                              → delta = cos(p,m) - cos(p,m) = 0 EXACTLY
                                              → verdict locks to "generic_plausible"
```

Verified by `ls backend/prerendered/ | grep -i baseline` → empty. Verified by `find . -name "control_*.json" -not -path "*/.git/*"` → empty. Verified analytically: when `main == control`, `proxy_score(text, main) == proxy_score(text, main)` for any text, so delta is identically zero.

The PRD §6.6 example shows `delta = 0.57, verdict = "anchored"`. The demo script (caltech/demo-script.md via PRD §12 BEAT-4) shows `falsification delta 0.27`. Both numbers are impossible under current code.

### 1.2 Internal research — what was the intended source?

I grep'd `caltech/`, `_bmad-output/`, `research/wiki/`, `archive/` for `(control|baseline|falsification)` mentions. Three planning artifacts disagree about *what kind* of control to bake; **the disagreement is the actual finding**.

| Source | Verbatim | Control type proposed |
|---|---|---|
| `caltech/3-person-build-plan.md:248-250` | *"Control video brain pattern (workplace baseline) → `junsoo/prerendered/control_workplace.json` / Junsoo / ~2-5 MB"* | **Different real video**, offline-baked through TRIBE V2 reverse |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md:222, 311, 479` | *"the falsification check (same paragraph scored against control footage of the same human in a different scene) drops similarity sharply, proving the description is specifically anchored. Same logic as the original Clair de Lune work falsifying against control music."* | **Different real video — same human, different scene** (within-subject contrast, NFR15) |
| `caltech/research-context/007-johnny-public-corpus-tribe-posts.md:38-39` (Johnny's published Synthetic Synesthesia post) | *"I tested it against other sounds to make sure it wasn't just hitting emotion in general. Triumphant music, rain, aggressive speech — the pattern falls apart. It was matching Clair de Lune specifically."* | **Different real stimulus** — three different audio types, picked to challenge a different failure mode each (emotional-valence-only, ambient-only, arousal-only) |
| `caltech/build-plan-locked.md:141, 219` (the v2 engineering companion to the technical PRD) | *"Control activity.json (workplace_routine_baseline, curated_short_film_baseline) | do NOT exist | **synthesize from existing activity.json + Gaussian noise; honest stub**"* AND *"`backend/scripts/bake_control_clips.py` — read existing activity.json, shuffle frames + add Gaussian noise to break the structural pattern → write prerendered/<control_id>/activity.json. Document honestly: 'control = perturbed-frame baseline, not a separately-recorded clip.'"* | **Permutation + Gaussian-noise stub** — labeled honest stub; script was specced but never written (`backend/scripts/` contains only `fit_projection_map.py`) |
| `archive/empathy-engine/README.md` | *"Construction footage is OOD for TRIBE V2 (canonical reference notes 0.32 → 0.17 score collapse on cartoons). Pre-cache mandatory for demo-day reliability."* | (no direct control choice — but flags TRIBE-OOD risk that bears on whether shuffle controls would even produce a meaningful contrast) |

**Reconciling:** the strategic PRD wants option (i) different real video; build-plan-locked compromised to option (ii) permutation+noise *because Junsoo's offline TRIBE bake of a second clip wasn't going to land in the freeze window*. The build-plan-locked path has a script name (`bake_control_clips.py`) but no script. Today's runtime is option (iv) — silent self-comparison — which is the one option nobody planned and nobody endorses.

### 1.3 External methodology — how brain-encoding studies pick controls

(External claims below are recall-grade unless quoted from a verified internal source.)

Standard practice across fMRI brain-encoding work (Allen et al. 2022 NSD; Caucheteux & King 2022 stories→brain; Defossez et al. 2023 brain2music; the TRIBE V2 paper itself):

1. **Held-out clips of the same modality.** A clip from the same dataset that the subject did NOT see during training, used as the encoding model's evaluation set. This is the gold-standard control — same camera, same subject, same scanner, different content.
2. **Permutation/temporal-shuffle null.** Re-randomize frame order within the same clip; recompute the encoding. Used as a *floor* baseline alongside (1), almost never as the headline number, because it preserves the marginal distribution of activations (so cosine similarity doesn't move much) and judges immediately see why.
3. **Random-Gaussian null.** Sample activations from `N(0, σ²)` with σ matched to the clip. Used as a sanity floor; any reasonable encoding model beats it trivially. Demo-grade only as a "we cleared the chance ceiling" footnote.
4. **Population-mean baseline.** Subject-A's activations vs the across-subject mean. Per PRD NFR15 + caltech/architecture-overview.md, this is **explicitly disallowed** in our build ("within-subject contrast only").

**TRIBE V2's own evaluation** (Caucheteux et al., Meta FAIR, ICLR 2026) uses held-out movie clips per subject + cross-subject permutation tests as the headline. Not random noise; not within-clip shuffle.

**The Clair de Lune protocol** (Johnny's prior work, cited as the methodological precedent in PRD §1 and §17 Q8) used **three different real stimuli** as controls (triumphant music, rain, aggressive speech), each chosen to falsify a *specific* failure mode of the candidate paragraph:
- *Triumphant music* falsifies "the paragraph just hits emotion centers in general" → control should hit emotion centers via different valence.
- *Rain* falsifies "the paragraph hits some default sensory baseline" → control should be ambient/neutral.
- *Aggressive speech* falsifies "the paragraph's score is driven by language-network activation alone" → control should have language but different affect.

Three controls × one paragraph = three deltas. The story was "deltas hold against all three" — which is a much harder and more demo-able claim than a single delta.

### 1.4 Three concrete options + tradeoffs (red-team mode)

I evaluated the three options the orchestrator proposed under bmad-advanced-elicitation red-team mode (think like Q-INT-style hostile judges). The ranked column is *demo defensibility* — what survives a hostile follow-up question.

#### Option (i) — Hand-pick a different real video; bake offline through TRIBE V2

**Procedure:** record/select two ~30s clips that match the demo clips on low-level features (camera type, framing, lighting, object density) but differ on *cognitive content*. Workplace control = same construction site, no scaffolding/no overhead drilling, just walking past materials. Consumer control = same Twitter/Reels-style feed, but topical ambient content (food porn, weather) instead of charged content (gossip + viral video). Bake each through the offline Colab pipeline (`prerendered/README.md` Stage 1) → drop `activity.json` into `backend/prerendered/{workplace_routine_baseline,curated_short_film_baseline}/`.

| Dimension | Score | Notes |
|---|---|---|
| Demo defensibility | **HIGH** | Direct match to Clair de Lune precedent + PRD §6.6 wording. Q-INT-7 ("How do you know it's not just hitting any brain pattern?") has a one-sentence answer: *"We scored against the same human's brain pattern on a different scene; delta = X."* |
| Within-subject contrast (NFR15) | **YES** | Clean within-subject if same subject filmed both clips. If two different subjects, becomes between-subject — still defensible but a softer claim. |
| Engineering cost | **HIGH** | Requires Colab bake (~30 minutes per clip if Vultr/Colab GPU available); also requires sourcing or shooting a control clip. The `caltech/3-person-build-plan.md:248-250` path was Junsoo's lane and was descoped in v2. |
| Demo-day fragility | **LOW** | activity.json on disk. No live anything. |
| Honesty risk | **LOW** | Real data, real contrast, easy to disclose method. |
| Red-team attack surface | "Why these specific controls?" — answerable; pre-write the rationale in the deck. "What if your subject is the same but the activity is more similar than you think?" — preempt by reporting per-region attribution showing where the deltas are biggest. |

**Headline number under this option:** the paragraph designed for the demo clip should hit ≥0.40 delta vs the control (PRD NFR23). If the bake produces a smaller delta on the actual paragraph, the falsifier is *informative* — that's good science, even if it's bad demo. Have a pre-written "the delta was 0.31 — we don't claim anchoring on that one" version of BEAT-4 in the back pocket.

#### Option (ii) — Synthesize controls from existing activity.json (shuffle frames + Gaussian noise)

**Procedure:** the path build-plan-locked explicitly named. `bake_control_clips.py` (does not exist; needs writing) reads `backend/prerendered/30s_ironsite/activity.json`, shuffles `frames[]` order, adds `np.random.normal(0, σ)` to every region scalar with σ ≈ within-clip std, writes `backend/prerendered/workplace_routine_baseline/activity.json`. Same for consumer. Document in the file as `"control_kind": "permuted_plus_gaussian_noise", "source": "30s_ironsite"`.

| Dimension | Score | Notes |
|---|---|---|
| Demo defensibility | **MEDIUM** | Honest if labeled. Q-INT attack: *"Your control is the SAME activity.json with frames shuffled. Why would that be a meaningful falsifier?"* The honest answer is: *"It preserves the marginal distribution but breaks temporal anchoring; we wanted a sanity floor in the freeze window. The real control is the held-out clip we couldn't bake in time."* — credible but soft. |
| Within-subject contrast (NFR15) | **TECHNICALLY YES** (same subject) but degraded — temporal-permutation is a within-condition control, not within-subject across conditions. |
| Engineering cost | **VERY LOW** | ~50 lines of Python; no GPU, no Colab. ≤15 min to write + run. |
| Demo-day fragility | **LOW** | activity.json on disk. |
| Honesty risk | **MEDIUM** | Acceptable IF clearly labeled in the falsification.json output (`"control_kind"` field). UNACCEPTABLE if presented as if it were a different recorded clip. PRD §5 + CONSTRAINT 2 demand transparent failure modes. |
| Red-team attack surface | Highest of the three. Statistician-judge will hammer it. Mitigated only by upfront disclosure. |

**Sub-variant (ii.b) — "shuffle frames only, no noise":** preserves marginal more strictly; weaker falsifier (deltas may be 0.1 not 0.4). Probably not enough to clear the NFR23 threshold of 0.40.

**Sub-variant (ii.c) — "Gaussian noise only, no shuffle":** wrecks structure but keeps temporal arc; effectively becomes option (iii). Don't ship.

#### Option (iii) — Synthetic / random-noise baseline

**Procedure:** generate `frames[]` with `regions[net] = np.random.normal(0, 0.05)` for every (t, network), write to disk. Or sample from a uniform distribution over `[-0.15, 0.30]` matching the empirical activation range.

| Dimension | Score | Notes |
|---|---|---|
| Demo defensibility | **LOW** | Q-INT attack: *"Your control is literally Gaussian noise — anything beats noise. What did you actually prove?"* Hard to defend at a brain-encoding-savvy panel. |
| Within-subject contrast | **NO** — synthetic; no subject. Direct violation of NFR15. |
| Engineering cost | **VERY LOW** | ~10 lines. |
| Demo-day fragility | **LOW** | activity.json on disk. |
| Honesty risk | **HIGH** if undisclosed; **MEDIUM-LOW** if framed as a *floor* alongside a real control. |
| Red-team attack surface | High; the methodologically-literate judge will dismiss. |

**Don't ship as the headline.** Acceptable as a *third* control alongside (i) showing "we beat random noise by X, beat the held-out clip by Y" — three-tier control structure mirroring Clair de Lune's three-stimulus design.

### 1.5 Recommendation

**Ship option (i) for the headline number, option (ii) as a labeled secondary, option (iii) only if both fail.**

Concrete plan:

1. **Saturday-morning offline Colab bake of two real control clips** (≤2 hrs total wall-clock for a Colab-comfortable Junsoo). Same subject if possible; if not, document the between-subject caveat in the falsification.json and the deck.
   - Workplace control: same construction-site footage, walking-only, no overhead drilling. Goal: matched on visual + somatomotor, differs on dorsal_attention + frontoparietal.
   - Consumer control: same Reels-style scroll, but ambient content. Goal: matched on visual + somatomotor (scroll motion), differs on default_mode + limbic.
2. **If (1) doesn't clear by 8 AM Saturday:** bake option (ii) controls with explicit metadata:
   ```json
   {
     "stimulus": null,
     "control_kind": "permuted_plus_gaussian_noise",
     "source_clip": "30s_ironsite",
     "permutation": "frame-order-shuffle, seed=42",
     "noise_sigma": 0.05,
     "atlas": "yeo7", ...
   }
   ```
   And surface `control_kind` in the empathy doc UI's §C so the audience sees the disclosure ("falsified against permuted-frame baseline — held-out clip control did not bake in time").
3. **In every case:** propagate `control_kind` field through `falsification.compute_falsification` → `falsification.json` → `EmpathyDocument.falsification.control_kind` → frontend §C render. Today this field doesn't exist anywhere; it's the linchpin of the disclosure path.
4. **Convert `_load_control_activity`** in both `main.py:289` and `warmup.py:226` to surface a structured error (`{"error":"control_missing", "expected_path":...}`) instead of self-substitute. This is also adjustment §6.B6 in the parent A1 audit.
5. **Cite Clair de Lune protocol** in the deck and pitch as the methodological precedent. Q-INT-7 answer: *"Same falsification logic that worked at 90.4% on Clair de Lune; we run it inverse here."* Already written in PRD §1 + post 2 of johnny-public-corpus-tribe-posts.md.

**Why this sequence:** strategic PRD demands (i); engineering plan-locked permits (ii) as honest stub; runtime demands neither be silent. Option (iii) is the floor anyone can write in 10 minutes if both upstream paths blow up — keep it as the disaster fallback only.

### 1.6 Open question for the orchestrator

The strategic PRD says **"same human, different scene"** (NFR15). For the consumer scenario this is hard: the demo clip is a Reels feed scroll; getting the same anonymous user filmed twice is impractical, and the publicly-available scrollcast clips don't come with subject identity. **Option:** treat the consumer control as between-subject (different person, similar scroll behavior) and disclose the loosened constraint in the falsification.json metadata. This is a strict downgrade from NFR15 but the alternative is no consumer control at all. Flag for orchestrator decision before R1 fires.

---

## DEEP-DIVE-2 — The empathy guardrail truthiness bug

### 2.1 Phase 1 — root-cause investigation (per superpowers:systematic-debugging)

#### Step 1.1 — read the error symptom

There is no traceback (the bug is silent). Symptom: `pass_guardrail_pre_flight` returns a result that *should* trigger STRICT MODE retry on forbidden phrases, but the retry path is never executed in any observed run. Verified by reading the trace in `qa_logs/QA_REPORT.md` — no STRICT MODE log lines.

#### Step 1.2 — reproduce consistently

```bash
$ python3 -c "
def pass_guardrail_pre_flight(text):
    if 'felt' in text:
        return (False, ['reverse-inference'])
    return (True, [])

candidate = 'she felt cold and afraid'
ok = bool(pass_guardrail_pre_flight(candidate))
print(f'bool() of returned tuple: {ok!r}')
print(f'STRICT-mode retry path entered? {not ok}')
print(f'raw return: {pass_guardrail_pre_flight(candidate)!r}')
"
```

Output (run during this audit):
```
bool() of returned tuple: True
STRICT-mode retry path entered? False
raw return: (False, ['reverse-inference'])
```

**100% reproducible.** Not flaky, not environmental, not race-conditioned.

#### Step 1.3 — gather evidence at boundaries

The bug crosses one boundary: the call from `empathy_synthesis.py` into `guardrails.py`. Read both halves:

**Producer — `backend/services/guardrails.py:27-34`:**
```python
def pass_guardrail_pre_flight(text: str) -> tuple[bool, list[str]]:
    if not text:
        return True, []
    violations: list[str] = []
    for pattern, tag in _FORBIDDEN_PATTERNS:
        if pattern.search(text):
            violations.append(tag)
    return (len(violations) == 0), violations
```

Type signature is explicit: `tuple[bool, list[str]]`. Returns `(ok_flag, violations_list)`. On a forbidden-phrase hit, returns `(False, ['reverse-inference: ...'])`.

**Consumer — `backend/services/empathy_synthesis.py:186-202`:**
```python
try:
    candidate = await _fire_once(system, user)
except Exception as e:
    return f"[empathy_synthesis error: {e}]"

try:
    ok = bool(pass_guardrail_pre_flight(candidate))   # ← line 192 — THE BUG
except Exception:
    ok = True

if not ok:
    try:
        candidate = await _fire_once(system + _STRICTER_DIRECTIVE, user)
    except Exception as e:
        return f"[empathy_synthesis retry error: {e}]"

return candidate
```

The consumer wraps the producer's tuple return in `bool(...)`. In Python, **any non-empty tuple is truthy regardless of element values**. Both `(True, [])` and `(False, ['reverse-inference'])` evaluate to `True` under `bool()`.

Verified empirically: `bool((False, ['reverse-inference']))` → `True`.

#### Step 1.4 — trace data flow backward from the symptom

Symptom: STRICT MODE retry never fires.
↓ traced to: `if not ok:` is never true.
↓ traced to: `ok = bool(tuple)` always `True`.
↓ traced to: `pass_guardrail_pre_flight` returns a 2-tuple, not a bool.
↓ traced to: signature change at some prior point — somebody upgraded the function from `bool` to `tuple[bool, list[str]]` (to also expose violation tags), and didn't update the caller.

Git blame would localize the regression but is out of scope for this audit.

#### Step 1.5 — co-located fail-soft cushion

`empathy_synthesis.py:19-23` wraps the IMPORT in a try/except that defines a no-op stub if `services.guardrails` fails to import:

```python
try:
    from services.guardrails import pass_guardrail_pre_flight  # type: ignore
except Exception:  # pragma: no cover - fail-soft if module missing
    def pass_guardrail_pre_flight(text: str) -> bool:  # type: ignore
        return True
```

Note the **stub's signature is `-> bool`** — that's the OLD signature. So even at the import layer, the type annotations disagree with reality. If the real module imports cleanly (it does today), the bug at line 192 fires. If the real module fails to import, the stub returns plain `True`, and `bool(True)` is `True` — STRICT MODE still never fires. **Either path silently bypasses.**

### 2.2 Phase 2 — pattern analysis

I checked other audits for whether anyone else has flagged this — they have:

- `refactor/audits/A2-stub-fallbacks.md:73` (entry I8) flags the exception wrap.
- `refactor/audits/A3-swarm-loop-merge.md:16-17, 57-62, 270` flags the truthiness bug as **CRITICAL**, includes a runtime verification.
- `refactor/audits/A5-prd-alignment-master.md:81-83, 254` includes the same finding plus a refactor signal: emit `{"error": "guardrail_violation", "violations": violations, "clip_id": clip_id}` when retry fails.
- `refactor/audits/A6-qa-eval-harness.md:112, 181, 683` notes the eval harness has no test for this — so CI couldn't have caught it.
- `refactor/audits/A7-structure-consolidation.md:64, 167` flags the import-stub fail-soft.
- The parent `refactor/audits/A1-prerender-cache.md:267-282` (Adjustment §6.B9 + §6.C10) covers both halves.

**Six audits independently identified the same bug across the audit pass.** That's strong corroboration. No audit has proposed a test that would catch it; that's the gap this dive closes.

### 2.3 Phase 3 — hypothesis + minimal fix

**Hypothesis:** unpacking the tuple makes the retry fire on forbidden input and not fire on clean input.

**Minimal patch** (do not apply; audit only):

```diff
--- a/backend/services/empathy_synthesis.py
+++ b/backend/services/empathy_synthesis.py
@@ -16,11 +16,8 @@
-try:
-    from services.guardrails import pass_guardrail_pre_flight  # type: ignore
-except Exception:  # pragma: no cover - fail-soft if module missing
-    def pass_guardrail_pre_flight(text: str) -> bool:  # type: ignore
-        return True
+# Hard import — PRD §5 calls forbidden-claim guardrails NON-NEGOTIABLE.
+# A missing module must crash, not fail-soft to "always pass".
+from services.guardrails import pass_guardrail_pre_flight
@@ -187,15 +184,18 @@
     try:
         candidate = await _fire_once(system, user)
     except Exception as e:
         return f"[empathy_synthesis error: {e}]"

-    try:
-        ok = bool(pass_guardrail_pre_flight(candidate))
-    except Exception:
-        ok = True
+    ok, violations = pass_guardrail_pre_flight(candidate)
+    if not ok:
+        logger.warning(
+            "guardrail_violation_pre_retry",
+            extra={"violations": violations, "candidate_head": candidate[:80]},
+        )

     if not ok:
         try:
             candidate = await _fire_once(system + _STRICTER_DIRECTIVE, user)
         except Exception as e:
             return f"[empathy_synthesis retry error: {e}]"
+        ok2, violations2 = pass_guardrail_pre_flight(candidate)
+        if not ok2:
+            logger.error(
+                "guardrail_violation_final",
+                extra={"violations": violations2, "candidate_head": candidate[:80]},
+            )
+            return (
+                f"[guardrail_violation_final: {','.join(violations2)}]"
+            )

     return candidate
```

(Plus `import logging; logger = logging.getLogger(__name__)` near the top — already present in `warmup.py:22` so the project pattern is established.)

The patch does three things:
1. **Unpacks the tuple correctly** so `ok` is the actual boolean.
2. **Hard-imports `pass_guardrail_pre_flight`** so a missing-module case raises at startup instead of silently making every paragraph pass.
3. **On final-retry failure, returns an error-tagged sentinel string** instead of the violating paragraph. Per CONSTRAINT 2 canonical shape ("logging the failure structurally AND returning an error-tagged payload"). The iterative loop's evaluator will score the sentinel as 0; the demo will surface visible failure rather than ship a paragraph that says "she felt afraid".

### 2.4 Phase 4 — the test that should catch it (TDD spec)

Per CONSTRAINTS rule 0 + superpowers:test-driven-development, the refactor lane (R-K or wherever guardrails live) MUST write the failing test first, watch it fail, then make it pass. There is currently NO test for this in the repo (verified: `find backend -name "test_*.py" -not -path "*/.venv/*"` → empty).

#### Failing test (red phase)

```python
# backend/tests/test_empathy_guardrails.py
"""Regression test for the bool(tuple) truthiness bug at empathy_synthesis.py:192.

When this test was written (2026-04-25), six independent A-shard audits
flagged that `bool(pass_guardrail_pre_flight(text))` is always True (any
non-empty 2-tuple is truthy). Without this test, the regression class will
return next time someone changes the guardrail signature.
"""
from __future__ import annotations

import asyncio
from unittest.mock import patch, AsyncMock

import pytest

from services import empathy_synthesis


@pytest.mark.asyncio
async def test_guardrail_violation_triggers_strict_retry(monkeypatch):
    """If K2 emits a forbidden phrase, the synthesizer must re-fire under
    STRICT MODE. The fact that the retry happens at all is the regression we
    are pinning."""
    fired_prompts: list[str] = []

    async def fake_fire_once(system: str, user: str) -> str:
        fired_prompts.append(system)
        if "STRICT MODE" in system:
            return "She moved through the scaffolding with sustained attention."
        # First call: produce a forbidden phrase ("she felt").
        return "She felt afraid as the scaffolding swayed."

    monkeypatch.setattr(empathy_synthesis, "_fire_once", fake_fire_once)

    out = await empathy_synthesis.synthesize(
        vision_report={"scene_summary": "scaffold"},
        swarm_readings={"regions": {}},
        scenario="ironside",
    )

    # Assert STRICT MODE retry fired.
    assert any("STRICT MODE" in p for p in fired_prompts), (
        "STRICT MODE retry never fired — the guardrail short-circuit bug is back. "
        "Check empathy_synthesis.py line ~192 — bool(tuple) is always truthy."
    )
    # Assert the violating output did NOT ship.
    assert "she felt" not in out.lower(), (
        f"Forbidden phrase 'she felt' shipped to caller: {out!r}"
    )


def test_guardrail_passthrough_on_clean_text(monkeypatch):
    """Clean candidate must NOT trigger STRICT MODE retry (positive case)."""
    fired_prompts: list[str] = []

    async def fake_fire_once(system: str, user: str) -> str:
        fired_prompts.append(system)
        return "The worker tracked the steel beam with sustained attention."

    monkeypatch.setattr(empathy_synthesis, "_fire_once", fake_fire_once)
    out = asyncio.run(empathy_synthesis.synthesize(
        vision_report={"scene_summary": "scaffold"},
        swarm_readings={"regions": {}},
        scenario="ironside",
    ))
    assert len(fired_prompts) == 1, (
        f"Expected exactly 1 fire on clean text; got {len(fired_prompts)}: {fired_prompts}"
    )
    assert "STRICT MODE" not in fired_prompts[0]


def test_pass_guardrail_pre_flight_returns_tuple_not_bool():
    """The signature itself is the bug source. If anyone reverts to
    `-> bool`, this test must scream."""
    from services.guardrails import pass_guardrail_pre_flight
    result = pass_guardrail_pre_flight("she felt afraid")
    assert isinstance(result, tuple), (
        f"pass_guardrail_pre_flight must return tuple[bool, list[str]]; got {type(result)}"
    )
    assert len(result) == 2
    ok, violations = result
    assert ok is False
    assert any("reverse-inference" in v.lower() for v in violations)


def test_bool_of_tuple_is_truthy_documentation():
    """Documents the Python semantics that produced this bug. Not a
    behavioral test — a tripwire on the language semantics so a future
    reader sees why the wrapping `bool()` was wrong."""
    assert bool((False, ["x"])) is True, (
        "If this assertion ever fails, Python's truthiness semantics have "
        "changed; revisit the empathy_synthesis guardrail call."
    )
    assert bool((True, [])) is True
```

#### Verification (red → green)

Order of execution per superpowers:test-driven-development:

1. **Red:** add the test file as-is. `pytest backend/tests/test_empathy_guardrails.py -v` → **FAIL** on `test_guardrail_violation_triggers_strict_retry` because `STRICT MODE` is never in `fired_prompts`. Evidence: the bug.
2. **Green:** apply the patch above. Re-run → **PASS**.
3. **Refactor:** ensure `logging.getLogger(__name__)` is wired and the `extra={...}` payload matches the canonical shape (`CONSTRAINTS.md:48`). Tests stay green.
4. **Regression-test the regression test:** revert just the patch (`git checkout backend/services/empathy_synthesis.py`); run again → **FAIL**. This is the red-green-red verification superpowers:verification-before-completion calls out for regression tests.

The fourth `test_bool_of_tuple_is_truthy_documentation` is a tripwire — it documents the semantics that produced the bug so a future reader is alerted before they re-write `bool(pass_guardrail_pre_flight(...))`. If Python ever changed its truthiness rules (it won't), the test catches that too.

### 2.5 Where this fits in the demo-day risk profile

PRD §5 lists six forbidden categories: reverse inference / clinical claims / sub-second predictions / population-norm / inflated TRIBE / "reads inner monologue". The `_FORBIDDEN_PATTERNS` table in `guardrails.py` covers all six (verified by reading `guardrails.py:12-24`). What's broken is the *enforcement*, not the *coverage*.

Today, the moderator prompt's in-prompt forbidden block (`prompts/moderator_synthesis.md:25-44`) does most of the work — K2 generally complies. But "generally" isn't NON-NEGOTIABLE. PRD §5 spells the consequence: **"NON-NEGOTIABLE — apply to ALL outputs."** Any single demo run where K2 hallucinates "she felt" is a public-facing PRD §5 violation. NFR12, NFR13, NFR14 are explicit in failing the rubric.

The 1-line fix (tuple unpack) closes the regex post-flight; the test pins it; the import hardening stops the silent-import-failure failure mode.

---

## Summary of asks for the orchestrator

| Ask | Decision needed | Owner-lane suggestion |
|---|---|---|
| Pick a control-baseline strategy (i / ii / iii / hybrid) | Yes — affects R1 and R-J Saturday-morning bake | LANE-J primary (offline TRIBE), LANE-K backstop (option ii script) |
| Approve the consumer between-subject control downgrade vs strict NFR15 within-subject | Yes (or surface the alternative — drop falsification on consumer scenario) | LANE-O / orchestrator |
| Approve the empathy-guardrail patch shape (tuple-unpack + hard import + sentinel return) | Yes — affects R-K | LANE-K |
| Add `backend/tests/` directory + the four tests above as the first regression suite | Yes — affects R-K and R-QA | LANE-K + A6 (qa-eval-harness shard recommendations) |
| Backport `control_kind` field through `falsification.compute_falsification` → `falsification.json` → frontend §C | Yes | LANE-J emits, LANE-O consumes |

---

**STATUS:** `DONE`

Both deep-dives delivered with run-and-test discipline. Internal evidence cited verbatim with file:line. External methodology recall is flagged as recall-grade, not verified, where applicable. No source modifications. Patch + test spec written for hand-off but not applied.
