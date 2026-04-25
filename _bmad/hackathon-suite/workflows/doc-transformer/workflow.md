---
name: doc-transformer
description: "Transform developer documentation into multi-lens knowledge base with parallel processing"
web_bundle: true
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/doc-transformer'
---

# Doc Transformer

**Goal:** Transform dense developer documentation into 6 specialized lenses optimized for rapid hackathon learning.

**Your Role:** You are the Documentation Architect. Teams face 50+ page API docs with 2 hours to read. You transform these into digestible, multi-perspective views that reveal capabilities, moonshot ideas, quick starts, patterns, track fits, and constraints—all in under 10 minutes.

**Philosophy:** Time is the ultimate constraint. Transform documentation from "learning resource" to "discovery engine."

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Adaptive Parallelism** — Small docs: 6 parallel lens agents. Large docs: Shard × Lens matrix
- **Progress Transparency** — Real-time status tracking via status.yaml
- **Code Validation** — Test snippets automatically, annotate results
- **Multi-Lens Intelligence** — Six complementary views of same content

### Embedded Patterns

- Size-based processing strategy (lens-parallel vs hybrid shard-lens)
- Task tool for spawning parallel subagents
- Session-based progress tracking
- Code testing with sandbox execution
- Library integration via existing tools

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order
3. **SPAWN INTELLIGENTLY**: Use Task tool for parallel agent execution
4. **TRACK PROGRESS**: Update status.yaml continuously
5. **LOAD NEXT**: When directed, load and execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** skip size analysis—processing strategy depends on it
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** process sequentially when parallel is possible
- 💾 **ALWAYS** update status.yaml for progress tracking
- ⏸️ **ALWAYS** use existing shard-doc and index-docs tasks
- ✅ **ALWAYS** test code snippets when possible

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load config from module.yaml and resolve:
- `output_folder`, `project_name`

### 2. Session Creation

Create unique session:
- session_id: `{tool-name}-{timestamp}`
- Session folder: `{installed_path}/_sessions/{session_id}/`

### 3. First Step Execution

Load, read the full file, and execute `./steps-c/step-01-ingest-analyze.md` to begin transformation.

---

## Workflow Summary

| Step | Name | Purpose |
|------|------|---------|
| 1 | Ingest & Analyze | Load docs, analyze size, determine strategy |
| 2 | Shard | Break large docs into processable chunks (if needed) |
| 3 | Parallel Transform | Spawn subagents to generate all 6 lenses |
| 4 | Code Testing | Extract and test code snippets in parallel |
| 5 | Reassemble | Merge sharded outputs, cross-reference |
| 6 | Index & Store | Generate indices, store in library |

---

## The 6 Transformation Lenses

### 1. Capabilities Lens
**Question:** What can this tool actually do?
**Output:** Core functions, advanced features, limits, pricing, hackathon specifics

### 2. Creative Applications Lens
**Question:** What FREAKY/moonshot things could we build?
**Output:** 5-7 moonshot ideas, cross-pollination opportunities, track mapping

### 3. Quick Start Lens
**Question:** Fastest path from zero to working prototype?
**Output:** Get API key, install, hello world, gotchas, next steps

### 4. Code Patterns Lens
**Question:** How do people typically use this?
**Output:** Basic, intermediate, advanced patterns with working code

### 5. Hackathon Tracks Lens
**Question:** Which tracks does this fit? How to position?
**Output:** Strong fits, positioning strategies, track-stacking opportunities

### 6. Constraints Lens
**Question:** What CAN'T this do? (Save time avoiding dead ends)
**Output:** Limitations, misconceptions, workarounds, dead ends to avoid

---

## Processing Strategies

### Lens-Parallel Mode (< 100 pages)

```
Main Workflow
↓
Spawn 6 parallel subagents (Task tool)
├─ capabilities-agent
├─ creative-agent
├─ quickstart-agent
├─ patterns-agent
├─ tracks-agent
└─ constraints-agent
↓
Each agent generates its lens
↓
Main workflow: cross-reference, index, store
```

**Time:** ~5-10 minutes

### Hybrid Shard-Lens Mode (100+ pages)

```
Main Workflow
↓
Shard documentation (existing shard-doc task)
↓
Spawn N × 6 subagents (N shards × 6 lenses)
↓
Each subagent processes its shard+lens combo
↓
Reassemble by lens (merge shard outputs)
↓
Cross-reference, index, store
```

**Time:** ~10-20 minutes

---

## Progress Tracking Structure

```
_sessions/{session_id}/
├── status.yaml                    # Real-time progress
├── shards/                        # If sharded
│   ├── shard-01.md
│   └── ...
├── progress/                      # Per-lens progress
│   ├── capabilities-progress.md
│   ├── creative-progress.md
│   └── ...
└── logs/
    └── execution.log
```

### status.yaml Schema

```yaml
session_id: {tool-name}-{timestamp}
tool_name: {tool}
doc_source: {url/path}
doc_size_pages: {number}
mode: {quick-hack/deep}
processing_strategy: {lens-parallel/hybrid-shard-lens}
started: {timestamp}
status: {processing/complete/failed}

shards:
  total: {number}
  completed: {number}
  strategy: {by-section-h2}

lenses:
  capabilities:
    status: {pending/in_progress/completed}
    shards_processed: [{list}]
    output: {path}
    word_count: {number}
  # ... other lenses

code_testing:
  enabled: {true/false}
  snippets_found: {number}
  snippets_tested: {number}
  snippets_passed: {number}
  pass_rate: {percentage}
```

---

## Output Structure

```
library/technical-patterns/{tool-name}/
├── _metadata.json
├── _index.md
├── capabilities-{tool}.md
├── creative-applications-{tool}.md
├── quick-start-{tool}.md
├── code-patterns-{tool}.md
├── hackathon-tracks-{tool}.md
├── constraints-{tool}.md
└── _original/
    └── shards/ (if applicable)
```

---

## Integration Points

### With Existing Tools
- **shard-doc task** — Used in Step 2 for large documents
- **index-docs task** — Used in Step 6 for generating indices
- **librarian agent** — Notified when transformation complete

### With Library
- Stores in `library/technical-patterns/{tool-name}/`
- Creates manifest entry in `library/technical-patterns/_manifest.yaml`
- Searchable via librarian agent

---

## Success Criteria

✅ Transforms 50-page docs in < 10 minutes
✅ Handles 500+ page docs via sharding in < 20 minutes
✅ Generates all 6 lenses with high quality
✅ Tests code snippets automatically (>80% pass rate target)
✅ Output more useful than original docs for rapid hacking
✅ Parallel processing achieves 3-5x speedup vs sequential

---

_Doc Transformer — Part of the Hackathon Suite module_
