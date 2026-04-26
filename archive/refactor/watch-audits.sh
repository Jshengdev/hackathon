#!/usr/bin/env bash
# watch-audits.sh — poll until all 9 audits + 3 deepdives + A9 + R-DOCS prerequisites land.
# Usage: bash refactor/watch-audits.sh [--once]
#
# Prints status lines and the trigger gate state. With --once, runs a single check.

set -e
cd "$(dirname "$0")/.."

REQUIRED_AUDITS=(
  "refactor/audits/A1-prerender-cache.md"
  "refactor/audits/A2-stub-fallbacks.md"
  "refactor/audits/A3-swarm-loop-merge.md"
  "refactor/audits/A4-frontend-empathy-wiring.md"
  "refactor/audits/A5-prd-alignment-master.md"
  "refactor/audits/A6-qa-eval-harness.md"
  "refactor/audits/A7-structure-consolidation.md"
  "refactor/audits/A8-brain-dashboard-redesign.md"
  "refactor/audits/A9-doc-audit-and-cleanup.md"
)

REQUIRED_DEEPDIVES=(
  "refactor/audits/A1-deepdive.md"
  "refactor/audits/A3-deepdive.md"
  "refactor/audits/A4-deepdive.md"
)

check_status() {
  local landed=0
  local total=$((${#REQUIRED_AUDITS[@]} + ${#REQUIRED_DEEPDIVES[@]}))

  echo "── $(date +%H:%M:%S) ──"
  for f in "${REQUIRED_AUDITS[@]}"; do
    if [ -f "$f" ]; then
      printf "✅ %-55s %s lines\n" "$f" "$(wc -l < $f | tr -d ' ')"
      landed=$((landed + 1))
    else
      printf "⏳ %-55s\n" "$f"
    fi
  done
  for f in "${REQUIRED_DEEPDIVES[@]}"; do
    if [ -f "$f" ]; then
      printf "✅ %-55s %s lines\n" "$f" "$(wc -l < $f | tr -d ' ')"
      landed=$((landed + 1))
    else
      printf "⏳ %-55s\n" "$f"
    fi
  done

  echo
  echo "  $landed / $total reports landed"
  if [ "$landed" -eq "$total" ]; then
    echo "  🎯 GATE: READY — orchestrator can start PHASE 0 synthesis."
    return 0
  else
    echo "  ⏳ GATE: NOT READY — $((total - landed)) reports still pending."
    return 1
  fi
}

if [ "$1" = "--once" ]; then
  check_status
  exit $?
fi

# Continuous mode — poll every 60s until READY, then exit 0.
while true; do
  clear
  if check_status; then
    echo
    echo "All reports landed. Come back to the orchestrator and say:"
    echo "  > QA the audits"
    exit 0
  fi
  sleep 60
done
