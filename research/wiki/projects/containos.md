---
file-type: project
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/011-demo-over-execution.md
cites-sources:
  - https://devpost.com/software/containos
  - https://github.com/maanitg/containment
  - https://treehacks-2026.devpost.com/project-gallery
cross-links:
  - patterns/per-item-parallel-llm-evaluation.md
  - patterns/robust-json-from-llms.md
  - patterns/witnessed-dissent.md
---

# ContainOS

- **Hackathon / event:** TreeHacks 2026 (Stanford, Feb 13–15, 2026)
- **Year / date:** 2026
- **Prize won:** **OpenAI AI Track 1st** (lunch with OpenAI engineers + 1 yr ChatGPT Pro)
- **Sponsor tracks involved:** OpenAI (the model that fires); Google Gemini (single context call)
- **Devpost / press / video / repo:** [Devpost](https://devpost.com/software/containos) · [GH: maanitg/containment](https://github.com/maanitg/containment)
- **Local clone:** `../sources/repos/containos/` (gitignored)

## Pitch (one sentence)

A physics-grounded multi-agent copilot for the first three hours of wildfire containment — deterministic spread/threat math sets ground truth, four GPT-4o agents reason on top, and a closed-loop validator forces replans whenever the LLM contradicts the physics.

## What's actually in the repo (verified vs. claimed)

Devpost / README sell "Claude + GPT-4o + Gemini." **Code ships GPT-4o + Gemini-1.5-flash only.** Claude is installed-but-never-imported.

| Claim | Reality (file:line) |
|---|---|
| Claude + GPT-4o + Gemini ensemble | ⚠️ GPT-4o (`backend/agents/orchestrator.py:21`) + Gemini 1.5 Flash (`backend/agents/historical_memory.py:65`) only. Claude is `@anthropic-ai/sdk ^0.74.0` in `frontend/package.json:13` + a "mock Claude API response" comment at `frontend/src/components/InsightsPanel.jsx:170`; the "LLM insights" are hardcoded English (`InsightsPanel.jsx:176-205`). |
| 7-component pipeline (physics + 4 GPT + Gemini + validator) | ✅ `process_live_graph` → parallel `_run_fire_agent`+`_run_risk_agent` → parallel `_run_notif_agent`+`_run_rec_agent` → `validate_agent_reasoning` → retry (`orchestrator.py:222-296`). |
| Pydantic cross-agent schemas | ✅ 5 `BaseModel`s (`orchestrator.py:28-46`), enforced via OpenAI Structured Outputs. |
| Closed-loop validator, max 2 retries | ✅ Errors re-injected into next prompt (`orchestrator.py:286`); loop runs 3× (`:22, :249`). |
| Geographic-first Gemini memory | ✅ But tiny — 1 call/tick against 3-record `historical_fires.json` (86 lines); "geography first" is one prompt line (`historical_memory.py:54-55`). |
| IndexedDB + SW + write queue | ✅ Hand-rolled raw `indexedDB.open` (no lib), 144 LOC `idb-cache.js`; write-queue replay w/ backoff + `X-Request-Id` idempotency (`write-queue.js:97-140`). |
| WebSocket real-time agent status | ✅ Per-100ms `status_tracker` broadcast (`main.py:266-345`). |
| Real drone / satellite ingest | ❌ 5 hardcoded `live_data_t{1..5}.json` files (~680 bytes each). |

**~580 LOC backend across 4 Python files; ~125 LOC offline + 1,100-LOC `FireMap.jsx`.** Tight for a weekend.

## The unique sauce

1. **Physics-as-validator, not physics-as-tool.** Most "AI + physics" hacks let the LLM *call* physics. ContainOS inverts it — physics runs *first*, sets ground truth in `computed_physics`, and the validator *rejects* LLM outputs that contradict the baseline (`orchestrator.py:108-134`). The model cannot win the argument. Whole anti-hallucination story in one design choice.
2. **Witnessed-dissent loop.** Validator failures feed forward as `VALIDATOR FEEDBACK: …\nYou MUST fix this.` into the next prompt (`orchestrator.py:176`). Same shape as GreenChain's retry-with-correction loop, applied to *semantic* failures not *syntactic* ones.
3. **Two-tier parallel fan-out.** L1 (Fire+Risk) parallel from physics+history; L2 (Notification+Recommendation) parallel from L1. `asyncio.gather` at both layers. Wall-clock ≈ 2 LLM round-trips.
4. **Hard length caps as adversarial defense.** ≤10-word notifications, 1-5 alerts, ≤12-word actions + ≤15-word rationale (`orchestrator.py:38-45`). Rambling outputs cannot pass `model_validate`. Demo never gets a wall of text.

## Implementation needles

### 1. Pydantic-as-cross-agent-contract via OpenAI Structured Outputs (`orchestrator.py:28-46, 162-186`)

```python
class AgentRecommendation(BaseModel):
    action: str = Field(description="Single recommended action (max 12 words).")
    rationale: str = Field(description="VERY brief (max 15 words) why critical.")
    confidence_score: int = Field(description="0-100 score of plan viability.")

completion = await client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06", messages=[...],
    response_format=AgentRecommendation,   # server-enforced schema
)
return completion.choices[0].message.parsed   # already a Pydantic instance
```

**Why it works:** Zero brace-walking, zero JSON retry-with-correction-for-shape. ContainOS only re-runs when *semantics* (physics) are wrong, not when JSON is malformed. Compare GreenChain needle 2: three layers of JSON robustness on K2; ContainOS gets that for free by single-vendor lock-in.

### 2. Closed-loop physics validator with feedback injection (`orchestrator.py:108-134, 244-288`)

```python
def validate_agent_reasoning(processed_graph, risk_data, rec_data):
    errors, physics = [], processed_graph["computed_physics"]
    if physics["deterministic_baseline_threat"] == "CRITICAL" and risk_data.threat_level != "CRITICAL":
        errors.append(f"Physics Violation: ... output '{risk_data.threat_level}'. You MUST escalate.")
    exposure_names = [e.split(" is ")[0].strip() for e in physics["critical_exposures_identified"]]
    if exposure_names and not any(n in risk_data.vulnerable_targets for n in exposure_names):
        errors.append("Logic Violation: You failed to mention critical exposure town(s)...")
    return errors

while attempts < (MAX_RETRIES + 1):
    fire_result, risk_result = await asyncio.gather(
        _run_fire_agent(processed_graph, history_summary),
        _run_risk_agent(processed_graph, history_summary, validator_feedback))
    notif_result, rec_result = await asyncio.gather(
        _run_notif_agent(fire_result, risk_result),
        _run_rec_agent(fire_result, risk_result, current_previous_rec, validator_feedback))
    errors = validate_agent_reasoning(processed_graph, risk_result, rec_result)
    if not errors: return ...
    validator_feedback = " | ".join(errors); attempts += 1
```

**Why it works:** Two-class validation (single-class threat band; list-membership exposure check) catches the demo-relevant hallucination space. Baseline is a few `if`s on wind/slope/vegetation/distance (`orchestrator.py:50-104`). Generalizes to any vertical with a *cheap deterministic ground-truth fn* and an *expensive LLM* that must agree. See `patterns/witnessed-dissent.md`.

### 3. Hand-rolled IDB + write-queue (`frontend/src/offline/idb-cache.js:105-142`, `write-queue.js:97-140`)

```javascript
// Network-first w/ 6s timeout, IDB fallback (cachedFetch)
try {
  const ctrl = new AbortController(); const tid = setTimeout(() => ctrl.abort(), 6000);
  const res = await fetch(url, { ...options, signal: ctrl.signal }); clearTimeout(tid);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  putCache(key, data).then(() => evict()).catch(() => {});       // fire-and-forget
  return { data, meta: { fromCache: false, ... } };
} catch {
  const cached = await getCache(key).catch(() => null);
  if (cached) return { data: cached.data, meta: { fromCache: true, stale: ... } };
  throw new Error(`Fetch failed and no cache for ${url}`);
}
// Replay queue on reconnect with idempotency header
await fetch(entry.url, { method: entry.method,
  headers: { ...entry.headers, 'X-Request-Id': entry.requestId }, body: entry.body });
```

**Why it works:** No library — `indexedDB.open` + one keyPath store + an `updatedAt` index for eviction. `X-Request-Id` is a free idempotency key for the backend. ~125 LOC total. Bones of "tablet keeps working in a comms-dark zone."

## Capability stack

| Layer | Choice |
|---|---|
| Frontend | React 19.2 + Vite 7.3 + Leaflet 1.9 |
| Backend | FastAPI 0.115 + Pydantic v2.10 |
| Agent runtime | OpenAI SDK 1.59, `client.beta.chat.completions.parse(response_format=PydanticModel)` |
| Reasoning LLM | GPT-4o (`gpt-4o-2024-08-06`), 4× agents, parallel fan-out |
| History LLM | Gemini 1.5 Flash (1 call/tick; falls back to hardcoded paragraph if API down) |
| Validation | Structured Outputs + 2-rule physics validator |
| Real-time | WebSocket per-100ms `status_tracker` broadcast |
| Offline | Hand-rolled IndexedDB + SW + write queue (backoff + idempotency keys) |
| **Claimed but absent** | Anthropic Claude (SDK in frontend, never called); live drone/satellite ingest (5 hardcoded JSONs); RL spread sim |

## Why it would win

"First three hours" is a phrase Cal Fire actually uses — crisp framing. Physics-as-judge is the strongest single answer to "how do you trust the LLM?" in this vertical. Real-time map UI + WebSocket status pills flipping idle→running→complete = visual demo theatre. Offline-first depth signals "real ops product" not "wrapper." Track-fit: `client.beta.chat.completions.parse` is *exactly* the OpenAI feature OpenAI engineers want to see at the AI track.

## Reusable for us at HackTech 2026?

- ✅ **Witnessed-dissent loop** ports to any vertical with a cheap ground-truth fn (tax law, drug interactions, satellite collision, grid-fault thresholds). See `patterns/witnessed-dissent.md`.
- ✅ **Pydantic-as-contract via Structured Outputs** kills 30 LOC of JSON-extraction-with-retry per agent — *if* we're OpenAI-shop on that subsystem.
- ✅ **Hand-rolled IDB + write-queue** is copy-pasteable for any "ops tablet on flaky network" demo.
- ⚠️ **Provider lock-in tax** — single-vendor robustness story breaks the moment we add K2 + Claude per `decisions/008-k2-think-as-speed-engine.md`; we eat GreenChain's three-layer dance.
- 🚫 **Don't copy the multi-LLM framing without the multi-LLM code.** Devpost says three providers; repo runs two. Judges who clone repos catch this.

## Lookalike-risk score

**Medium-high (6/10).** "Vertical-agent-stack on critical infra with a physics/rules validator" is *the* TreeHacks-2026 winning archetype (`scrapes/treehacks-2026-winners.md:104, 119–127`); 8+ winners did this shape. Copying 1:1 in another vertical (substations, pipelines, ICUs) reads as derivative. **Differentiator:** dissent loop alone isn't enough — add *cross-site federation* (Jarvis), *audit-grade citations* (Tribune/Synapse), or *K2 Think reasoning* to escape.

## What this forecloses

- **Audit-grade citations.** Zero source-attribution — no event-IDs / frame numbers / sensor IDs. We should *out-cite* ContainOS — every assertion bound to a timestamped sensor / camera / report ID.
- **Multi-site federation.** Single fire, single ops center, single physics state. "Evidence from site A informs agent at site B" (Jarvis expansion) is wide open.
- **Live ingest realism.** 5 hardcoded JSONs is a demo crutch. Pipe a staged-realistic stream through Browserbase/MCP fetch.
- **The Claude integration that wasn't.** A real three-model ensemble with *role separation* (GPT for structure, Claude for narrative, Gemini for retrieval) would honor the framing ContainOS sold but didn't ship.

## Cross-links

- Patterns: [`per-item-parallel-llm-evaluation.md`](../patterns/per-item-parallel-llm-evaluation.md), [`robust-json-from-llms.md`](../patterns/robust-json-from-llms.md) (negative example: ContainOS dodges via Structured Outputs), [`witnessed-dissent.md`](../patterns/witnessed-dissent.md)
- Decisions: [`007-agent-swarms-as-coordination-pattern.md`](../decisions/007-agent-swarms-as-coordination-pattern.md), [`011-demo-over-execution.md`](../decisions/011-demo-over-execution.md)
- Sibling projects: [`bridge.md`](./bridge.md), [`greenchain.md`](./greenchain.md), [`jarvis.md`](./jarvis.md)
