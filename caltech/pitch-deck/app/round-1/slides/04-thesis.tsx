"use client";

// SLIDE 04 · THESIS — the inversion · they use it to manipulate, we reversed it
// Speaker note: NOTES.thesis · Persona-aware: NO
// Content lives in: persona-content/ThesisContent.tsx

import type { Slide } from "../../components/Deck";
import ThesisContent from "../persona-content/ThesisContent";

const slide: Slide = {
  id: "thesis",
  render: () => <ThesisContent />,
};

export default slide;
