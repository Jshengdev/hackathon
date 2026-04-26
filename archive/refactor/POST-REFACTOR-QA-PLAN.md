# Post-Refactor QA Pass Plan (B-shards)

This is the plan for the **third pass** that fires AFTER the refactor execution shards (R1-R9) have landed. Each B-shard re-audits the same scope its A-shard audited, but instead of cataloging gaps it verifies that the gaps were actually closed.

## When to fire

Sequence:
1. **A-pass (audit) — IN FLIGHT NOW.** A1-A9 each generate a report at `refactor/audits/<shard>.md` and `<shard>-deepdive.md` where applicable.
2. **Orchestrator QA pass.** Synthesizes the audits into a consolidated **Refactor Execution Plan** (single doc, ordered list of changes per file).
3. **R-pass (refactor execution).** R1-R9 + R-DOCS each execute their slice of the refactor plan — actually move files, write code, fix bugs. Each R-shard runs in its own worktree on `refactor/<shard>` branch. Sequential (not parallel) — R-shards may touch overlapping files, so we serialize.
4. **Settle.** After all R-shards merge, run the eval harness from A6 (no-fallback grep recipes + integration tests + e2e demo gate) to confirm the refactored system works end-to-end.
5. **B-pass (re-QA) — THIS PLAN.** B1-B9 verify each refactor's claims against the original A-shard audit. Each B-shard re-runs the A-shard's verification commands and confirms the gaps are closed.

## B-shard scopes (mirror A-shards)

| B-shard | What it verifies |
|---|---|
| **B1** | Pre-render cache layout matches CONTRACTS C1; control_activity.json files exist for both scenarios; falsification.delta is non-zero on real demo runs; no TRIBE-live code paths remain ungated. |
| **B2** | `grep -rn '"stub": True' backend/services/` returns 0 lines. Every external call path emits structured `logger.error(...)` on failure. Frontend renders visible "FAILED" badges (Playwright drive-through). |
| **B3** | Stage 1B / Stage 2 / Stage 3 / Stage 4 / Stage 5 each match v2 architecture diagram exactly. K2 plays three roles on one surface as documented. Opus polish path either exists + gated or is formally removed. Per-round trace schema validates against CONTRACTS C2. |
| **B4** | `ComparisonStage.vue` removed (or its inline mock removed). `EmpathyDocumentStage.vue` consumes real `/demo/empathy/{clip_id}` payload. RegionPopup field shape matches new `/demo/k2-region` output. Zero inline mock arrays in shipping code (`grep -rn "const.*= \[" frontend/src/stages frontend/src/components` shows only fixture/dev imports). |
| **B5** | PRD §13/§14 v2-superseded tags now consistent with §3/§4 (no orphan "Stage 2 Opus" or "TRIBE forward" references). Strategic PRD rewritten by R-DOCS to v2 architecture. Architecture-overview doc unchanged (still v2-current). |
| **B6** | Eval harness from A6 actually runs in CI / pre-commit. FR/NFR coverage matrix shows green for every locked v2 requirement. End-to-end demo gate script passes against real backend. Schema validators in place. |
| **B7** | Repo structure matches A7's recommended layout. No legacy `caltech/engine/` paths still imported. `junsoo/`, `feesh/`, scratch dirs archived. Boundary leaks (frontend → backend internals) closed. |
| **B8** | Dashboard collapses 4-stage flow into 1 page. Brain mesh hosts 7 hover anchors at correct world coords. Insight cards swap on hover with safe-triangle transit. Real backend data drives every panel. PostEffects + atmosphere/orbit visuals intact. |
| **B9** | Repo cleanliness — long-line violations < 5, all addressed; deprecated docs in `archive/`; no overly-long source lines remain; no orphan files at root. |

## How B-shards differ from A-shards

| Aspect | A-shard | B-shard |
|---|---|---|
| Mode | Audit-only | Verify + QA-only |
| Modifies code? | No | No |
| Output | Catalog of gaps | Pass/fail per A-finding |
| Time budget | 5-15 min thinking | 2-5 min verification |
| Skills loaded | Full stack (writing-plans + TDD + ...) | `superpowers:verification-before-completion` + `superpowers:systematic-debugging` |
| Failure | Reports `BLOCKED` if can't audit | Reports `FAILED` with specific A-finding numbers that didn't close |

## B-shard prompt template

```
You are a verification-only Claude instance for shard B<N>-<topic>. The corresponding A<N> audit finished
at refactor/audits/A<N>-<topic>.md. The R<N> refactor that addresses A<N>'s findings landed in commits
<sha-range> on branch refactor/<topic>.

Your job: re-run A<N>'s verification commands and confirm each gap is closed.

Bootstrap:
1. Read refactor/audits/A<N>-<topic>.md (the original audit).
2. Read refactor/audits/R<N>-<topic>-summary.md if it exists (refactor execution log).
3. Read CLAUDE.md, NEW-ARCHITECTURE.md, CONSTRAINTS.md (canonical references).
4. Load skills: superpowers:verification-before-completion, superpowers:systematic-debugging.

For each finding in A<N>'s report:
- Re-run the verification command from A<N>.
- Compare output: does it now show the fix landed?
- Mark each finding: ✅ CLOSED | ⚠️ PARTIAL | ❌ STILL OPEN | 🆕 NEW REGRESSION

Write to: refactor/audits/B<N>-<topic>-verification.md.

Constraints:
- Do NOT modify code (verify-only).
- Do NOT mask failures — log + surface every regression.
- Cite exact command + actual output for every claim.

Report status: ALL_CLOSED | PARTIAL_CLOSURE | REGRESSIONS_FOUND.
```

## Spawning B-pass

After R-pass settles + eval harness green, run:

```bash
bash refactor/spawn-verification-swarm.sh   # to be created when R-pass is queued
```

This script will mirror `spawn-audit-swarm.sh` but use the B-shard prompt template and a separate `worktrees/B*-*/` set on `verify/<topic>` branches.

## What constitutes "settle" before B-pass

1. ✅ All R-pass shards merged (or rejected — but no R-shard left in-flight).
2. ✅ Backend `pytest` (or equivalent) green.
3. ✅ Frontend `npm run build` clean (no console errors).
4. ✅ Manual demo flow Landing → Loading → Dashboard → Region click works end-to-end with real backend, real keys, real cache files.
5. ✅ A6's e2e demo gate script passes.

If any of those 5 fails, fix BEFORE firing B-pass. The B-pass is the final sign-off — it should not be where the demo bugs get caught.

## Dependencies

The orchestrator (this main session) must:
- Receive A-pass reports.
- Synthesize the consolidated execution plan.
- Spawn the R-pass (sequential).
- Run the eval harness.
- Spawn the B-pass.
- If B-pass shows regressions, queue R-pass-2 (targeted fixes + re-verify).

This file is the contract for steps 5+ above.
