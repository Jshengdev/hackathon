"use client";

import { AbsoluteFill } from "remotion";
import { loadFont as loadDMMono } from "@remotion/google-fonts/DMMono";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { palette } from "../palette";

export const dmMono = loadDMMono();
export const dmSans = loadDMSans();

export function Stage({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill
      style={{
        background: palette.ivory,
        color: palette.ink,
        fontFamily: dmSans.fontFamily,
        fontFeatureSettings: "'ss01', 'ss02', 'liga'",
      }}
    >
      {/* corner dot texture to match the deck */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle at 1% 1%, rgba(29,29,31,0.04) 0.8px, transparent 1.2px), radial-gradient(circle at 99% 99%, rgba(29,29,31,0.03) 0.8px, transparent 1.2px)`,
          backgroundSize: "26px 26px, 28px 28px",
          backgroundPosition: "0 0, 13px 13px",
        }}
      />
      {children}
    </AbsoluteFill>
  );
}

export const mono = dmMono.fontFamily;
export const sans = dmSans.fontFamily;
