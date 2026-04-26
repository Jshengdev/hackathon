"use client";

// AMY — the chatbot UI surface for interrogating the empathy document.
// ─────────────────────────────────────────────────────────────────────────────
// Lives below the EmpathyDocument on the hero-output slide. Surfaces unique
// scenario data — the same swarm that wrote the paragraph also answers
// follow-up questions about it.
//
// Persona-aware: YES. The questions + answers swap to match the active
// persona's scenario (construction / reels / design).
//
// Verbatim from yappage:
//   "we're going to make a chat bot of which we have sample questions that
//    you can ask it to clarify exactly how they feel" (Msg 09)
//   "the chatbot ui is what we have as a way to interact with AMY to surface
//    the unique data about the scenario" (Msg 14)
//
// The answers below are pre-baked for the deck. When the backend chat
// endpoint is wired (sample run → AMY response), swap the resolver for a
// real fetch. For now, each click reveals a curated, persona-specific answer.

import { useState } from "react";
import { usePersona, PERSONA_META } from "../../components/Deck";

// AMY's logo. A soft accent ring with three asymmetric dots inside —
// references the seven-region brain swarm condensed into a friendly,
// recognizable cluster. Two "eyes" + one "speaking" dot below center.
// Designed to read as a living listener, not a corporate avatar.
export function AmyLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label="AMY"
    >
      <circle cx="16" cy="16" r="14.5" fill="var(--accent)" />
      <circle cx="11" cy="13" r="2.3" fill="var(--warm-cream)" />
      <circle cx="20.5" cy="13" r="2.3" fill="var(--warm-cream)" />
      <circle cx="15.5" cy="21.5" r="2.1" fill="var(--warm-cream)" opacity="0.85" />
    </svg>
  );
}

type AmyQA = { q: string; a: string };

const AMY_BANK: Record<"construction" | "consumer" | "design", AmyQA[]> = {
  construction: [
    {
      q: "when did the threat-detection peak?",
      a: "it didn't peak — it sustained. threat-detection hit plateau at minute 4 and stayed there for the remaining 36 minutes. that pattern matches continuous vigilance against environmental hazard, not a single startle.",
    },
    {
      q: "what was he calibrating against?",
      a: "memory networks lit up specifically around the second-floor edge. that's recognition. this exact spatial location triggered recall of a prior incident — he's checking against past experience the camera doesn't have.",
    },
    {
      q: "is extending this shift sustainable?",
      a: "no. sustained threat-detection at this intensity produces measurable cortisol elevation. two more hours of the same load produces decision fatigue equivalent to a 12-hour shift in a low-stress role. extending = negative productivity.",
    },
  ],
  consumer: [
    {
      q: "where did her taste flatline?",
      a: "by reel 3, default-mode convergence with the 18-year-old cohort exceeded 78%. by reel 5 it was 92%. the same shaping vector we've measured across thousands of feeds — she's converging to a designed average, not expressing preference.",
    },
    {
      q: "which network is converging fastest?",
      a: "default-mode — the self-referential one. it's collapsing into the cohort pattern fastest. visual cortex is the hardest to converge; it varies person to person. but the part of her that's just *her* is being smoothed.",
    },
    {
      q: "what divergent thought is being suppressed?",
      a: "her salience signal is sharp on emotional triggers, dull on novelty. the thoughts that would distinguish her — the wait-this-is-strange reactions — aren't firing. the algorithm is pre-empting the divergent path.",
    },
  ],
  design: [
    {
      q: "why aren't students learning?",
      a: "by minute 6 the prefrontal began to disengage. that's the network responsible for sustained attention — it's throttling. they're physically present but cognitively gone. the acoustic environment is producing a defensive shutdown.",
    },
    {
      q: "when does the prefrontal disengage?",
      a: "first clear disengagement at 5:42. after each volume rise, a 4–7 second limbic activation — longer than the lecture itself continued. the cumulative load crossed threshold around minute 6. once it disengages, it doesn't come back inside the session.",
    },
    {
      q: "what design fix would you suggest?",
      a: "lower the ambient noise floor by 12–18 dB. stagger high-volume sections instead of clustering them. add 90-second decompression intervals after acoustic peaks. predicted recovery of prefrontal engagement: 65–80%.",
    },
  ],
};

export default function AmyChat() {
  const { persona } = usePersona();
  const exampleKey = PERSONA_META[persona].heroExampleKey;
  const bank = AMY_BANK[exampleKey];
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Reset to first answer when persona swaps so the panel always shows
  // something relevant to the current scenario.
  const safeIdx =
    activeIdx === null || activeIdx >= bank.length ? null : activeIdx;
  const showing = safeIdx === null ? null : bank[safeIdx];

  return (
    <div
      className="surface-card flex flex-col gap-4 max-w-2xl"
      style={{ padding: "20px 24px" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AmyLogo size={28} />
          <div className="flex flex-col">
            <span
              className="mono ink"
              style={{ fontSize: 13, lineHeight: 1, fontWeight: 600 }}
            >
              amy
            </span>
            <span
              className="kicker"
              style={{ fontSize: 9, lineHeight: 1.2, marginTop: 2 }}
            >
              empathy-layer assistant
            </span>
          </div>
        </div>
        <span className="kicker" style={{ color: "var(--accent)" }}>
          interrogate the document →
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {bank.map((qa, i) => {
          const isActive = safeIdx === i;
          return (
            <button
              key={qa.q}
              type="button"
              onClick={() => setActiveIdx(isActive ? null : i)}
              className="text-left transition-colors"
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${
                  isActive ? "var(--accent)" : "var(--oat-border)"
                }`,
                background: isActive
                  ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                  : "transparent",
                color: isActive ? "var(--accent)" : "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                lineHeight: 1.3,
                cursor: "pointer",
              }}
            >
              {qa.q}
            </button>
          );
        })}
      </div>

      {showing ? (
        <div
          className="flex flex-col gap-2 enter"
          style={{
            paddingTop: 12,
            borderTop: "1px solid var(--hair)",
          }}
        >
          <p className="kicker" style={{ color: "var(--accent)" }}>
            amy answers
          </p>
          <p className="serif text-sm md:text-base ink leading-relaxed">
            {showing.a}
          </p>
        </div>
      ) : (
        <p
          className="kicker"
          style={{
            color: "var(--warm-charcoal)",
            opacity: 0.55,
            paddingTop: 8,
          }}
        >
          tap a question to surface scenario-specific data.
        </p>
      )}
    </div>
  );
}
