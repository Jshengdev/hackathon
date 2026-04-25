# GreenChain

- **Hackathon / event:** HackPrinceton 2026 (Sustainability + Environment track)
- **Year / date:** 2026 (Spring; verify exact dates from Devpost)
- **Prize won:** unverified — Devpost text mentions Dedalus best-use, K2 Think, MLH Gemini, MLH GoDaddy, Telora, Eragon sponsor tracks
- **Sponsor tracks involved:** **Dedalus Labs** (containers + agent swarm), **K2 Think** (scenario editor), **MLH Google Gemini** (report generation), **MLH GoDaddy** (domain), **Telora**, **Eragon**
- **Devpost / press / video / repo:** repo only — https://github.com/thejustjim/hackprinceton2026.git ; live URL: makethesupplychain.work
- **Local clone:** `../sponsors/k2-think/clones/greenchain/`

## Pitch (one sentence)

A web app where a procurement manager types a product, picks countries and a transport mode, and gets back a live, ranked, environmentally-scored comparison of real manufacturers — agents discover the suppliers, ML scores them, and a 3D globe + force-directed graph shows the result.

## What's actually in the repo (verified vs. claimed)

This one is the inverse of BRIDGE: the Devpost prose is **mostly accurate** and the codebase is large (~30 backend Python files + Next.js frontend + ML training pipeline + a 600-line `CLAUDE.md` that reads like a complete brief).

| Devpost claim | Reality |
|---|---|
| Dedalus-orchestrated agent swarm with Claude Sonnet 4.6 | ✅ `backend/agents.py` calls `DedalusRunner` with `anthropic/claude-sonnet-4-6` |
| Brave Search MCP for manufacturer discovery | ✅ `mcp_servers=["windsornguyen/brave-search-mcp"]` |
| BeautifulSoup for sustainability page extraction | ✅ Listed in deps + used downstream of fetch |
| Dedalus Container Service (Machines) for sandboxed page fetches | ✅ `backend/machine_host.py` provisions Machines via DCS REST API |
| XGBoost quantile regression with q10/q50/q90 uncertainty | ✅ `backend/ml_runtime/ml/train_model.py` |
| GLEC framework for transport emissions (sea/air/rail/road) | ✅ Hard-coded factors in `tools.py` and `transport.py` |
| K2 Think v2 two-pass scenario editor (intent classify → per-node decide) | ✅ `backend/scenario_editing.py` — this is the cleanest part of the codebase |
| Up to 6 K2 evaluations in parallel | ✅ `asyncio.Semaphore(6)` in `edit_scenario_with_k2` |
| Gemini/Gemma 4 for report synthesis | ✅ `backend/report_generation.py` |
| EPA USEEIO + Ember Climate + ND-GAIN datasets | ✅ Loaded into SQLite via `db.py` |
| Three.js 3D globe with depth-sorted geodesic arcs | ✅ Frontend tree confirms; not deeply audited |
| SQLite revision history for scenario edits | ✅ `append_scenario_revision`, `get_scenario_revision` etc. |

## The unique sauce (what made it stand out)

1. **K2 Think used for "structured ambiguous reasoning," not just JSON.** Their pitch line — _"K2 has to reason about what 'ISO-certified' means in the context of each specific component, whether an unverified supplier counts, and what the user probably intended"_ — is a precise framing of a class of problems (rules-with-judgment) where K2 fits and one-shot LLMs don't.
2. **Two-pass cascade: intent classifier → per-item evaluator.** They don't ask K2 "rewrite this scenario." They ask it (a) "is this a filter / undo / reject?" and then (b), in parallel, "should this *one* manufacturer survive?" — N+1 cheap calls instead of one impossible call.
3. **Dedalus Machines as the untrusted-input sandbox.** Web fetches (which can be SEO spam, malformed HTML, or worse) execute on a remote KVM-isolated VM via `POST /v1/machines/{id}/executions` with the URL as a separate argv element. HTML parsing happens back in-process. Clean trust boundary, and a great answer to "how do you handle untrusted web data?"
4. **`CLAUDE.md` as a complete project brief.** The repo ships with a ~600-line `backend/CLAUDE.md` that contains: architecture diagram, env vars, full code stubs for every key file, demo scenarios, data-source URLs, training script, and "key decisions + constraints." This is the single most copyable piece of process tooling in the repo.
5. **Client-side rescore on the demo's killer toggle.** The transport-mode toggle (sea → air → rail → road) is the demo's "wow" — and it never re-calls the backend. GLEC factors run in JS, sort runs in JS, the whole UI updates instantly. Demo looks like magic; pipeline never gets re-stressed.

## Implementation needles (actual code patterns)

### 1. Two-pass K2 cascade — intent classify, then per-item evaluate (`backend/scenario_editing.py`)

```python
async def edit_scenario_with_k2(prompt, scenario):
    api_key, model, base_url, timeout = _get_k2think_settings()
    headers = {"Authorization": f"Bearer {api_key}", ...}

    async with httpx.AsyncClient(timeout=timeout) as client:
        # PASS 1 — classify intent
        intent = await classify_prompt_with_k2(client=client, ..., prompt=prompt, scenario=baseline_scenario)
        if intent.op == "reject":  return ScenarioEditResponsePayload(message=intent.message, status="rejected")
        if intent.op == "undo":    return restore_scenario_revision(scenario.id, intent.undo_steps, prompt)

        # PASS 2 — fan out one K2 call per alternate manufacturer, max 6 in flight
        semaphore = asyncio.Semaphore(6)
        async def evaluate_manufacturer(m):
            async with semaphore:
                try:
                    result = await evaluate_alternate_node_with_k2(client=client, ..., prompt=prompt, manufacturer=m)
                except ScenarioEditProviderError:
                    evaluation_warnings.append(f"Preserved {m.name} because K2 evaluation failed.")
                    return m.id, True   # fail-open: keep on error
            return m.id, result.decision == "keep"

        decisions = await asyncio.gather(*(evaluate_manufacturer(m) for m in alternate_manufacturers))
        keep_ids = {mid for mid, keep in decisions if keep}
        return apply_filtered_scenario(baseline_scenario, keep_ids)
```

**Why it works:** Each K2 call has a small, focused, well-scoped decision (one manufacturer, one prompt). That's where reasoning models shine — and where they reliably emit valid JSON. Failures fall back to "keep," so a flaky API never makes the demo lose data.

### 2. Robust JSON extraction with retry-with-correction (`backend/scenario_editing.py`)

```python
def _extract_json_object_text(raw_content: str) -> str:
    text = raw_content.strip()
    if text.startswith("```"):
        # strip fenced code block
        lines = text.splitlines()
        if lines and lines[0].startswith("```"): lines = lines[1:]
        if lines and lines[-1].strip() == "```":  lines = lines[:-1]
        text = "\n".join(lines).strip()
    if text.startswith("{"):
        return text
    # find first '{' and walk forward, brace-balanced, respecting strings/escapes
    start = text.find("{")
    depth, in_string, escape = 0, False, False
    for i in range(start, len(text)):
        c = text[i]
        if in_string:
            if escape: escape = False
            elif c == "\\": escape = True
            elif c == '"': in_string = False
            continue
        if c == '"': in_string = True
        elif c == "{": depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0: return text[start:i+1]
    raise ValueError("unterminated JSON")

# Retry-with-correction loop
for attempt in range(1, 4):
    response = await client.post(f"{base_url}/chat/completions", headers=headers, json=request_body)
    content = response.json()["choices"][0]["message"]["content"]
    try:
        return response_model.model_validate(json.loads(_extract_json_object_text(content)))
    except Exception as exc:
        parse_error = str(exc)
    if attempt < 3:
        conversation += [
            {"role": "assistant", "content": content},
            {"role": "user", "content": f"Your previous response was invalid. Problem: {parse_error}. Return only valid JSON matching the required response schema."},
        ]
raise ScenarioEditProviderError("K2 Think failed to return valid JSON after 3 attempts.")
```

**Why it works:** Three layers of robustness in ~30 lines: (1) Pydantic v2 strict models with `extra="forbid"` reject silently bad shapes, (2) the brace-balanced extractor recovers JSON from prose-padded output, (3) the retry loop appends the error back into the conversation as a user turn so the model self-corrects on attempt 2/3. Generalize this to anywhere you call an LLM for structured output.

### 3. Dedalus runner with custom tools auto-schema'd from Python signatures (`backend/agents.py` per CLAUDE.md)

```python
from dedalus_labs import AsyncDedalus, DedalusRunner
from tools import lookup_emission_factor, calculate_transport_emissions, score_certifications

client = AsyncDedalus()
runner = DedalusRunner(client)
response = await runner.run(
    input=f"You are a supply chain researcher. Research manufacturers of \"{product}\" in: {countries}. ...",
    model="anthropic/claude-sonnet-4-6",
    mcp_servers=["windsornguyen/brave-search-mcp"],
    tools=[lookup_emission_factor, calculate_transport_emissions, score_certifications],
)
```

**Why it works:** No tool schema written by hand. Dedalus extracts the tool signature, name, docstring, and type hints into the model's tool-use schema automatically — same idea as Anthropic's beta MCP / Claude Agent SDK, but plug-and-play. You write a regular Python function, you pass it in, it's a tool.

### 4. Dedalus Machine as untrusted-fetch sandbox (per Devpost + `machine_host.py`)

```
[FastAPI backend] --provision--> [Dedalus Machine (KVM)]
                                       |
                                       v
            POST /v1/machines/{id}/executions  (curl URL as separate argv)
                                       |
                  GET  /v1/machines/{id}/executions/{exec_id}  (poll)
                  GET  /v1/machines/{id}/executions/{exec_id}/output  (HTML)
                                       |
[FastAPI backend] <--HTML body--  (back in-process for BeautifulSoup parsing)

On shutdown: DELETE /v1/machines/{id} with If-Match revision header.
```

**Why it works:** Web fetches have two threats — shell-injection via the URL and SSRF/exfil via the response. They neutralize the first by passing the URL as a *separate argv element* (no shell interpolation possible) and the second by running the fetch on isolated remote infra with explicit lifecycle. The trust boundary is crisp: untrusted bytes live on the Machine; parsed text lives in the app.

### 5. Live SSE pipeline (per CLAUDE.md `main.py`)

```python
@app.post("/search")
async def search(req: SearchRequest):
    async def stream():
        yield f"data: {json.dumps({'status': 'agents_running', 'message': 'Searching ...'})}\n\n"
        raw = await run_supply_chain_research(...)
        yield f"data: {json.dumps({'status': 'scoring', 'message': 'Running ML scoring ...'})}\n\n"
        scored = compute_composite_scores(raw, req.transport_mode)
        yield f"data: {json.dumps({'status': 'complete', 'results': scored})}\n\n"
    return StreamingResponse(stream(), media_type="text/event-stream")
```

**Why it works:** Long-running agent + ML pipelines are a UX disaster behind a spinner. SSE lets the frontend show "agents discovering...", "scoring...", "complete" in real time, and pairs with the D3 graph that *grows* as nodes arrive. Same idea as Vercel AI SDK streaming, but vanilla FastAPI.

### 6. Client-side toggle rescore (per CLAUDE.md `useSSE.ts`)

```typescript
const GLEC = { sea: 0.011, air: 0.602, rail: 0.028, road: 0.096 };
function rescoreLocally(manufacturers, mode) {
  return manufacturers.map(m => {
    const newTransport = GLEC[mode] * (m.transport.weight_kg / 1000) * m.transport.distance_km;
    return { ...m, transport: { ...m.transport, transport_tco2e: newTransport, mode },
             scores: { ...m.scores, transport_tco2e: newTransport,
                       total_tco2e: m.scores.manufacturing_tco2e + newTransport } };
  }).sort((a, b) => a.scores.total_tco2e - b.scores.total_tco2e);
}
```

**Why it works:** The fixed cost (agent discovery) is paid once. The variable demo input (transport mode) is recomputed locally with a 4-key constant table. The demo feels instantaneous because **it is** — no network round-trip on the action judges actually play with.

## Capability stack

| Layer | Choice |
|---|---|
| Frontend | Next.js + React, Tailwind, shadcn/ui, react-resizable-panels |
| Globe | Three.js 3D Earth + custom geodesic arcs + world-atlas topology |
| Graph | D3 force-directed (spring + collision + repulsion) |
| Backend | FastAPI + Uvicorn + Pydantic v2 (`extra="forbid"`) |
| Database | SQLite (manufacturer cache, search audit log, scenario revision history, datasets) |
| Web fetch | BeautifulSoup4 inside Dedalus Machine sandbox |
| Agent runtime | Dedalus Labs SDK (`AsyncDedalus` + `DedalusRunner`) |
| Search | Brave Search via `windsornguyen/brave-search-mcp` |
| Reasoning LLM | K2 Think v2 (`MBZUAI-IFM/K2-Think-v2`) at `https://api.k2think.ai/v1/chat/completions` |
| Research LLM | Claude Sonnet 4.6 (`anthropic/claude-sonnet-4-6`) via Dedalus |
| Report LLM | Gemma 4 via Gemini API |
| ML | XGBoost quantile regression (q10/q50/q90), GroupShuffleSplit, Spearman validation |
| Datasets | EPA USEEIO v1.3, Ember Climate grid intensity, ND-GAIN climate risk, GLEC transport factors |

## Why it would win

- **Real product, real datasets, real workflow.** Procurement managers exist; CSRD compliance is a real EU regulation; the data sources are auditable. The demo answers a regulator-grade question in 60 seconds.
- **The toggle.** Sea → air → emissions multiply ~55x in front of the judge. Single best demo moment in the project.
- **Sponsor stacking.** They wrote *separate*, polished pitches for Dedalus (containers + swarm), K2 Think, MLH Gemini, MLH GoDaddy, Telora, and Eragon — each one tied to the actual implementation. That's the multi-track-prize hustle.
- **The visuals.** Globe + force graph + scenario editor + ranked drawer is the demo aesthetic that's been winning in 2025–26.

## Reusable for us at HackTech 2026?

- ✅ **angle:** Pick a regulated/compliance-driven vertical (climate, healthcare, finance, immigration, energy markets) and build an "operations-center" UI with auditable data sources behind it. Match the tooling: SSE backbone + Dedalus swarm + K2 reasoning + 3D viz.
- ✅ **angle:** The Dedalus + K2 stack is sponsor-leveraged twice in one architecture. If both sponsor at HackTech (verify), this is a high-EV combo.
- ⚠️ **risk:** Heavy dataset prep. EPA USEEIO + Ember + GLEC + ND-GAIN took non-trivial integration work; we'd need a faster data hook.
- ⚠️ **risk:** XGBoost training before the hack is *required* (see the `train_model.py` script). Don't try to fit a model on stage.
- 🚫 **saturated:** Generic "AI for sustainability" pitches without real datasets. Without the EPA/Ember/GLEC grounding, judges see another wrapper.

## Cross-links

- Patterns: [`two-stage-llm-compile.md`](../patterns/two-stage-llm-compile.md) (sibling pattern), [`robust-json-from-llms.md`](../patterns/robust-json-from-llms.md), [`per-item-parallel-llm-evaluation.md`](../patterns/per-item-parallel-llm-evaluation.md), [`sandboxed-untrusted-input.md`](../patterns/sandboxed-untrusted-input.md), [`client-side-rescore.md`](../patterns/client-side-rescore.md), [`claude-md-as-brief.md`](../patterns/claude-md-as-brief.md)
- Stacks: [`agent-swarm-ml-viz.md`](../stacks/agent-swarm-ml-viz.md)
- Tools: [`k2-think.md`](../tools/k2-think.md), [`dedalus-labs.md`](../tools/dedalus-labs.md)
