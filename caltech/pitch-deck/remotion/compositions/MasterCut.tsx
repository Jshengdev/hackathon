"use client";

import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Stage, mono, sans } from "../components/Stage";
import { palette } from "../palette";

// 1:30 master cut — beat-synced to caltech/pitch-story-v3-next-level.md §2.
// Cold open (0–5s) → BEAT-1 gap (5–15s) → BEAT-2 mesh (15–35s) →
// BEAT-3 score climb with 4s silence (35–60s) → BEAT-4 paragraph cards (60–85s) →
// BEAT-5 split-card reversal (85–90s) → title (90–96s).
// Total = 2880 frames at 30fps. Title sits inside the buffer window.

const FPS = 30;
const COLD_OPEN_FRAMES = 5 * FPS; // 0–150
const BEAT_1_FRAMES = 10 * FPS; // 150–450
const BEAT_2_FRAMES = 20 * FPS; // 450–1050
const BEAT_3_FRAMES = 25 * FPS; // 1050–1800
const BEAT_4_FRAMES = 25 * FPS; // 1800–2550
const BEAT_5_FRAMES = 5 * FPS; // 2550–2700
const TITLE_FRAMES = 6 * FPS; // 2700–2880

const BEAT_1_START = COLD_OPEN_FRAMES;
const BEAT_2_START = BEAT_1_START + BEAT_1_FRAMES;
const BEAT_3_START = BEAT_2_START + BEAT_2_FRAMES;
const BEAT_4_START = BEAT_3_START + BEAT_3_FRAMES;
const BEAT_5_START = BEAT_4_START + BEAT_4_FRAMES;
const TITLE_START = BEAT_5_START + BEAT_5_FRAMES;

function fadeInOut(localFrame: number, durationFrames: number, fadeFrames = 12) {
  const fadeIn = interpolate(localFrame, [0, fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    localFrame,
    [durationFrames - fadeFrames, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return Math.min(fadeIn, fadeOut);
}

export function MasterCut() {
  return (
    <Stage>
      <Sequence from={0} durationInFrames={COLD_OPEN_FRAMES}>
        <ColdOpen />
      </Sequence>
      <Sequence from={BEAT_1_START} durationInFrames={BEAT_1_FRAMES}>
        <Beat1Gap />
      </Sequence>
      <Sequence from={BEAT_2_START} durationInFrames={BEAT_2_FRAMES}>
        <Beat2Mesh />
      </Sequence>
      <Sequence from={BEAT_3_START} durationInFrames={BEAT_3_FRAMES}>
        <Beat3ScoreClimb />
      </Sequence>
      <Sequence from={BEAT_4_START} durationInFrames={BEAT_4_FRAMES}>
        <Beat4Paragraph />
      </Sequence>
      <Sequence from={BEAT_5_START} durationInFrames={BEAT_5_FRAMES}>
        <Beat5Reversal />
      </Sequence>
      <Sequence from={TITLE_START} durationInFrames={TITLE_FRAMES}>
        <TitleCard />
      </Sequence>
    </Stage>
  );
}

// ──────────────────────────────────────────────────────────────────
// COLD OPEN · 0–5s · "somewhere right now…"
// ──────────────────────────────────────────────────────────────────
function ColdOpen() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, COLD_OPEN_FRAMES, 18);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 14%",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 18,
          color: palette.smoke,
          letterSpacing: 1.2,
          textTransform: "lowercase",
          marginBottom: 36,
        }}
      >
        cold open · johnny on camera
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 84,
          lineHeight: 1.05,
          color: palette.ink,
          textTransform: "lowercase",
          maxWidth: 1380,
        }}
      >
        somewhere right now,
        <br />
        a manager is looking at a number.
      </div>
    </AbsoluteFill>
  );
}

// ──────────────────────────────────────────────────────────────────
// BEAT-1 · 5–15s · the gap (frozen dashboard text)
// ──────────────────────────────────────────────────────────────────
function Beat1Gap() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, BEAT_1_FRAMES, 18);
  const cursorOpacity = (Math.floor(frame / 15) % 2) * 0.55 + 0.1;
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          width: 1280,
          padding: "56px 64px",
          background: palette.ivoryHi,
          border: `1px solid ${palette.hairStrong}`,
          fontFamily: mono,
          color: palette.smoke,
        }}
      >
        <div style={{ fontSize: 16, color: palette.slate, marginBottom: 18 }}>
          dashboard · row 1
        </div>
        <div style={{ fontSize: 36, color: palette.ink, lineHeight: 1.5 }}>
          action: held hand
          <br />
          duration: 1,800s
          <br />
          status:{" "}
          <span style={{ color: palette.red }}>over_threshold</span>
          <span style={{ opacity: cursorOpacity }}> ▍</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 48,
          fontFamily: sans,
          fontStyle: "italic",
          fontSize: 24,
          color: palette.graphite,
          maxWidth: 980,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        every company in the world is making decisions about humans using data
        that was never designed to understand humans.
      </div>
    </AbsoluteFill>
  );
}

// ──────────────────────────────────────────────────────────────────
// BEAT-2 · 15–35s · the mesh + 8 specialists
// ──────────────────────────────────────────────────────────────────
const SPECIALISTS = [
  "prefrontal",
  "default-mode",
  "salience-tracking",
  "emotional-processing",
  "visual-cortex",
  "auditory",
  "motor",
  "memory-association",
];

function Beat2Mesh() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, BEAT_2_FRAMES, 24);
  // 1Hz pulse rate — biological, not sci-fi (per LOCKED direction §8)
  const pulse = 0.55 + 0.25 * Math.sin((frame / FPS) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 14,
          color: palette.slate,
          letterSpacing: 1.4,
          textTransform: "lowercase",
          marginBottom: 32,
        }}
      >
        beat-2 · the brain layer
      </div>

      {/* mesh proxy — concentric pulsing ring */}
      <div
        style={{
          position: "relative",
          width: 520,
          height: 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {[0, 1, 2, 3].map((i) => {
          const r = 120 + i * 60;
          const a = 0.18 - i * 0.035 + pulse * 0.08;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: r * 2,
                height: r * 2,
                borderRadius: 999,
                border: `1px solid rgba(55,48,163,${Math.max(0, a)})`,
              }}
            />
          );
        })}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 999,
            background: `rgba(55,48,163,${0.2 + pulse * 0.4})`,
            boxShadow: `0 0 0 ${10 + pulse * 14}px rgba(245,161,66,${0.05 + pulse * 0.08})`,
          }}
        />
      </div>

      {/* 8 specialist labels — fade in staggered */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 24px",
          maxWidth: 1080,
          justifyContent: "center",
        }}
      >
        {SPECIALISTS.map((label, i) => {
          const labelStart = 30 + i * 18;
          const labelOpacity = interpolate(
            frame,
            [labelStart, labelStart + 24],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <span
              key={label}
              style={{
                fontFamily: mono,
                fontSize: 16,
                color: palette.smoke,
                textTransform: "lowercase",
                opacity: labelOpacity,
                padding: "4px 10px",
                border: `1px solid ${palette.hair}`,
              }}
            >
              {label}
            </span>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 48,
          fontFamily: sans,
          fontStyle: "italic",
          fontSize: 22,
          color: palette.graphite,
          maxWidth: 920,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        what her brain was doing while she did it.
      </div>
    </AbsoluteFill>
  );
}

// ──────────────────────────────────────────────────────────────────
// BEAT-3 · 35–60s · score climbs · 4s silence at frames 1500–1620
// ──────────────────────────────────────────────────────────────────
const ROUND_SCORES = [
  { round: 1, score: 0.42 },
  { round: 2, score: 0.58 },
  { round: 3, score: 0.65 },
  { round: 5, score: 0.71 },
  { round: 8, score: 0.84 },
];

function Beat3ScoreClimb() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, BEAT_3_FRAMES, 18);
  // 25s = 750 frames. spread the 5 rounds across it.
  // first 3 rounds 0–13s, then BEAT-3 silence 13–17s (frames ~390–510),
  // then last 2 rounds 17–25s.
  const progress = frame / BEAT_3_FRAMES;

  const currentScore = (() => {
    if (progress < 0.15) return ROUND_SCORES[0]!;
    if (progress < 0.32) return ROUND_SCORES[1]!;
    if (progress < 0.5) return ROUND_SCORES[2]!;
    if (progress < 0.78) return ROUND_SCORES[3]!;
    return ROUND_SCORES[4]!;
  })();

  const lineProgress = interpolate(
    frame,
    [0, BEAT_3_FRAMES - 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 14,
          color: palette.slate,
          letterSpacing: 1.4,
          textTransform: "lowercase",
          marginBottom: 28,
        }}
      >
        beat-3 · iterative loop · 8 rounds
      </div>

      {/* chart frame */}
      <div
        style={{
          position: "relative",
          width: 1280,
          height: 480,
          border: `1px solid ${palette.hair}`,
          background: palette.ivoryHi,
        }}
      >
        {/* dashed target line at 1.0 — visible the whole time (LOCKED §8) */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 0,
            right: 0,
            borderTop: `1px dashed ${palette.slate}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            fontFamily: mono,
            fontSize: 12,
            color: palette.slate,
          }}
        >
          target · 1.00
        </div>

        {/* the climbing line — built from ROUND_SCORES, drawn left to right */}
        <svg
          width="1280"
          height="480"
          style={{ position: "absolute", inset: 0 }}
        >
          {(() => {
            const xs = [0.05, 0.25, 0.45, 0.7, 0.95];
            const points = ROUND_SCORES.map((r, i) => ({
              x: xs[i]! * 1280,
              y: 480 - 32 - (480 - 64) * r.score,
            }));
            const visibleCount = Math.max(
              1,
              Math.ceil(lineProgress * points.length),
            );
            const visible = points.slice(0, visibleCount);
            const path = visible
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ");
            return (
              <>
                <path
                  d={path}
                  fill="none"
                  stroke={palette.accent}
                  strokeWidth={3}
                />
                {visible.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={6}
                    fill={palette.accent}
                  />
                ))}
              </>
            );
          })()}
        </svg>

        {/* current round + score readout, top-left */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            fontFamily: mono,
            fontSize: 20,
            color: palette.ink,
          }}
        >
          round {currentScore.round} · {currentScore.score.toFixed(2)}
        </div>
      </div>

      <div
        style={{
          marginTop: 36,
          fontFamily: mono,
          fontSize: 14,
          color: palette.slate,
          letterSpacing: 1.4,
          textTransform: "lowercase",
        }}
      >
        round 1 → 0.42 · round 8 → 0.84 · same protocol that hit 90.4% on clair
        de lune
      </div>
    </AbsoluteFill>
  );
}

// ──────────────────────────────────────────────────────────────────
// BEAT-4 · 60–85s · three typographic cards + footer
// ──────────────────────────────────────────────────────────────────
const PARAGRAPH_LINES = [
  "she did not rush.",
  "she did not check out.",
  "she held space.",
];

function Beat4Paragraph() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, BEAT_4_FRAMES, 18);

  // 25s = 750f. line 1 at 0–6s, line 2 at 6–12s, line 3 at 12–18s, footer 18–25s.
  const lineIdx = (() => {
    if (frame < 6 * FPS) return 0;
    if (frame < 12 * FPS) return 1;
    if (frame < 18 * FPS) return 2;
    return 3; // footer
  })();

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        padding: "0 12%",
      }}
    >
      {lineIdx < 3 ? (
        <div
          style={{
            fontFamily: sans,
            fontStyle: "italic",
            fontSize: 96,
            lineHeight: 1.05,
            color: palette.ink,
            textAlign: "center",
            maxWidth: 1500,
          }}
        >
          {PARAGRAPH_LINES[lineIdx]}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 14,
              color: palette.slate,
              letterSpacing: 1.4,
              textTransform: "lowercase",
            }}
          >
            empathy document · footer
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 32,
              color: palette.ink,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            brain-pattern similarity: 0.84
            <br />
            falsification check: 0.27
          </div>
          <div
            style={{
              fontFamily: sans,
              fontStyle: "italic",
              fontSize: 24,
              color: palette.graphite,
            }}
          >
            anchored. not confabulated.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

// ──────────────────────────────────────────────────────────────────
// BEAT-5 · 85–90s · split-card decision reverses
// ──────────────────────────────────────────────────────────────────
function Beat5Reversal() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, BEAT_5_FRAMES, 12);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "row",
        opacity,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: palette.ivory,
          borderRight: `1px solid ${palette.hair}`,
          padding: "0 6%",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 14,
            color: palette.slate,
            letterSpacing: 1.4,
            textTransform: "lowercase",
            marginBottom: 18,
          }}
        >
          before · the dashboard
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 36,
            color: palette.smoke,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          over_threshold
          <br />
          30 min · cut to 10
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: palette.ivoryHi,
          padding: "0 6%",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 14,
            color: palette.accent,
            letterSpacing: 1.4,
            textTransform: "lowercase",
            marginBottom: 18,
          }}
        >
          after · the empathy document
        </div>
        <div
          style={{
            fontFamily: sans,
            fontStyle: "italic",
            fontSize: 32,
            color: palette.ink,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          she held space.
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: mono,
            fontSize: 18,
            color: palette.smoke,
          }}
        >
          similarity 0.84 · falsified 0.27
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ──────────────────────────────────────────────────────────────────
// TITLE · 90–96s · three lines, 1s gaps, hard-cut feel
// ──────────────────────────────────────────────────────────────────
const TITLE_LINES = [
  "humans are not machines.",
  "the empathy layer is what ai gives back.",
  "caltech hacktech 2026.",
];

function TitleCard() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: palette.ink,
        gap: 28,
      }}
    >
      {TITLE_LINES.map((line, i) => {
        const start = i * FPS;
        const lineOpacity = interpolate(
          frame,
          [start, start + 18],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{
              fontFamily: i === 2 ? mono : sans,
              fontStyle: i === 2 ? "normal" : "italic",
              fontSize: i === 2 ? 28 : 56,
              color: palette.ivory,
              opacity: lineOpacity,
              textAlign: "center",
              letterSpacing: i === 2 ? 1.6 : 0,
              textTransform: "lowercase",
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
