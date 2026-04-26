"use client";

// SLIDE 16 · WEBSITE ARCHITECTURE — visual diagram of the layered tech stack
// Speaker note: NOTES["website-architecture"] · Persona-aware: NO
// Content lives in: persona-content/WebsiteArchitectureContent.tsx
// Embeds: public/diagrams/website-architecture.html

import type { Slide } from "../../components/Deck";
import WebsiteArchitectureContent from "../persona-content/WebsiteArchitectureContent";

const slide: Slide = {
  id: "website-architecture",
  render: () => <WebsiteArchitectureContent />,
};

export default slide;
