---
name: 'step-02-shard'
description: 'Break large documentation into processable chunks (if needed)'

nextStepFile: './step-03-parallel-transform.md'
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/doc-transformer'
shard_doc_task: '{project-root}/_bmad/core/tasks/shard-doc.xml'
---

# Step 2: Shard (If Needed)

## STEP GOAL

If documentation is large (100+ pages), break it into manageable shards using the existing shard-doc task. If small, skip to parallel transform.

## MANDATORY SEQUENCE

### 1. Check Processing Strategy

Read from status.yaml:
```yaml
processing_strategy: {lens-parallel or hybrid-shard-lens}
```

**If lens-parallel:**
- Skip sharding entirely
- Update status: `status: ready_for_transform`
- Load `{nextStepFile}` immediately

**If hybrid-shard-lens:**
- Continue to step 2.2

### 2. Execute Sharding

"**📄 Sharding large documentation...**"

"This doc is {pages} pages. I'll break it into smaller chunks for parallel processing."

Use the existing shard-doc task:
- Load `{shard_doc_task}`
- Input: `_sessions/{session_id}/raw-doc.md`
- Strategy: by-section-h2 (split by major headings)
- Output: `_sessions/{session_id}/shards/`

Expected output:
```
_sessions/{session_id}/shards/
├── shard-01.md
├── shard-02.md
├── shard-03.md
└── ...
```

### 3. Count Shards

Count files in shards directory:
```bash
ls _sessions/{session_id}/shards/*.md | wc -l
```

### 4. Update status.yaml

```yaml
status: sharding_complete

shards:
  total: {count}
  completed: 0
  strategy: by-section-h2
  location: _sessions/{session_id}/shards/
```

### 5. Report Sharding Results

"**✓ Sharding complete:**"
- Created {count} shards
- Average size: ~{pages/count} pages per shard
- Next: Spawning {count × 6} parallel agents ({count} shards × 6 lenses)

### 6. Create Execution Matrix

Generate the processing matrix:

For each shard (1 to N):
  For each lens (capabilities, creative, quick-start, patterns, tracks, constraints):
    - Create task: process shard-{n} for {lens}

Total tasks: N × 6

**Example for 4 shards:**
```
Tasks to spawn:
1. shard-01 × capabilities
2. shard-01 × creative
3. shard-01 × quick-start
4. shard-01 × patterns
5. shard-01 × tracks
6. shard-01 × constraints
7. shard-02 × capabilities
... (total 24 tasks)
```

### 7. Determine Execution Approach

Based on shard count:

**< 10 shards (< 60 tasks):**
- Approach: Full parallel auto-spawn
- All tasks run simultaneously

**10+ shards (60+ tasks):**
- Approach: Batched parallel
- Process in batches of 18 concurrent agents
- Sequential batches until complete

Store approach in status.yaml:
```yaml
execution_approach: {full-parallel or batched-parallel}
batch_size: {18 if batched}
```

### 8. Load Next Step

"**Ready to spawn transformation agents...**"

Update status: `status: ready_for_transform`

Load `{nextStepFile}` to begin parallel transformation.

---

## SUCCESS METRICS

✅ Determined if sharding needed
✅ Executed shard-doc task successfully (if needed)
✅ All shards created in proper directory
✅ Shard count accurate
✅ Execution matrix generated
✅ status.yaml updated with shard info

## FAILURE CONDITIONS

❌ shard-doc task failed
❌ Shards not created properly
❌ Cannot count shards
❌ Invalid shard strategy

---

_Step 2: Shard — Doc Transformer Workflow_
