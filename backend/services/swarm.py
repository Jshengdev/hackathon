from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal
import numpy as np

N_WANDERERS = 93
MAX_SPEED = 12.0
SEP_RADIUS = 7.0
COH_RADIUS = 30.0
ACTIVE_RADIUS = 25.0   # mm — wanderer inside this sphere of a hot centroid = active


@dataclass
class Agent:
    id: int
    type: Literal["region", "wanderer"]
    position: np.ndarray
    velocity: np.ndarray
    network: str = ""
    home: np.ndarray = field(default_factory=lambda: np.zeros(3, dtype=np.float32))
    active: bool = False


class SwarmSimulation:
    def __init__(self, brain_mesh):
        self.region_agents: list[Agent] = []
        self.wanderers: list[Agent] = []
        self._brain_mesh = brain_mesh

    @property
    def n_agents(self) -> int:
        return len(self.region_agents) + len(self.wanderers)

    def init_agents(self):
        rng = np.random.default_rng(99)

        # One region agent per Yeo7 network, placed at network centroid
        for i, (name, data) in enumerate(self._brain_mesh.networks.items()):
            centroid = data["centroid"].copy()
            self.region_agents.append(Agent(
                id=i,
                type="region",
                position=(centroid + rng.normal(0, 1.5, 3)).astype(np.float32),
                velocity=np.zeros(3, dtype=np.float32),
                network=name,
                home=centroid.copy(),
            ))

        # Wanderers seeded on random brain surface vertices
        all_verts = self._brain_mesh.vertices
        indices = rng.choice(len(all_verts), size=N_WANDERERS, replace=False)
        for j, idx in enumerate(indices):
            self.wanderers.append(Agent(
                id=len(self.region_agents) + j,
                type="wanderer",
                position=(all_verts[idx] * 1.02).copy(),
                velocity=rng.normal(0, 2.0, 3).astype(np.float32),
            ))

    def update(self, vertex_activations: np.ndarray, brain_mesh) -> dict:
        # Per-network mean activation
        network_act: dict[str, float] = {}
        hot_centroids: list[np.ndarray] = []

        for name, data in brain_mesh.networks.items():
            idxs = data["vertex_indices"]
            mean_act = float(vertex_activations[idxs].mean()) if len(idxs) else 0.0
            network_act[name] = mean_act
            if mean_act > data["activation_threshold"]:
                hot_centroids.append(data["centroid"])

        # Update region agents (spring to home + jitter)
        for ra in self.region_agents:
            ra.active = network_act.get(ra.network, 0.0) > self._brain_mesh.networks[ra.network]["activation_threshold"]
            to_home = ra.home - ra.position
            ra.velocity = (to_home * 0.2 + np.random.randn(3).astype(np.float32) * 0.4)
            ra.position += ra.velocity * 0.1

        # Update wanderers with boids + attraction
        self._update_wanderers(hot_centroids)

        return {"agents": self._agents_list()}

    def _update_wanderers(self, hot_centroids: list[np.ndarray]):
        if not self.wanderers:
            return

        N = len(self.wanderers)
        pos = np.array([a.position for a in self.wanderers], dtype=np.float32)
        vel = np.array([a.velocity for a in self.wanderers], dtype=np.float32)

        # Attraction toward nearest hot centroid
        attraction = np.zeros((N, 3), dtype=np.float32)
        if hot_centroids:
            hp = np.array(hot_centroids, dtype=np.float32)
            for i in range(N):
                diffs = hp - pos[i]
                dists = np.linalg.norm(diffs, axis=1)
                nn = np.argmin(dists)
                d = dists[nn]
                if d > 2.0:
                    attraction[i] = diffs[nn] / (d + 1e-6) * 4.0

        # Separation — push away from nearby wanderers
        separation = np.zeros((N, 3), dtype=np.float32)
        for i in range(N):
            diff = pos - pos[i]
            dists = np.linalg.norm(diff, axis=1)
            mask = (dists > 0) & (dists < SEP_RADIUS)
            if mask.any():
                separation[i] = (-diff[mask] / (dists[mask, None] + 1e-6)).mean(axis=0) * 2.5

        # Cohesion — pull toward local flock centroid
        cohesion = np.zeros((N, 3), dtype=np.float32)
        for i in range(N):
            dists = np.linalg.norm(pos - pos[i], axis=1)
            mask = (dists > 0) & (dists < COH_RADIUS)
            if mask.any():
                cohesion[i] = (pos[mask].mean(axis=0) - pos[i]) * 0.05

        new_vel = vel + attraction + separation + cohesion
        new_vel += np.random.randn(N, 3).astype(np.float32) * 0.3

        speeds = np.linalg.norm(new_vel, axis=1, keepdims=True)
        new_vel = np.where(speeds > MAX_SPEED, new_vel / speeds * MAX_SPEED, new_vel)

        new_pos = pos + new_vel * 0.25

        # Active flag: wanderer is within ACTIVE_RADIUS of any hot region centroid
        active_homes = [ra.home for ra in self.region_agents if ra.active]

        for i, agent in enumerate(self.wanderers):
            agent.position = new_pos[i]
            agent.velocity = new_vel[i]
            agent.active = any(
                np.linalg.norm(agent.position - c) < ACTIVE_RADIUS
                for c in active_homes
            )

    def _agents_list(self) -> list[dict]:
        return [
            {
                "id": a.id,
                "type": a.type,
                "pos": a.position.tolist(),
                "network": a.network,
                "active": a.active,
            }
            for a in self.region_agents + self.wanderers
        ]
