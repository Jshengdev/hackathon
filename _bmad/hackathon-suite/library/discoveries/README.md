# Discoveries Library

This directory stores discoveries made during doc-explorer sessions.

## What are Discoveries?

Discoveries are tested combinations, patterns, and insights found while exploring transformed documentation. They capture:

- **Combination details:** What features work together
- **Tested code:** Working implementations
- **Use cases:** Specific applications
- **Track positioning:** How to pitch for competitions
- **Feasibility:** Can it be built in 24 hours?

## Discovery Format

Each discovery is a markdown file with frontmatter:

```markdown
---
title: "Vision + Tool Use Streaming"
tools: [anthropic-api]
capabilities: [vision, tool-use, streaming]
tracks: [social-impact, education]
tested: true
feasibility: high
hackathon_ready: true
tags: [combo, tested, social-impact]
---

# Discovery Title

## What We Found
[Description]

## Tested Code
```code
[Working implementation]
✅ Tested [date]
```

## Use Cases
[Specific applications]

## Track Positioning
[How to pitch]

## Related Discoveries
- [Link to related]
```

## Created By

Discoveries are automatically created by the doc-explorer agent when users save findings during exploration sessions.

## Usage

```bash
# Explore and save discoveries
/hackathon-suite:doc-explorer anthropic-api

# Search discoveries
/hackathon-suite:librarian
> "Find discoveries with tag #vision"

# Read specific discovery
cat discoveries/vision-tool-streaming-combo.md
```

## Organization

Discoveries are flat files in this directory:
- discovery-name-{tool}-{feature}.md
- Searchable via librarian agent
- Tagged for easy filtering
- Cross-referenced with technical-patterns

---

_Discoveries Library — Part of Hackathon Suite Documentation Intelligence System_
