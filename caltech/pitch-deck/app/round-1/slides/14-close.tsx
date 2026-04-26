"use client";

// SLIDE 14 · CLOSE — humanity stake · persona-aware tagline
// Speaker notes: NOTES.close + NOTES["close::ironsight"] +
//   NOTES["close::listen-labs"] + NOTES["close::best-of-ai"]
// Persona-aware: YES (PersonaCloseTagline swaps the middle paragraph)
// Content lives in: persona-content/CloseContent.tsx

import type { Slide } from "../../components/Deck";
import CloseContent from "../persona-content/CloseContent";

const slide: Slide = {
  id: "close",
  render: () => <CloseContent />,
};

export default slide;
