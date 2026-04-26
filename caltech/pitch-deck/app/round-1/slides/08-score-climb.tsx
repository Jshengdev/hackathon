"use client";

// SLIDE 08 · SCORE CLIMB — 8 rounds · the iterative loop hero reveal
// Speaker note: NOTES["score-climb"] · Persona-aware: NO
// Content lives in: persona-content/ScoreClimbContent.tsx

import type { Slide } from "../../components/Deck";
import ScoreClimbContent from "../persona-content/ScoreClimbContent";

const slide: Slide = {
  id: "score-climb",
  render: () => <ScoreClimbContent />,
};

export default slide;
