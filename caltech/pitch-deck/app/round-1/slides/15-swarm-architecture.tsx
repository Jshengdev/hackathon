"use client";

// SLIDE 15 · SWARM ARCHITECTURE — visual diagram of the 6-stage swarm pipeline
// Speaker note: NOTES["swarm-architecture"] · Persona-aware: NO
// Content lives in: persona-content/SwarmArchitectureContent.tsx
// Embeds: public/diagrams/swarm-architecture.html

import type { Slide } from "../../components/Deck";
import SwarmArchitectureContent from "../persona-content/SwarmArchitectureContent";

const slide: Slide = {
  id: "swarm-architecture",
  render: () => <SwarmArchitectureContent />,
};

export default slide;
