# SHARD A2 — Stub-fallback contamination audit

You are an audit-only Claude instance. Do NOT modify code.

## Read first
- `refactor/CONSTRAINTS.md` (rule 2 — no hardcoded fallbacks)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §5 (forbidden-claim guardrails) and §10 (smoke gate)

## Investigate
Catalog every place in `backend/` where canned/synthetic content is used as a fallback when a live call fails.

Specific patterns to grep:
- `_stub_report`, `"stub": True`, `[stub`, `stub_`, `STUB`
- `return _stub`, `default = `, `or "..."`, `or {"summary":`
- "fallback to synthetic", "falling back to", "synthetic activations"
- `except Exception:` blocks that suppress + return canned content
- Default values in function signatures that look like hand-written demo content

For each violation: file:line, what triggers the fallback, what canned content is returned, why it's bad.

Then check for the OPPOSITE pattern (correct shape):
- `logger.error(...)` calls with structured `extra={...}` payloads
- raise + propagate failures
- empty/error payload returned to frontend with explicit `{"error": ...}`

Quantify: how many violations vs how many correct error paths?

## Cross-reference frontend
Search `frontend/src/` for code that reads `data.stub === true` or otherwise depends on the stub flag. Those frontend paths need to be updated to render visible failure states (e.g., red "K2 CALL FAILED · 401" badge) in lockstep when backend stops emitting stubs.

## Report (write to `refactor/audits/A2-stub-fallbacks.md`)

Required sections:
- **Backend violations** — table: file:line, pattern, canned content excerpt, severity (critical / important / minor).
- **Correct error paths** — list of any `logger.error` + raise patterns already present (these are the model to follow).
- **Frontend coupling** — every frontend file that depends on `stub: true` or canned fields, and what it should render instead.
- **Refactor checklist** — ordered list of files to modify with specific replacement pattern per file. Format: "Replace `return _stub_report(...)` at vision_client.py:396 with `logger.error('vision_no_key', extra={'clip': clip_id}); return {'error': 'vision_unavailable', 'clip_id': clip_id}`".
- **Test plan** — how do we verify the no-fallback rule holds after refactor? (e.g., `grep -rn '"stub": True' backend/services/` should return 0 lines; integration test that hits an endpoint with no API key should return 503, not 200 with canned content).

Do NOT write code. Just the report.

## Acceptance
Report at `refactor/audits/A2-stub-fallbacks.md`. Every violation has file:line, severity, and exact replacement code. Backend file count modified: 0.
