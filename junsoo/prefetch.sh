#!/usr/bin/env bash
# Download all model weights into ./cache so demo-day boot is offline.
#
# Footprint (approximate):
#   - facebook/tribev2          ~1   GB
#   - meta-llama/Llama-3.2-3B   ~6   GB  (gated; needs HF login)
#   - facebook/w2v-bert-2.0     ~1.2 GB
#   - facebook/vjepa2 (giant)   ~5   GB
#   - facebook/dinov2 (vit-l)   ~1   GB
#
# Total: ~15 GB. Make sure you provisioned a disk with headroom.
set -euo pipefail

CACHE_DIR="${CACHE_DIR:-./cache}"
mkdir -p "$CACHE_DIR"

echo "==> Verifying HF login"
if ! huggingface-cli whoami >/dev/null 2>&1; then
    echo "ERROR: not logged in. Run: huggingface-cli login" >&2
    exit 1
fi

echo "==> Verifying gated Llama-3.2-3B access"
if ! huggingface-cli download meta-llama/Llama-3.2-3B --revision main --local-dir-use-symlinks False --quiet README.md >/dev/null 2>&1; then
    echo "ERROR: cannot fetch meta-llama/Llama-3.2-3B." >&2
    echo "Request access at https://huggingface.co/meta-llama/Llama-3.2-3B and retry." >&2
    exit 1
fi

echo "==> Pre-fetching TRIBE V2"
python -c "
from pathlib import Path
from tribev2.demo_utils import TribeModel
TribeModel.from_pretrained('facebook/tribev2', cache_folder=Path('$CACHE_DIR'))
print('TRIBE V2 cached')
"

echo "==> Pre-building Yeo 7-network atlas"
python -c "
from pathlib import Path
from atlas import build_yeo_labels
labels = build_yeo_labels(Path('$CACHE_DIR'), n_networks=7)
print('Atlas labels shape:', labels.shape)
"

echo "==> Done. Cache dir:"
du -sh "$CACHE_DIR"
