"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Halftone } from "../components/Halftone";
import { Stage } from "../components/Stage";
import { palette } from "../palette";

/**
 * Pure symbolic clip — hand pinch on the left dissolves into a glassmorphic
 * vault unfolding outward on the right. Two gestures, one continuous motion.
 */
export function PinchUnfold() {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const blend = interpolate(frame, [165, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const side = Math.min(width, height) * 0.9;

  return (
    <Stage>
      {/* Pinch layer — fades out during blend */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - blend,
        }}
      >
        <div style={{ width: side, height: side }}>
          <Halftone
            variant="hand-pinch"
            frame={Math.min(frame, 179)}
            durationInFrames={180}
            seed={55}
            width={Math.round(side)}
            height={Math.round(side)}
          />
        </div>
      </AbsoluteFill>

      {/* Unfold layer — full-bleed constellation of glass tiles */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: blend,
        }}
      >
        <div style={{ width: Math.round(width * 0.94), height: Math.round(height * 0.94) }}>
          <Halftone
            variant="vault-unfold"
            frame={Math.max(0, frame - 120)}
            durationInFrames={240}
            seed={99}
            width={Math.round(width * 0.94)}
            height={Math.round(height * 0.94)}
          />
        </div>
      </AbsoluteFill>

      <RedDot />
    </Stage>
  );
}

function RedDot() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        bottom: "6%",
        right: "6%",
        width: 14,
        height: 14,
        borderRadius: 999,
        background: palette.red,
        boxShadow: `0 0 0 ${8 + Math.sin(frame * 0.2) * 2}px rgba(229,75,75,0.18)`,
      }}
    />
  );
}
