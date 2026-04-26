#!/bin/bash
# tmux-spawn-all.sh — orchestration script for the 14-Claude packaging swarm
# Spawn pattern: git worktree add + tmux new-window per worktree
#
# Usage:
#   ./tmux-spawn-all.sh tier1   # Build/execution worktrees (Friday-Saturday morning)
#   ./tmux-spawn-all.sh tier2   # Packaging worktrees (Saturday afternoon)
#   ./tmux-spawn-all.sh all     # Both tiers
#   ./tmux-spawn-all.sh status  # Show current worktree state
#   ./tmux-spawn-all.sh cleanup # Tear down all spawned worktrees (CAREFUL)

set -e
REPO=/Users/johnnysheng/code/hackathon
SESSION=hackathon

cd "$REPO"

spawn_worktree() {
  local name=$1
  local branch=$2
  local epic_path=$3

  if [ ! -d ".worktrees/$name" ]; then
    git worktree add ".worktrees/$name" -b "$branch" 2>/dev/null || git worktree add ".worktrees/$name"
    echo "✅ Worktree created: .worktrees/$name (branch: $branch)"
  else
    echo "⚠️  Worktree exists: .worktrees/$name"
  fi

  # Symlink the epic spec for the spawned Claude to read on first invocation
  if [ -n "$epic_path" ]; then
    ln -sf "$epic_path" ".worktrees/$name/EPIC.md" 2>/dev/null || true
    echo "   📎 EPIC.md → $epic_path"
  fi
}

spawn_tmux_window() {
  local name=$1
  local cmd=$2

  if ! tmux has-session -t "$SESSION" 2>/dev/null; then
    tmux new-session -d -s "$SESSION" -n orchestrator
    tmux send-keys -t "$SESSION:orchestrator" "cd $REPO && echo 'Orchestrator pane ready. Coordinate from here.'" C-m
  fi

  tmux new-window -t "$SESSION" -n "$name" -c "$REPO/.worktrees/$name"
  tmux send-keys -t "$SESSION:$name" "$cmd" C-m
  echo "🪟 tmux window: $name"
}

tier1() {
  echo "=== TIER 1: Build / Execution worktrees ==="
  spawn_worktree junsoo-tribe       junsoo/tribe-pipeline    "$REPO/caltech/tasks-by-person/junsoo-tribe-v2.md"
  spawn_worktree jacob-swarm        jacob/k2-swarm           "$REPO/caltech/tasks-by-person/jacob-agent-swarms.md"
  spawn_worktree johnny-vis-brain   johnny/vis-brain         "$REPO/caltech/tasks-by-person/johnny-orchestration.md"
  spawn_worktree johnny-vis-graph   johnny/vis-graph         "$REPO/caltech/tasks-by-person/johnny-orchestration.md"
  spawn_worktree johnny-orch-glue   johnny/orch-glue         "$REPO/caltech/tasks-by-person/johnny-orchestration.md"

  spawn_tmux_window junsoo-tribe      "echo 'cat EPIC.md to begin Junsoo TRIBE pipeline'; cat EPIC.md | head -50"
  spawn_tmux_window jacob-swarm       "echo 'cat EPIC.md to begin Jacob K2 swarm'; cat EPIC.md | head -50"
  spawn_tmux_window johnny-vis-brain  "echo 'cat EPIC.md to begin vis-brain (Johnny C-A)'; cat EPIC.md | head -50"
  spawn_tmux_window johnny-vis-graph  "echo 'cat EPIC.md to begin vis-graph (Johnny C-B)'; cat EPIC.md | head -50"
  spawn_tmux_window johnny-orch-glue  "echo 'cat EPIC.md to begin orchestration glue (Johnny C-C)'; cat EPIC.md | head -50"
}

tier2() {
  echo "=== TIER 2: Packaging worktrees ==="
  spawn_worktree pkg-devpost        pkg/devpost              "$REPO/caltech/research-context/008-devpost-exemplars-mindpad-terralink.md"
  spawn_worktree pkg-demo-video     pkg/demo-video           "$REPO/caltech/narration-script-3min.md"
  spawn_worktree pkg-brand-system   pkg/brand                "$REPO/caltech/tier-2-epics/pkg-brand-system.md"
  spawn_worktree pkg-pitch-deck     pkg/pitch-deck           "$REPO/caltech/tier-2-epics/pkg-pitch-deck.md"
  spawn_worktree pkg-landing-page   pkg/landing              "$REPO/caltech/tier-2-epics/pkg-landing-page.md"
  spawn_worktree pkg-social-content pkg/social               "$REPO/caltech/tier-2-epics/pkg-social-content.md"
  spawn_worktree pkg-tech-writeup   pkg/tech-writeup         "$REPO/caltech/tier-2-epics/pkg-tech-writeup.md"
  spawn_worktree pkg-faq-script     pkg/faq                  "$REPO/caltech/prd.md"
  spawn_worktree pkg-runbook        pkg/runbook              "$REPO/caltech/demo-script.md"

  spawn_tmux_window pkg-devpost        "echo 'cat EPIC.md (devpost exemplars + PRD §1-§6); claude'"
  spawn_tmux_window pkg-demo-video     "echo 'cat EPIC.md (3-min narration script); claude'"
  spawn_tmux_window pkg-brand-system   "echo 'cat EPIC.md (brand system spec); claude'"
  spawn_tmux_window pkg-pitch-deck     "echo 'cat EPIC.md (pitch deck spec); claude'"
  spawn_tmux_window pkg-landing-page   "echo 'cat EPIC.md (landing page spec); claude'"
  spawn_tmux_window pkg-social-content "echo 'cat EPIC.md (social content spec); claude'"
  spawn_tmux_window pkg-tech-writeup   "echo 'cat EPIC.md (Junsoo PhD-app paper spec); claude'"
  spawn_tmux_window pkg-faq-script     "echo 'cat EPIC.md (PRD §8 has FAQ scaffold); claude'"
  spawn_tmux_window pkg-runbook        "echo 'cat EPIC.md (demo-script.md is the runbook source); claude'"
}

status() {
  echo "=== Worktree status ==="
  git worktree list
  echo
  echo "=== tmux session status ==="
  tmux list-windows -t "$SESSION" 2>/dev/null || echo "No active session: $SESSION"
}

cleanup() {
  echo "⚠️  This will tear down all .worktrees/ entries and the tmux session."
  read -p "Are you sure? (yes/no): " confirm
  if [ "$confirm" = "yes" ]; then
    git worktree list | grep ".worktrees/" | awk '{print $1}' | while read wt; do
      git worktree remove "$wt" --force 2>/dev/null || true
    done
    tmux kill-session -t "$SESSION" 2>/dev/null || true
    echo "✅ Cleanup complete."
  else
    echo "Aborted."
  fi
}

case "${1:-}" in
  tier1) tier1; tmux attach -t "$SESSION" ;;
  tier2) tier2; tmux attach -t "$SESSION" ;;
  all)   tier1; tier2; tmux attach -t "$SESSION" ;;
  status) status ;;
  cleanup) cleanup ;;
  *)
    echo "Usage: $0 {tier1|tier2|all|status|cleanup}"
    echo ""
    echo "  tier1   Spawn 5 build worktrees (Junsoo / Jacob / 3x Johnny)"
    echo "  tier2   Spawn 9 packaging worktrees (Devpost / video / brand / deck / landing / social / tech / FAQ / runbook)"
    echo "  all     Both tiers"
    echo "  status  Show current worktree + tmux state"
    echo "  cleanup Tear down everything"
    exit 1
    ;;
esac
