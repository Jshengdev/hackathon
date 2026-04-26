"use client";

// SLIDE 13 · PAVILION MAP — sponsor coverage · pre-rendered swap-slides
// Speaker note: NOTES["pavilion-map"] · Persona-aware: NO
// Content lives in: persona-content/PavilionMapContent.tsx

import type { Slide } from "../../components/Deck";
import PavilionMapContent from "../persona-content/PavilionMapContent";

const slide: Slide = {
  id: "pavilion-map",
  render: () => <PavilionMapContent />,
};

export default slide;
