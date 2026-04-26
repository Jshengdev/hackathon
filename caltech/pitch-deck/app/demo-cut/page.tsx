"use client";

// CALTECH HACKTECH 2026 — 1:30 MASTER CUT (self-running, no audio)
//
// Beat-synced to caltech/pitch-story-v3-next-level.md §2. Each section maps
// 1:1 to the LOCKED beat structure. The 4-second silence in BEAT-3 is held
// literally; do not fill it.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrainBlock } from "../components/SlideKit";
import ProgressBar from "../components/ProgressBar";

const BEAT = {
  coldOpenStart: 0,
  beat1: 5_000,
  beat2: 15_000,
  beat3: 35_000,
  beat4: 60_000,
  beat5: 85_000,
  end: 90_000,
  title1: 90_000,
  title2: 91_500,
  title3: 93_000,
  finalHold: 96_000,
} as const;

const SCORE_STEPS: { t: number; v: string }[] = [
  { t: 0, v: "0.42" },
  { t: 3_000, v: "0.58" },
  { t: 6_000, v: "0.65" },
  { t: 9_000, v: "0.71" },
  { t: 12_000, v: "0.78" },
  { t: 15_000, v: "0.82" },
  { t: 18_000, v: "0.84" },
];

const SILENCE_START = 21_000;
const SILENCE_END = 25_000;

const PARAGRAPH_LINES = [
  "she did not rush.",
  "she did not check out.",
  "she held space.",
];

export default function DemoCut() {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // rAF-driven elapsed clock — pauses cleanly via the `playing` flag.
  useEffect(() => {
    if (!playing || done) return;
    let raf = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      setElapsed((e) => {
        const next = e + (now - last);
        if (next >= BEAT.finalHold) {
          setDone(true);
          return BEAT.finalHold;
        }
        return next;
      });
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, done]);

  // Literal setTimeout 4000ms during BEAT-3 silence — production discipline,
  // not just animation. This ensures the silence is structured time, not
  // accidental dead air.
  const inBeat3 = elapsed >= BEAT.beat3 && elapsed < BEAT.beat4;
  const beat3Local = elapsed - BEAT.beat3;
  const inBeat3Silence =
    inBeat3 && beat3Local >= SILENCE_START && beat3Local < SILENCE_END;
  useEffect(() => {
    if (!inBeat3Silence) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      return;
    }
    if (silenceTimerRef.current) return;
    silenceTimerRef.current = setTimeout(() => {
      silenceTimerRef.current = null;
    }, 4000);
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [inBeat3Silence]);

  const restart = useCallback(() => {
    setElapsed(0);
    setDone(false);
    setPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (done) {
      restart();
      return;
    }
    setPlaying((p) => !p);
  }, [done, restart]);

  const scrubTo = useCallback((ms: number) => {
    setElapsed(Math.max(0, Math.min(BEAT.finalHold, ms)));
    setDone(false);
  }, []);

  // Section selection
  const section = useMemo<
    | "cold-open"
    | "beat1"
    | "beat2"
    | "beat3"
    | "beat4"
    | "beat5"
    | "title1"
    | "title2"
    | "title3"
    | "final-hold"
  >(() => {
    if (elapsed < BEAT.beat1) return "cold-open";
    if (elapsed < BEAT.beat2) return "beat1";
    if (elapsed < BEAT.beat3) return "beat2";
    if (elapsed < BEAT.beat4) return "beat3";
    if (elapsed < BEAT.beat5) return "beat4";
    if (elapsed < BEAT.title1) return "beat5";
    if (elapsed < BEAT.title2) return "title1";
    if (elapsed < BEAT.title3) return "title2";
    if (elapsed < BEAT.finalHold) return "title3";
    return "final-hold";
  }, [elapsed]);

  const inTitleCards =
    section === "title1" ||
    section === "title2" ||
    section === "title3" ||
    section === "final-hold";

  // Approximate slide-index for the progress bar (1-of-7 beat blocks).
  const beatIndex = useMemo(() => {
    switch (section) {
      case "cold-open":
        return 0;
      case "beat1":
        return 1;
      case "beat2":
        return 2;
      case "beat3":
        return 3;
      case "beat4":
        return 4;
      case "beat5":
        return 5;
      default:
        return 6;
    }
  }, [section]);

  const startedAt = useRef<number>(Date.now()).current;

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      onClick={done ? restart : undefined}
      style={{
        background: inTitleCards ? "var(--clay-black)" : "var(--ivory)",
        color: inTitleCards ? "var(--warm-cream)" : "var(--ink)",
        transition: "background 600ms ease, color 600ms ease",
      }}
    >
      <ProgressBar currentSlide={beatIndex} totalSlides={7} startedAt={startedAt} />

      {/* Top control bar */}
      <div
        className="fixed top-3 left-4 z-[60] flex items-center gap-3 mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "lowercase",
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={{
            border: "1px solid var(--hair-strong)",
            background: "transparent",
            color: inTitleCards ? "var(--warm-cream)" : "var(--ink)",
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          {done ? "restart" : playing ? "pause" : "play"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            restart();
          }}
          style={{
            border: "1px solid var(--hair-strong)",
            background: "transparent",
            color: inTitleCards ? "var(--warm-cream)" : "var(--ink)",
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          ⟲ reset
        </button>
        <span style={{ color: inTitleCards ? "var(--mute)" : "var(--smoke)" }}>
          beat {beatIndex + 1}/7 · {Math.floor(elapsed / 1000)}s
        </span>
        <span
          style={{
            display: "flex",
            gap: 6,
            marginLeft: 12,
            color: inTitleCards ? "var(--mute)" : "var(--smoke)",
          }}
        >
          {[
            { l: "0:00", t: 0 },
            { l: "0:05", t: BEAT.beat1 },
            { l: "0:15", t: BEAT.beat2 },
            { l: "0:35", t: BEAT.beat3 },
            { l: "1:00", t: BEAT.beat4 },
            { l: "1:25", t: BEAT.beat5 },
            { l: "1:30", t: BEAT.title1 },
          ].map((m) => (
            <button
              key={m.l}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrubTo(m.t);
              }}
              style={{
                border: "1px solid var(--hair)",
                background: "transparent",
                color: "inherit",
                padding: "2px 6px",
                cursor: "pointer",
                fontSize: 10,
              }}
            >
              {m.l}
            </button>
          ))}
        </span>
      </div>

      <div
        className="relative w-full min-h-screen flex items-center justify-center px-10 md:px-16 lg:px-24 py-16"
      >
        {section === "cold-open" && <ColdOpen />}
        {section === "beat1" && <Beat1 elapsedInBeat={elapsed - BEAT.beat1} />}
        {section === "beat2" && <Beat2 elapsedInBeat={elapsed - BEAT.beat2} />}
        {section === "beat3" && (
          <Beat3
            elapsedInBeat={elapsed - BEAT.beat3}
            silent={inBeat3Silence}
          />
        )}
        {section === "beat4" && <Beat4 elapsedInBeat={elapsed - BEAT.beat4} />}
        {section === "beat5" && <Beat5 />}
        {section === "title1" && <TitleCard line="humans are not machines." />}
        {section === "title2" && (
          <TitleCard line="the empathy layer is what ai gives back." />
        )}
        {section === "title3" && (
          <TitleCard line="caltech hacktech 2026" small />
        )}
        {section === "final-hold" && (
          <div className="flex flex-col items-center gap-6">
            <TitleCard line="caltech hacktech 2026" small />
            <p
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                color: "var(--mute)",
              }}
            >
              click anywhere to restart
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Section components

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      style={{
        animation: `democut-fade 600ms ${delay}ms ease-out both`,
      }}
    >
      {children}
      <style>{`@keyframes democut-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function ColdOpen() {
  return (
    <FadeIn>
      <div className="flex flex-col items-start max-w-4xl gap-8">
        <p
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: "var(--accent)",
            textTransform: "lowercase",
          }}
        >
          0:00 · cold open · johnny on camera
        </p>
        <p className="display-mono ink text-3xl md:text-5xl leading-[1.1] lowercase">
          somewhere right now, a manager is looking at a number.
        </p>
        <figcaption
          className="mono italic"
          style={{
            fontSize: 14,
            color: "var(--smoke)",
            maxWidth: "55ch",
            lineHeight: 1.6,
          }}
        >
          johnny — locked vo · &ldquo;somewhere right now, a manager is looking at a
          number. thirty minutes. over threshold. and they&apos;re about to send a
          message.&rdquo;
        </figcaption>
      </div>
    </FadeIn>
  );
}

function Beat1({ elapsedInBeat }: { elapsedInBeat: number }) {
  return (
    <FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-6xl">
        <div className="lg:col-span-7 flex flex-col gap-6 max-w-xl">
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              color: "var(--accent)",
              textTransform: "lowercase",
            }}
          >
            beat-1 · 0:05 · the gap
          </p>
          <h2 className="display-mono ink text-4xl md:text-6xl leading-[1.0] lowercase">
            <span className="ink">ai can see.</span>
            <br />
            <span className="grad">it cannot tell you what it meant.</span>
          </h2>
          <figcaption
            className="mono italic"
            style={{ fontSize: 14, color: "var(--smoke)", maxWidth: "55ch" }}
          >
            johnny — locked vo · &ldquo;every company in the world is making
            decisions about humans using data that was never designed to
            understand humans.&rdquo;
          </figcaption>
        </div>
        <div className="lg:col-span-5 justify-self-end">
          <div
            className="surface-card-feature flex flex-col gap-3"
            style={{
              padding: "28px 32px",
              minWidth: 360,
              animation:
                elapsedInBeat < 800
                  ? "democut-glow 800ms ease-out"
                  : undefined,
            }}
          >
            <p
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--accent)",
                textTransform: "lowercase",
              }}
            >
              productivity dashboard · live
            </p>
            <p className="mono text-sm smoke">action: held hand</p>
            <p className="mono text-sm smoke">duration: 1,800s</p>
            <p
              className="mono text-base"
              style={{ color: "var(--red)", letterSpacing: "0.08em" }}
            >
              flag: OVER_THRESHOLD
            </p>
            <div className="rule" />
            <p
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                color: "var(--mute)",
                textTransform: "lowercase",
              }}
            >
              manager · about to type
            </p>
          </div>
          <style>{`@keyframes democut-glow { from { box-shadow: 0 0 0 4px var(--accent-soft); } to { box-shadow: none; } }`}</style>
        </div>
      </div>
    </FadeIn>
  );
}

function Beat2({ elapsedInBeat }: { elapsedInBeat: number }) {
  // Lower-third VO line crossfades after 8s.
  const showSecond = elapsedInBeat > 8_000;
  return (
    <FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-6xl">
        <div className="lg:col-span-6 flex flex-col gap-6 max-w-xl">
          <p
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              color: "var(--accent)",
              textTransform: "lowercase",
            }}
          >
            beat-2 · 0:15 · the brain layer
          </p>
          <h2 className="display-mono text-4xl md:text-6xl leading-[1.0] lowercase">
            <span className="ink">we send the same video into</span>{" "}
            <span className="grad">meta&apos;s tribe v2.</span>
          </h2>
          <figcaption
            className="mono italic"
            style={{ fontSize: 14, color: "var(--smoke)", maxWidth: "55ch" }}
            key={showSecond ? "b" : "a"}
          >
            {showSecond ? (
              <>
                johnny — locked vo · &ldquo;eight specialist agents interpret each
                region in parallel. what the action data missed — the brain
                pattern captures.&rdquo;
              </>
            ) : (
              <>
                johnny — locked vo · &ldquo;it predicts per-second neural response
                across roughly twenty thousand cortical points. not what she
                said. not what she did. what her brain was doing while she did
                it.&rdquo;
              </>
            )}
          </figcaption>
        </div>
        <div className="lg:col-span-6 justify-self-end">
          <BrainBlock variant="vision-vs-brain" seed={42} size={460} />
        </div>
      </div>
    </FadeIn>
  );
}

function Beat3({
  elapsedInBeat,
  silent,
}: {
  elapsedInBeat: number;
  silent: boolean;
}) {
  // Cumulative score reveal: each step is shown once its t has passed.
  const visibleSteps = SCORE_STEPS.filter((s) => elapsedInBeat >= s.t);
  const latest = visibleSteps[visibleSteps.length - 1] ?? SCORE_STEPS[0];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-6xl">
      <div className="lg:col-span-6 flex flex-col gap-7 max-w-xl">
        <p
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: "var(--accent)",
            textTransform: "lowercase",
          }}
        >
          beat-3 · 0:35 · score climb · hero reveal
        </p>
        <h2 className="display-mono text-4xl md:text-6xl leading-[0.95] lowercase">
          <span className="ink">eight rounds.</span>
          <br />
          <span className="grad">the score climbs.</span>
        </h2>
        <p
          className="numeral ink"
          style={{
            fontSize: "5.5rem",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            transition: "color 200ms ease",
            color: silent ? "var(--accent)" : "var(--ink)",
          }}
          key={latest.v}
        >
          {latest.v}
        </p>
        <p
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.18em",
            color: "var(--smoke)",
            textTransform: "lowercase",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {SCORE_STEPS.map((s, i) => {
            const visible = elapsedInBeat >= s.t;
            return (
              <span
                key={s.v}
                style={{
                  opacity: visible ? 1 : 0.18,
                  color: i === visibleSteps.length - 1 ? "var(--accent)" : undefined,
                  transition: "opacity 220ms ease",
                }}
              >
                {s.v}
                {i < SCORE_STEPS.length - 1 ? " →" : ""}
              </span>
            );
          })}
        </p>
        {silent ? (
          <p
            className="mono italic"
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "var(--red)",
              textTransform: "lowercase",
            }}
          >
            — held silence · 4 seconds · do not fill —
          </p>
        ) : (
          <figcaption
            className="mono italic"
            style={{ fontSize: 14, color: "var(--smoke)", maxWidth: "55ch" }}
          >
            johnny — locked vo · &ldquo;each round, claude writes a new paragraph
            describing what the nurse felt. tribe v2 scores it against the
            actual brain pattern from the footage.&rdquo;
          </figcaption>
        )}
      </div>
      <div className="lg:col-span-6 justify-self-end">
        <BrainBlock variant="score-climb" seed={84} size={460} />
      </div>
    </div>
  );
}

function Beat4({ elapsedInBeat }: { elapsedInBeat: number }) {
  // Each line appears 1.5s after the previous (locked production note).
  const lineTimings = [0, 1_500, 3_000];
  return (
    <div className="flex flex-col items-center justify-center gap-10 max-w-4xl text-center">
      <p
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.32em",
          color: "var(--accent)",
          textTransform: "lowercase",
        }}
      >
        beat-4 · 1:00 · the paragraph · the artifact
      </p>
      <div className="flex flex-col items-center gap-6 min-h-[18rem] justify-center">
        {PARAGRAPH_LINES.map((line, i) => {
          const visible = elapsedInBeat >= lineTimings[i];
          return (
            <h2
              key={line}
              className="display-mono text-4xl md:text-7xl leading-[0.95] lowercase"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 600ms ease, transform 600ms ease",
                color: i === 2 ? "var(--accent)" : "var(--ink)",
              }}
            >
              {line}
            </h2>
          );
        })}
      </div>
      <figcaption
        className="mono italic"
        style={{ fontSize: 13, color: "var(--smoke)", maxWidth: "55ch" }}
      >
        johnny — locked vo · &ldquo;she did not rush. she did not check out. she
        held space.&rdquo; — 2 second silence held —
      </figcaption>
    </div>
  );
}

function Beat5() {
  return (
    <FadeIn>
      <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
        <p
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: "var(--accent)",
            textTransform: "lowercase",
          }}
        >
          beat-5 · 1:25 · the decision reverses
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div
            className="surface-card-dashed p-6 md:p-8 flex flex-col gap-3"
            style={{ background: "color-mix(in srgb, var(--ink) 4%, transparent)" }}
          >
            <p
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--red)",
                textTransform: "lowercase",
              }}
            >
              action-data report
            </p>
            <p className="mono text-sm smoke leading-relaxed">
              over_threshold · 30 min · cut to 10
            </p>
          </div>
          <div className="surface-card-feature p-6 md:p-8 flex flex-col gap-3">
            <p
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--accent)",
                textTransform: "lowercase",
              }}
            >
              empathy document
            </p>
            <p className="serif text-base ink leading-relaxed">she held space.</p>
            <p className="mono text-xs smoke">
              similarity 0.84 · falsification 0.27 · anchored
            </p>
          </div>
        </div>
        <p className="mono italic text-lg ink lowercase">
          the corner-cut doesn&apos;t happen.
        </p>
        <figcaption
          className="mono italic"
          style={{ fontSize: 13, color: "var(--smoke)", maxWidth: "55ch" }}
        >
          johnny — locked vo · &ldquo;the manager doesn&apos;t send the message.
          the patient stays. the nurse stays. the corner-cut doesn&apos;t
          happen.&rdquo;
        </figcaption>
      </div>
    </FadeIn>
  );
}

function TitleCard({ line, small = false }: { line: string; small?: boolean }) {
  return (
    <FadeIn>
      <h2
        className="display-mono lowercase text-center"
        style={{
          color: "var(--warm-cream)",
          fontSize: small ? "1.5rem" : "clamp(2.5rem, 6vw, 5rem)",
          letterSpacing: small ? "0.32em" : "-0.01em",
          lineHeight: 1.05,
        }}
      >
        {line}
      </h2>
    </FadeIn>
  );
}
