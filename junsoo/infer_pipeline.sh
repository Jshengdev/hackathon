#!/usr/bin/env bash
# End-to-end inference: video file -> per-region JSON.
#
# Usage:
#   bash infer_pipeline.sh path/to/video.mp4 [output.json]
#
# Defaults:
#   - atlas: yeo7
#   - cache: ./cache
#   - intermediate preds saved to ./out/preds.npz
set -euo pipefail

VIDEO="${1:?usage: infer_pipeline.sh <video> [out.json]}"
OUT_JSON="${2:-out/activity.json}"
ATLAS="${ATLAS:-yeo7}"
CACHE_DIR="${CACHE_DIR:-./cache}"

# Backend's activity_reader.py reads from this fixed path. Set BACKEND_DATA_DIR
# to "" to skip the copy step (e.g. when running TRIBE on a separate Vultr box).
BACKEND_DATA_DIR="${BACKEND_DATA_DIR:-../_bmad/brain-swarm/backend/data}"

mkdir -p out

echo "==> [1/3] TRIBE V2 inference: $VIDEO"
python run_inference.py \
    --video "$VIDEO" \
    --out out/preds.npz \
    --cache "$CACHE_DIR"

echo "==> [2/3] Aggregating to per-region JSON ($ATLAS)"
python aggregate.py \
    --preds out/preds.npz \
    --segments out/preds.segments.pkl \
    --out "$OUT_JSON" \
    --atlas "$ATLAS" \
    --cache "$CACHE_DIR"

if [ -n "$BACKEND_DATA_DIR" ]; then
    echo "==> [3/3] Handing off to swarm backend at $BACKEND_DATA_DIR"
    mkdir -p "$BACKEND_DATA_DIR"
    cp out/preds.npz "$BACKEND_DATA_DIR/preds.npz"
    cp "$OUT_JSON" "$BACKEND_DATA_DIR/activity.json"
    echo "    copied preds.npz + activity.json"
else
    echo "==> [3/3] Skipped backend handoff (BACKEND_DATA_DIR empty)"
fi

echo
echo "==> Done. JSON: $OUT_JSON"
echo "==> First frame:"
python -c "import json; d=json.load(open('$OUT_JSON')); print(json.dumps(d['frames'][0], indent=2))"
