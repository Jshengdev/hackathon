"use client";

// SLIDE 17 · SIMULATION ARCHITECTURE — visual deep-dive into Stage 2
// Speaker note: NOTES["simulation-architecture"] · Persona-aware: NO
// Content lives in: persona-content/SimulationArchitectureContent.tsx
// Embeds: public/diagrams/simulation-architecture.html
// Pairs with: 15-swarm-architecture (the broader pipeline overview)

import type { Slide } from "../../components/Deck";
import SimulationArchitectureContent from "../persona-content/SimulationArchitectureContent";

const slide: Slide = {
  id: "simulation-architecture",
  render: () => <SimulationArchitectureContent />,
};

export default slide;
