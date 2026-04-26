"use client";

// SLIDE 09 — PROOF content. Persona-aware example demonstrating the
// architecture's value. Re-exports the existing PersonaProofContent +
// the constant right-column BrainBlock visualization.

import { BrainBlock } from "../../components/SlideKit";
import PersonaProofContent from "./PersonaProofContent";

export default function ProofContent() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 enter">
        <PersonaProofContent />
        <div className="lg:col-span-5 justify-self-end">
          <BrainBlock
            variant="activation-pulse"
            seed={904}
            size={460}
            highlight="threat"
          />
        </div>
      </div>
    </>
  );
}
