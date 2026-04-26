# SHARD A9 — Documentation audit + repo-cleanliness pass

You are an audit-only Claude instance. Do NOT move files or modify code yet — write a report that the R-pass executes from.

## Skills to load before starting
- `superpowers:writing-plans` — convert findings into ordered move/archive/keep plan.
- `superpowers:subagent-driven-development` — spawn parallel sub-investigators (one for backend code-quality, one for frontend code-quality, one for doc-deprecation, one for web-research best practices). Use the Agent tool with `general-purpose` subagent_type for each.
- `superpowers:using-git-worktrees` — your worktree is the isolation boundary.
- `superpowers:verification-before-completion` — claims need real `find` / `wc -l` / `awk` evidence.
- `code-simplifier:code-simplifier` — for the code-quality lint pass.
- `bmad-advanced-elicitation` — when stuck on what to keep vs archive.

## Dispatch sub-agents in parallel

Use the `Agent` tool to spawn the following four sub-investigators in ONE message (parallel). Each writes a section that you assemble into the final report.

### Sub-agent 1 — Documentation deprecation catalog

> Walk every `.md` file in the repo (use `find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.worktrees/*" -not -path "*/worktrees/*"`). For each file: path, size in lines, last-modified date, top-of-file purpose (read first 10 lines), classify as one of:
> - **canonical** — current source of truth for some topic (e.g., `caltech/NEW-ARCHITECTURE.md`, `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` v2)
> - **active** — supports current work but not yet canonical (e.g., shard SHARD.md files)
> - **deprecated** — superseded but not yet archived (e.g., old PRD versions, prior TODO files, completed yap-extracts, prior architecture sketches)
> - **historical** — already archived or appropriately in `archive/`
> - **orphan** — no obvious purpose, possible scratch
>
> Output: markdown table per category. For deprecated items, propose target archive path (e.g., `archive/prd-v1/...`).
> Heavy use of `grep -l "v1\|deprecated\|superseded"` to find self-flagged stale docs.
> Do NOT move anything — just catalog.

### Sub-agent 2 — Backend code-quality lint pass

> Audit backend Python source for long lines, missing type hints, leftover `print(` debug statements, missing logging, swallowed exceptions, and dead code.
>
> Specific commands:
> - `find backend -name "*.py" -not -path "*/__pycache__/*" -not -path "*/.venv/*" -exec awk '$0 ~ /.{121}/ {print FILENAME":"NR" ("length($0)" chars)"}' {} \;` — files with lines > 120 chars
> - `grep -rn "print(" backend/services/ | grep -v "__pycache__"` — debug prints in services
> - `grep -rn "except Exception:" backend/ | grep -v "__pycache__"` — bare excepts
> - `grep -rn "TODO\|FIXME\|XXX\|HACK" backend/` — outstanding markers
>
> Output: severity-ordered list of code-quality issues with file:line + suggested fix. Cross-reference CONSTRAINTS rule 2 (silent fallbacks).

### Sub-agent 3 — Frontend code-quality lint pass

> Audit frontend Vue / JS source for inline mock arrays, hardcoded fallback strings, long lines, missing prop types, console.log debug leftovers, dead components.
>
> Specific commands:
> - `find frontend/src -type f \( -name "*.vue" -o -name "*.js" -o -name "*.ts" \) -exec awk '$0 ~ /.{121}/ {print FILENAME":"NR" ("length($0)" chars)"}' {} \;`
> - `grep -rn "console.log\|console.warn" frontend/src/ | grep -v "node_modules"`
> - `grep -rn "// TODO\|// FIXME" frontend/src/`
> - `grep -rn "const.*\\[\\s*\\{" frontend/src/stages/ frontend/src/components/` — inline object arrays (potential mocks)
> - List every component import to find unused (orphan) components
>
> Output: severity-ordered list with file:line. Flag any inline mock that violates CONSTRAINTS §7.

### Sub-agent 4 — Web research on infra best practices

> Use `WebSearch` to research best practices for the kind of infrastructure this project has: a Vue 3 + Vite frontend talking to a FastAPI backend that orchestrates multiple LLM APIs (K2, Anthropic, OpenRouter), with pre-rendered cache files as the source of truth, designed for a demo-day reliability story.
>
> Search queries to run:
> - `"FastAPI" "best practices" 2025 production-ready structure`
> - `"Vue 3" "Three.js" dashboard architecture single-page realtime`
> - `LLM "fallback strategy" reliability "no mocks"`
> - `"hackathon demo" reliability pre-cache pattern`
> - `pydantic v2 schema validation REST API best practices`
>
> Synthesize: 3-5 specific patterns we should consider adopting, with citation. Cross-check against our `caltech/NEW-ARCHITECTURE.md` and flag any deviation.

## Your own deliverable (after sub-agents return)

Write `refactor/audits/A9-doc-audit-and-cleanup.md` with these sections:

1. **TL;DR** — 5-line executive summary.
2. **Documentation deprecation catalog** — table from sub-agent 1, with one new column: "R-shard action" (`KEEP_AT_PATH`, `MOVE_TO_archive/<path>`, `MERGE_INTO_<canonical_doc>`, `DELETE`).
3. **Proposed clean repo layout** — ASCII tree of what root looks like AFTER the cleanup. Compare to current.
4. **Backend code-quality lint findings** — table from sub-agent 2.
5. **Frontend code-quality lint findings** — table from sub-agent 3.
6. **Long-line violations** — files with any line > 120 chars, count + worst offender per file.
7. **Web-research best-practices brief** — sub-agent 4's synthesis, with 3-5 specific recommendations + citations.
8. **No-fallback compliance audit** — verify against CONSTRAINTS §2 + §7. Cross-check any patterns sub-agent 4 surfaced for fallback-discipline best practices.
9. **R-shard action list** — ordered list: each item is a discrete file move / merge / lint fix, with file paths, rationale, and risk level.
10. **Open questions for orchestrator** — anything you would not decide unilaterally.

## Acceptance

Report at `refactor/audits/A9-doc-audit-and-cleanup.md` with all 10 sections. The deprecation catalog must be exhaustive — every `.md` in the repo gets a classification. Long-line + lint findings cite real `awk`/`grep` outputs. Web-research section has at least 3 named-source citations. R-shard action list is concrete enough that a refactor-execution shard could run `git mv` / `rm -r` directly from it.

## Constraints

- DO NOT move, delete, or modify any file. Catalog only.
- DO NOT touch backend/ or frontend/ source code.
- DO NOT push or commit anything.
- The 8 other audit shards (A1-A8) are running in parallel — do not interfere with their worktrees or their reports in `refactor/audits/`.
- If you find a documentation cleanup that conflicts with another shard's recommendation (especially A7 structure-consolidation), flag it — do not unilaterally decide.
