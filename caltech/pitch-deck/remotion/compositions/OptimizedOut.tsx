"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Halftone } from "../components/Halftone";
import { Stage } from "../components/Stage";
import { palette } from "../palette";

/**
 * Pure symbolic clip — 4×4 feed-grid cells begin with distinct patterns
 * (taste) and converge into the same image (flattening). No text.
 */
export function OptimizedOut() {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const side = Math.min(width, height) * 0.84;

  return (
    <Stage>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: side, height: side }}>
          <Halftone
            variant="feed-grid-converge"
            frame={frame}
            durationInFrames={durationInFrames}
            seed={31}
            width={Math.round(side)}
            height={Math.round(side)}
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
        top: "6%",
        left: "6%",
        width: 14,
        height: 14,
        borderRadius: 999,
        background: palette.red,
        boxShadow: `0 0 0 ${8 + Math.sin(frame * 0.18) * 2}px rgba(229,75,75,0.18)`,
      }}
    />
  );
}
