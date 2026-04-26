---
file-type: source
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/
  - https://arxiv.org/abs/2507.22229
  - https://arxiv.org/html/2507.22229v1
  - https://openreview.net/pdf/286cdc57ba83dcd3f58821d8bde1e38ca234637c.pdf
  - https://github.com/facebookresearch/tribev2
  - https://huggingface.co/facebook/tribev2
  - https://aidemos.atmeta.com/tribev2/
  - https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb
  - https://github.com/facebookresearch/tribev2/issues/45
  - https://github.com/facebookresearch/tribev2/issues/48
  - https://github.com/facebookresearch/tribev2/issues/49
  - https://www.cortex.buzz/
  - https://medium.com/ai-pragmatist/metas-tribe-and-the-future-of-simulated-consumers-1bf694bcf0e9
  - https://kingjr.github.io/
  - https://x.com/AIatMeta/status/2037153756346016207
  - https://x.com/AIatMeta/status/1954865388749205984
  - https://www.algonautsproject.com/2025/challenge.html
  - https://arxiv.org/abs/2508.10784
  - https://www.lesswrong.com/posts/JY9fXGzsAv8Pdgmje/paper-review-trimodal-brain-encoder-for-whole-brain-fmri
  - https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/
  - https://github.com/facebookresearch/vjepa2
  - https://huggingface.co/facebook/w2v-bert-2.0
  - https://huggingface.co/meta-llama/Llama-3.2-3B
  - https://www.marktechpost.com/2026/03/26/meta-releases-tribe-v2-a-brain-encoding-model-that-predicts-fmri-responses-across-video-audio-and-text-stimuli/
  - https://pubmed.ncbi.nlm.nih.gov/16406760/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC3240863/
  - https://leg.colorado.gov/bills/hb24-1058
  - https://www.orrick.com/en/Insights/2024/04/Colorado-Enacts-Nations-First-Privacy-Law-to-Protect-Consumer-Brainwaves
  - https://www.ohchr.org/en/press-releases/2025/03/un-expert-calls-for-regulation-of-neurotechnologies-to-protect-right-privacy
  - https://www.ohchr.org/en/documents/thematic-reports/ahrc5858-foundations-and-principles-regulation-neurotechnologies-and
  - https://www.ohchr.org/en/press-releases/2025/10/un-expert-calls-model-law-neurotechnologies-protect-right-privacy
cross-links:
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md
---

# TRIBE v2 — canonical reference

> Karpathy-LLM-wiki-style entity page. Scope: capabilities + integration paths + risks. Does not propose what to build.

## 1. The 30-second answer

**TRIBE v2** (TRImodal Brain Encoder, version 2) is Meta FAIR's open-source foundation model that takes any combination of **video, audio, and text** as input and **predicts the fMRI signal a human cortex would emit while watching/listening/reading it**, across roughly 20,000 cortical-surface vertices on the `fsaverage5` mesh, at 1-second (1 Hz) temporal resolution. It was announced 2026-03-26, released under **CC BY-NC-4.0** with weights, code, paper, and a public interactive demo, and was accepted at **ICLR 2026** [source: https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/]. It is the scaled successor to **TRIBE v1**, the Meta FAIR Brain & AI team's 1B-parameter model that won 1st place out of 263 teams at the **Algonauts 2025** brain-encoding competition [source: https://x.com/AIatMeta/status/1954865388749205984]. The lead author is **Jean-Rémi King**, a CNRS research scientist on detachment to Meta where he leads the Brain & AI team [source: https://kingjr.github.io/]. What makes it special: it is the first publicly-shipped foundation model that predicts whole-cortex naturalistic neural response **zero-shot across new subjects, new languages, and new content types**, and demonstrates a **scaling law** that has not yet plateaued [source: https://arxiv.org/html/2507.22229v1]. What it cannot do: read inner monologue, decode private intent, infer felt experience from activation patterns ("reverse inference"), operate below fMRI's seconds-scale temporal resolution, model child/disease/plastic brains, or process smell/touch.

## 2. Canonical references

| Source | Type | Access | Contains |
|---|---|---|---|
| [ai.meta.com — TRIBE v2 announcement (2026-03-26)](https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/) | Meta blog | public | Official 2-minute announcement, headline claim, links to all artifacts |
| [arxiv.org/abs/2507.22229](https://arxiv.org/abs/2507.22229) | Paper (TRIBE v1) | public | Original Algonauts-winning paper, July 2025 |
| [arxiv.org/html/2507.22229v1](https://arxiv.org/html/2507.22229v1) | HTML render of v1 | public | Same content, easier to extract |
| [openreview.net/…/286cdc57ba83dcd3f58821d8bde1e38ca234637c.pdf](https://openreview.net/pdf/286cdc57ba83dcd3f58821d8bde1e38ca234637c.pdf) | ICLR 2026 paper PDF | public | Conference-form camera-ready, "TRIBE: TRIMODAL BRAIN ENCODER" |
| [github.com/facebookresearch/tribev2](https://github.com/facebookresearch/tribev2) | Repo | public, CC BY-NC-4.0 | Inference + training code, README, demo notebook. 2,039★, 462 forks (as of 2026-04-25) |
| [huggingface.co/facebook/tribev2](https://huggingface.co/facebook/tribev2) | Model weights | public, CC BY-NC-4.0 | ~1 GB checkpoint download |
| [aidemos.atmeta.com/tribev2/](https://aidemos.atmeta.com/tribev2/) | Interactive demo | public | Browser demo (no install) |
| [tribe_demo.ipynb](https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb) | Colab notebook | public | End-to-end inference walkthrough |
| [github.com/facebookresearch/tribev2/issues/45](https://github.com/facebookresearch/tribev2/issues/45) | GH issue | public | BrainRank commercial-license inquiry (open, unanswered) |
| [github.com/facebookresearch/tribev2/issues/48](https://github.com/facebookresearch/tribev2/issues/48) | GH issue | public | Reported commercial-license violation by AskKairo.com (closed) |
| [github.com/facebookresearch/tribev2/issues/49](https://github.com/facebookresearch/tribev2/issues/49) | GH issue | public | Byne commercial-license inquiry (open) |
| [Meta Algonauts 2025 win tweet](https://x.com/AIatMeta/status/1954865388749205984) | X post (Aug 2025) | public | Original Algonauts trophy announcement |
| [Meta TRIBE v2 launch tweet](https://x.com/AIatMeta/status/2037153756346016207) | X post (Mar 2026) | public | TRIBE v2 launch thread |
| [algonautsproject.com/2025/challenge.html](https://www.algonautsproject.com/2025/challenge.html) | Competition page | public | Algonauts 2025 rules, dataset, leaderboard |
| [arxiv.org/abs/2508.10784 — Insights from Algonauts 2025 Winners](https://arxiv.org/abs/2508.10784) | Paper (Scotti & Tripathy) | public | Third-party retrospective on competition outcomes |
| [LessWrong: Paper Review TRIBE](https://www.lesswrong.com/posts/JY9fXGzsAv8Pdgmje/paper-review-trimodal-brain-encoder-for-whole-brain-fmri) | Blog review | public | Independent review by "soycarts" — minor critique of explanatory ceiling |
| [Jean-Rémi King — kingjr.github.io](https://kingjr.github.io/) | Personal site | public | Lead author bio, publication list |
| [Cortex (cortex.buzz)](https://www.cortex.buzz/) | Commercial product | public | Third-party SaaS built on TRIBE v2 (status of license unknown) |
| [Ramsøy on Meta TRIBE — Medium](https://medium.com/ai-pragmatist/metas-tribe-and-the-future-of-simulated-consumers-1bf694bcf0e9) | Industry critique | public | Neuromarketing PhD's reverse-inference warning |
| [V-JEPA 2 blog](https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/) | Meta blog | public | 1.2B-param video world-model used as TRIBE v2's video encoder |
| [github.com/facebookresearch/vjepa2](https://github.com/facebookresearch/vjepa2) | Repo | public | V-JEPA 2 weights and code; includes `vit_giant` and `vit_gigantic_384` |
| [huggingface.co/facebook/w2v-bert-2.0](https://huggingface.co/facebook/w2v-bert-2.0) | Model | public, MIT | 600M-param speech encoder; 4.5M hours / 143 languages |
| [huggingface.co/meta-llama/Llama-3.2-3B](https://huggingface.co/meta-llama/Llama-3.2-3B) | Model | gated, Llama 3.2 Community License | 3.21B-param text decoder used as text encoder |
| [Colorado HB24-1058 (neural data)](https://leg.colorado.gov/bills/hb24-1058) | Statute | public | First US neural-data privacy law (eff. 2024-08-07) |
| [Orrick — Colorado neural-data law analysis](https://www.orrick.com/en/Insights/2024/04/Colorado-Enacts-Nations-First-Privacy-Law-to-Protect-Consumer-Brainwaves) | Legal analysis | public | Practitioner summary of HB24-1058 |
| [OHCHR — Nougrères neurotech press release (2025-03)](https://www.ohchr.org/en/press-releases/2025/03/un-expert-calls-for-regulation-of-neurotechnologies-to-protect-right-privacy) | UN press | public | UN Special Rapporteur calls for regulation |
| [OHCHR — A/HRC/58/58 report (Nougrères)](https://www.ohchr.org/en/documents/thematic-reports/ahrc5858-foundations-and-principles-regulation-neurotechnologies-and) | UN report | public | Foundations + principles for regulating neurotechnologies |
| [OHCHR — model-law call (2025-10)](https://www.ohchr.org/en/press-releases/2025/10/un-expert-calls-model-law-neurotechnologies-protect-right-privacy) | UN press | public | Subsequent model-law call |
| [Poldrack 2006 — *TICS*, "Can cognitive processes be inferred from neuroimaging data?"](https://pubmed.ncbi.nlm.nih.gov/16406760/) | Paper | public | Canonical reverse-inference critique |
| [Poldrack 2011 — *Neuron*](https://pmc.ncbi.nlm.nih.gov/articles/PMC3240863/) | Paper | public | Updated formalization w/ Bayesian decoding |

## 3. What it actually does (verified from primary sources)

### 3a. Architecture (three encoders → transformer → linear voxel mapper)

TRIBE v2 is a **trimodal-input, single-output foundation model** that maps a synchronous video+audio+text stream to a predicted whole-cortex BOLD time series. The README states verbatim:

> "TRIBE v2 is a deep multimodal brain encoding model that predicts fMRI brain responses to naturalistic stimuli (video, audio, text). It combines state-of-the-art text, audio and video models into a unified Transformer architecture that maps multimodal representations onto the cortical surface." `[verbatim]` [source: https://github.com/facebookresearch/tribev2]

**The three encoders (frozen feature extractors):**

| Modality | Encoder | Params | Embedding dim | Source |
|---|---|---|---|---|
| Text | **Llama-3.2-3B** | 3.21B | 2,048 (1,024-token context window per paper) | [HF model card](https://huggingface.co/meta-llama/Llama-3.2-3B) |
| Audio | **Wav2Vec-BERT 2.0** (`w2v-bert-2.0`) | 600M | resampled to 2 Hz; dim 1,024 | [HF model card](https://huggingface.co/facebook/w2v-bert-2.0) |
| Video | **V-JEPA 2 Giant** (`vjepa2_vit_giant`) | ≥1.2B (Giant variant) | 1,280 | [V-JEPA 2 GitHub](https://github.com/facebookresearch/vjepa2) |

The demo notebook adds a fourth feature stream — DINOv2 frame embeddings — alongside V-JEPA 2 for the visual stream:

> "Extracts visual features (DINOv2 + V-JEPA2) and audio features (Wav2Vec-BERT) and text features (LLaMA 3.2)" `[verbatim, demo notebook cell 5]` [source: https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb]

**The fusion transformer:** "Transformer encoder (8 layers, 8 attention heads)" operating on a 100-second window, resampled to 1 Hz fMRI frequency [source: https://www.marktechpost.com/2026/03/26/meta-releases-tribe-v2-a-brain-encoding-model-that-predicts-fmri-responses-across-video-audio-and-text-stimuli/]. Modality dropout p = 0.2 during training keeps the model robust when one stream is missing (relevant for the silent-Charlie-Chaplin OOD test) [source: https://arxiv.org/html/2507.22229v1].

**The voxel mapper:** A subject-specific linear prediction block. v1 emitted predictions across **1,000 cortical parcels** (Schaefer atlas); v2 emits onto the **`fsaverage5` cortical surface mesh, ~20,000 vertices per hemisphere** = approximately 20K vertices total across the cortex. Predictions are **offset by 5 seconds in the past** to compensate for the canonical hemodynamic response lag [source: https://github.com/facebookresearch/tribev2].

> ⚠️ **Contradiction with current source 006:** The YouTube transcripts in `006-tribe-v2-meta-trimodal-brain-encoder.md` repeatedly cite "**70,000 voxels**" as TRIBE v2's output resolution, derived from the marketer's "70× resolution increase vs v1's ~1,000 areas." The **primary sources (README, demo notebook, model card) state ~20,000 cortical-surface vertices on `fsaverage5`** — i.e., ~20× resolution increase, not 70×. The Meta blog cites only "70x resolution increase" qualitatively, without specifying the absolute voxel count. The "70,000-voxel" figure may refer to a v2 variant trained on a denser mesh (e.g. `fsaverage6` ≈ 81K vertices) but **the public release defaults to `fsaverage5` with ~20K vertices**. Treat the YouTuber's "70K" figure as marketing summary; treat the README's "~20K vertices" as ground-truth for what the public-release model emits at inference. `[contradiction noted; primary source wins]`

### 3b. Training data

**TRIBE v1** (Algonauts 2025 entry): Courtois NeuroMod CNeuroMod dataset — **4 subjects**, ~80 hours of fMRI per subject (~320 hours total), watching Friends seasons 1–6, *The Bourne Supremacy*, *Hidden Figures*, *Life* (BBC nature doc), *The Wolf of Wall Street* [source: https://www.algonautsproject.com/2025/challenge.html] [source: https://arxiv.org/html/2507.22229v1].

**TRIBE v2** (the public ICLR 2026 release):

> "451.6 hours of fMRI data from 25 subjects across four naturalistic studies (movies, podcasts, and silent videos)" with evaluation across **"1,117.7 hours from 720 subjects."** `[verbatim per MarkTechPost extract of the paper]` [source: https://www.marktechpost.com/2026/03/26/meta-releases-tribe-v2-a-brain-encoding-model-that-predicts-fmri-responses-across-video-audio-and-text-stimuli/]

Meta's own announcement language:

> "more than 700 healthy volunteers who were presented with a wide variety of media, including images, podcasts, videos, and text" `[verbatim]` [source: https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/]
> "TRIBE v2 draws on 500+ hours of fMRI recordings from 700+ people" `[verbatim, X/Twitter launch tweet]` [source: https://x.com/AIatMeta/status/2037153756346016207]

> ⚠️ **Reconcile the numbers:** The training set is ~451.6 h from 25 subjects (the model is *trained* on a small number of heavily-scanned subjects, similar to v1); the broader 720-subject / 1,117 h figure is the **evaluation universe** plus the data the architecture has been benchmarked across. Source 006's "trained on 700 people / 500 h" framing flattens this distinction. Be precise: training-set subject count is ~25 (deeply scanned); generalization is tested across ~720 subjects.

### 3c. Output shape

`(n_timesteps, n_vertices)` where:
- `n_timesteps` = duration of stimulus in seconds (1 Hz, i.e., one prediction per second)
- `n_vertices` ≈ 20,000 on `fsaverage5` cortical surface
- Predictions correspond to BOLD activity offset 5 s into the past (HRF compensation) [source: https://github.com/facebookresearch/tribev2]

### 3d. Performance — explained variance

From the v1 paper (the version that won Algonauts 2025):
- **Algonauts mean encoding score: 0.2146** (Pearson r vs. ground-truth fMRI parcel time series), 1st of 263 teams
- **Per-subject scores:** S1=0.2381, S2=0.2105, S3=0.2377, S5=0.1720
- "Normalized Pearson correlation: **0.54 ± 0.10** across all parcels" — i.e., 54% of explainable variance recovered on average [source: https://arxiv.org/html/2507.22229v1]
- Highest correlation in auditory/language cortices, **near the noise ceiling**
- Trimodal beats best unimodal by ~6 percentage points; in associative cortices, multimodal gives "up to 30% increase in encoding score"

For v2 with finetuning:

> "TRIBE v2 achieved a group correlation (Rgroup) near 0.4, a two-fold improvement over the median subject's group-predictivity. Fine-tuning with one hour of data produced a two- to four-fold improvement over linear models." `[verbatim per MarkTechPost extract]` [source: https://www.marktechpost.com/2026/03/26/meta-releases-tribe-v2-a-brain-encoding-model-that-predicts-fmri-responses-across-video-audio-and-text-stimuli/]

### 3e. Scaling law (the underdiscussed result)

> "Encoding performance increases systematically with training volume (no plateau observed)" `[verbatim summary of paper]` [source: https://arxiv.org/html/2507.22229v1]

The scaling axis is hours of fMRI training data — not tokens, not parameters. The implication (per the paper's discussion) is that brain-encoding accuracy is currently bottlenecked by fMRI dataset size, not by model architecture or compute, and continued data accumulation will keep improving the model log-linearly.

### 3f. In-silico replication of canonical findings

Without targeted training, TRIBE v2 reproduces:
- **Hemodynamic response timing** peak at ~5 s
- **Functional localizers**: FFA for faces, PPA for places, EBA for bodies
- **Language network**: left-hemisphere lateralization, Broca's-area surge for syntactically-complex sentences
- **ICA on the model's last layer recovers** the brain's canonical large-scale functional networks (auditory, language, motion, default-mode, visual)

## 4. Capabilities matrix — in scope vs. out of scope

### In scope (validated)

| Capability | Source |
|---|---|
| Predict group-mean fMRI BOLD response to a video clip (≤ minutes) | Demo notebook, paper |
| Predict response to audio-only stimulus (podcast, music, speech) | Paper, demo notebook |
| Predict response to text passage (text → TTS → audio pipeline) | Demo notebook cell 11–17 |
| Zero-shot prediction for **new subjects never seen in training** | Paper, "Rgroup near 0.4" |
| Zero-shot prediction for **new languages** | Meta announcement |
| Zero-shot prediction for **new content types** (movies → cartoons → silent film, with degradation) | OOD table: 0.32 → 0.19 → 0.17 |
| Fine-tune to a specific subject in **~1 hour of new fMRI data** for 2–4× boost | Paper, blog |
| Visualize predicted activity on `fsaverage5` 3D cortical mesh (PyVista / Nilearn backends) | Demo notebook cell 10 |
| Localize predictions to specific functional networks via ICA on last-layer embeddings | Paper |
| Run modality-ablation experiments (video-only, audio-only, etc.) via modality-dropout-trained model | Paper, model checkpoint |
| Predict response to a 100-second context window per prediction | Paper architecture |

### Out of scope (explicitly disclaimed by primary sources)

| Out-of-scope claim | Why |
|---|---|
| **Decode private inner monologue / unspoken thoughts** | Model is a forward predictor on *external stimuli*, not a decoder of internal state [source: 006 transcript A] |
| **Infer felt experience / emotion / intent from activation pattern** | Reverse inference fallacy (Poldrack 2006) [source: https://pubmed.ncbi.nlm.nih.gov/16406760/] |
| **Predict at sub-second / millisecond resolution** | Output is at fMRI sampling rate (1 Hz / 1 TR ≈ 1 second; v1 used 2 Hz internally for embeddings) |
| **Real-time prediction below the HRF lag** | 5-second hemodynamic offset is structural; not surmountable with this physiological signal |
| **Account for child / developing brain, plasticity, learning** | Trained on adult brains, treated as static [source: paper Limitations] |
| **Account for diseased / atypical brain (aphasia, PTSD, etc.)** | Healthy-adult training distribution; clinical comparison is a *proposed application*, not a validated capability |
| **Smell / touch / proprioception / interoception** | Not in training stimulus modality set |
| **Active behavior / motor output / decision-making** | "Treats the brain as a passive observer instead of an active agent" `[verbatim, paper Limitations]` |
| **Subcortical structures (hippocampus, thalamus, etc.) at near-noise-ceiling accuracy** | "Statistically significant" but markedly weaker than cortical predictions [source: source 006 transcript B] |
| **Voxel-level (sub-mm) localization** | v1 used 1,000 parcels; v2 uses ~20K surface vertices; not millimeter-precise voxels |

## 5. Integration paths (how a hackathon team would use this in 36 hours)

### 5a. Local install path

```bash
# Inference only (smallest)
pip install -e .

# Inference + plotting (PyVista / Nilearn brain renders)
pip install -e ".[plotting]"

# Training stack (PyTorch Lightning, W&B)
pip install -e ".[training]"
```

Python ≥ 3.11 required. Key dependencies (from `pyproject.toml`): `torch>=2.5.1,<2.7`, `numpy==2.2.6`, `transformers`, `huggingface_hub`, `gtts` (for text-to-speech), `moviepy`, `x_transformers`, `einops`, `julius` (audio), `Levenshtein`, `spacy`, `langdetect`, `soundfile`, plus internal `neuralset==0.0.2` and `neuraltrain==0.0.2` packages [source: https://github.com/facebookresearch/tribev2 — `pyproject.toml`].

> **HuggingFace-gated dependency:** The text encoder is Llama-3.2-3B which is gated. The demo notebook explicitly warns: *"NOTE: you will have to request access to the Llama-3.2 model using your HuggingFace account."* `[verbatim, demo cell 7]` [source: https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb]. Approval is usually same-day, but it can block setup.

### 5b. Inference API call shape

```python
from tribev2.demo_utils import TribeModel, download_file
from tribev2.plotting import PlotBrain
from pathlib import Path

CACHE_FOLDER = Path("./cache")

# Load the pretrained model — ~1 GB checkpoint downloaded on first run
model = TribeModel.from_pretrained("facebook/tribev2", cache_folder=CACHE_FOLDER)
plotter = PlotBrain(mesh="fsaverage5")

# Build an "events dataframe" from a video / audio / text input
df = model.get_events_dataframe(video_path="path/to/video.mp4")
# (alternatively: text_path="..." or audio_path="...")

# Run prediction
preds, segments = model.predict(events=df)
print(preds.shape)  # (n_timesteps, n_vertices)  ~ (T_seconds, ~20_000)

# Visualize first 15 seconds
fig = plotter.plot_timesteps(
    preds[:15], segments=segments[:15],
    cmap="fire", norm_percentile=99, vmin=.6,
    alpha_cmap=(0, .2), show_stimuli=True,
)
```

[source: https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb]

### 5c. Input modality requirements

- **Video:** any `moviepy`-readable container (MP4 verified in demo using Blender's *Sintel* trailer 480p).
- **Audio:** auto-extracted from video; speech is auto-transcribed via **WhisperX** to obtain word-level timings before being fed through Llama-3.2 [source: demo notebook cell 5].
- **Text:** auto-converted to speech via **gTTS** (Google Text-to-Speech), then re-transcribed for word-level timing alignment [source: demo notebook cell 11].
- **Max context window:** 100 s per prediction; the model can be run windowed for longer stimuli.
- **Sample rates / resolutions:** Not surfaced in the public API — the model resamples internally (audio → 2 Hz embeddings, video frame-rate handled by V-JEPA 2 preprocessing).

### 5d. Compute requirements

| Phase | Reported requirement | Notes |
|---|---|---|
| Model checkpoint download | ~1 GB | One-time [source: demo notebook cell 3] |
| Demo notebook (inference) | Colab GPU sufficient | Demo explicitly says "Activate the GPU (Menu > Runtime > Change runtime)" `[verbatim, cell 1]` |
| Local inference | GPU (any modern NVIDIA, T4 OK) | Public README does not specify floor |
| Training from scratch | Multi-GPU Slurm cluster | `tribev2/grids/run_cortical.py` and `run_subcortical.py` are designed for Slurm grid search |
| Ensembling at v1 paper | "1,000 models with varied initializations and hyperparameters" | Not needed for inference; only for replication of leaderboard score |

For hackathon: **a single Modal/RunPod A10G or L4 (~$0.50–$1.00/hr)** is sufficient for inference. **No fMRI scanner is required** — the model's value proposition is that it is the predictor; you don't need to scan anyone.

### 5e. Demo-friendly pre-cached scenarios

The Colab demo ships with two:
1. **Sintel trailer (Blender open-source short film)** — 480p MP4, has dialogue + music + visuals
2. **Hamlet "To be or not to be" passage** — 7 lines of text rendered via gTTS

Either is safe (Blender = CC-BY, Shakespeare = public domain) and each runs in ~minutes on a Colab GPU.

### 5f. The fastest path to a "wow toggle"

The 3D `PlotBrain` cortical surface with `cmap="fire"` heatmap is the demo's hero artifact. The visualization shows predicted activity changing second-by-second on a rotating 3D `fsaverage5` brain with the stimulus frame inset. The notebook author's own caption confirms the wow:

> "We see that as the image appears on the screen, the visual cortex lights up (t=4s), followed by the language network when the character starts to speak (t=12s)." `[verbatim, demo notebook cell 9]` [source: https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb]

For a higher-density product surface, the third-party reference is **Cortex (cortex.buzz)**, which renders TRIBE v2's output as "12 metrics that map to specific decisions a creative team actually makes" plus per-second "timeline analysis" and a "dedicated 3D brain view" measuring "neural responses across 20,000 cortical vertices per hemisphere" `[verbatim]` [source: https://www.cortex.buzz/]. (Whether Cortex is licensed for commercial use is unclear — see §6.)

## 6. License + privacy + regulatory surface

### 6a. Meta's published license — CC BY-NC 4.0 (verbatim core terms)

The repo ships [`LICENSE`](https://github.com/facebookresearch/tribev2/blob/main/LICENSE) which is the **Creative Commons Attribution-NonCommercial 4.0 International** text. The operative grant:

> "Subject to the terms and conditions of this Public License, the Licensor hereby grants You a worldwide, royalty-free, non-sublicensable, non-exclusive, irrevocable license to exercise the Licensed Rights in the Licensed Material to: a. reproduce and Share the Licensed Material, in whole or in part, for **NonCommercial purposes only**; and b. produce, reproduce, and Share Adapted Material for **NonCommercial purposes only**." `[verbatim]` [source: LICENSE file, retrieved via GitHub API]

"NonCommercial" defined:

> "NonCommercial means not primarily intended for or directed towards commercial advantage or monetary compensation." `[verbatim]`

The same CC BY-NC 4.0 license attaches to the **HuggingFace weights** at [`facebook/tribev2`](https://huggingface.co/facebook/tribev2) per the repo's badge.

### 6b. Stacked-license matrix (because TRIBE v2 ≠ a single license)

| Component | License | Commercial OK? |
|---|---|---|
| TRIBE v2 weights + code | CC BY-NC 4.0 | **No** (NonCommercial only) |
| Llama 3.2-3B (text encoder) | Llama 3.2 Community License | **Yes** with caveats: "Built with Llama" attribution required; >700M MAU triggers separate Meta license; multimodal-model rights NOT granted to EU-domiciled entities (text-only 3B is not multimodal so EU OK) [source: https://huggingface.co/meta-llama/Llama-3.2-3B] |
| V-JEPA 2 (video encoder) | Per Meta blog: "available for commercial and research applications" | **Yes** (per Meta announcement; verify per-checkpoint LICENSE in `vjepa2` repo for the Giant variant before shipping) |
| Wav2Vec-BERT 2.0 (audio encoder) | MIT | **Yes** [source: https://huggingface.co/facebook/w2v-bert-2.0] |

**Net:** the *trained TRIBE v2 system* is NonCommercial-only, even though three of its four components individually allow commercial use. The CC BY-NC restriction on the fine-tuned weights/architecture controls.

### 6c. Live commercial-licensing chatter on the repo

Three filed issues (as of 2026-04-25) make the licensing surface concrete:

- **[#45 BrainRank](https://github.com/facebookresearch/tribev2/issues/45)** (filed 2026-04-15, **open, unanswered**): Diego Fill of brainrank.ai requests "a commercial license or alternative arrangement that would allow us to offer this as a paid service." Their use case: users upload short-form videos, TRIBE v2 inference runs on RunPod GPU infrastructure, returns neural activation scores. No model modification. Contact: `partnerships@diegofill.com`.
- **[#48 AskKairo violation report](https://github.com/facebookresearch/tribev2/issues/48)** (filed 2026-04-17, **closed**): akbartaimurr alleges AskKairo.com violates CC BY-NC by selling "neural activation heatmaps and Attention Scores for advertisements" behind a paywall at `https://www.askkairo.com/beta/analysis`. Quote: *"By integrating TRIBE v2 into a paid SaaS pipeline, AskKairo has exceeded the scope of the license."* `[verbatim]`
- **[#49 Byne commercial inquiry](https://github.com/facebookresearch/tribev2/issues/49)** (filed 2026-04-17, **open**): Same complainant requests guidance on commercial-license process for their own platform "Byne" — analyzing neural engagement in video content via RunPod-hosted TRIBE v2.

> No Meta legal/research-team response is publicly visible on any of these issues. There is **no published commercial-licensing pathway** — the only artifact is the CC BY-NC license file. This is the load-bearing fact for any team considering monetization.

### 6d. US neural-data privacy law landscape

**Colorado HB24-1058** (effective **2024-08-07**) is the **first US state law to explicitly add "neural data" as a sensitive-data category under a state privacy act** [source: https://leg.colorado.gov/bills/hb24-1058] [source: https://www.orrick.com/en/Insights/2024/04/Colorado-Enacts-Nations-First-Privacy-Law-to-Protect-Consumer-Brainwaves]. Statutory definition: *"Neural data is information that is generated by the measurement of the activity of an individual's central or peripheral nervous systems and that can be processed by or with the assistance of a device."* `[verbatim per legal summary]` Operative requirement: **opt-in consent** before collection or processing, plus data-protection-assessment obligations.

**California followed** with similar amendments to CCPA in 2024 [source: https://www.afslaw.com/perspectives/alerts/california-and-colorado-establish-protections-neural-data].

> **Important nuance for TRIBE v2:** the model does NOT generate or process *measured* neural data from a user — it generates *predicted* neural data from a stimulus the user uploads. Whether the predicted-fMRI output counts as "neural data" under HB24-1058 is **legally untested**. The statute reads "measurement of the activity" — predictions arguably aren't measurements. But a creator-pre-screening product that ingests a user's *content* and outputs the *predicted brain response of an audience* sits in a grey zone: the audience never opted in. Counsel before shipping.

(Source 006 cited the legislation as "SB 205" — that was a search-misfire; the correct citation is **HB24-1058**.)

### 6e. UN — Special Rapporteur Ana Brian Nougrères

The UN Special Rapporteur on the right to privacy has filed two reports flagging neurotechnology:
- **A/HRC/58/58** (2025, presented at HRC 58th session): *Foundations and principles for the regulation of neurotechnologies and the processing of neurodata from the perspective of the right to privacy* [source: https://www.ohchr.org/en/documents/thematic-reports/ahrc5858-foundations-and-principles-regulation-neurotechnologies-and]
- **2025-10 follow-up press release** explicitly calling for an **international model law** on neurotechnologies [source: https://www.ohchr.org/en/press-releases/2025/10/un-expert-calls-model-law-neurotechnologies-protect-right-privacy]

Key verbatim positions (paraphrased extracts from her A/HRC/58/58 report and press releases):

> "Neurodata is highly sensitive personal data, as it is directly related to cognitive state and reflects unique personal experiences and emotions." `[verbatim]`
> "Neurodata constitute windows into the cognitive, emotional, and psychological fabric of the human being." `[verbatim]`
> "Neurodata will not only allow access to what people think, but also manipulate people's brains, leading to a violation of privacy in one's own thoughts and decision-making." `[verbatim]`

[source: https://www.ohchr.org/en/press-releases/2025/03/un-expert-calls-for-regulation-of-neurotechnologies-to-protect-right-privacy]

### 6f. Specific advice for what's safe to demo at a hackathon

- **Safe:** Demo using public-domain or CC-licensed stimuli (Sintel, Shakespeare — both shipped in the demo notebook). Self-as-input. Synthetic content. *Show* TRIBE v2's predictions on the 3D brain.
- **Safe with caveat:** Show predictions for popular ad clips / movie trailers — but do not assert "this WILL make people feel X" (reverse-inference trap; see §7). Use copy like "TRIBE v2 predicts the cortical-response *pattern* this stimulus is likely to evoke."
- **Yellow zone:** Capture audience members' uploaded content and predict response. The content's IP is theirs; the prediction is yours. No measured neural data is collected from anyone, so HB24-1058 likely doesn't bite — but if you market this as a product, get counsel.
- **Red zone:** Anything that implies "we read what you were thinking" or "this is what you felt" — both technically wrong and regulatorily inflammatory.
- **Hard red zone:** Charge anyone for it. The license bars commercial use; the live AskKairo issue (#48) shows Meta is already being asked to enforce.

## 7. Risks + failure modes

### 7a. Reverse inference (Poldrack / Ramsøy)

The single most-cited scientific failure mode. **Russell A. Poldrack, *Trends in Cognitive Sciences* 10(2), 2006**, the canonical critique:

> "There is much interest currently in using functional neuroimaging techniques to understand better the nature of cognition. One particular practice that has become common is 'reverse inference', by which the engagement of a particular cognitive process is inferred from the activation of a particular brain region. Such inferences are not deductively valid, but can still provide some information." `[verbatim]` [source: https://pubmed.ncbi.nlm.nih.gov/16406760/]

> "Cognitive neuroscientists should be circumspect in the use of reverse inference, particularly when selectivity of the region in question cannot be established or is known to be weak." `[verbatim]`

**Thomas Zoëga Ramsøy** (PhD on fMRI, 20+ years of neuromarketing publication) on TRIBE specifically:

> "TRIBE predicts patterns of activation, not psychology or behavior. Interpreting 'this brain region lit up, therefore emotion X happened' is risky." `[verbatim]` [source: https://medium.com/ai-pragmatist/metas-tribe-and-the-future-of-simulated-consumers-1bf694bcf0e9]

> "Movies ≠ the world. TRIBE was trained on people watching movies. That's rich data, but still a limited domain. Predicting brain responses to other stimuli — ads, websites, packaging, or real-world interactions — requires retraining or new datasets." `[verbatim]`

> "The hype cycle will spin this as if TRIBE can predict consumer behavior in general. It cannot — not yet." `[verbatim]`

**Practical implication for a hackathon:** Do not build a UX claim that requires reverse inference (e.g., "this content will make the viewer feel curious"). Build claims that stay on the activation pattern itself (e.g., "this content recruits the visual word-form area more heavily than the comparison").

### 7b. The 46% gap — predictions are plausible-but-wrong

TRIBE v2 explains ~54% of explainable variance at best, in cortical zones near the noise ceiling; **46% remains unpredicted**. In OOD content (cartoons, silent film), the score collapses from 0.32 → 0.17 [source: https://arxiv.org/html/2507.22229v1 OOD table]. Subcortical predictions (hippocampus, thalamus) are statistically significant but weak. **Treat the model's output as a first-pass forecast that's directionally informative for cortical-sensory regions, much weaker for subcortical and high-level associative regions.**

### 7c. Latency stacking

TRIBE v2 inference is GPU-bound and the demo runs second-by-second prediction across a 100-s context window. If you build a multi-agent pipeline (e.g., LLM → TRIBE v2 → another LLM), each stage adds ~seconds. The 5-second HRF offset is structural and cannot be removed.

### 7d. Wifi at demo day (model size)

~1 GB checkpoint. Pre-cache it into your demo machine *before* arriving. If you depend on Llama-3.2 download from HuggingFace at the venue, you'll have a 6 GB pull plus a gated-access auth flow over conference wifi — high risk.

### 7e. Single-point-of-failure on Llama-3.2 access

The demo gates on HuggingFace access approval to `meta-llama/Llama-3.2-3B`. If the auth handshake fails the model cannot be instantiated. Have a backup HuggingFace account with pre-approved access.

### 7f. Out-of-distribution failure modes

The OOD table from the v1 paper (Friends S7 in-dist 0.3195 → silent B&W Charlie Chaplin 0.1686) is the cleanest available benchmark for *how badly* the model degrades on stimuli unlike the training set. If your demo stimulus is structurally unlike Hollywood film + podcast (e.g., abstract art, white noise, raw screen recordings of UIs), expect degraded predictions.

### 7g. Licensing risk at scale

If your demo goes viral or attracts a sponsor's interest in commercializing it, **CC BY-NC bites immediately**. The AskKairo case shows the community will report violations. Have a story for the commercial path (write to Meta legal? rebuild on linear baseline that's CC BY?) before the question is asked at the demo table.

## 8. How TRIBE v2 connects to the AI-paradox theme

### 8a. Inverts trends slop

LLMs output the corpus mean — the "regression to the most-frequent next token" produces the slop that source 003 names. TRIBE v2 inverts this: it does not generate content; it **measures (predicts) what content does to a brain**. Where slop is *content shipped without anyone knowing what it'll evoke*, TRIBE v2 is *the only publicly-available system that lets you check the predicted neural response to a piece of content in software, before deployment.* The architectural bet is: trends slop happens because measurement is missing; TRIBE v2 supplies the measurement.

### 8b. Filter World

Source 002's "Filter World" frames algorithmic feeds as opaque pre-screening of attention. TRIBE v2 is the first **credible candidate for a neural-response filter** — it could, in principle, sit in front of a recommendation pipeline and predict whether the next ten candidate items will produce monotonic, fragmented, or varied cortical-response patterns. Whether anyone would use it that way is a product question, not an engineering one; but the engineering primitive exists.

### 8c. Comprehension debt

The "comprehension debt" thread says: users are accumulating content they did not understand. TRIBE v2 gives the user (or, more defensibly, the *creator*) a **measured answer to "did this content land?"** — not at the level of subjective report, but at the level of predicted cortical-response signature. If the predicted activation pattern shows weak engagement of language and association cortices, the content didn't land in the comprehension sense. This is *one external referent* against which the otherwise-circular self-report of "yes I got it" can be checked.

### 8d. Actor / Auditor / Mediator triad

In source 004's frame, TRIBE v2 is the **auditor's empirical instrument** — the only "external referent" so far that is not another LLM (which would just be the actor checking itself in a mirror). When the auditor has to decide whether to ratify the actor's claim, TRIBE v2 supplies a non-LLM signal grounded in human-brain measurement. This addresses the open tension named **T2 in `500-elicitation-qa-pass.md`** (the un-black-boxing claim needs an external referent; without one, "auditor disagreeing with actor" is just inter-LLM noise). TRIBE v2 is currently the only candidate that the architecture can quote.

## 9. Open questions

- **Does the public `facebook/tribev2` checkpoint emit on `fsaverage5` (~20K vertices) or on the 70K-vertex variant the marketing references?** README + demo confirm `fsaverage5`. No 70K-vertex public checkpoint has been observed. *Resolve before any product claim cites "70,000 voxels."*
- **What is Meta's actual commercial-licensing pathway?** Three issues filed since mid-April 2026; zero responses on the public thread. Is there a dark-channel partnerships email? Has any organization actually obtained a commercial license?
- **Is the predicted-fMRI output legally "neural data" under Colorado HB24-1058?** Statute references "measurement"; predictions are not measurements. Untested.
- **How much does the 25-subject training set bias the model toward the demographic of those 25 subjects?** The CNeuroMod-derived dataset population is small and not demographically described in any source we located.
- **What is the GPU floor for inference?** README does not specify. Demo says "Activate the GPU" without specifying class. Empirical: T4/L4 likely fine for <2-min clips; longer requires testing.
- **What's the gap between v1's reported `0.54 ± 0.10` and v2's reported `Rgroup ≈ 0.4`?** They measure different things (single-subject Pearson vs. group-level Pearson), so they are not directly comparable. Confirm by reading the v2 ICLR paper's Table 1.
- **Why isn't there a `model card` per the Meta usual format?** Other Meta models (V-JEPA 2, Llama 3.2) have full model cards. The `facebook/tribev2` HF page is markedly thin. May reflect either institutional caution or pre-publication state.
- **What follow-up papers cite TRIBE / TRIBE v2?** As of search date (2026-04-25), the closest is "Insights from the Algonauts 2025 Winners" (Scotti & Tripathy, arxiv 2508.10784) which does not explicitly name TRIBE in its abstract. The LessWrong community review (soycarts) is the only public independent commentary we found.
- **Cortex.buzz** is a third-party SaaS shipping TRIBE v2 in production for ad pre-testing — license status unverified. It may itself be in violation. The team is "Srijit Iyer and Adam Abdalla" per the site.
- **What does the auditor agent quote when it disagrees with the actor?** TRIBE v2 outputs are vectors, not claims; consuming them requires another layer of interpretation, which itself requires guarding against reverse inference.

## 10. Verbatim quote vault

> 1. **README headline (Meta FAIR):**
> "TRIBE v2 is a deep multimodal brain encoding model that predicts fMRI brain responses to naturalistic stimuli (video, audio, text). It combines state-of-the-art text, audio and video models into a unified Transformer architecture that maps multimodal representations onto the cortical surface." `[verbatim]` [source: https://github.com/facebookresearch/tribev2]

> 2. **Meta blog headline (2026-03-26):**
> "Introducing TRIBE v2: A Predictive Foundation Model Trained to Understand How the Human Brain Processes Complex Stimuli" `[verbatim]` [source: https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/]

> 3. **Meta blog body (2026-03-26):**
> "our next-gen model that acts as a digital twin of human neural activity … unprecedented speed, accuracy, and a 70x resolution increase as compared to similar models to predict how the brain responds to almost any sight or sound … TRIBE v2 reliably predicts high-resolution fMRI brain activity — enabling zero-shot predictions for new subjects, languages, and tasks." `[verbatim]` [source: https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/]

> 4. **Meta launch tweet (2026-03-26):**
> "Today we're introducing TRIBE v2 (Trimodal Brain Encoder), a foundation model trained to predict how the human brain responds to almost any sight or sound. Building on our Algonauts 2025 award-winning architecture, TRIBE v2 draws on 500+ hours of fMRI recordings from 700+ people." `[verbatim]` [source: https://x.com/AIatMeta/status/2037153756346016207]

> 5. **TRIBE v1 paper abstract (d'Ascoli et al., arXiv 2507.22229):**
> "Historically, neuroscience has progressed by fragmenting into specialized domains, each focusing on isolated modalities, tasks, or brain regions. While fruitful, this approach hinders the development of a unified model of cognition. Here, we introduce TRIBE, the first deep neural network trained to predict brain responses to stimuli across multiple modalities, cortical areas and individuals. … achieving the first place in the Algonauts 2025 brain encoding competition with a significant margin over competitors. Ablations show that while unimodal models can reliably predict their corresponding cortical networks (e.g. visual or auditory networks), they are systematically outperformed by our multimodal model in high-level associative cortices. Currently applied to perception and comprehension, our approach paves the way towards building an integrative model of representations in the human brain." `[verbatim]` [source: https://arxiv.org/html/2507.22229v1]

> 6. **Paper Limitations (verbatim, from the ICLR paper):**
> "First, our approach currently operates on a coarse parcellation of brain areas – reducing hundreds of thousands of voxels to 1,000 cortical parcels. … this approach limits the spatial resolution of our model, which inherently prevents it from capturing highly localized phenomena. … Second, our current approach is limited to fMRI data. … Third, while the volume of recording per participant in the study considered here is particularly large, only four participants were included. … Finally, the present approach remains limited to perception and comprehension." `[verbatim]` [source: https://arxiv.org/html/2507.22229v1]

> 7. **Demo notebook running commentary (cell 9), the closest thing to a hero soundbite:**
> "We see that as the image appears on the screen, the visual cortex lights up (t=4s), followed by the language network when the character starts to speak (t=12s)." `[verbatim]` [source: https://github.com/facebookresearch/tribev2/blob/main/tribe_demo.ipynb]

> 8. **Jean-Rémi King on noise reduction (per source 006 transcript A, attributed quote):**
> "Non-invasive recordings are notoriously noisy and can greatly vary across recording sessions and individuals. Tribe cuts through that." `[verbatim, attribution per YouTuber transcript; not yet verified against a primary King interview]`

> 9. **Poldrack 2006 — the canonical reverse-inference quote:**
> "Such inferences are not deductively valid, but can still provide some information. Its usefulness is particularly limited by the selectivity of activation in the region of interest. … Cognitive neuroscientists should be circumspect in the use of reverse inference, particularly when selectivity of the region in question cannot be established or is known to be weak." `[verbatim]` [source: https://pubmed.ncbi.nlm.nih.gov/16406760/]

> 10. **Ramsøy on TRIBE specifically:**
> "TRIBE predicts patterns of activation, not psychology or behavior. Interpreting 'this brain region lit up, therefore emotion X happened' is risky. … The hype cycle will spin this as if TRIBE can predict consumer behavior in general. It cannot — not yet. … TRIBE is a big deal. It shows that **the simulated consumer is moving from concept to practice**." `[verbatim]` [source: https://medium.com/ai-pragmatist/metas-tribe-and-the-future-of-simulated-consumers-1bf694bcf0e9]

> 11. **CC BY-NC 4.0 LICENSE — operative grant clause (verbatim from the file shipped in the repo):**
> "Subject to the terms and conditions of this Public License, the Licensor hereby grants You a worldwide, royalty-free, non-sublicensable, non-exclusive, irrevocable license to exercise the Licensed Rights in the Licensed Material to: a. reproduce and Share the Licensed Material, in whole or in part, for NonCommercial purposes only; and b. produce, reproduce, and Share Adapted Material for NonCommercial purposes only." `[verbatim]` [source: https://github.com/facebookresearch/tribev2/blob/main/LICENSE]

> 12. **Cortex.buzz product copy (a third-party productionization, license status unverified):**
> "Cortex runs on TRIBE v2, Meta's foundation model for predicting cortical activity from video, audio, and language simultaneously. Trained on fMRI data from 700+ subjects, it maps brain response across 20,000 cortical vertices per hemisphere. … Cortex shows where attention, memorability, and intent are likely to rise or fall so your team can improve the work before it goes live." `[verbatim]` [source: https://www.cortex.buzz/]
