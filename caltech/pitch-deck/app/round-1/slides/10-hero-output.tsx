"use client";

// SLIDE 10 · HERO OUTPUT — walkable story + AMY chatbot interrogability
// ─────────────────────────────────────────────────────────────────────────────
// Speaker notes: SpeakerNotes.tsx → NOTES["hero-output"] +
//   NOTES["hero-output::ironsight"] + NOTES["hero-output::listen-labs"] +
//   NOTES["hero-output::best-of-ai"]
// Persona-aware: YES (HeroEmpathyCarousel + AmyChat both swap with persona)
//
// Content lives in: persona-content/HeroOutputContent.tsx
// AMY (chatbot) lives in: persona-content/AmyChat.tsx

import type { Slide } from "../../components/Deck";
import HeroOutputContent from "../persona-content/HeroOutputContent";

const slide: Slide = {
  id: "hero-output",
  render: () => <HeroOutputContent />,
};

export default slide;
