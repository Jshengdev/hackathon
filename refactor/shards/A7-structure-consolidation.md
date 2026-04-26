# SHARD A7 — Structure consolidation + long-term architecture refactor

You are an audit-only Claude instance. Do NOT modify code.

## Skills to load before starting
- `code-simplifier:code-simplifier` — clarity, consistency, dead-code removal.
- `feature-dev:code-architect` — sketch the long-term layout that production-grade SaaS projects use.
- `superpowers:writing-plans` — convert the audit findings into a plan that refactor shards can execute.

## Critical context

The user's lock: "consolidate the structure and refactor everything into the exact architecture structure that we need for long-term coding development and ensuring that there's a good frontend and stable backend."

Today the repo has accumulated multiple parallel build attempts:
- `backend/` (the active demo backend, post-junsoo's v2 pull)
- `caltech/engine/` (old empathy engine — was the prior pipeline, partially superseded by v2)
- `archive/` (history)
- `junsoo/` (re-introduced fixture/scratch dir)
- `_bmad/`, `_bmad-output/` (planning + LLM bmad workflow outputs)
- `feesh/` (?)
- `frontend/` (active demo UI)
- `caltech/pitch-deck/` (separate Next.js project for the public deck)

This shard maps the current structure, identifies dead code + duplications, and proposes the consolidated long-term layout that the refactor execution shards will migrate to.

## Read first
- `refactor/CONSTRAINTS.md` and `refactor/CONTRACTS.md`
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §3 + §4 (the v2 architecture — this is what the structure must reflect)
- `caltech/architecture-overview.md` §4 (the v2 flow)
- `TODO.md` (the demo TODO from the prior session)

## Investigate

1. **Current top-level inventory.** For each top-level dir, document: purpose, last-touched commit, lines-of-code, whether it's still load-bearing for the demo, whether it duplicates another dir.

2. **Backend structure deep-read.** Walk `backend/`:
   - `services/` — list each `.py`, its public functions, who imports it, status (`ACTIVE` / `LEGACY` / `DEAD`).
   - `prompts/` — which prompts are referenced from code? which are orphaned?
   - `prerendered/` — per-clip cache layout; is it consistent with CONTRACTS.md C1?
   - `models/`, `scripts/`, root-level `main.py`, `atlas.py`, `smoke_test_swarm.py` — what's the boundary between "long-lived API surface" and "one-off scripts"?

3. **Frontend structure deep-read.** Walk `frontend/src/`:
   - `stages/` — one per route stage; document the lifecycle.
   - `components/` — sibling-pattern consistency? Any dead components?
   - `composables/` — Vue 3 composition functions; orphans?
   - `api/`, `utils/` — boundary between data layer + utilities.
   - Identify any inline mock data, hardcoded fallback content, or placeholder strings (per the no-fallback rule).

4. **Cross-cutting cleanup candidates.**
   - `caltech/engine/` — was it superseded by `backend/services/`? If yes, can it be archived?
   - `junsoo/` re-introduced dir — is anything in it active or is it scratch?
   - Old fixtures, old prerendered files, screenshot directories (other than `backend/qa_logs/`) — what's safe to remove?

5. **Long-term layout proposal.** Sketch the target tree. Examples to consider:
   ```
   /
   ├── apps/
   │   ├── frontend/          # Vue 3 demo UI
   │   └── deck/              # caltech/pitch-deck (Next.js)
   ├── services/
   │   └── backend/           # FastAPI + K2 + Qwen + embedding proxy
   ├── data/
   │   └── prerendered/       # canonical per-clip cache (was backend/prerendered)
   ├── docs/
   │   ├── prd/               # ironsight-listenlabs-prd.md, technical-prd.md
   │   ├── architecture.md    # caltech/architecture-overview.md
   │   └── runbook/           # demo-script.md, build-plan-locked.md
   ├── plans/                 # refactor/ + audits/
   └── archive/               # history (no symlinks back into active code)
   ```
   Pros / cons of various consolidations. Do NOT pick one — propose 2-3 options and recommend the cheapest one that achieves the user's goal.

6. **Stable input/output contracts.** Reaffirm that across the consolidation, every active module has a clear public input/output (NO leaky imports, NO sibling-of-sibling reaches into private internals). Identify offenders today.

7. **Frontend ↔ backend boundary.** Is the frontend reaching into anything other than `/demo/*` and `/brain/*` HTTP routes? Any cross-imports that violate the boundary? Document them.

## Report (write to `refactor/audits/A7-structure-consolidation.md`)

Required sections:
- **Top-level dir inventory** — table per top-level: purpose / last-touched / LOC / status.
- **Backend dead-code map** — every legacy file in `backend/` + `caltech/engine/` + `junsoo/` with safe-to-archive recommendation.
- **Frontend dead-code + mock-data map** — components / composables / inline mocks to clean up.
- **Cross-cutting cleanup** — `caltech/engine/`, screenshot dirs, prerendered duplicates, etc.
- **Long-term layout options** — 2-3 candidate tree shapes with pros/cons; one explicit recommendation.
- **Migration risk callouts** — what breaks during a tree move? import paths, scripts that hardcode `backend/`, deploy configs.
- **Boundary violations** — where the frontend ↔ backend boundary is currently leaky.
- **Refactor execution sequence** — ordered list of moves so the demo never breaks during the migration. Each step should leave a working demo.

Do NOT write code. Do NOT move files. Just the report.

## Acceptance
Report at `refactor/audits/A7-structure-consolidation.md` with all 8 sections. Migration sequence must keep the demo runnable at every step. Long-term layout has explicit pros/cons per option.
