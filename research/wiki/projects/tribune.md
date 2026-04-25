---
file-type: project
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/005-best-use-of-ai-as-hard-target.md
  - ../decisions/011-demo-over-execution.md
cites-sources:
  - https://devpost.com/software/tribune
  - https://github.com/arihantjain4/Tribune
  - ../scrapes/treehacks-2026-winners.md
cross-links:
  - ../patterns/grounded-citation.md
  - ../patterns/witnessed-dissent.md
  - ../patterns/two-stage-llm-compile.md
  - ../patterns/per-item-parallel-llm-evaluation.md
  - ../decisions/005-best-use-of-ai-as-hard-target.md
  - ../decisions/011-demo-over-execution.md
  - ./greenchain.md
  - ./jarvis.md
---

# Tribune

- **Hackathon / event:** TreeHacks 2026 (Stanford)
- **Year / date:** Feb 2026
- **Prize won:** **Anthropic Human Flourishing — 1st place**
- **Sponsor tracks involved:** Anthropic (Claude Sonnet 4.5 for the agent + diff generator), Elastic (Elasticsearch hybrid search + Agent Builder A2A), JINA (embeddings v3 + reranker v3), OpenAI (GPT-4o-mini classifier, Realtime voice), Twilio, Google (Gemini 2.0 Flash), Mapbox
- **Devpost / press / video / repo:** Devpost https://devpost.com/software/tribune · Repo https://github.com/arihantjain4/Tribune
- **Local clone:** `../sources/repos/tribune/`

## Pitch (one sentence)

"GitHub for democracy" — Tribune scrapes city-council agendas, has an OpenAI Realtime + Twilio agent phone-interview affected residents, and Claude generates a red-line policy diff where every insertion traces back to specific constituent quotes via a 12-table SQLite citation chain.

## Claimed-vs-verified

Devpost prose is *substantially accurate* — closer to GreenChain than to BRIDGE on the verification spectrum. One notable gap: there is **no audio-clip storage**; every "voice citation" is a *transcript* citation through `interviews → quotes`.

| Devpost claim | Reality |
|---|---|
| Scrapes Palo Alto council PDFs / municipal code | ✅ Three collectors (`primegov.py`, `city_website.py`, `municipal_code.py`) + `downloader.py` (async fetch, hash dedupe) |
| Gemini 2.0 Flash → structured policy JSON | ✅ `app/extractor.py` (9 categories) |
| GPT-4o-mini actionability/impact 1-5 | ✅ `app/classifier.py` |
| Hybrid: BM25 + JINA kNN + RRF (k=60) + JINA Reranker v3 | ✅ `app/elastic.py:194-237` — RRF constant, window math, both legs |
| 3 ES indices: policies, quotes, diffs | ✅ `app/agent.py:8` |
| Civic synonym analyzer (ADU = granny flat, BMR = affordable housing) | ✅ `app/elastic.py:20-57` |
| Elastic Agent Builder A2A, 7 ES\|QL tools | ✅ `app/agent_builder.py`; `ask_agent_builder` tool in Claude agent |
| Claude Sonnet 4.5 agent, 8 tools, SSE streaming | ✅ `app/agent.py:35-150`; streaming via `/agent/ask` in `main.py` |
| Twilio ↔ OpenAI Realtime bidirectional voice | ✅ `server.py:62-186` — μ-law, server VAD, `gpt-4o-mini-transcribe` |
| "Hidden directions" mid-call (human-in-loop) | ⚠️ **Not found.** WebSocket handler only forwards Twilio→OpenAI; no operator-injection channel in cloned code. Demo-only or in unlocated route inside `main.py` (1604 lines). |
| Diff: copy verbatim, insert ≤2 clauses (<15 words), trace each to a constituent | ✅ `app/diff_generator.py:12-39` — six numbered "CRITICAL RULES" *are* the system prompt |
| "Every change cites the resident interviews" | ✅ Schema-level. `diffs.citation_interview_ids` (JSON of `interviews.id` FKs) written in `main.py:438-464`; serializer `_row_to_diff` (`main.py:196-212`) walks `→ interviews → quotes` on every read |
| "Every diff cites a constituent **voice clip**" (our brief's framing) | ⚠️ **Partial.** No audio persisted — `interviews.transcript` is JSON of `{role, text, timestamp}` turns; no `audio_url`/`recording_path` column in `database.py`. Citation hyperlinks a *transcript line*, not a playable clip. "Voice" lives in provenance, not artifact. |
| ~200 real Palo Alto policies | ✅ `data/tribune.db` ships in repo; `seed_nyc.py` for second city |
| 12-table SQLite WAL | ✅ Exactly 12 tables in `database.py:8-183` |
| Next.js 16 / React 19 / Tailwind v4 / Mapbox / shadcn / Framer | ✅ `frontend/package.json` |

## Unique sauce

1. **Citation as database invariant.** A `diffs` row cannot be read without joining `interviews → quotes`; serializer `_row_to_diff` (`main.py:196`) hydrates them on every fetch. No "claim without source" code path — the schema makes uncited diffs structurally impossible. Cleanest grounded-citation implementation in the TreeHacks corpus.
2. **Diff prompt as constitution, not request.** Six numbered "CRITICAL RULES" force character-for-character preservation with only ≤2 short insertions. The model is constrained to be a *redline editor*, not a rewriter — output is mechanically diffable and visually trustworthy.
3. **Watch → Listen → Draft as one closed loop.** `app/pipeline.py` ingests PDFs nightly; `server.py` calls residents; `_generate_diff_internal` re-emits a revision automatically. No human in the middle — that *is* the demo.
4. **A2A delegation, not disagreement.** Claude agent (`agent.py`) offloads ES|QL queries to Elastic Agent Builder (`agent_builder.py`) over A2A. Closest cousin to *witnessed-dissent* in the corpus, but rendered as delegation rather than visible conflict.

## Implementation needles

### 1. The diff prompt as constitution (`backend/app/diff_generator.py:12-39`)

Function: `generate_policy_diff` (module-level prompt constant `DIFF_PROMPT`)

```python
DIFF_PROMPT = """You are a policy analyst for the City of Palo Alto. Make MINIMAL surgical edits to this ordinance based on constituent feedback.

ORIGINAL ORDINANCE (you MUST preserve this text exactly — copy it character-for-character, including all line breaks):
{original_clause}

CRITICAL RULES:
1. Copy the ENTIRE original text character-for-character, preserving ALL line breaks and formatting.
2. Insert only 1-2 short clauses (under 15 words each) at natural points — after a comma, period, or semicolon.
3. Do NOT remove, rearrange, or reword ANY existing text.
4. The revised text MUST be longer than the original.
5. Every insertion must be traceable to specific constituent concerns.
6. Use formal legislative language matching the original style.
"""
```

**Why it works:** The model isn't asked to draft — it's asked to *insert*. By forbidding deletion or reorder, the diff stays mechanically computable (any naive `difflib` produces the redline) and the burden of proof per insertion is small. Combine with rule 5 and you have a self-enforcing citation invariant: a clause that doesn't tie to a quote is structurally indefensible inside the prompt's own logic.

### 2. Citation chain stitched at read time (`backend/app/main.py:196-212`, function `_row_to_diff`)

```python
def _row_to_diff(conn, row) -> DiffOut:
    citation_ids = _json(row["citation_interview_ids"], [])
    citations: list[QuoteOut] = []
    for iid in citation_ids:
        citations.extend(_quotes_for_interview(conn, iid))
    return DiffOut(
        id=row["id"], policy_id=row["policy_id"],
        original_clause=row["original_clause"],
        revised_clause=row["revised_clause"],
        commit_message=row["commit_message"],
        reasoning=row["reasoning"],
        citation_interview_ids=citation_ids,
        citations=citations,           # ← the join is mandatory on every read
        status=row["status"], created_at=row["created_at"],
    )
```

Paired with the writer in `_generate_diff_internal` (`backend/app/main.py:446-456`) which captures *every* interview ID for the policy:

```python
interview_rows = conn.execute(
    "SELECT id FROM interviews WHERE policy_id = ?", (policy_id,)
).fetchall()
interview_ids = [r["id"] for r in interview_rows]
conn.execute(
    "INSERT INTO diffs (id, policy_id, original_clause, revised_clause, "
    "commit_message, reasoning, citation_interview_ids, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    (diff_id, policy_id, policy["original_clause"], result["revised_clause"],
     result["commit_message"], result["reasoning"], json.dumps(interview_ids), "proposed"),
)
```

**Why it works:** Citation isn't a UI overlay — it's a column. Every diff serialized to the API hydrates its source quotes. Lift this verbatim for `patterns/grounded-citation.md`.

**Caveat for our team:** the cited artifact is a transcript turn, not an audio file. If we want the demo emotional payoff of *playing the actual voice*, we need to add an `audio_url` column and persist Twilio's recording (Tribune doesn't).

### 3. Hybrid search RRF in ~40 lines (`backend/app/elastic.py:194-237`, function `hybrid_search`)

```python
def hybrid_search(index, query_text, query_vector, size=10, filters=None):
    es = get_elastic()
    RRF_K = 60
    window = size * 5
    bm25_result = es.search(index=index, query=text_query, size=window, ...)
    knn_result  = es.search(index=index, knn=knn_body,    size=window, ...)
    rrf_scores = {}
    for rank, hit in enumerate(bm25_result["hits"]["hits"]):
        rrf_scores[hit["_id"]] = rrf_scores.get(hit["_id"], 0) + 1.0 / (RRF_K + rank + 1)
    for rank, hit in enumerate(knn_result["hits"]["hits"]):
        rrf_scores[hit["_id"]] = rrf_scores.get(hit["_id"], 0) + 1.0 / (RRF_K + rank + 1)
    ranked = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)[:size]
    return [...]
```

**Why it works:** Reciprocal Rank Fusion is the cheapest possible "blend BM25 with semantic" — no learned weights, no calibration, just `1 / (60 + rank)` summed across both rankers. Domain synonyms (`ADU = granny flat`, `BMR = affordable housing`) are pushed down into the analyzer at index time, so the BM25 leg already understands civic-speak. This is the textbook hybrid search recipe — clip it for any project that wants Elasticsearch + vectors without a learned reranker on the hot path.

### 4. Voice loop is fully ephemeral (`backend/server.py:62-186`, `handle_media_stream`)

Twilio↔OpenAI Realtime bridge = two `asyncio.gather`'d coroutines. `receive_from_twilio` forwards μ-law audio frames into OpenAI's `input_audio_buffer.append`; `send_to_twilio` forwards OpenAI's `response.output_audio.delta` back as Twilio media frames. The transcript list is built from `conversation.item.input_audio_transcription.completed` events (user) and `response.content.done` text parts (agent), each with `timestamp = time.time() - call_start_time`. On hangup, `save_call_result` (`server.py:221-245`) pickles the transcript JSON into `call_results.transcript` and runs `analyze_call` once via `gpt-5-nano` for outcome/sentiment/concerns.

**Why it works:** No persistent audio store, no recording fees, no privacy review — just text lands in SQLite. Latency stays low because the only blocking work post-call is one nano-model JSON call.

**Critical for us:** "voice citation" is text-only by default. To get a playable clip per cited turn we need (a) Twilio `<Record>` URL on the interview row, (b) per-turn timestamps (Tribune already captures these), (c) `<audio>` element in the diff UI that scrubs to the cited turn. Tribune cites *transcript line*; we could cite *audio span*.

## Capability stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 + React 19, Tailwind v4, Framer Motion, Mapbox GL, shadcn/ui |
| Backend | FastAPI (Python) — two servers: REST on 8000, voice on 8001 |
| Database | SQLite (WAL), 12 tables, `data/tribune.db` ships in repo |
| Document ingest | PrimeGov API + custom HTML scrapers + async PDF download with content-hash dedupe |
| Extraction LLM | Gemini 2.0 Flash (structured-JSON prompts) |
| Classifier LLM | GPT-4o-mini (actionability + impact, 1-5) |
| Search | Elasticsearch 3-index (policies/quotes/diffs); BM25 + JINA v3 kNN, RRF k=60, JINA Reranker v3, `civic_synonyms` analyzer |
| Agent runtime | Anthropic Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`); 8 tools; SSE streaming via `/agent/ask` |
| A2A | Elastic Agent Builder converse API (7 ES\|QL tools) |
| Voice | Twilio Programmable Voice + OpenAI Realtime (`gpt-realtime`, μ-law, server VAD, `gpt-4o-mini-transcribe`) |
| Diff generation | Claude Sonnet 4.5 with copy-verbatim + ≤2 small inserts constraint |
| Geo | Mapbox GL zone overlays |
| Config | Per-city YAML (`app/cities/palo_alto.yaml`) — claimed scaling vector |
| Deploy | Vercel (frontend); Fly.io + Docker (backend, see `fly.toml` + `Dockerfile`) |

## Why it won (Anthropic Human Flourishing 1st)

Anthropic's track rewards AI that compounds human agency rather than substituting for it. Tribune's frame — *"the 98% who don't go to council meetings still get heard"* — is exactly that thesis as a working artifact. Three properties stack: (1) **civic empowerment** as headline emotion — a renter's concern surfaces as a redline; AI does scut work, the human voice is load-bearing input; (2) **audit-grade visible provenance** — the diff page reads like a GitHub PR with sourced quotes; Anthropic judges this cycle have been visibly allergic to "trust me, the LLM said so" demos; (3) **end-to-end loop on real data** — actual Palo Alto ordinances, not mocks.

## Reusable for us

- **Lift verbatim:** `citation_interview_ids → interviews → quotes` + always-hydrate-on-read serializer. Platonic shape of the grounded-citation invariant; the Tribune team did the work, don't pretend we discovered it.
- **Lift verbatim:** constraint-as-prompt discipline in `diff_generator.py`. Six numbered rules, no negotiation. Use anywhere LLM output must be mechanically diffable against an input.
- **Steal-and-extend:** Tribune cites *transcript text*. We can cite *audio spans* by adding (a) Twilio `<Record>` URL on the interview, (b) per-turn timestamps (Tribune already captures these in `transcript[*].timestamp`), (c) `<audio>` element in diff UI that scrubs to the cited turn. ~2-hour upgrade with disproportionate demo payoff.
- **Sponsor stack:** Anthropic + Elastic + JINA + OpenAI + Twilio is a heavy bingo card if our vertical needs voice + grounded citations.

## Lookalike-risk score

**8/10 — high.** Tribune just won 1st place at TreeHacks with this pattern (civic + voice agent + grounded-citation diff). The grounded-citation pattern itself is widely useful, but a Tribune-shaped demo (city council + phone interviews + redline diff) at HackTech would read as derivative. Greenfield-divergent angles: (a) different *modality of feedback* (in-person interviews, video, written comment letters); (b) different *input artifact* (legal contracts, lease agreements, school board minutes, building permits, HOA bylaws); (c) different *output artifact* (not a redline — e.g., a hearing brief, a community impact statement, a delegated proxy vote). The needles (citation invariant, prompt-as-constitution, hybrid RRF, ephemeral-voice-with-text-persistence) transfer cleanly even when the surface differs.

## What this forecloses

- **The civic-tech vertical with phone-interview-to-policy-diff workflow.** Doing this at HackTech six weeks after Tribune won at TreeHacks invites direct comparison and, almost certainly, an unfavorable one.
- **"GitHub for X" as a positioning line.** Tribune's "GitHub for democracy" is the cleanest version; using "GitHub for healthcare/education/zoning" right after will sound like a sequel.
- **OpenAI Realtime + Twilio as our novelty hook.** The pattern is now table stakes (Tribune, Jarvis-style voice probes, multiple TreeHacks 2026 finalists). It's a *capability*, not a *differentiator*.

Open: ephemeral-voice-with-audited-transcripts (Tribune did) vs. **persistent-voice-with-deep-link citations** (Tribune didn't). The latter is unowned and is exactly the upgrade `grounded-citation.md` should specify.

## Cross-links

- Patterns: [`grounded-citation.md`](../patterns/grounded-citation.md), [`witnessed-dissent.md`](../patterns/witnessed-dissent.md), [`per-item-parallel-llm-evaluation.md`](../patterns/per-item-parallel-llm-evaluation.md), [`two-stage-llm-compile.md`](../patterns/two-stage-llm-compile.md)
- Decisions: [`005-best-use-of-ai-as-hard-target.md`](../decisions/005-best-use-of-ai-as-hard-target.md), [`011-demo-over-execution.md`](../decisions/011-demo-over-execution.md)
- Sibling projects: [`greenchain.md`](./greenchain.md) (sponsor stacking + parallel LLM eval), [`jarvis.md`](./jarvis.md) (event-cited supervisor reports — same emotional grammar), [`mira.md`](./mira.md)
- Source: [`../scrapes/treehacks-2026-winners.md`](../scrapes/treehacks-2026-winners.md) row 13
