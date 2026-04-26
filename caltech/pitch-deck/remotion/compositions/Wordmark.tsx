"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Halftone } from "../components/Halftone";
import { Stage } from "../components/Stage";
import { palette } from "../palette";

/**
 * Symbolic shpatial ident — a single accent dot pulses at center, emits a ring
 * that dissolves into a constellation forming around it. No typography.
 */
export function Wordmark() {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Dot scale/pulse
  const birth = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const pulsePhase = Math.max(0, frame - 18);
  const pulse = 1 + 0.18 * Math.sin(pulsePhase * 0.22);

  // Emitted rings: rings spawn every 24 frames and expand outward.
  const rings: { start: number }[] = [];
  for (let s = 22; s < durationInFrames; s += 24) rings.push({ start: s });

  // Constellation forms in the second half
  const constellationFade = interpolate(frame, [56, 110], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      {/* Soft dust halftone backdrop */}
      <Halftone
        variant="wordmark-dust"
        frame={frame}
        durationInFrames={durationInFrames}
        seed={7}
        width={width}
        height={height}
      />

      {/* Constellation forming around the dot */}
      <AbsoluteFill style={{ opacity: constellationFade }}>
        <Halftone
          variant="constellation-draw"
          frame={Math.max(0, frame - 50)}
          durationInFrames={Math.max(1, durationInFrames - 50)}
          seed={360}
          width={width}
          height={height}
        />
      </AbsoluteFill>

      {/* Emitted rings */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {rings.map((r, i) => {
          const local = frame - r.start;
          if (local < 0 || local > 60) return null;
          const t = local / 60;
          const ringR = 24 + t * Math.min(width, height) * 0.45;
          const alpha = 0.55 * (1 - t);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: ringR * 2,
                height: ringR * 2,
                borderRadius: 999,
                border: `1.5px solid rgba(0,113,227,${alpha})`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Central accent dot */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: palette.accent,
            transform: `scale(${birth * pulse})`,
            boxShadow: `0 0 0 ${10 + Math.sin(frame * 0.2) * 3}px rgba(0,113,227,0.12)`,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
}
