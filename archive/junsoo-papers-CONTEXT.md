# What this slice is doing — primer for teammates

## TL;DR

We feed a stimulus (video / audio / text) into **TRIBE v2** (Meta's brain-encoding foundation model), get back a per-second prediction of fMRI activity over ~20k cortical vertices, **collapse those vertices into 7 functional networks** (Yeo 7-network atlas), and emit a JSON time-series like:

```json
{ "stimulus": "...", "atlas": "yeo7", "fps": 1,
  "frames": [{ "t_s": 0, "top_region": "visual",
               "regions": { "visual": 0.42, "default_mode": 0.17, ... } }, ...] }
```

That JSON is the input to a **swarm of 7 LLM agents**, one per brain network. Each agent has a "voice" tied to what its network actually does in the literature, and they collectively narrate "what the subject is perceiving / feeling / doing" frame-by-frame.

This dir (`papers/`) holds the research grounding so the swarm can cite real findings instead of hallucinating.

---

## Why this works (the chain)

1. **TRIBE v2** is trained on >1,000 hours of fMRI from 720 subjects watching/listening to/reading naturalistic stimuli. It maps multimodal embeddings (LLaMA 3.2 text, V-JEPA2 video, Wav2Vec-BERT audio) onto the cortical surface and predicts BOLD responses for an "average" subject. Predictions live on the **fsaverage5** mesh (~20k vertices). They're already HRF-corrected (offset 5 s into the past).
   → d'Ascoli et al. 2026, *A foundation model of vision, audition, and language for in-silico neuroscience* (Meta FAIR). [Paper](https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/) · [Code](https://github.com/facebookresearch/tribev2) · [Weights](https://huggingface.co/facebook/tribev2)

2. **Yeo 7-network parcellation** clusters those 20k vertices into 7 large-scale functional networks discovered from resting-state connectivity in 1,000 subjects. It's the standard coarse atlas for asking "which *system* of the brain is engaged right now."
   → Yeo, Krienen, Sepulcre et al. 2011, *J. Neurophysiol.* 106:1125-1165. [PubMed](https://pubmed.ncbi.nlm.nih.gov/21653723/) · [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3174820/)

3. **Why aggregate to 7?** A single LLM agent reasoning about ~20k vertex values is hopeless. A swarm of 7 agents — each anchored to one *meaningful* system — is a realistic abstraction layer that maps cleanly onto how cognitive neuroscientists actually talk about activity.

---

## The 7 networks — what each one does, and what each agent should "be"

For each network: anatomy → function → the agent's voice → what high activation infers → the seminal paper to ground it.

### 1. `visual` — occipital cortex (V1/V2, FFA, PPA, LOC)
- **Function**: low/mid-level vision. Edges, motion, color, faces (FFA), places (PPA), objects (LOC), words.
- **Agent voice**: *"I am the visual cortex. I report what is on the retina — content, not meaning."*
- **High activation → infer**: visual-rich stimulus, scene change, face/place onset, reading. Spike during a *non-visual* stimulus = mental imagery or eyes-open default; flag it.
- **Citation (modern)**: Allen et al. 2022, *A massive 7T fMRI dataset to bridge cognitive neuroscience and AI* — the NSD benchmark for naturalistic vision and DNN-to-brain alignment. [Nature Neuroscience](https://www.nature.com/articles/s41593-021-00962-x). *Foundational ref:* Kanwisher, McDermott & Chun 1997 (FFA discovery). [Paper](https://www.jneurosci.org/content/17/11/4302)

### 2. `somatomotor` — pre/postcentral gyrus + early auditory (A1) on lateral edge
- **Function**: body movement planning/execution, touch, proprioception. In Yeo7, A1 also rides this network, so it lights up for sound and speech onset.
- **Agent voice**: *"I am the body and the ears. I act and I hear."*
- **High activation → infer**: motor mirroring (action observation), strong audio event, music, loud speech. Pair with `visual` low → likely auditory-driven.
- **Citation (modern)**: Norman-Haignere, Kanwisher & McDermott 2015, *Distinct cortical pathways for music and speech revealed by hypothesis-free voxel decomposition* — auditory cortex is not a uniform sheet; speech, music, and song each have selective sub-populations. [Neuron](https://www.cell.com/neuron/fulltext/S0896-6273(15)01071-5). *Atlas ref:* Yeo et al. 2011 — the somatomotor cluster spans sensorimotor strip plus A1. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3174820/)

### 3. `dorsal_attention` — intraparietal sulcus + frontal eye fields (DAN)
- **Function**: top-down, goal-directed attention. The "spotlight" — where you *choose* to look or track.
- **Agent voice**: *"I am the spotlight. I aim attention on purpose."*
- **High activation → infer**: focused tracking, visual search, effortful sustained engagement.
- **Citation (modern)**: Petersen & Posner 2012, *The attention system of the human brain: 20 years after* (Annu. Rev. Neurosci.) — multi-network treatment of attention with DAN as the sustained-orienting node. [Paper](https://www.annualreviews.org/content/journals/10.1146/annurev-neuro-062111-150525). *Foundational ref:* Corbetta & Shulman 2002 (the original DAN/VAN dissociation). [Paper](https://www.nature.com/articles/nrn755)

### 4. `ventral_attention` — TPJ + ventral frontal cortex (VAN; overlaps salience network / anterior insula / dACC)
- **Function**: bottom-up reorienting, novelty/oddball detection. Acts as a "circuit-breaker" that interrupts the dorsal system when something salient happens.
- **Agent voice**: *"I am the alarm. Something unexpected just happened."*
- **High activation → infer**: surprise, scene cut, salient deviant, sudden change, emotional salience spike. Best detector of *event boundaries.*
- **Citation (modern)**: Uddin 2015, *Salience processing and insular cortical function and dysfunction* (Nat. Rev. Neurosci.) — anterior insula as the gatekeeper that switches the brain between DMN and FPCN/DAN modes. [Paper](https://www.nature.com/articles/nrn3857). *Foundational refs:* Corbetta & Shulman 2002 (VAN proper); Seeley et al. 2007 (salience network). [Seeley paper](https://www.jneurosci.org/content/27/9/2349)

### 5. `limbic` — orbitofrontal cortex + temporal pole
- **Function**: emotion, reward valuation, hedonic experience, social/semantic meaning, affective tagging.
- **Agent voice**: *"I am the heart. I feel what this means to you."*
- **High activation → infer**: emotional content, reward/punishment cue, personally meaningful or socially warm/threatening moment. Valence (+/−) needs combining with other channels — limbic only says "this matters affectively."
- **Citation (modern)**: Rolls 2023, *Emotion, motivation, decision-making, the orbitofrontal cortex, anterior cingulate cortex, and the amygdala* (Brain Structure and Function) — current synthesis on OFC + emotion, with the medial-vs-lateral reward/punishment dissociation. [Paper](https://link.springer.com/article/10.1007/s00429-023-02644-9). *Foundational ref:* Kringelbach 2005 (OFC + hedonic experience). [Paper](https://www.nature.com/articles/nrn1747)

### 6. `frontoparietal` — lateral PFC + posterior parietal cortex (FPCN, "executive control")
- **Function**: cognitive control, working memory, rule-holding, flexible task switching, integration across modalities.
- **Agent voice**: *"I am the conductor. I hold the rules and decide."*
- **High activation → infer**: deliberation, multi-step reasoning, integrating signals, decision/choice point. Pairs with DAN → active task; pairs with DMN → reflective reasoning about meaning.
- **Citation (modern)**: Marek & Dosenbach 2018, *The frontoparietal network: function, electrophysiology, and importance of individual precision mapping* (Dialogues in Clinical Neuroscience) — current account of FPCN as a flexible bridge between DAN and DMN. [Paper](https://www.tandfonline.com/doi/full/10.31887/DCNS.2018.20.2/smarek). *Foundational ref:* Vincent, Kahn, Snyder, Raichle & Buckner 2008 (FPCN as distinct from both DAN and DMN). [Paper](https://journals.physiology.org/doi/full/10.1152/jn.90355.2008)

### 7. `default_mode` — mPFC + PCC + angular gyrus + lateral temporal cortex (DMN)
- **Function**: self-referential thought, narrative comprehension, theory of mind, autobiographical memory, mind-wandering, future projection.
- **Agent voice**: *"I am the narrator. I weave this into your story and into other minds."*
- **High activation → infer**: story comprehension phase, character/intent modeling, introspection, "what does this mean for me?" Suppressed DMN + high DAN/FPCN = externally focused work. High DMN with low task signal = drifting.
- **Citation (modern)**: Smallwood et al. 2021, *The default mode network in cognition: a topographical perspective* (Nat. Rev. Neurosci.) — current view of DMN as the most distant point from sensory cortex, supporting abstract / narrative cognition. [Paper](https://www.nature.com/articles/s41583-021-00474-4). *Foundational refs:* Raichle et al. 2001 (DMN discovery, [PNAS](https://www.pnas.org/doi/10.1073/pnas.98.2.676)); Buckner, Andrews-Hanna & Schacter 2008 ([PubMed](https://pubmed.ncbi.nlm.nih.gov/18400922/)).

---

## Cross-network patterns (what the swarm moderator should look for)

Single-network activation tells you a little; *combinations* tell you what the subject is doing. These patterns matter more than any one node:

| Pattern | Interpretation |
|---|---|
| Visual ↑ + DAN ↑ + DMN ↓ | Externally focused looking / searching |
| DMN ↑ + Limbic ↑ + DAN ↓ | Emotional reflection, personally meaningful narrative |
| VAN spike (alone) | Discrete surprise / event boundary — useful for segmentation |
| FPCN ↑ + DAN ↑ | Active task engagement, deliberation |
| Somatomotor ↑ (A1 edge) + DMN ↑, Visual mid | Listening to a spoken story |
| Limbic ↑ + Somatomotor ↑ + DMN ↑ | Emotionally loaded speech / music |
| All flat / Visual only | Low engagement or stimulus mismatch — sanity flag |

**Key principle**: DMN and DAN are anti-correlated by default. When you see them both high, something interesting is happening (often FPCN is bridging them — that's the reflective-reasoning signature).

---

## File map of this slice (`junsoo/`)

- `run_inference.py` — loads TRIBE v2 from HuggingFace, runs it on `--video` / `--audio` / `--text`, saves raw `(T, 20484)` predictions to `.npz`.
- `atlas.py` — builds (or loads from cache) the Yeo 7-network labels projected onto the fsaverage5 surface using `nilearn`.
- `aggregate.py` — mean-pools the predictions per network per timestep, emits the JSON shape above.
- `smoke_test.py` — synthetic-data test that the JSON pipeline works without needing GPU / nilearn / network access.
- `tribev2/` — vendored clone of `facebookresearch/tribev2` (CC-BY-NC-4.0).
- `papers/` — this dir. Research grounding for the swarm.
  - `papers/CONTEXT.md` — this primer.
  - `papers/prompts/<network>.md` — system-prompt-ready file per swarm agent. Seven network agents + one `moderator.md` synthesizer. Load each into your swarm framework as the agent's system prompt.

## How to run the pipeline end-to-end

```bash
# 1. Inference (needs GPU, TRIBE v2 weights, ~3 min on a single video)
python run_inference.py --video cache/sample_video.mp4 --out cache/preds.npz

# 2. Aggregate to per-network JSON (cheap, CPU-only)
python aggregate.py --preds cache/preds.npz --out cache/activity.json --atlas yeo7

# 3. Sanity-check the aggregator without TRIBE v2
python smoke_test.py
```

The output `cache/activity.json` is what the swarm consumes.

---

## What's NOT decided yet (open for teammate input)

- **How the swarm consumes this**: do agents see one frame at a time (low context, fast) or a sliding window (richer pattern detection, slower)? The JSON supports either.
- **Yeo 7 vs Yeo 17**: 17 gives finer detail (e.g. splits visual into central/peripheral, splits DMN into 3 subnets) but means 17 agents. `aggregate.py --atlas yeo17` already supports this if we want to try.
- **Subject specificity**: TRIBE v2 predicts the "average subject." If we want to claim subject-specific activity, that's a much bigger lift (training).

---

## Sources

### Tools we depend on
- **TRIBE v2** — d'Ascoli et al. 2026 ([Paper](https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/) · [GitHub](https://github.com/facebookresearch/tribev2) · [HuggingFace](https://huggingface.co/facebook/tribev2))
- **Yeo 7-network atlas** — Yeo et al. 2011, *J. Neurophysiol.* ([PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3174820/))

### Modern per-network reviews (drove the agent prompts)
- **Visual** — Allen et al. 2022, NSD, *Nature Neuroscience* ([Paper](https://www.nature.com/articles/s41593-021-00962-x))
- **Somatomotor / A1** — Norman-Haignere, Kanwisher & McDermott 2015, *Neuron* ([Paper](https://www.cell.com/neuron/fulltext/S0896-6273(15)01071-5))
- **Dorsal attention** — Petersen & Posner 2012, *Annu. Rev. Neurosci.* ([Paper](https://www.annualreviews.org/content/journals/10.1146/annurev-neuro-062111-150525))
- **Ventral attention / salience** — Uddin 2015, *Nat. Rev. Neurosci.* ([Paper](https://www.nature.com/articles/nrn3857))
- **Limbic / OFC** — Rolls 2023, *Brain Structure and Function* ([Paper](https://link.springer.com/article/10.1007/s00429-023-02644-9))
- **Frontoparietal** — Marek & Dosenbach 2018, *Dialogues in Clinical Neuroscience* ([Paper](https://www.tandfonline.com/doi/full/10.31887/DCNS.2018.20.2/smarek))
- **Default mode** — Smallwood et al. 2021, *Nat. Rev. Neurosci.* ([Paper](https://www.nature.com/articles/s41583-021-00474-4))

### Foundational refs (kept for historical orientation)
- Corbetta & Shulman 2002 — original DAN/VAN dissociation ([Paper](https://www.nature.com/articles/nrn755))
- Seeley et al. 2007 — salience network defined ([Paper](https://www.jneurosci.org/content/27/9/2349))
- Vincent et al. 2008 — FPCN as distinct system ([Paper](https://journals.physiology.org/doi/full/10.1152/jn.90355.2008))
- Raichle et al. 2001 — DMN discovery ([Paper](https://www.pnas.org/doi/10.1073/pnas.98.2.676))
- Buckner, Andrews-Hanna & Schacter 2008 — DMN review ([Paper](https://pubmed.ncbi.nlm.nih.gov/18400922/))
- Kringelbach 2005 — OFC + hedonic experience ([Paper](https://www.nature.com/articles/nrn1747))
- Kanwisher, McDermott & Chun 1997 — FFA discovery ([Paper](https://www.jneurosci.org/content/17/11/4302))
