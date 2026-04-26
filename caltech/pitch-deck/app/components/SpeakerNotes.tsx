"use client";

import { useEffect, useState } from "react";

interface SpeakerNotesProps {
  slideId: string;
  notes: Record<string, string>;
}

export default function SpeakerNotes({ slideId, notes }: SpeakerNotesProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "n" || e.key === "N") {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  const body = notes[slideId] ?? `(no notes for slide: ${slideId})`;

  return (
    <aside
      role="region"
      aria-label="speaker notes"
      className="fixed bottom-0 left-0 right-0 z-[60]"
      style={{
        borderTop: "1px solid var(--hair)",
        background: "color-mix(in srgb, var(--ink) 95%, transparent)",
        color: "var(--warm-cream)",
        maxHeight: "30vh",
        overflowY: "auto",
        padding: "16px 28px 22px",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.18)",
      }}
    >
      <p
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "lowercase",
          color: "var(--accent-soft)",
          marginBottom: 10,
        }}
      >
        speaker notes · {slideId} · press n to toggle
      </p>
      <p
        className="sans"
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--warm-cream)",
          maxWidth: "70ch",
          whiteSpace: "pre-wrap",
        }}
      >
        {body}
      </p>
    </aside>
  );
}

export const NOTES: Record<string, string> = {
  // ── Round 1 (13)
  title:
    "somewhere right now, a manager is looking at a number. thirty minutes. over threshold. and they're about to send a message. they don't know what happened in that room. the action data was right. the decision was wrong. the empathy layer is what closes that gap.",
  hook:
    "somewhere right now, a manager is looking at a number. thirty minutes. over threshold. and they're about to send a message. the slide is silent on purpose — the message hasn't been sent yet, and the judge is the one about to send it.",
  stakes:
    "these aren't different problems. they're the same problem at three layers. ai describes what humans did. it cannot model the cognitive-emotional state underneath the action. managers cut the corners that destroy what their company actually wants. humans are not machines.",
  thesis:
    "the action data was right. the decision was wrong. the empathy layer is what closes that gap. one engine. video in. paragraph out. brain-grounded, falsifiable, never recommends behavior. the empathy layer is what ai gives back when ai augments management decisions instead of replacing them.",
  architecture:
    "qwen3-vl describes the scene observationally. tribe v2 predicts per-second neural response across roughly twenty thousand cortical points. the k2 swarm fans out region-specialist agents, one per brain region, in parallel. claude opus combines vision and brain readings. then the swarm comes back as evaluator. eight rounds. the score climbs.",
  "swarm-detail":
    "seven brain regions. seven k2 specialists. each one reads its region's per-second activation pattern. visual attention sees what the eyes track. threat detection registers cognitive load. default-mode reads the part of her that's her. salience tracking finds the moments that matter. what her brain was doing while she did it.",
  "score-climb":
    "eight rounds of iterative scoring. each round, claude writes a new paragraph describing what the nurse felt. tribe v2 scores it against the actual brain pattern from the footage. round one — generic, low score. round by round, the paragraph rewrites itself toward the brain pattern. — HOLD 4 SECONDS — round one: 0.42. round eight: 0.84. the same protocol that matched clair de lune to 90.4% — run in reverse.",
  proof:
    "same iterative-scoring loop. ran forward last spring: sixty seconds of clair de lune in, text out, 90.4% match in the emotion region across roughly twenty thousand vertices. eight rounds. falsified against triumphant music, rain, and aggressive speech. published, dated, public. the methodology already shipped. we're applying a published method to a problem nobody else has connected it to.",
  "hero-output":
    "the dashboard flagged the visit as over-threshold. cut to ten minutes. the empathy-layer document showed otherwise. her vital-attention signature shifted as she entered the room. for the first twelve minutes her emotional-processing specialist sustained engagement. — pause — she did not rush. she did not check out. she held space. — pause — anchored. not confabulated. the corner-cut doesn't happen.",
  falsification:
    "same nurse. two scenes. patient room consultation: 0.86. routine vitals visit: 0.27. delta of fifty-nine points. the paragraph is anchored to this scene specifically, not generically plausible. same falsification logic as our clair de lune work — falsified against triumphant music, rain, and aggressive speech. the methodology travels.",
  "two-scenarios":
    "same engine. two scenarios. different beneficiaries. the construction worker on scaffolding. maya scrolling reels. the nurse in the patient room. same engine. different input. we surface evidence. the human in the loop judges. that's the yea rubric of best use of ai, enacted in the product itself. manipulation only works in the dark. we turned the lights on.",
  "pavilion-map":
    "one engine. four sponsor closes. ironside — primary five thousand, structurally answered. listen labs — three thousand plus interview, the iterative loop IS the simulation. sideshift — consumer-data agency, know what knows you. yc — the design pattern before the cognitive interface becomes invisible. each pavilion gets its own swap-slide; the master cut is constant.",
  close:
    "humans are not machines. the empathy layer is what ai gives back when ai augments management decisions instead of replacing them. — beat — the action data was right. the decision was wrong. the empathy layer is what closes that gap. that's the whole pitch. thank you.",

  // ── Round 2 (additional IDs not already covered)
  "cold-open":
    "somewhere right now, a manager is looking at a number. thirty minutes. over threshold. and they're about to send a message. they don't know what happened in that room. ai can watch that footage. it can describe every action and tool every second. but it cannot tell you how that person felt doing it. that gap is where bad decisions live. we built the missing layer.",
  "the-gap":
    "a vlm flags a thirty-minute nurse visit as over-threshold. the manager cuts it to ten. the patient was being told they have cancer. action data was right. the decision was wrong. ai describes what humans did. it cannot model the cognitive-emotional state underneath the action. we built the missing layer.",
  "brain-layer":
    "a brain-grounded empathy layer. video in. paragraph out. tribe v2 — meta's brain-encoding model — predicts per-second neural response across twenty thousand cortical points. k2 swarm fans out specialist agents, one per brain region, in parallel. claude opus synthesizes one paragraph. then the iterative-scoring loop from clair de lune, run in reverse — eight rounds. evidence the manager can audit.",
  paragraph:
    "the dashboard would have cut the visit to ten minutes. the document changes the call. for the first twelve minutes her emotional-processing specialist sustained engagement. she was reading the patient's grief, not just monitoring it. — pause — she did not rush. she did not check out. she held space. — pause — similarity 0.86. falsification check 0.27. anchored. not confabulated. the corner-cut doesn't happen.",
  "decision-reverses":
    "the manager doesn't send the message. the patient stays. the nurse stays. — silence — the corner-cut doesn't happen. that's a decision change, not a feature. surface evidence. let the human judge. don't recommend. the architecture enacts the yea rubric — it's not in the pitch deck, it's in the system.",
};
