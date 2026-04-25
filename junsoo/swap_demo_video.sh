#!/usr/bin/env bash
# Pick a pre-rendered TRIBE output and install it as the brain-swarm backend's
# active demo data.
#
# Usage:
#   bash swap_demo_video.sh                  # interactive: lists choices, prompts
#   bash swap_demo_video.sh <video_stem>     # non-interactive: e.g. clip1
#   bash swap_demo_video.sh --list           # just list available stems
#   bash swap_demo_video.sh --current        # show what's currently installed
#
# What it does:
#   - validates junsoo/prerendered/<stem>/activity.json against Contract A
#     (yeo7 region keys, frames[], stimulus field optional)
#   - copies it to _bmad/brain-swarm/backend/data/activity.json
#   - prints a summary so you know which clip is now armed for demo
set -euo pipefail

cd "$(dirname "$0")"
JUNSOO_DIR="$(pwd)"
PRERENDERED_DIR="$JUNSOO_DIR/prerendered"
BACKEND_DATA_DIR="$JUNSOO_DIR/../_bmad/brain-swarm/backend/data"
TARGET="$BACKEND_DATA_DIR/activity.json"

REQUIRED_REGIONS=(visual somatomotor dorsal_attention ventral_attention limbic frontoparietal default_mode)

list_stems() {
    find "$PRERENDERED_DIR" -mindepth 2 -maxdepth 2 -name 'activity.json' 2>/dev/null \
        | sed -e "s|$PRERENDERED_DIR/||" -e 's|/activity.json||' \
        | sort
}

show_current() {
    if [ ! -f "$TARGET" ]; then
        echo "No activity.json currently installed at $TARGET"
        return
    fi
    python3 - "$TARGET" <<'PY'
import json, sys
from pathlib import Path
p = Path(sys.argv[1])
try:
    d = json.loads(p.read_text())
except Exception as e:
    print(f"[warn] cannot parse {p}: {e}")
    sys.exit(0)
print(f"Currently installed: {p}")
print(f"  stimulus:    {d.get('stimulus')!r}")
print(f"  atlas:       {d.get('atlas')}")
print(f"  fps:         {d.get('fps')}")
print(f"  n_timesteps: {d.get('n_timesteps')}")
print(f"  size:        {p.stat().st_size / 1024:.1f} KB")
PY
}

validate_json() {
    local json_path="$1"
    python3 - "$json_path" "${REQUIRED_REGIONS[@]}" <<'PY'
import json, sys
from pathlib import Path
path = Path(sys.argv[1])
required = set(sys.argv[2:])

try:
    d = json.loads(path.read_text())
except Exception as e:
    print(f"[FAIL] not valid JSON: {e}")
    sys.exit(1)

errs = []
for key in ("frames", "n_timesteps"):
    if key not in d:
        errs.append(f"missing top-level key: {key!r}")

frames = d.get("frames", [])
if not isinstance(frames, list) or not frames:
    errs.append("frames[] is empty or not a list")
else:
    f0 = frames[0]
    for key in ("t_s", "regions", "top_region"):
        if key not in f0:
            errs.append(f"frames[0] missing key: {key!r}")
    regions = f0.get("regions", {})
    missing = required - set(regions)
    extra   = set(regions) - required
    if missing:
        errs.append(f"frames[0].regions missing networks: {sorted(missing)}")
    if extra:
        # not fatal — yeo17 has more — but warn
        print(f"[warn] frames[0].regions has extra networks (yeo17?): {sorted(extra)}")

if errs:
    print("[FAIL] schema check failed:")
    for e in errs:
        print(f"  - {e}")
    sys.exit(1)

print(f"[ok] schema valid — {len(frames)} frames, "
      f"top region (frame 0): {f0['top_region']!r}, "
      f"stimulus: {f0.get('stimulus', '<none>')!r}")
PY
}

# --- arg dispatch ---

case "${1:-}" in
    --list)
        list_stems
        exit 0
        ;;
    --current)
        show_current
        exit 0
        ;;
    -h|--help)
        sed -n '2,12p' "$0"
        exit 0
        ;;
esac

# Interactive mode if no stem given
STEM="${1:-}"
if [ -z "$STEM" ]; then
    echo "Available pre-rendered videos:"
    mapfile -t STEMS < <(list_stems)
    if [ ${#STEMS[@]} -eq 0 ]; then
        echo "  (none — run colab_prerender.ipynb to generate some)"
        exit 1
    fi
    for i in "${!STEMS[@]}"; do
        printf "  [%d] %s\n" "$((i+1))" "${STEMS[$i]}"
    done
    echo
    show_current
    echo
    read -rp "Pick number (1-${#STEMS[@]}): " idx
    if ! [[ "$idx" =~ ^[0-9]+$ ]] || [ "$idx" -lt 1 ] || [ "$idx" -gt ${#STEMS[@]} ]; then
        echo "ERROR: invalid choice." >&2
        exit 1
    fi
    STEM="${STEMS[$((idx-1))]}"
fi

SRC="$PRERENDERED_DIR/$STEM/activity.json"
if [ ! -f "$SRC" ]; then
    echo "ERROR: $SRC not found." >&2
    echo "Available stems:" >&2
    list_stems | sed 's/^/  /' >&2
    exit 1
fi

echo "==> Validating $SRC"
validate_json "$SRC"

echo "==> Installing to $TARGET"
mkdir -p "$BACKEND_DATA_DIR"
cp "$SRC" "$TARGET"

echo
echo "==> Now armed for demo: $STEM"
show_current
echo
echo "Restart the backend (or it'll re-read on next sim start) to pick this up."
