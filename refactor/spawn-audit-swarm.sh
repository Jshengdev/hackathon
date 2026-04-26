#!/usr/bin/env bash
# spawn-audit-swarm.sh — spin up 5 worktrees + 5 tmux windows, each running a
# fresh Claude CLI on one audit shard. Orchestrator (you) lives in window 0.
#
# Usage:
#   bash refactor/spawn-audit-swarm.sh        # create + spawn all
#   bash refactor/spawn-audit-swarm.sh status # show worktree + window state
#   bash refactor/spawn-audit-swarm.sh kill   # tear down (CAREFUL)
#
# Audit shards (no code changes; each writes refactor/audits/<shard>.md):
#   A1 prerender-cache       A4 frontend-empathy-wiring
#   A2 stub-fallbacks        A5 prd-alignment-master
#   A3 swarm-loop-merge

set -e
REPO="/Users/johnnysheng/code/hackathon"
SESSION="hackathon"

cd "$REPO"

SHARDS=(
  "A1-prerender-cache"
  "A2-stub-fallbacks"
  "A3-swarm-loop-merge"
  "A4-frontend-empathy-wiring"
  "A5-prd-alignment-master"
  "A6-qa-eval-harness"
  "A7-structure-consolidation"
  "A8-brain-dashboard-redesign"
)

cmd="${1:-spawn}"

ensure_session() {
  if ! tmux has-session -t "$SESSION" 2>/dev/null; then
    tmux new-session -d -s "$SESSION" -n "orchestrator" -c "$REPO"
    echo "✅ tmux session '$SESSION' created (window 0: orchestrator)"
  fi
}

spawn_one() {
  local shard="$1"
  local wt="worktrees/${shard}"
  local branch="audit/${shard}"

  if [ -d "$wt" ]; then
    echo "⚠️  worktree already exists: $wt"
  else
    git worktree add "$wt" -b "$branch" 2>&1 | tail -1
    echo "✅ worktree: $wt (branch: $branch)"
  fi

  # Symlink shared context into the worktree root so the spawned Claude
  # finds them at top level.
  ln -sf "$REPO/refactor/CONSTRAINTS.md"        "$wt/CONSTRAINTS.md"
  ln -sf "$REPO/refactor/CONTRACTS.md"          "$wt/CONTRACTS.md"
  ln -sf "$REPO/refactor/shards/${shard}.md"    "$wt/SHARD.md"

  # Mirror the audits dir so the spawned Claude can write its report and the
  # orchestrator can read it from the main checkout.
  ln -sf "$REPO/refactor/audits"                "$wt/audits"

  if tmux list-windows -t "$SESSION" -F '#W' | grep -qx "$shard"; then
    echo "⚠️  tmux window already exists: $shard"
  else
    tmux new-window -t "$SESSION" -n "$shard" -c "$REPO/$wt"
    # Send commands one at a time so the user can see them land
    tmux send-keys -t "$SESSION:$shard" "echo '🚀 spawning Claude for $shard'" Enter
    tmux send-keys -t "$SESSION:$shard" "cat SHARD.md | head -20" Enter
    tmux send-keys -t "$SESSION:$shard" "claude --dangerously-skip-permissions" Enter
    # Don't auto-send the prompt; user reviews + sends. Comment next 2 lines
    # out to make it fully autonomous. Recommended: orchestrator hits Enter
    # in each window to kick off after eyeballing.
    sleep 1
    tmux send-keys -t "$SESSION:$shard" "Step 1: read /Users/johnnysheng/code/hackathon/caltech/NEW-ARCHITECTURE.md (canonical pipeline + locked rules). Step 2: read /Users/johnnysheng/code/hackathon/research/INDEX.md (research navigation). Step 3: read SHARD.md, CONSTRAINTS.md, CONTRACTS.md in this worktree. Step 4: load these skills via Skill tool — superpowers:writing-plans, superpowers:subagent-driven-development, superpowers:using-git-worktrees, superpowers:test-driven-development, superpowers:verification-before-completion, bmad-advanced-elicitation, plus any domain skill listed in your SHARD.md. Step 5: execute the audit using run-test-run discipline (every claim verified by a command you actually ran). Step 6: write your report to audits/${shard}.md. Do NOT modify any source code in backend/ or frontend/. Convert silent stubs into log+surface error payloads (per CONSTRAINTS rule 2) — that IS the refactor signal, not a blocker. If a constraint conflicts with a real demo deadline, flag it as an audit finding. Don't be a blocker. Report status when the audit file is written."
    echo "✅ window: $shard (claude prompt staged; press Enter in window to send)"
  fi
}

case "$cmd" in
  spawn)
    ensure_session
    mkdir -p refactor/audits
    for shard in "${SHARDS[@]}"; do
      spawn_one "$shard"
    done
    echo
    echo "── done ────────────────────────────────────────────────────"
    echo "tmux session: $SESSION ($(tmux list-windows -t $SESSION | wc -l | tr -d ' ') windows)"
    echo "Attach:  tmux attach -t $SESSION"
    echo "Cycle windows: Ctrl-b then n / p"
    echo "Audit reports will land in: refactor/audits/<shard>.md"
    echo "Once all 5 audits land, run:  bash refactor/qa-audit-reports.sh"
    ;;
  status)
    echo "── worktrees ────"
    git worktree list
    echo
    echo "── tmux ────"
    tmux list-windows -t "$SESSION" 2>/dev/null || echo "(no tmux session '$SESSION')"
    echo
    echo "── audits ────"
    ls -la refactor/audits/ 2>/dev/null || echo "(no audits yet)"
    ;;
  kill)
    read -r -p "Tear down tmux session '$SESSION' AND all 5 audit worktrees? (yes/N) " ans
    if [ "$ans" = "yes" ]; then
      tmux kill-session -t "$SESSION" 2>/dev/null || true
      for shard in "${SHARDS[@]}"; do
        git worktree remove "worktrees/${shard}" --force 2>/dev/null || true
        git branch -D "audit/${shard}" 2>/dev/null || true
      done
      echo "✅ torn down"
    else
      echo "aborted"
    fi
    ;;
  *)
    echo "usage: $0 {spawn|status|kill}"
    exit 1
    ;;
esac
