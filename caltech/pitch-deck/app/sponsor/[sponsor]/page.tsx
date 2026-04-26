"use client";

// CALTECH HACKTECH 2026 — SPONSOR SWAP SLIDES
//
// Re-anchored to the empathy-layer engine per:
//   _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md
//   caltech/architecture-overview.md
//
// Ironsight is the primary $5K target. Listen Labs is core ($3K + interview).
// Sideshift is the B2C overlay. YC is the stretch (future-Obsidian for journal
// accumulation). One engine answers all four briefs.

import { use, type ReactNode } from "react";
import { notFound } from "next/navigation";
import RedDot from "../../components/RedDot";
import { Kicker, BrainBlock, AnchorQuote, EmpathyDocument } from "../../components/SlideKit";
import type { BrainVariant } from "../../components/BrainCanvas";

type FitRow = { ask: string; answer: string };

type SponsorContent = {
  brand: string;
  title: string;
  anchor: string;
  brief: string; // verbatim sponsor brief
  fit: FitRow[]; // their ask → our structural answer
  ask: string;
  visual:
    | { kind: "brain"; variant: BrainVariant; seed: number; highlight?: string }
    | {
        kind: "empathy";
        scenarioLabel: string;
        visionReport: string;
        empathyParagraph: ReactNode;
        similarity: number;
        falsificationDelta: number;
      };
};

const sponsors: Record<string, SponsorContent> = {
  ironside: {
    brand: "Ironsight",
    title: "video tells you what was done. brain encoding tells you what state of mind it took to do it well.",
    anchor: "you confirmed it at office hours: a new modality mapped back to the video qualifies as spatial intelligence.",
    brief:
      "can you teach a machine to truly understand the physical world? today&apos;s ai can see, but doesn&apos;t comprehend. it recognizes objects but misses the critical spatial relationship that humans understand intuitively. pinpoint a key spatial task where current models fail. develop an innovative technique. showcase the impact on a real-world problem.",
    fit: [
      {
        ask: "spatial task where vlms fail",
        answer:
          "vision-language models cannot infer the cognitive-emotional state behind the spatial action. threat-detection fires. prefrontal engagement doesn&apos;t. that gap — that&apos;s the signal.",
      },
      {
        ask: "innovative technique",
        answer:
          "tribe v2 brain-encoding sidecar. per-second neural response across ~20k cortical points, 1hz. seven region specialists cross-talk in parallel. we didn&apos;t label these. the regions did.",
      },
      {
        ask: "real-world impact",
        answer:
          "the manager reads the empathy document, not just the action log. the corner-cut doesn&apos;t happen. for the worker — not the surveiller.",
      },
    ],
    ask: "ironsight core · $5K · same engine, different input. for the worker — not the surveiller.",
    visual: {
      kind: "empathy",
      scenarioLabel: "ironsight · construction site · scaffolding sequence",
      visionReport:
        "worker on scaffolding tier 3. tool in hand. movement near edge logged at t+47s. duration 8m12s. flag = NEAR_EDGE.",
      empathyParagraph: (
        <>
          his salience-tracking specialist held tight on the lower platform across the full
          sequence — fixated on a beam joint the action log treated as routine. threat-detection
          ran high while prefrontal-engagement stayed steady; this is the brain-pattern of
          <em> scanning a hazard before stepping into it.</em> the &ldquo;near-edge&rdquo; flag the
          dashboard raised reads, in regions, as cognitive load and threat detection diverging
          together — within-subject, against this same worker on a routine task. the action log
          called it the unsafe minute. the regions called it the careful one.
        </>
      ),
      similarity: 0.84,
      falsificationDelta: 0.27,
    },
  },

  listenlabs: {
    brand: "Listen Labs",
    title: "the iterative loop IS the simulation.",
    anchor: "you asked: simulate humans, then prove it. we grounded the simulation in real brain-response data.",
    brief:
      "can you simulate how humans really think? humans don&apos;t just process information — they argue, persuade, change their minds, and influence each other in complex, unpredictable ways. today&apos;s ai can mimic language, but can it model the messy reality of human cognition and social dynamics? pick any slice of human or social behavior and simulate it. we care about the insight, not the stack.",
    fit: [
      {
        ask: "simulate humans / society",
        answer:
          "eight rounds of brain-pattern scoring across seven region specialists. candidate paragraphs compete round by round; the loop rewrites toward the brain pattern. round one: 0.42. round eight: 0.84.",
      },
      {
        ask: "ground in something real",
        answer:
          "within-subject brain contrast is the falsifier — same protocol as our 90.4% match against the clair de lune emotion-center, run in reverse. control-clip delta proves anchored, not confabulated.",
      },
      {
        ask: "insight, not stack",
        answer:
          "no text-only sim distinguishes genuine cognitive-emotional shift from surface agreement. brain-grounding does. insight, not stack — brain-grounding is the insight.",
      },
    ],
    ask: "listen labs core · $3K + interview · the iterative loop IS the simulation.",
    visual: { kind: "brain", variant: "swarm-bridges", seed: 314 },
  },

  sideshift: {
    brand: "Sideshift",
    title: "know what knows you.",
    anchor: "the user owns the data. the user owns the result. a mirror built by you.",
    brief:
      "consumer-data agency. give people the surface to see what their digital life is doing to them — and choose differently.",
    fit: [
      {
        ask: "data agency",
        answer:
          "user uploads their own footage. vault is theirs. no persistence beyond session unless they choose. not a product built from your data — a mirror built by you.",
      },
      {
        ask: "consumer surface",
        answer:
          "shareable brain card export — 1:1 ig-story shape of the empathy document. daily entries accumulate into a knowledge graph the user owns. the empathy document IS the daily journal.",
      },
      {
        ask: "post-recommender posture",
        answer:
          "the system never recommends. it surfaces evidence. the user judges. manipulation only works in the dark. we turned the lights on.",
      },
    ],
    ask: "sideshift core · b2c overlay · know what knows you.",
    visual: { kind: "brain", variant: "feed-grid", seed: 271 },
  },

  yc: {
    brand: "Y Combinator",
    title: "obsidian, but the graph is your brain.",
    anchor: "today it&apos;s reels. in five years it&apos;s brain chips. same trade. same trap.",
    brief:
      "consumer cognitive infrastructure. local-first moat. the tam is the smartphone-to-bci transition.",
    fit: [
      {
        ask: "category creator",
        answer:
          "every empathy document is a daily entry in a graph the user owns. cortex.buzz uses tribe v2 to engineer attention. we run it the other way — the design pattern for human-ai partnership.",
      },
      {
        ask: "moat",
        answer:
          "founder-market-fit + methodology credibility chip are the same artifact: 90.4% match against the clair de lune emotion-center. local-first by design — your brain pattern doesn&apos;t leave the device.",
      },
      {
        ask: "tam",
        answer:
          "the smartphone-to-bci transition. we&apos;re building the design pattern before the cognitive interface becomes invisible. the first product you use ON the algorithm instead of being used BY it.",
      },
    ],
    ask: "yc stretch · the design pattern for human-ai partnership before the cognitive interface becomes invisible.",
    visual: { kind: "brain", variant: "cortical-mesh", seed: 707, highlight: "default-mode" },
  },
};

export default function SponsorSwap({ params }: { params: Promise<{ sponsor: string }> }) {
  const { sponsor } = use(params);
  const content = sponsors[sponsor];
  if (!content) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center px-10 md:px-16 lg:px-24 py-16 md:py-20 relative">
      <RedDot top="7%" left="7%" />
      <div className="relative mx-auto w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 items-start gap-16 enter">
        {/* Left column: title, brief, fit table, ask */}
        <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
          <Kicker>sponsor swap · {content.brand.toLowerCase()}</Kicker>
          <h1 className="display-mono ink text-4xl md:text-5xl leading-[1.0] lowercase">
            {content.title}
          </h1>

          <AnchorQuote attribution={`${content.brand} brief`}>{content.anchor}</AnchorQuote>

          {/* Verbatim brief block — small, in oat-bordered card */}
          <div className="surface-card-dashed p-4 md:p-5 max-w-xl">
            <p className="kicker mb-2">verbatim brief</p>
            <p
              className="sans text-sm smoke leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.brief }}
            />
          </div>

          {/* Fit table */}
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--hair)" }}>
            {content.fit.map((row) => (
              <li
                key={row.ask}
                className="grid grid-cols-12 gap-4 items-baseline py-3"
                style={{ borderColor: "var(--hair)" }}
              >
                <p
                  className="kicker col-span-12 md:col-span-4"
                  style={{ color: "var(--accent)" }}
                >
                  {row.ask}
                </p>
                <p
                  className="sans text-sm md:text-base col-span-12 md:col-span-8 smoke leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: row.answer }}
                />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-1.5">
            <p className="kicker" style={{ color: "var(--accent)" }}>
              ask
            </p>
            <p className="mono text-base md:text-lg ink lowercase">{content.ask}</p>
          </div>
        </div>

        {/* Right column: hero artifact (empathy doc OR brain visual) */}
        <div className="lg:col-span-5 justify-self-end">
          {content.visual.kind === "empathy" ? (
            <EmpathyDocument
              scenarioLabel={content.visual.scenarioLabel}
              visionReport={content.visual.visionReport}
              empathyParagraph={content.visual.empathyParagraph}
              similarity={content.visual.similarity}
              falsificationDelta={content.visual.falsificationDelta}
            />
          ) : (
            <BrainBlock
              variant={content.visual.variant}
              seed={content.visual.seed}
              size={460}
              highlight={content.visual.highlight}
            />
          )}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 right-6 sans text-xs tracking-widest text-mute select-none"
        style={{ color: "var(--mute)" }}
      >
        sponsor / {content.brand.toLowerCase()}
      </div>
    </main>
  );
}
