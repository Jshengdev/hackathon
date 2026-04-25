---
name: 'step-03-parallel-transform'
description: 'Spawn parallel subagents to generate all transformation lenses'

nextStepFile: './step-04-code-testing.md'
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/doc-transformer'
output_folder: '{output_folder}'
---

# Step 3: Parallel Transform

## STEP GOAL

Spawn parallel subagents using the Task tool to generate all 6 transformation lenses simultaneously. Each subagent reads documentation (full or shard) and generates its specific lens output.

## MANDATORY SEQUENCE

### 1. Determine Execution Mode

Read from status.yaml:
```yaml
processing_strategy: {lens-parallel or hybrid-shard-lens}
execution_approach: {full-parallel or batched-parallel}
```

### 2. Prepare Lens Prompts

Define the 6 lens transformation prompts (these will be given to subagents):

**Capabilities Lens Prompt:**
```
Analyze this API documentation and extract:

1. Core Functions/Endpoints - List all primary capabilities with 1-line descriptions
2. Advanced Features - Special features and what they enable
3. Explicit Limits - Rate limits, data limits, feature gaps
4. Pricing/Costs - Structure relevant to hackathons (free tier, credits, etc.)
5. Hackathon-Specific - Fastest options, free tier details

Format as structured markdown with clear sections.
Be concise. No marketing language. Facts only.
Include code examples where relevant.

Output to: library/technical-patterns/{tool-name}/capabilities-{tool}.md
```

**Creative Applications Lens Prompt:**
```
Given this API's capabilities, generate 5-7 moonshot hackathon project ideas.

For each idea:
- Name (catchy, memorable)
- Concept (2-3 sentences)
- Why it's "HOLY SHIT" (what crosses The Gap - not just "cool")
- Feasibility (High/Medium/Low for 24-hour hackathon)
- Track fit (which common tracks this could win)

Then suggest 3+ cross-pollination opportunities (combine with other APIs/tools).
Then map capabilities to common hackathon tracks.

Think wild. Think impossible-made-possible. Think moonshot.
Avoid generic/obvious applications.

Output to: library/technical-patterns/{tool-name}/creative-applications-{tool}.md
```

**Quick Start Lens Prompt:**
```
Create the fastest possible path from zero to working code.

Include:
1. Get API key - Exact steps, where to go
2. Install - Single command to get started
3. Hello World - Minimal working example (actually runnable)
4. The One Integration Pattern - Most common way to use this
5. Common Gotchas - Top 3-5 mistakes and how to avoid
6. Next Steps - What to build after hello world

Optimize for speed. Assume user knows how to code but not this API.
Every code example must be complete and runnable.

Output to: library/technical-patterns/{tool-name}/quick-start-{tool}.md
```

**Code Patterns Lens Prompt:**
```
Extract and document common code patterns from this documentation.

For each pattern:
1. Name - Clear, descriptive pattern name
2. Use case - When to use this pattern
3. Implementation - Complete, runnable code
4. Variations - Alternative approaches
5. Gotchas - What to watch out for

Include:
- Basic patterns (for beginners)
- Intermediate patterns (common integrations)
- Advanced patterns (power user techniques)
- Architecture approaches (how to structure apps using this)

All code must be complete and runnable.

Output to: library/technical-patterns/{tool-name}/code-patterns-{tool}.md
```

**Hackathon Tracks Lens Prompt:**
```
Analyze this API for hackathon track positioning.

For each common track:
- Strong fit - Natural applications for this track
- Positioning strategy - How to pitch and win
- Past winners - Similar successful projects (if known)
- Unique angles - Non-obvious ways to use this for the track

Common tracks: Social Impact, AI/ML, Sustainability, Hardware,
FinTech, HealthTech, EdTech, Entertainment, Developer Tools

Also identify:
- Track-stacking opportunities - Ways to hit multiple tracks
- Weak fits - Tracks where this is a stretch (save time)

Output to: library/technical-patterns/{tool-name}/hackathon-tracks-{tool}.md
```

**Constraints Lens Prompt:**
```
Document what this API CANNOT do - be brutally honest.

Include:
1. Explicit limitations - From docs, what it doesn't support
2. Common misconceptions - What people think it can do but can't
3. Workarounds - Alternatives or hacks for unsupported features
4. Dead ends for hackathons - Ideas that seem good but won't work in 24hrs
5. Comparison gaps - What competitors have that this doesn't

Help hackers avoid wasting hours on impossible paths.
Be specific, not vague.

Output to: library/technical-patterns/{tool-name}/constraints-{tool}.md
```

### 3. Spawn Lens Agents (Lens-Parallel Mode)

**If processing_strategy == lens-parallel:**

"**🚀 Spawning 6 parallel lens agents...**"

Use Task tool to spawn 6 subagents in PARALLEL (single message, multiple tool calls):

```
For each lens in [capabilities, creative-applications, quick-start, code-patterns, hackathon-tracks, constraints]:

  Task({
    description: "Generate {lens} lens for {tool-name}",
    subagent_type: "general-purpose",
    model: "sonnet",
    prompt: "
      You are generating the {lens} lens for {tool-name} API documentation.

      {lens_specific_prompt}

      Documentation:
      {full_documentation_content}

      When complete:
      1. Write output to specified path
      2. Update _sessions/{session_id}/progress/{lens}-progress.md with status
      3. Report completion
    "
  })
```

All 6 agents spawn simultaneously.

### 4. Spawn Shard-Lens Agents (Hybrid Mode)

**If processing_strategy == hybrid-shard-lens:**

"**🚀 Spawning {N × 6} parallel shard-lens agents...**"

**If execution_approach == full-parallel:**

Spawn ALL shard × lens combinations simultaneously:

```
For each shard (1 to N):
  For each lens in [capabilities, creative, quick-start, patterns, tracks, constraints]:

    Task({
      description: "Process shard-{n} for {lens} lens",
      subagent_type: "general-purpose",
      model: "haiku", // faster for parallel processing
      prompt: "
        You are processing shard {n} for the {lens} lens of {tool-name}.

        {lens_specific_prompt}

        Shard content:
        {shard_content}

        IMPORTANT: You are processing ONE SHARD of a larger document.
        - Extract information relevant to your lens from THIS SHARD only
        - APPEND your output to: library/technical-patterns/{tool-name}/{lens}-{tool}.md
        - Use '## Section from Shard {n}' as heading
        - Update progress: _sessions/{session_id}/progress/{lens}-progress.md
        - Mark shard {n} as processed for {lens} in status.yaml
      "
    })
```

**If execution_approach == batched-parallel:**

Process in batches of 18:

```
Batch 1: Spawn first 18 agents
Wait for completion
Batch 2: Spawn next 18 agents
Wait for completion
... continue until all processed
```

### 5. Monitor Progress

While agents are running, monitor status.yaml:

Update terminal/output every 10 seconds:
```
🔄 Transformation in progress...

Capabilities:     [##########----------] 50% (2/4 shards)
Creative Apps:    [######--------------] 30% (1/4 shards)
Quick Start:      [####################] 100% (4/4 shards)
Code Patterns:    [#######-------------] 35% (1/4 shards)
Hackathon Tracks: [###############-----] 75% (3/4 shards)
Constraints:      [########------------] 40% (2/4 shards)

Estimated completion: 3 minutes
```

### 6. Wait for All Agents

Monitor until all agents report completion.

Each agent updates status.yaml when done:
```yaml
lenses:
  capabilities:
    status: completed
    shards_processed: [1, 2, 3, 4] # or just [full] if lens-parallel
    output: library/technical-patterns/{tool}/capabilities-{tool}.md
    word_count: {count}
    completed: {timestamp}
```

### 7. Verify All Lenses Complete

Check status.yaml:
```yaml
lenses:
  capabilities: {status: completed}
  creative-applications: {status: completed}
  quick-start: {status: completed}
  code-patterns: {status: completed}
  hackathon-tracks: {status: completed}
  constraints: {status: completed}
```

### 8. Report Completion

"**✅ All lenses generated!**"

- ✓ Capabilities: {word_count} words
- ✓ Creative Applications: {ideas_count} ideas generated
- ✓ Quick Start: {examples_count} code examples
- ✓ Code Patterns: {patterns_count} patterns documented
- ✓ Hackathon Tracks: {tracks_count} tracks analyzed
- ✓ Constraints: {limitations_count} constraints documented

"**Next: Testing code snippets...**"

### 9. Load Next Step

Update status: `status: transform_complete`

Load `{nextStepFile}` for code testing.

---

## SUCCESS METRICS

✅ All 6 lens agents spawned successfully
✅ Agents running in parallel (not sequential)
✅ Progress tracking working in real-time
✅ All lenses completed without errors
✅ Output files created at correct paths
✅ status.yaml updated accurately
✅ Parallel speedup achieved (3-5x vs sequential)

## FAILURE CONDITIONS

❌ Agent failed to spawn
❌ Agent crashed during processing
❌ Output file not created
❌ status.yaml not updated
❌ Running sequentially instead of parallel

---

_Step 3: Parallel Transform — Doc Transformer Workflow_
