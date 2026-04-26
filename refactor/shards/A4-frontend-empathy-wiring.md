# SHARD A4 — Frontend ↔ EmpathyDocument wiring audit

You are an audit-only Claude instance. Do NOT modify code.

## Read first
- `refactor/CONSTRAINTS.md` (rule 4 — no inline mock data)
- `refactor/CONTRACTS.md` (C2 EmpathyDocument, C3 per-round trace, C4 API surface)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §6.7 (EmpathyDocument), §11 (output document UI)
- `caltech/architecture-overview.md` "EMPATHY-LAYER DOCUMENT" box

## Investigate
1. **Stage map.** What stages exist in `frontend/src/stages/`? For each: what backend endpoints does it call, what data shape does it expect, what does it render?
2. **ComparisonStage hard-code violations.** `frontend/src/stages/ComparisonStage.vue` has an inline `trajectory = [...]` mock. Document its shape. Also check for any other inline mocks in shipping code (not gated behind `import.meta.env.DEV`).
3. **API consumer audit.** Walk `frontend/src/api/index.js`. List every function: name, endpoint hit, return shape consumed, where it's called.
4. **EmpathyDocument readiness.** The backend exposes `/demo/empathy/{clip_id}`, `/demo/iterative-trajectory/{clip_id}`, `/demo/falsification/{clip_id}`. Does the frontend call any of these? If not, what would need to change?
5. **IterativeLoop component contract.** `frontend/src/components/IterativeLoop.vue` accepts a `:trajectory` prop. Document its expected shape (round / score / paragraphExcerpt at minimum). Cross-reference against the per-round trace that the new swarm-loop will emit (per A3's contract). Any field gaps?
6. **RegionPopup wiring.** `frontend/src/components/RegionPopup.vue` is fed by `POST /demo/k2-region`. Verify the field shape (text/confidence/cite/t/runtimeSec). Document any fields the popup wants that the backend doesn't currently emit.
7. **Visible failure states.** When backend errors, what does the frontend currently render? Does it show "K2 CALL FAILED · 401" with red accent (correct) or does it render a happy fallback (violation)? Catalog every error-handling path in the stages and components.
8. **Ironsight vs Listen Labs scenario routing.** How does the frontend decide which scenario it's in? Is there a prop/route/session-state plumbing for it? The new modular Opus output requires the frontend to know which framing to render.

## Report (write to `refactor/audits/A4-frontend-empathy-wiring.md`)

Required sections:
- **Stage call graph** — table per stage: endpoints called, props passed, mocks present.
- **Inline mock violations** — file:line of every hardcoded data in shipping code, with proposed real-fetch replacement.
- **API function inventory** — table of every export in `api/index.js` with consumer + endpoint + shape.
- **Empathy endpoint integration plan** — concrete patch outline for ComparisonStage to consume `/demo/empathy/{clip_id}` instead of `/demo/comparison/{clip_id}`. Document data-shape diff.
- **IterativeLoop schema gap** — what fields the component needs that the new backend trace doesn't yet emit (or vice versa).
- **RegionPopup contract** — current vs desired payload from `/demo/k2-region`.
- **Error-state coverage** — for each stage, what happens on backend 4xx/5xx? Where are the "K2 CALL FAILED" surfaces missing?
- **Scenario routing recommendation** — how to plumb scenario (workplace vs consumer) through frontend so Opus can return the right modular output.
- **Migration order** — which file to refactor first to avoid breaking the running demo (probably `api/index.js` first as the seam).

Do NOT write code. Just the report.

## Acceptance
Report at `refactor/audits/A4-frontend-empathy-wiring.md` with all 9 sections. Every recommendation has a frontend file path. Stage call graph is complete (every stage in `frontend/src/stages/`).
