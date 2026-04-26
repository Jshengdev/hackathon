"use client";

// SLIDE 01 · TITLE — humans are not machines / ai forgot
// Speaker note: NOTES.title · Persona-aware: NO
// Content lives in: persona-content/TitleContent.tsx

import type { Slide } from "../../components/Deck";
import TitleContent from "../persona-content/TitleContent";

const slide: Slide = {
  id: "title",
  render: () => <TitleContent />,
};

export default slide;
