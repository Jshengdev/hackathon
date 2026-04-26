"""Step A / B / C swarm orchestrator.

Step A: 7 parallel K2 calls — one per Yeo network that just spiked.
Step C: moderator synthesis across all observations (step B is implicit in moderator prompt).

Prompts are abbreviated; swap in backend/prompts/<network>.md for full grounded versions.
"""
from __future__ import annotations
import asyncio
import os
import re
import sys
from pathlib import Path

from services.k2_client import K2Client

# Try to load full prompts from backend/prompts/ if available
_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"


_TEMPLATE_ECHOES = (
    "one-sentence call",
    "what's likely happening in this network",
    "low/med/high",
    "what would change your call",
    "low / med / high",
)
_CITE_LINE_RE = re.compile(r"^\s*\[?[A-Z][^.\n]{2,}?\d{4}[^.\n]*?\]?\s*$")
_CONF_PREFIX_RE = re.compile(
    r"^(?:high|medium|med|low)\b[\s,;:]?",
    re.IGNORECASE,
)


def _looks_like_template_echo(line: str) -> bool:
    low = line.lower()
    return any(t in low for t in _TEMPLATE_ECHOES)


def _strip_label(line: str) -> str:
    """Drop a `Label:` or `**Label**:` prefix and surrounding markdown noise."""
    s = line.split(":", 1)[-1] if ":" in line[:40] else line
    return s.strip().lstrip("*").strip().strip("*").strip()


def _parse_observation(text: str) -> dict:
    """Parse 3-line K2 output into {reading, confidence, cite}.

    K2 Think often (a) echoes the prompt template literally inside its
    reasoning, (b) emits unlabeled lines like "High confidence; ..." or
    "[Allen et al. 2022, Nature Neuroscience]", and (c) runs out of token
    budget mid-thought. This parser:
      1. Drops lines that are verbatim echoes of the prompt template
      2. Recognizes labeled OR unlabeled confidence + cite lines
      3. Falls back to the first non-echo, non-confidence, non-cite line
         as `reading` rather than dumping the entire raw blob.
    """
    raw_lines = [l.strip() for l in text.splitlines() if l.strip()]
    # Filter out lines that are verbatim template echoes from the prompt.
    lines = [l for l in raw_lines if not _looks_like_template_echo(l)]
    out = {"reading": "", "confidence": "", "cite": ""}

    candidates: list[str] = []
    for line in lines:
        low = line.lower().lstrip("*").strip()
        if low.startswith(("1.", "**reading**", "reading", "**reading")):
            out["reading"] = _strip_label(line)
        elif low.startswith(("2.", "**confidence", "confidence", "**conf")):
            out["confidence"] = _strip_label(line)
        elif low.startswith(("3.", "**cite", "cite", "**citation", "citation", "source")):
            out["cite"] = _strip_label(line)
        elif _CITE_LINE_RE.match(line) or (line.startswith("[") and line.endswith("]")):
            if not out["cite"]:
                out["cite"] = line.strip("[]").strip()
        elif _CONF_PREFIX_RE.match(line):
            if not out["confidence"]:
                out["confidence"] = line.strip()
        else:
            candidates.append(line)

    if not out["reading"] and candidates:
        # First non-template, non-cite, non-confidence line is the reading.
        out["reading"] = candidates[0]
    if not out["reading"]:
        # Last-resort: stripped raw text without template echoes.
        out["reading"] = " ".join(lines).strip() or text.strip()
    return out

def _load_prompt(network: str) -> str:
    path = _PROMPTS_DIR / f"{network}.md"
    if path.exists():
        return path.read_text()
    return FALLBACK_VOICES.get(network, f"You are the {network} network. React in 1 sentence.")


# Moderator: deliberately *not* loading the rich `papers/prompts/moderator.md`.
# That prompt asks for structured JSON output (mode/valence/summary/boundary/
# flags) plus a long decision rubric. K2 Think is a reasoning model and burns
# its entire token budget reasoning through that rubric, so the swarm UI
# silently shows incomplete output. A one-sentence inline prompt produces
# clean, demo-ready text in ~6-8 s. moderator.md is kept for documentation
# and as a future option if/when we swap to a non-reasoning fallback model.
_MODERATOR_PROMPT = (
    "You are the brain's moderator. Given the network observations and their activation values, "
    "write ONE sentence describing the overall cognitive and affective state. "
    "Stay at the level of mental state, not literal stimulus content. "
    "Mention which network is dominant and whether the pattern is coherent or conflicted."
)

FALLBACK_VOICES: dict[str, str] = {
    "visual":
        "You are the visual cortex. You report what is on the retina — content, not meaning. "
        "React to your activation level in 1 sentence. Name what is likely being seen.",
    "somatomotor":
        "You are the somatomotor cortex (body + auditory edge). "
        "React in 1 sentence. Name the physical sensation or sound you are detecting.",
    "dorsal_attention":
        "You are the dorsal attention network — the spotlight. "
        "React in 1 sentence. Name what attention is deliberately tracking.",
    "ventral_attention":
        "You are the ventral attention network — the alarm. "
        "React in 1 sentence. Note whether something unexpected just happened.",
    "limbic":
        "You are the limbic system. React in 1 sentence. "
        "Describe the emotional valence you are registering.",
    "frontoparietal":
        "You are the frontoparietal control network — the conductor. "
        "React in 1 sentence. Describe the cognitive work being done.",
    "default_mode":
        "You are the default mode network — the narrator. "
        "React in 1 sentence. Describe the narrative or self-referential processing happening.",
}

SPIKE_THRESHOLD = float(os.getenv("SWARM_SPIKE_THRESHOLD", "0.60"))
MAX_NETWORKS_PER_FRAME = int(os.getenv("SWARM_MAX_PARALLEL", "3"))


class Orchestrator:
    def __init__(self):
        self.k2 = K2Client()
        self._last_active: set[str] = set()
        # Cache full prompts at init
        self._prompts: dict[str, str] = {
            name: _load_prompt(name) for name in FALLBACK_VOICES
        }
        self._moderator_prompt: str = _MODERATOR_PROMPT

    async def run_frame(
        self, network_frame: dict, t: int, speech_queue: asyncio.Queue
    ) -> None:
        regions: dict[str, float] = network_frame.get("regions", {})
        if not regions:
            return

        # Optional stimulus snippet (transcript word/sentence) attached by aggregate.py
        stimulus_text: str = network_frame.get("stimulus") or ""

        # Fire only on networks that newly crossed the spike threshold
        now_active = {n for n, v in regions.items() if v > SPIKE_THRESHOLD}
        fired = now_active - self._last_active
        self._last_active = now_active

        if not fired:
            return

        # Step A: parallel network observations (capped to limit cost)
        targets = list(fired)[:MAX_NETWORKS_PER_FRAME]
        tasks: dict[str, asyncio.Task] = {}
        for name in targets:
            system = self._prompts.get(name, FALLBACK_VOICES.get(name, ""))
            user_lines = [
                f"Your activation: {regions.get(name, 0):.2f}.",
                f"Other networks: {', '.join(f'{k}={v:.2f}' for k, v in regions.items() if k != name)}.",
                f"Time: {t}s.",
            ]
            if stimulus_text:
                user_lines.append(f'Stimulus right now: "{stimulus_text}"')
            user = " ".join(user_lines)
            tasks[name] = asyncio.create_task(self.k2.chat(system, user, max_tokens=140))

        observations: dict[str, str] = {}
        for name, task in tasks.items():
            try:
                observations[name] = await task
            except Exception:
                observations[name] = f"[{name}: signal unclear]"

        # Step C: moderator synthesis when ≥2 networks fired
        if len(observations) >= 2:
            obs_lines = "\n".join(f"{k}: {v}" for k, v in observations.items())
            region_str = ", ".join(f"{k}={v:.2f}" for k, v in regions.items())
            user_msg_parts = [f"Network observations at t={t}s:", obs_lines, f"All activations: {region_str}"]
            if stimulus_text:
                user_msg_parts.append(f'Current stimulus: "{stimulus_text}"')
            user_msg = "\n".join(user_msg_parts)
            try:
                moderator_text = await self.k2.chat(self._moderator_prompt, user_msg, max_tokens=240)
                await speech_queue.put({
                    "network": "moderator", "text": moderator_text,
                    "t": t, "type": "moderator",
                })
            except Exception:
                pass

        # Push per-network observations to speech queue
        for name, text in observations.items():
            parsed = _parse_observation(text)
            await speech_queue.put({
                "network": name,
                "text": parsed["reading"],
                "confidence": parsed["confidence"],
                "cite": parsed["cite"],
                "t": t,
                "type": "region",
            })
