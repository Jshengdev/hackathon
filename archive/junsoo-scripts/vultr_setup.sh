#!/usr/bin/env bash
# Bootstrap a fresh Vultr Cloud GPU VM for TRIBE V2 inference.
#
# Run as: bash vultr_setup.sh
#
# Assumes:
#   - Ubuntu 22.04 image with NVIDIA drivers pre-installed (Vultr's
#     "GPU-optimized" image — confirm `nvidia-smi` works before running).
#   - You have an HF token with access to meta-llama/Llama-3.2-3B and
#     facebook/tribev2.
#
# What it does:
#   1. apt-installs python3.11 + venv + git + ffmpeg
#   2. clones TRIBE V2 (or pulls if already present)
#   3. creates a venv at ./venv
#   4. installs TRIBE V2 with [plotting] extras (gives us nilearn for the atlas)
#   5. prompts for `huggingface-cli login`
#   6. copies our adapter scripts (run_inference.py, aggregate.py, atlas.py)
#      next to the cloned repo
#
# After this runs, prefetch the model checkpoints via:
#   bash prefetch.sh
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$HOME/tribe-deploy}"
TRIBE_REPO="${TRIBE_REPO:-https://github.com/facebookresearch/tribev2.git}"

echo "==> Project dir: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "==> Checking GPU"
if ! command -v nvidia-smi >/dev/null 2>&1; then
    echo "ERROR: nvidia-smi not found. Pick a Vultr GPU-optimized image." >&2
    exit 1
fi
nvidia-smi | head -20

echo "==> Installing system deps"
sudo apt-get update -qq
sudo apt-get install -y -qq \
    python3.11 python3.11-venv python3.11-dev \
    git git-lfs \
    ffmpeg \
    build-essential

echo "==> Cloning TRIBE V2"
if [ ! -d tribev2 ]; then
    git clone --depth 1 "$TRIBE_REPO" tribev2
else
    (cd tribev2 && git pull --ff-only)
fi

echo "==> Creating venv"
if [ ! -d venv ]; then
    python3.11 -m venv venv
fi
# shellcheck disable=SC1091
source venv/bin/activate

echo "==> Upgrading pip"
pip install -q --upgrade pip wheel

echo "==> Installing TRIBE V2 (with plotting extras for nilearn)"
pip install -e "./tribev2[plotting]"

echo
echo "==> NEXT STEPS:"
echo "   1. Run: source $PROJECT_DIR/venv/bin/activate"
echo "   2. Run: huggingface-cli login   (paste your HF token)"
echo "   3. Copy run_inference.py, aggregate.py, atlas.py into $PROJECT_DIR"
echo "   4. Run: bash prefetch.sh        (downloads ~7 GB of weights)"
echo "   5. Run: bash infer_pipeline.sh path/to/video.mp4"
