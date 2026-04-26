"use client";

// Persona-aware tagline used on the close slide. Reads
// `PERSONA_META[persona].closeTagline` so each audience hears the close
// in their own register.

import { usePersona, PERSONA_META } from "../../components/Deck";

export default function PersonaCloseTagline() {
  const { persona } = usePersona();
  return (
    <p className="sans text-base md:text-xl ink max-w-3xl leading-relaxed mt-2">
      {PERSONA_META[persona].closeTagline}
    </p>
  );
}
