# CONSTRAINTS — locked rules for every audit shard and every refactor shard

These are non-negotiable. Apply them in your audit findings and your recommendations.

## 0. Skills every spawned Claude should load

Before doing audit or refactor work, load these via the `Skill` tool. Don't skip the planning discipline — it's what keeps 8 parallel Claudes from drifting.

**Planning + execution (load first):**
- `superpowers:writing-plans` — convert audit findings into an executable plan; specs > guesses.
- `superpowers:subagent-driven-development` — when the shard's work itself decomposes into independent tasks, spawn sub-implementers + reviewers using this pattern.
- `superpowers:using-git-worktrees` — your worktree is the isolation boundary; don't leak changes outside it.
- `bmad-advanced-elicitation` — when stuck on a design choice, use Socratic / first-principles / pre-mortem / red-team to surface the right answer before writing code.

**Quality + discipline:**
- `superpowers:test-driven-development` — write the failing test first, watch it fail, then make it pass. Mandatory for refactor shards.
- `superpowers:verification-before-completion` — never claim done without running the verification commands and confirming output.
- `superpowers:systematic-debugging` — root-cause failures.
- `code-simplifier:code-simplifier` — clarity, consistency, dead-code removal.

**Domain-specific (load if your shard touches them):**
- `frontend-design:frontend-design` — for shards A4 / A8 (frontend redesign).
- `feature-dev:code-architect` — for shards A3 / A7 (architecture-level decisions).
- `bmad-party-mode` — when an audit needs multiple perspectives at once (PM + architect + QA + designer).

Run-then-test discipline is mandatory: every change → run the eval harness → fix what broke → run again. Verification commands or it didn't happen.

**Don't be a blocker:** if a constraint here would prevent you from making forward progress on a real demo-day deadline, raise it as an audit finding rather than freezing. The constraints are guardrails, not stop signs.

## 1. TRIBE V2 is NEVER run live during the demo

- All TRIBE V2 outputs (forward and reverse) are pre-rendered offline (Vultr GPU box) and shipped as JSON next to each clip.
- Live demo path reads `backend/prerendered/<clip_id>/<artifact>.json` as the source of truth. Hard-code name match: `clip_id` → folder name → cached JSON.
- Any code path that imports `tribev2.demo_utils` or otherwise touches TRIBE weights MUST be gated behind an explicit env flag (e.g. `TRIBE_LIVE=1`) and skipped by default.
- Cache miss → `logger.error("cache_miss", extra={"clip": clip_id, "artifact": "target_brain"})` + return 404. Never synthesize.

## 2. Don't substitute fake content silently — log + surface

The principle: **a failure must be visible**, not disguised as a successful call.

- ❌ **NOT acceptable:** silently returning a hand-written stub paragraph that looks like real K2 output. A judge can't tell it's fake.
- ✅ **Acceptable:** logging the failure structurally AND returning an error-tagged payload that the frontend renders as a visible "K2 CALL FAILED · 401" red badge.
- ✅ **Acceptable:** documented dev-mode fallbacks gated behind `import.meta.env.DEV` or `MOCK_*=1` env flags. These are testing tools, not shipping content.
- ✅ **Acceptable:** pre-rendered cache reads — that's the demo-day reliability story.
- ✅ **Acceptable:** schema-defaulted empty payloads (e.g., `round_trajectory: []`) when a stage genuinely produced no data — the frontend handles empty arrays as "no data yet" without faking content.

Use this canonical shape when an external call fails:
```python
logger.error("k2_call_failed", extra={"clip": clip_id, "network": net, "status": status, "body": body[:200]})
return {"error": "k2_unavailable", "clip_id": clip_id, "network": net}
```

The autonomous refactor flow should NOT block on rule 2 — instead it should **convert** existing silent stubs into log-and-surface error payloads. If a refactor has to keep a fallback temporarily to ship the feature, mark it with `# TODO(no-fallback): convert to log+surface` and call it out in the audit report.

## 3. Swarm-loop architecture (v2, locked 2026-04-25 in technical PRD §3)

K2 plays THREE roles on one surface (per technical PRD §4.3):
- **Stage 1B — Per-region specialists.** 7 parallel K2 calls reading `activity.json` aggregates → `(reading, confidence, cite)` per Yeo7 network. Code: `services/swarm_runner.py`.
- **Stage 2 — Moderator.** ONE K2 call combines vision_report + swarm_readings (+ prior_score / per_region_miss on rounds ≥ 2) into a candidate paragraph. Code: `services/empathy_synthesis.py`. **Note: v2 swapped this from Opus 4.7 to K2 because the loop fires Stage 2 once per round and Opus latency × 8 rounds was the budget killer.**
- **Stage 3 — Evaluator swarm.** Per round, 7 parallel K2 evaluators rate the candidate paragraph; mean = round_score. Plateau-exit on |Δ|<0.02 over 2 rounds OR round 8. Code: `services/iterative_loop.py`.

**Stage 4 — Opus 4.7 synthesis.** Terminal-only: ONE Anthropic Messages API call per clip, post-loop, that braids vision report + swarm readings + iterative trajectory + per-region attribution + falsification + best_paragraph into a structured `EmpathySynthesisDocument` (CONTRACTS C6 — `headline`, `synthesis_paragraph`, `temporal_arc[]`, `neural_evidence[]`, `inflection_moment`, `falsification` explanation, `scenario_lens`, `model_metadata`). Code: `services/empathy_polish.py`; prompt: `prompts/opus_synthesis.md`. **Never inside the iterative loop** — Opus latency × 8 rounds was the original budget killer; Stage 4 is once-per-clip only. Gated by `OPUS_POLISH=1` + `ANTHROPIC_API_KEY`. If either env is missing (or the call fails / JSON-parse fails / required keys missing), `synthesize_document` returns `None`, `synthesis_document` and `polished_paragraph` land as `null` in `empathy.json`, and the frontend renders `best_paragraph`. The original "cut-line at 8 PM Saturday" framing is now implemented as graceful env-driven degradation — flip `OPUS_POLISH=0` (or unset `ANTHROPIC_API_KEY`) and re-bake the cache; no code rollback. This is the ONLY place Opus 4.7 runs.

**Stage 5 — Embedding-proxy falsification.** Sentence-transformer (`all-MiniLM-L6-v2`) → 384-dim → 7-dim Yeo7 projection (W matrix). Cosine vs activity.json (target) and control_activity.json. NOT a TRIBE forward call — proxy stand-in.

**Use-case alignment:**
- Ironsight prompt = the K2 swarm (Stage 1B + 3) gives the video information it didn't have before (per-region cognitive context).
- Listen Labs prompt = the modular Opus synthesis (`scenario_lens` swap on `clip.scenario` between `ironside` and `listenlabs`) + persona-shell (workplace / consumer / pavilion) lets the same engine generate scenario-appropriate output.

## 4. Frontend never has inline mock data in shipping code

- Mocks are dev-only and gated behind `import.meta.env.DEV`.
- The current `ComparisonStage.vue` mock `trajectory = [...]` const is a violation that must be replaced with a real fetch from `/demo/iterative-trajectory/{clip_id}`.

## 5. Audit shards do NOT modify code

- Audit shards (S1–S5) read code, document state, propose adjustments, and write a markdown report at `refactor/audits/<shard-name>.md`.
- Audit shards do NOT git-add, git-commit, or change any source files. They may create their own report file in the worktree.
- Refactor execution happens in a SEPARATE pass after the orchestrator QAs all 5 audits.

## 6. PRD + architecture-overview are the alignment targets

- Technical PRD: `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (v2 — §3 + §4 are the v2 architecture; §13 + §14 carry v1 FRs/NFRs with `[v2-superseded]` tags inline)
- Strategic PRD: `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (CURRENTLY STALE — still references live TRIBE + Opus-as-Stage-2; refactor shard R-DOCS will rewrite)
- Architecture overview: `caltech/architecture-overview.md` (v2-current as of 2026-04-25)
- Every audit finding must be cross-referenced to a specific section of the technical PRD or architecture-overview. "This deviates from PRD §4.2" not "this seems off".

## 6.5. Design system (for any UI/UX-touching shard)

Frontend visuals MUST align to the pitch-deck's Clay-inspired design system documented in `caltech/pitch-deck/DESIGN.md` and `caltech/pitch-deck/app/globals.css`. Canonical tokens are summarized in `CLAUDE.md` "Design tokens" section.

Key choices:
- **Accent:** `--blueberry-800: #01418d` (also the cortical-cool stop)
- **Failure / control:** `--red: #fc7981` (pomegranate-400)
- **Highlight:** lemon-500 `#fbbd41`
- **Background:** for the demo dashboard, keep dark navy `#050510` (the brain reads against dark — pitch-deck uses warm-cream because it's a slide deck)
- **Type:** Roobert (display/UI) + Space Mono (telemetry/code labels)
- **Shadow:** Clay multi-layer signature `rgba(0,0,0,0.10) 0 1px 1px, rgba(0,0,0,0.04) 0 -1px 1px inset, rgba(0,0,0,0.05) 0 -0.5px 1px`
- **Radius:** 12px cards, 24px features, 40px sections, 9999px pills
- **Hover micro-animation:** Clay's `rotateZ(-8deg) translateY(-80%)` + hard offset shadow — use sparingly on hero CTAs only (would be too playful for swarm panels)

Don't invent new color tokens. If a shard needs a color the system doesn't have, surface it as an audit finding so we can extend the system once.

## 7. Real data only — especially the frontend

- Frontend has zero inline mock arrays in shipping code. Mocks gated behind `import.meta.env.DEV` only.
- Backend caches MUST contain real data (no `"stub": true` flags). Cache-warm path: TRIBE-cut means activity.json is the seed; everything else (vision, swarm, empathy) is real-LLM-generated and committed to repo on Saturday 8 AM.
- Frontend "real data" assertion: every component with a fallback render path must, in PROD mode, show an explicit "REAL DATA MISSING" surface (red badge, error code) — never a happy-looking placeholder.
- Run → test → run → test discipline applies hardest here: every refactor that touches frontend data flow must be followed immediately by a Playwright drive-through that scans for any visible "STUB" / "FAKE" / "PLACEHOLDER" surface.
