# SHARD A1 — Pre-render cache & TRIBE-not-live audit

You are an audit-only Claude instance. Do NOT modify code. Read, analyze, write a markdown report.

## Read first
- `refactor/CONSTRAINTS.md`
- `refactor/CONTRACTS.md`
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (especially §3 architecture, §4.4 brain-encoding, §6 data contracts, §7 stage 0/1)
- `caltech/architecture-overview.md` (especially the "TRIBE V2 — BRAIN ENCODING" box and the "PRE-CACHE FALLBACK" notes throughout)

## Investigate
1. What pre-rendered artifacts exist today per clip? Walk `backend/prerendered/<clip_id>/` for both `30s_ironsite` and `30s_twitter` and document every file present + its shape (head -50 each JSON).
2. Which artifacts MISSING per the PRD §3 pre-warmup contract? Specifically: `activity.json`, `swarm_readings.json`, `k2_region_cache.json`, `empathy.json` (which itself includes `iterative_trajectory` + `falsification` payloads). Plus a `control_activity.json` for the falsification baseline.
3. How does the current backend resolve a video upload to its pre-rendered cache? Read `backend/main.py:_resolve_video_path`, `_clip_dir`, and `/demo/match`. Document the exact match logic. Is it the hard-code name match per CONTRACTS C5?
4. Where in `backend/services/` does TRIBE V2 get touched? Search for `tribev2`, `TribeModel`, `predict_brain_from_text`, `encode_video`. Document each call site, noting whether it's gated behind any env flag.
5. The `services/embedding_proxy/__init__.py` is a sentence-transformer→Yeo7 proxy. Read it. Document: what does it replace, what does it consume, what does it emit? Is it being used by `iterative_loop.py` as the TRIBE forward substitute?
6. Cross-reference `backend/services/warmup.py` and `backend/services/session_cache.py` — what is the orchestration that fills caches at startup? Is the cache write path safe (no live TRIBE attempt at boot)?

## Report (write to `refactor/audits/A1-prerender-cache.md`)

Required sections:
- **Inventory** — table of every file in each `prerendered/<clip>/` dir + size + shape (top-level JSON keys).
- **PRD §6 gap matrix** — for each PRD-mandated artifact, present? what schema? deviations?
- **TRIBE-touchpoints** — every line in `backend/` that imports/calls TRIBE; for each: live or pre-cached? gated by env flag?
- **Cache-resolve logic** — annotated walkthrough of how a video filename becomes a cache hit (or miss).
- **Embedding proxy assessment** — is it correctly substituting TRIBE forward for the iterative loop? Any code paths that bypass it and try real TRIBE?
- **Concrete adjustments** — bullet list of changes needed to make the system PRD-faithful AND TRIBE-not-live compliant. Cite PRD section per bullet.
- **Risk callouts** — anything that would silently break if TRIBE forward gets called by accident.

Do NOT write code. Do NOT git-add or commit. Just the report.

## Acceptance
Report exists at `refactor/audits/A1-prerender-cache.md` with all 7 sections. Every adjustment cites a PRD section. Inventory is complete. No file under `backend/services/` was modified.
