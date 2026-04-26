"use client";

// SLIDE 03 · STAKES — three industries, same black box
// Speaker note: NOTES.stakes · Persona-aware: NO
// Content lives in: persona-content/StakesContent.tsx

import type { Slide } from "../../components/Deck";
import StakesContent from "../persona-content/StakesContent";

const slide: Slide = {
  id: "stakes",
  render: () => <StakesContent />,
};

export default slide;
