# Pre-rendered TRIBE V2 outputs

One subdirectory per demo stimulus. The brain-swarm backend reads `activity.json` files from here for canned demo playback (no live GPU required at demo time).

## Layout

```
prerendered/
├── README.md                          # this file
├── example_clip/                      # hand-authored example showing all 4 committed file shapes
│   ├── activity.json                  # Contract A — per-second 7-network activations
│   ├── action_segments.json           # manual: [{start_t, end_t, action}, ...]
│   ├── per_action_activations.json    # output of report_card/aggregate_per_action.py
│   └── ironside_report.json           # output of report_card/run_report_card.py
└── <real_video_stem>/                 # populated by colab_prerender.ipynb + report_card pipeline
    ├── activity.json                  # committed
    ├── action_segments.json           # committed (hand-annotated)
    ├── per_action_activations.json    # committed
    ├── ironside_report.json           # committed (the demo artifact)
    # preds.npz, preds.segments.pkl stay on Drive — too big, gitignored
```

`example_clip/` shows within-subject contrast: routine actions (low cognitive_load, focused) vs. novel overhead drilling (high cognitive_load, deliberating). Use it as the visual reference for what the pipeline produces.

## How files get here

Two-stage pipeline:

**Stage 1 — TRIBE → activity.json** (Colab):
1. Run `../colab_prerender.ipynb` end-to-end on Colab → `MyDrive/tribe/prerendered/<stem>/activity.json`
2. Download the `activity.json` (notebook cell 9 zips them) → unzip into `junsoo/prerendered/<stem>/`
3. Hand-annotate `action_segments.json` (watch the video; mark start/end of each action)

**Stage 2 — activity.json → ironside_report.json** (local, needs `K2_API_KEY`):
4. `python3 -m junsoo.report_card.aggregate_per_action --activity .../activity.json --segments .../action_segments.json --out .../per_action_activations.json`
5. `python3 -m junsoo.report_card.run_report_card --activations .../per_action_activations.json --out .../ironside_report.json`
6. `git add junsoo/prerendered && git commit`

Or run `make -C junsoo run-fixture` to see the full pipeline against the example fixture (no real video required).

## How the swarm consumes these

For demo, copy the chosen file into the backend's expected path:

```bash
cp junsoo/prerendered/<video_stem>/activity.json \
   _bmad/brain-swarm/backend/data/activity.json
```

Or set `BACKEND_DATA_DIR` when re-running `infer_pipeline.sh` to write directly there.

The schema is locked in `../swarm_contract.md` (Contract A). If you regenerate, validate against `../smoke_test.py` before committing.

## Why pre-render at all

- **Demo reliability:** live GPU inference at a hackathon demo is a known failure mode (network, cold start, OOM). Canned `activity.json` makes the demo deterministic.
- **Vultr deposit gate:** Vultr requires $50 real-money deposit for new GPU accounts. Pre-rendering on Colab free-tier sidesteps that.
- **Tech B/C unblock:** swarm/moderator lanes can dev against real activations instead of synthetic frames.
