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

mkdir -p out

echo "==> [1/2] TRIBE V2 inference: $VIDEO"
python run_inference.py \
    --video "$VIDEO" \
    --out out/preds.npz \
    --cache "$CACHE_DIR"

echo "==> [2/2] Aggregating to per-region JSON ($ATLAS)"
python aggregate.py \
    --preds out/preds.npz \
    --segments out/preds.segments.pkl \
    --out "$OUT_JSON" \
    --atlas "$ATLAS" \
    --cache "$CACHE_DIR"

echo
echo "==> Done. JSON: $OUT_JSON"
echo "==> First frame:"
python -c "import json; d=json.load(open('$OUT_JSON')); print(json.dumps(d['frames'][0], indent=2))"
