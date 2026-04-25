---
name: 'step-01-ingest-analyze'
description: 'Load documentation and analyze size to determine processing strategy'

nextStepFile: './step-02-shard.md'
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/doc-transformer'
output_folder: '{output_folder}'
---

# Step 1: Ingest & Analyze

## STEP GOAL

Load the developer documentation and analyze its size to determine the optimal processing strategy (lens-parallel vs hybrid shard-lens).

## MANDATORY SEQUENCE

### 1. Welcome & Input

"**Welcome to Doc Transformer!**"

"I'll transform dense developer docs into 6 specialized lenses optimized for rapid hackathon learning:"
- 📊 Capabilities (what it can do)
- 🚀 Creative Applications (moonshot ideas)
- ⚡ Quick Start (fastest path to working code)
- 🔧 Code Patterns (how people use it)
- 🎯 Hackathon Tracks (positioning strategies)
- ⛔ Constraints (what NOT to try)

"**What documentation would you like to transform?**"

**Input options:**
- URL (e.g., https://docs.anthropic.com/en/api)
- Local file path (e.g., ./docs/api-reference.md)
- PDF file path

**Mode:**
- quick-hack (3 lenses: capabilities, quick-start, constraints) ~5 min
- deep (all 6 lenses) ~10-20 min

### 2. Load Documentation

Based on input type:

**If URL:**
Use WebFetch to retrieve documentation content

**If file path:**
Use Read tool to load file

**If PDF:**
Use Read tool (supports PDF extraction)

Store raw content for analysis.

### 3. Analyze Documentation Size

Calculate approximate page count:
- Word count / 300 words per page = estimated pages
- For PDF: actual page count

Determine processing strategy:
- **< 100 pages:** Lens-Parallel Mode (6 agents, no sharding)
- **100+ pages:** Hybrid Shard-Lens Mode (shard first, then parallel)

### 4. Create Session

Generate session ID: `{tool-name}-{YYYYMMDD-HHMM}`

Create session directory structure:
```
{installed_path}/_sessions/{session_id}/
├── status.yaml
├── shards/ (if needed)
├── progress/
└── logs/
```

### 5. Initialize status.yaml

Write initial status:

```yaml
session_id: {session_id}
tool_name: {extracted from user input}
doc_source: {url or path}
doc_size_pages: {calculated}
mode: {quick-hack or deep}
processing_strategy: {lens-parallel or hybrid-shard-lens}
started: {timestamp}
status: analyzing

lenses:
  capabilities: {status: pending}
  creative-applications: {status: pending}
  quick-start: {status: pending}
  code-patterns: {status: pending}
  hackathon-tracks: {status: pending}
  constraints: {status: pending}

code_testing:
  enabled: true
  snippets_found: 0
  snippets_tested: 0
```

### 6. Report Analysis

"**📊 Documentation Analysis**"

- Tool: {tool_name}
- Source: {source}
- Size: ~{pages} pages ({words} words)
- Processing strategy: {lens-parallel or hybrid-shard-lens}
- Mode: {quick-hack or deep}
- Estimated time: {estimate}

"**I'll generate {3 or 6} lenses using {strategy}.**"

### 7. Store Raw Documentation

If sharding will be needed (hybrid mode):
- Save raw content to `_sessions/{session_id}/raw-doc.md`

If lens-parallel mode:
- Keep in memory for direct processing

### 8. Load Next Step

Update status.yaml:
```yaml
status: ready_for_sharding
```

Load `{nextStepFile}` to continue.

---

## SUCCESS METRICS

✅ Documentation loaded successfully
✅ Size analyzed accurately
✅ Processing strategy determined
✅ Session created with proper structure
✅ status.yaml initialized
✅ User informed of approach and timeline

## FAILURE CONDITIONS

❌ Cannot access documentation source
❌ Documentation format not supported
❌ Failed to create session directory
❌ Invalid tool name extraction

---

_Step 1: Ingest & Analyze — Doc Transformer Workflow_
