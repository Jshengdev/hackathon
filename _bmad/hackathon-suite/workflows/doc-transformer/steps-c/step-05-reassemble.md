---
name: 'step-05-reassemble'
description: 'Merge sharded outputs and add cross-references between lenses'

nextStepFile: './step-06-index-store.md'
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/doc-transformer'
---

# Step 5: Reassemble & Cross-Reference

## STEP GOAL

If documentation was sharded, merge the shard outputs for each lens. Then add cross-references between lenses to create a cohesive knowledge base.

## MANDATORY SEQUENCE

### 1. Check If Reassembly Needed

Read from status.yaml:
```yaml
processing_strategy: {lens-parallel or hybrid-shard-lens}
```

**If lens-parallel:**
- Skip merging (no shards to reassemble)
- Go directly to step 5.5 (cross-referencing)

**If hybrid-shard-lens:**
- Continue to step 5.2 (merge shards)

### 2. Merge Shard Outputs (Hybrid Mode Only)

"**🔗 Merging shard outputs for each lens...**"

For each lens file that has multiple shard sections:

**Example state:**
```
library/technical-patterns/anthropic-api/capabilities-anthropic-api.md

Current content (from parallel shard agents):
## Section from Shard 1
- Core function A
- Core function B

## Section from Shard 2
- Core function C
- Advanced feature A

## Section from Shard 3
- Advanced feature B
- Limits and constraints

## Section from Shard 4
- Pricing information
```

**Merge process:**
1. Read the file with all shard sections
2. Extract information by category (not by shard)
3. Deduplicate entries
4. Reorganize into proper structure
5. Remove shard headings

**After merge:**
```
# Capabilities: Anthropic Claude API

## Core Functions
- Core function A - [description]
- Core function B - [description]
- Core function C - [description]

## Advanced Features
- Advanced feature A - [description]
- Advanced feature B - [description]

## Limits & Constraints
- [constraints from shard 3]

## Pricing
- [pricing info from shard 4]
```

### 3. Deduplicate Content

While merging, identify and remove duplicates:

**Example:**
If multiple shards mentioned "200K context window":
- Keep the most detailed version
- Remove redundant mentions
- Consolidate information

**Deduplication strategy:**
- Compare section headings (exact match)
- Compare bullet points (similarity > 80%)
- Merge when near-duplicates found
- Preserve unique details

### 4. Verify All Lenses Merged

For each lens:
- ✓ capabilities-{tool}.md - merged and cleaned
- ✓ creative-applications-{tool}.md - merged and cleaned
- ✓ quick-start-{tool}.md - merged and cleaned
- ✓ code-patterns-{tool}.md - merged and cleaned
- ✓ hackathon-tracks-{tool}.md - merged and cleaned
- ✓ constraints-{tool}.md - merged and cleaned

Update status.yaml:
```yaml
status: reassembly_complete
lenses:
  capabilities: {status: merged, word_count: {final}}
  creative-applications: {status: merged, ideas_count: {final}}
  # ... etc
```

### 5. Add Cross-References Between Lenses

"**🔗 Adding cross-references between lenses...**"

Create bidirectional links to help users navigate:

**In capabilities lens:**
```markdown
## Core Functions

- **Tool Use**: Execute function calls during conversations
  - See: [Code Patterns → Tool Use Examples](./code-patterns-anthropic-api.md#tool-use-patterns)
  - See: [Creative Applications → Agent Ideas](./creative-applications-anthropic-api.md#tool-use-combinations)

- **Vision**: Analyze images in conversations
  - See: [Quick Start → Vision Hello World](./quick-start-anthropic-api.md#vision-example)
  - See: [Hackathon Tracks → Accessibility Apps](./hackathon-tracks-anthropic-api.md#social-impact)
```

**In creative-applications lens:**
```markdown
## Moonshot Ideas

### 1. Real-time Visual Assistant
- Concept: Uses vision + streaming for instant image analysis
- **Required capabilities:** [Vision](./capabilities-anthropic-api.md#vision), [Streaming](./capabilities-anthropic-api.md#streaming)
- **Code pattern:** [Vision + Streaming](./code-patterns-anthropic-api.md#vision-streaming-combo)
- **Track fit:** [Social Impact](./hackathon-tracks-anthropic-api.md#social-impact)
- **Constraints to note:** [No fine-tuning](./constraints-anthropic-api.md#fine-tuning)
```

**Cross-reference categories:**
- Capabilities → Quick Start (implementation)
- Capabilities → Code Patterns (how to use)
- Capabilities → Creative Applications (what to build)
- Creative Applications → Hackathon Tracks (positioning)
- Creative Applications → Constraints (feasibility check)
- Quick Start → Code Patterns (next steps)
- Code Patterns → Constraints (gotchas)

### 6. Create "See Also" Sections

At the end of each lens, add comprehensive "See Also":

**Example for capabilities lens:**
```markdown
---

## See Also

**For implementation:**
- [Quick Start Guide](./quick-start-anthropic-api.md) - Get started in 15 minutes
- [Code Patterns](./code-patterns-anthropic-api.md) - Common usage patterns

**For ideation:**
- [Creative Applications](./creative-applications-anthropic-api.md) - Moonshot project ideas
- [Hackathon Tracks](./hackathon-tracks-anthropic-api.md) - Track positioning strategies

**For validation:**
- [Constraints](./constraints-anthropic-api.md) - What NOT to try
```

### 7. Add Internal Navigation Links

Within each lens, add jump links for long sections:

**Example:**
```markdown
# Capabilities: Anthropic Claude API

**Quick Navigation:**
- [Core Functions](#core-functions)
- [Advanced Features](#advanced-features)
- [Limits & Constraints](#limits--constraints)
- [Pricing](#pricing)
- [Hackathon Tips](#hackathon-tips)

## Core Functions
...
```

### 8. Verify Cross-References

Check that all links work:
- Test relative paths
- Verify section IDs exist
- No broken links

### 9. Report Reassembly Complete

"**✅ Reassembly and cross-referencing complete!**"

**Merged content:**
- Capabilities: {word_count} words
- Creative Applications: {ideas_count} ideas
- Quick Start: {examples_count} examples
- Code Patterns: {patterns_count} patterns
- Hackathon Tracks: {tracks_count} tracks
- Constraints: {limitations_count} limitations

**Cross-references added:**
- {count} inter-lens links
- {count} see-also sections
- Navigation aids in all lenses

### 10. Load Next Step

"**Next: Indexing and storing in library...**"

Update status: `status: ready_for_indexing`

Load `{nextStepFile}` for final indexing and storage.

---

## SUCCESS METRICS

✅ All shard outputs merged (if applicable)
✅ Duplicates removed
✅ Content reorganized logically
✅ Cross-references added between lenses
✅ "See Also" sections created
✅ Internal navigation added
✅ All links verified working

## FAILURE CONDITIONS

❌ Merge produced malformed content
❌ Duplicates not removed
❌ Broken cross-reference links
❌ Missing see-also sections

---

_Step 5: Reassemble & Cross-Reference — Doc Transformer Workflow_
