"""Step A / B / C swarm orchestrator.

Step A: 7 parallel K2 calls — one per Yeo network that just spiked.
Step C: moderator synthesis across all observations (step B is implicit in moderator prompt).

Prompts are abbreviated; swap in junsoo/papers/prompts/<network>.md for full grounded versions.
"""
from __future__ import annotations
import asyncio
import sys
from pathlib import Path

from services.k2_client import K2Client

# Try to load full prompts from Junsoo's papers/prompts/ if available
_PROMPTS_DIR = Path(__file__).parents[4] / "junsoo" / "papers" / "prompts"

def _load_prompt(network: str) -> str:
    path = _PROMPTS_DIR / f"{network}.md"
    if path.exists():
        return path.read_text()
    return FALLBACK_VOICES.get(network, f"You are the {network} network. React in 1 sentence.")


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

MODERATOR_SYSTEM = (
    "You are the brain's moderator. Given 7 network observations and their activation values, "
    "write ONE sentence describing the overall cognitive and affective state. "
    "Stay at the level of mental state, not literal stimulus content. "
    "Mention which network is dominant and whether the pattern is coherent or conflicted."
)

SPIKE_THRESHOLD = 0.60   # only send to K2 when network exceeds this
MAX_NETWORKS_PER_FRAME = 3  # cap parallel K2 calls per tick


class Orchestrator:
    def __init__(self):
        self.k2 = K2Client()
        self._last_active: set[str] = set()
        # Cache full prompts at init
        self._prompts: dict[str, str] = {
            name: _load_prompt(name) for name in FALLBACK_VOICES
        }

    async def run_frame(
        self, network_frame: dict, t: int, speech_queue: asyncio.Queue
    ) -> None:
        regions: dict[str, float] = network_frame.get("regions", {})
        if not regions:
            return

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
            user = (
                f"Your activation: {regions.get(name, 0):.2f}. "
                f"Other networks: {', '.join(f'{k}={v:.2f}' for k, v in regions.items() if k != name)}. "
                f"Time: {t}s."
            )
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
            user_msg = f"Network observations at t={t}s:\n{obs_lines}\nAll activations: {region_str}"
            try:
                moderator_text = await self.k2.chat(MODERATOR_SYSTEM, user_msg, max_tokens=240)
                await speech_queue.put({
                    "network": "moderator", "text": moderator_text,
                    "t": t, "type": "moderator",
                })
            except Exception:
                pass

        # Push per-network observations to speech queue
        for name, text in observations.items():
            await speech_queue.put({"network": name, "text": text, "t": t, "type": "region"})
