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
    "ai right now is a black box. it sells you the convenience of personalization at the cost of your privacy and eventually your humanity. the things you consume aren't even things you choose anymore — you converge to the best average they engineered for. — concrete: writers using chatgpt all become the same essay writer. a manager chatgpts the best way to organize their team and slots every worker into the same one-size-fits-all box. you can't see any part of the machinery. corporations have the ability to manipulate the way you work to maximize and cheat the system. — that's the question we wanted to answer: why does AI technology have to be this way? why does instagram keep its algorithms gatekept? why can't spotify tell you how it recommends? why can't you see what's being fed to you? — we built the inverse.",
  stakes:
    "three industries with the same gap. — design / taste: everything based on how you feel, how your mood is, how the brain fires in a specific environment. design and packaging shape thought. we ship environments blind to what they do to humans. — construction: managers optimize for sheer productivity. when we ran the footage through the model we discovered which parts of the brain fired most often — they map to higher cortisol, sustained stress. the best way to treat workers isn't to optimize their time, it's to optimize their emotions. better humans, better managers, win-win. — consumer: platforms have engineered which parts of your brain fire to keep you on the platform. there's no way for you to see those weights, let alone adjust them. we democratize that access. — same engine. three industries. one missing layer.",
  thesis:
    "the inversion. corporations already use brain-encoding research to maximize engagement — they score whether content fires the exact regions tied to high cravings, then push more of it. we ran the same machinery in reverse. to understand humans, not hijack them. — this is how we re-evaluate using AI sustainably and ethically. not racing to automate every task that's inherently based on human creativity. not letting it take control over everything. — name the category here: biological signal as operational data. the first time cortical activation becomes a feedback layer on decisions that were previously made on action data alone. — ai is not meant to replace human thinking. it's meant to augment it. the human data layer was the missing piece.",
  "tribe-v2":
    "the unlock. tribe v2 is a model from meta fair — the same research lab that builds llama. they trained it on real brain recordings from about 25 human subjects across thousands of hours of video. you feed it any video, sound, or text, and it predicts the brain pattern that brain would have produced. roughly 20,000 cortical points across the cortex per second. — no scanner needed. open-source on huggingface. the same machinery corporations are already using to optimize content for engagement, just sitting there in public. — for the first time, every video has a brain attached to it. that's the only reason any of this works. our role: we inverted it.",

  architecture:
    "qwen3-vl describes the scene observationally. tribe v2 predicts per-second neural response across roughly twenty thousand cortical points. — disclosure here, not later: we run tribe offline. pre-baked. reproducibility, not shortcut. — the k2 swarm fans out region-specialist agents, one per brain region, in parallel. then the same swarm comes back as moderator and again as evaluator. — name the architectural virtue: k2 in three roles on one surface. specialist, moderator, evaluator. one low-latency model handles the whole loop without multi-vendor coordination. — eight rounds. the score climbs. total cost per clip: about three cents.",
  "swarm-detail":
    "seven brain regions. seven k2 specialists. we used k2 because of its fast throughput and its low hallucination rate — both load-bearing. each agent represents one part of the cortex. the brain encoder returns json numbers — raw activation values per region. how we make those numbers mean anything is the work — we surfaced research papers on neuroscience, mapped each number to its semantic role, ingested the mapping through a python file that brings semantic variation back to the activation. that's how we got from numbers to reasoning. then we deploy the seven specialists to communicate with each other and with the source video — round 1, round 2, round 3, round 4 — until the paragraph scores against the brain signal. higher signals interact more. bias gets stripped. the paragraph emerges.",
  "score-climb":
    "eight rounds of iterative scoring. each round, claude writes a new paragraph describing what the nurse felt. tribe v2 scores it against the actual brain pattern from the footage. round one — generic, low score. round by round, the paragraph rewrites itself toward the brain pattern. — HOLD 4 SECONDS — round one: 0.42. round eight: 0.84. the same protocol that matched clair de lune to 90.4% — run in reverse.",
  proof:
    "the construction example. the vision model alone described 'worker walked across platform, paused, continued' — flat. with the cortical layer added, the same scene resolves: threat-detection peaked for 40 minutes straight. sustained cognitive load. the camera couldn't see the hazard; the brain pattern did. — spatial intelligence isn't more pixels. it's a new modality layered onto the camera. the worker's experience becomes spatial data the LLM can reason about.",

  "proof::listen-labs":
    "the un-blackboxing example. five reels in, by reel three the user's default-mode network — the part that's just THEM — is firing in the convergent pattern of ten thousand other 18-year-olds. the algorithm steers everyone toward a shared average. the user has stopped contributing to their own taste. — this is what 'simulating humanity' looks like when it's grounded in brains, not text. neurons fire. the loop iterates. and for the first time, the user can SEE the loop they've been inside. that's the autonomy we just handed back.",

  "proof::best-of-ai":
    "the design / taste example. taste is the one skill that persists beyond ai — but only if it's accessible. — feed the engine a reference: a video of autumn leaves, something smooth, the FEELING you want your design to carry. then feed it your draft. the cosine similarity between the two brain patterns tells you whether your work lands the way you intended — before any human sees it. — ai stops generating-for-you and starts simulating-for-you. you keep the divergent thought. the engine becomes the mirror, not the maker.",
  "hero-output":
    "the empathy layer turns the brain reading into a story you can walk through yourself. you still get everything you would have gotten — actions, duration, flag — but now you can put yourself in their shoes. — the document is interrogable: 'when did the stress peak?' 'what were they avoiding?' the same swarm answers because emotions communicate through semantic relationships. — — ← → at the deck level swaps audience emphasis (best-of-ai / ironsight / listen-labs); the example simulation auto-matches the persona. anchored. not confabulated.",

  "hero-output::ironsight":
    "the construction example. 40 minutes on a site walk. action data flagged it 'slow.' but the empathy layer shows threat-detection sustained at peak the entire time, attention narrowed, memory networks lit up around an edge the worker recognized as a prior incident spot. — the worker isn't slow. the worker is calibrating against an environment the camera couldn't see. extending this shift is not a productivity gain. — this is the empowerment gap closed: a manager finally has the data to treat the worker as a human, not a productivity number. win-win for everyone.",

  "hero-output::listen-labs":
    "the consumer example. Maya, 17, scrolling instagram. five reels — by reel three her default-mode network is firing in the same convergent pattern as 10,000 other 18-year-olds we've sampled. the algorithm is steering toward a shared average. she has stopped contributing to her own taste. — this is the simulation listen labs is asking for. not personas in text. neurons firing. thought-paths visible. and for the first time the user can SEE the loop they're inside and step out of it. that's the autonomy we just made available again.",

  "hero-output::best-of-ai":
    "the design / taste example. a 90-second clip of a loud professor. visual saw 'students sitting still in a lecture hall.' the empathy layer shows ventral attention spiking with each volume rise, limbic system staying activated 4-7 seconds after each peak, prefrontal disengaging entirely by minute 6 — students were in the room but no longer learning. — this isn't bad teaching. it's bad design. — taste is the one skill that persists beyond ai, but only if it's accessible. our engine makes feeling measurable so designers can ship environments that don't accidentally hijack the people who use them.",
  falsification:
    "same subject. two scenes. main scene: 0.86 cosine similarity to its own brain pattern. control scene: 0.27 against the wrong scene's pattern. delta of fifty-nine points. the paragraph belongs to THIS scene specifically — not generically plausible. that's the falsification — within-subject, no population norms, just geometry. cosine distance doesn't lie.",
  "two-scenarios":
    "the example. if the action we tracked looked like laziness — duration over threshold, flag — we might think the worker is being lazy. but if we had reviewed the footage and seen what they were seeing, we would have noticed a high-stress environment for very long duration. not sustainable for the worker. not sustainable for long-term productivity. with the empathy layer, the manager doesn't send the message. the corner-cut doesn't happen over data that wasn't actually tracked. — and this changes the culture of any workplace. democratizing access to this knowledge is what it looks like when people use ai to make decisions WITH humans, not ABOUT them. the LLM stops being the autopilot and becomes the co-pilot — guiding you toward empathy. people stop being cogs. — same engine, infinite scenarios. manipulation only works in the dark. we turned the lights on.",
  "pavilion-map":
    "one job — make the invisible legible. four hires of the same job. — ironside ($5K + pilot): your worker's experience becomes spatial data. cortical signal as a new sensing modality on top of the camera. — listen labs ($3K + interview): the iterative loop IS the simulation. biological signal as the substrate. — sideshift (b2c): an ingredients-list for content. know what knows you. — yc (stretch): the future-obsidian — your inner life as a longitudinal dataset, owned by you. — same engine. four hires. each pavilion gets its own swap-slide via /sponsor/<name>; the master cut is constant.",
  close:
    "this is bigger than industries. the impact extends beyond any one vertical. — ai augments humans. it doesn't replace them. taste was the one skill that persists — and only if it's accessible. now it is. — we turned the lights on. now everyone gets to see.",

  "close::ironsight":
    "the empowerment gap was real. industries like construction, healthcare, food service — anywhere humans do work that involves judgment — have been forced to use ai by treating workers as productivity numbers. that's the only language the data spoke. — the best managers were always the ones with EQ. now those managers can use ai without giving up empathy. it's a win-win for the worker, the manager, and the company. real problems aren't solved by brute force — they're solved by understanding. and human connection always precedes anything ai can accomplish.",

  "close::listen-labs":
    "an entire generation has lost the ability to think for themselves because the algorithm decided what fires in their brain — and they could never see it. — we just handed back the controls. for the first time you can simulate how a person reacts before deploying content on them. for the first time you can see when convergence is happening to YOU and step back from the feed. — the value beyond is what lies past the convergence — what people would think if the algorithm didn't already think for them. that's what we made available again.",

  "close::best-of-ai":
    "ai is not meant to replace human thinking or human creativity. it's meant to augment them. the tragedy is that most people right now just generate-generate-generate, and lose the divergent thought that was theirs to begin with. — our engine never makes the decision for you. it simulates your reactions. it shows you the cosine similarity between what you intended to feel and what you actually made. you're still the one with the divergent thought. ai becomes the co-pilot guiding you toward empathy, not the autopilot replacing your judgment. — taste is the one skill that persists beyond ai. now it's accessible.",

  // ── Round 2 (additional IDs not already covered)
  "cold-open":
    "somewhere right now, a manager is looking at a number. thirty minutes. over threshold. and they're about to send a message. they don't know what happened in that room. ai can watch that footage. it can describe every action and tool every second. but it cannot tell you how that person felt doing it. that gap is where bad decisions live. we built the missing layer.",
  "the-gap":
    "a vlm flags a thirty-minute nurse visit as over-threshold. the manager cuts it to ten. the patient was being told they have cancer. action data was right. the decision was wrong. ai describes what humans did. it cannot model the cognitive-emotional state underneath the action. we built the missing layer.",
  "brain-layer":
    "the missing layer — biological signal as operational data. tribe v2 — meta's brain encoder — predicts per-second neural response across twenty thousand cortical points. — pre-rendered offline. reproducibility, not shortcut. — k2 swarm fans out seven specialist agents, one per brain system, in parallel. moderator writes one paragraph. the same swarm comes back as evaluator. eight rounds. k2 in three roles on one surface. about three cents per clip. — evidence the manager can audit.",
  paragraph:
    "the dashboard would have cut the visit to ten minutes. the document changes the call. for the first twelve minutes her emotional-processing specialist sustained engagement. she was reading the patient's grief, not just monitoring it. — pause — she did not rush. she did not check out. she held space. — pause — similarity 0.86. falsification check 0.27. anchored. not confabulated. the corner-cut doesn't happen.",
  "decision-reverses":
    "the manager doesn't send the message. the patient stays. the nurse stays. — silence — the corner-cut doesn't happen. that's a decision change, not a feature. surface evidence. let the human judge. don't recommend. the architecture enacts the yea rubric — it's not in the pitch deck, it's in the system.",
};
