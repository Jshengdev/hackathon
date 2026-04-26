"use client";

// SLIDE 09 · PROOF — persona-aware example demonstrating the architecture
// Speaker notes: NOTES.proof + NOTES["proof::ironsight"] +
//   NOTES["proof::listen-labs"] + NOTES["proof::best-of-ai"]
// Persona-aware: YES (left column swaps via PersonaProofContent)
// Content lives in: persona-content/ProofContent.tsx

import type { Slide } from "../../components/Deck";
import ProofContent from "../persona-content/ProofContent";

const slide: Slide = {
  id: "proof",
  render: () => <ProofContent />,
};

export default slide;
