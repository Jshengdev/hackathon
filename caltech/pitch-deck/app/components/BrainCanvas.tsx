"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";
import { useMemo } from "react";

// Brain-specific p5.js visuals for the Caltech HackTech pitch deck.
// Brand-native to the brain-encoding story (cortical mesh, convergence,
// divergence, swarm bridges, activation pulse, feed grid).

export type BrainVariant =
  | "cortical-mesh" // top-down stippled brain, one region can be highlighted
  | "convergence" // many wavy paths flattening into one straight line
  | "divergence" // one line branching out into many paths
  | "swarm-bridges" // n nodes (specialists) with flickering edges
  | "activation-pulse" // single region pulsing fire-colormap
  | "feed-grid"; // grid of phone-screens with synchronized scroll

type Props = {
  variant: BrainVariant;
  seed?: number;
  size?: number; // px width of square canvas
  highlight?: string; // region label (cortical-mesh, activation-pulse)
  className?: string;
};

// Palette aligned with globals.css.
const C = {
  ivory: [247, 245, 240] as const,
  ink: [29, 26, 23] as const,
  smoke: [61, 56, 50] as const,
  mute: [138, 132, 122] as const,
  sepia: [107, 93, 76] as const,
  accent: [55, 48, 163] as const, // deep indigo
  accentSoft: [109, 101, 212] as const,
  warm: [196, 69, 105] as const, // activation-warm (pink)
  hot: [245, 161, 66] as const, // activation-hot (amber)
  hair: [29, 26, 23, 24] as const, // ink @ 9%
};

// Linear interpolation across the activation gradient: cool indigo → warm pink → hot amber.
function activation(t: number): [number, number, number] {
  if (t < 0.5) {
    const u = t / 0.5;
    return [
      C.accent[0] + (C.warm[0] - C.accent[0]) * u,
      C.accent[1] + (C.warm[1] - C.accent[1]) * u,
      C.accent[2] + (C.warm[2] - C.accent[2]) * u,
    ];
  }
  const u = (t - 0.5) / 0.5;
  return [
    C.warm[0] + (C.hot[0] - C.warm[0]) * u,
    C.warm[1] + (C.hot[1] - C.warm[1]) * u,
    C.warm[2] + (C.hot[2] - C.warm[2]) * u,
  ];
}

const REGIONS = [
  "amygdala",
  "default-mode",
  "visual-cortex",
  "broca",
  "wernicke",
  "motor",
  "prefrontal",
  "auditory",
];

function makeSketch(
  variant: BrainVariant,
  seed: number,
  canvasSize: number,
  highlight?: string,
): Sketch {
  return (p) => {
    let t0 = 0;

    p.setup = () => {
      p.createCanvas(canvasSize, canvasSize);
      p.pixelDensity(2);
      p.noStroke();
      p.randomSeed(seed);
      p.noiseSeed(seed);
      t0 = p.millis();

      if (variant === "swarm-bridges" || variant === "activation-pulse") {
        p.frameRate(24);
      } else {
        p.noLoop();
      }
    };

    p.draw = () => {
      const tElapsed = (p.millis() - t0) / 1000;
      p.clear();
      switch (variant) {
        case "cortical-mesh":
          drawCorticalMesh(p, canvasSize, highlight);
          break;
        case "convergence":
          drawConvergence(p, canvasSize);
          break;
        case "divergence":
          drawDivergence(p, canvasSize);
          break;
        case "swarm-bridges":
          drawSwarmBridges(p, canvasSize, tElapsed);
          break;
        case "activation-pulse":
          drawActivationPulse(p, canvasSize, tElapsed, highlight);
          break;
        case "feed-grid":
          drawFeedGrid(p, canvasSize);
          break;
      }
    };
  };
}

// ─────────────────────────────────────────────────────────────────────
// CORTICAL MESH — top-down stippled brain shape, 8 regions
// ─────────────────────────────────────────────────────────────────────
function drawCorticalMesh(p: any, S: number, highlight?: string) {
  const cx = S / 2;
  const cy = S / 2;
  const rx = S * 0.42;
  const ry = S * 0.36;
  const highlightIdx = highlight ? REGIONS.indexOf(highlight) : -1;

  // Region boundaries: 8 wedges around the center.
  for (let i = 0; i < 6000; i++) {
    // Sample a point inside an oval brain shape.
    const u = p.random();
    const v = p.random();
    const r = Math.sqrt(u);
    const theta = v * Math.PI * 2;
    const x = cx + Math.cos(theta) * r * rx;
    const y = cy + Math.sin(theta) * r * ry;

    // Add noise to displace into a brain-like irregular silhouette.
    const noise = p.noise(x * 0.012, y * 0.012);
    if (noise < 0.42) continue;

    // Determine which region this point belongs to (8 wedges by angle).
    const angle = Math.atan2(y - cy, x - cx);
    const wedge = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 8) % 8;

    const isHighlight = highlightIdx >= 0 && wedge === highlightIdx;
    const dotR = isHighlight ? 1.6 : 0.9;

    if (isHighlight) {
      // Activation gradient based on distance from region center.
      const t = 1 - r * 0.7;
      const [rr, gg, bb] = activation(t);
      p.fill(rr, gg, bb, 220);
    } else {
      const greyT = 0.35 + noise * 0.4;
      const grey = 80 + greyT * 80;
      p.fill(grey, grey - 5, grey - 12, 130);
    }
    p.circle(x, y, dotR * 2);
  }

  // Hint at the central fissure.
  p.stroke(C.ink[0], C.ink[1], C.ink[2], 30);
  p.strokeWeight(0.6);
  p.noFill();
  p.beginShape();
  for (let i = 0; i <= 30; i++) {
    const u = i / 30;
    const y = cy - ry * 0.85 + u * ry * 1.7;
    const wob = (p.noise(u * 4, 999) - 0.5) * 4;
    p.vertex(cx + wob, y);
  }
  p.endShape();
  p.noStroke();
}

// ─────────────────────────────────────────────────────────────────────
// CONVERGENCE — N wavy paths flatten into one straight line, left → right
// ─────────────────────────────────────────────────────────────────────
function drawConvergence(p: any, S: number) {
  const N = 26;
  const padX = S * 0.08;
  const w = S - padX * 2;
  const cy = S / 2;

  for (let i = 0; i < N; i++) {
    const offset = (i - N / 2) * (S * 0.6 / N);
    const hue = i / N;
    p.stroke(C.smoke[0] + (1 - hue) * 30, C.smoke[1], C.smoke[2], 110);
    p.strokeWeight(0.9);
    p.noFill();
    p.beginShape();
    for (let s = 0; s <= 100; s++) {
      const u = s / 100; // 0 → 1 left to right
      const x = padX + u * w;
      // Amplitude decays from full (left) to ~0 (right).
      const amp = (1 - u) * (1 - u) * 1;
      const wob = (p.noise(u * 3, i * 0.6) - 0.5) * S * 0.4 * amp;
      const y = cy + offset * (1 - u) + wob;
      p.vertex(x, y);
    }
    p.endShape();
  }

  // The convergence line at the right.
  p.stroke(C.accent[0], C.accent[1], C.accent[2], 240);
  p.strokeWeight(1.6);
  p.line(padX + w * 0.78, cy, padX + w, cy);
  p.noStroke();
  p.fill(C.accent[0], C.accent[1], C.accent[2]);
  p.circle(padX + w, cy, 7);
}

// ─────────────────────────────────────────────────────────────────────
// DIVERGENCE — one line on the left branches into N paths spreading right
// ─────────────────────────────────────────────────────────────────────
function drawDivergence(p: any, S: number) {
  const N = 14;
  const padX = S * 0.08;
  const w = S - padX * 2;
  const cy = S / 2;

  for (let i = 0; i < N; i++) {
    const targetY = cy + (i - (N - 1) / 2) * (S * 0.7 / (N - 1));
    const hue = i / (N - 1);
    p.stroke(C.smoke[0], C.smoke[1] + (1 - hue) * 20, C.smoke[2], 130);
    p.strokeWeight(0.9);
    p.noFill();
    p.beginShape();
    for (let s = 0; s <= 100; s++) {
      const u = s / 100;
      const x = padX + u * w;
      const amp = u * u;
      const wob = (p.noise(u * 4, i * 0.7) - 0.5) * S * 0.3 * amp;
      const y = cy + (targetY - cy) * u + wob;
      p.vertex(x, y);
    }
    p.endShape();
    // Arrow head on each branch end.
    p.fill(C.smoke[0], C.smoke[1], C.smoke[2], 180);
    p.noStroke();
    p.circle(padX + w, targetY, 3.5);
    p.stroke(C.smoke[0], C.smoke[1], C.smoke[2], 130);
    p.noFill();
  }

  // Origin dot at left.
  p.noStroke();
  p.fill(C.accent[0], C.accent[1], C.accent[2]);
  p.circle(padX, cy, 8);
  p.fill(C.accent[0], C.accent[1], C.accent[2], 60);
  p.circle(padX, cy, 16);
}

// ─────────────────────────────────────────────────────────────────────
// SWARM BRIDGES — N nodes in a ring with flickering edges between pairs
// ─────────────────────────────────────────────────────────────────────
function drawSwarmBridges(p: any, S: number, tSec: number) {
  const N = 8;
  const cx = S / 2;
  const cy = S / 2;
  const r = S * 0.36;
  const nodes: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    nodes.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }

  // Faint background edges (all pairs).
  p.stroke(C.ink[0], C.ink[1], C.ink[2], 14);
  p.strokeWeight(0.5);
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      p.line(nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1]);
    }
  }

  // Active flickering bridges (3-4 at a time).
  const ACTIVE = 4;
  for (let k = 0; k < ACTIVE; k++) {
    const phase = (tSec * 0.4 + k * 0.37) % 1;
    const i = Math.floor((p.noise(k * 1.7, Math.floor(tSec * 0.4 + k * 0.37)) * N)) % N;
    const j = (i + 1 + Math.floor(p.noise(k * 2.3, Math.floor(tSec * 0.4 + k)) * (N - 2))) % N;
    if (i === j) continue;
    const intensity = Math.sin(phase * Math.PI);
    const [rC, gC, bC] = activation(0.3 + k * 0.15);
    p.stroke(rC, gC, bC, 180 * intensity);
    p.strokeWeight(1.4);
    p.line(nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1]);
  }

  // Nodes (specialists).
  p.noStroke();
  for (let i = 0; i < N; i++) {
    const pulse = 0.5 + 0.5 * Math.sin(tSec * 1.2 + i);
    p.fill(C.accent[0], C.accent[1], C.accent[2], 60 + pulse * 50);
    p.circle(nodes[i][0], nodes[i][1], 18);
    p.fill(C.accent[0], C.accent[1], C.accent[2]);
    p.circle(nodes[i][0], nodes[i][1], 8);
  }
}

// ─────────────────────────────────────────────────────────────────────
// ACTIVATION PULSE — single region (irregular blob) pulsing fire colormap
// ─────────────────────────────────────────────────────────────────────
function drawActivationPulse(p: any, S: number, tSec: number, highlight?: string) {
  const cx = S / 2;
  const cy = S / 2;
  const baseR = S * 0.32;
  const pulse = 0.5 + 0.5 * Math.sin(tSec * 1.6);

  // Outer aura.
  for (let layer = 6; layer >= 0; layer--) {
    const t = layer / 6;
    const radius = baseR + layer * 6 + pulse * 8;
    const [rr, gg, bb] = activation(0.4 + t * 0.5);
    p.noFill();
    p.stroke(rr, gg, bb, 30 - layer * 4);
    p.strokeWeight(1.5);
    p.beginShape();
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const wob = p.noise(Math.cos(a) * 0.5 + 1, Math.sin(a) * 0.5 + 1, layer * 0.2) * 12;
      p.vertex(cx + Math.cos(a) * (radius + wob), cy + Math.sin(a) * (radius + wob));
    }
    p.endShape(p.CLOSE);
  }

  // Stippled fill.
  p.noStroke();
  for (let i = 0; i < 1200; i++) {
    const u = p.random();
    const v = p.random();
    const r = Math.sqrt(u) * baseR;
    const theta = v * Math.PI * 2;
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r;
    const t = 1 - r / baseR;
    const [rr, gg, bb] = activation(0.3 + t * 0.7);
    p.fill(rr, gg, bb, 60 + t * 140);
    p.circle(x, y, 1.5 + t * 1.5);
  }

  // Label.
  if (highlight) {
    p.fill(C.smoke[0], C.smoke[1], C.smoke[2], 200);
    p.textFont("monospace");
    p.textSize(10);
    p.textAlign(p.CENTER);
    p.text(highlight.toLowerCase(), cx, cy + baseR + 20);
  }
}

// ─────────────────────────────────────────────────────────────────────
// FEED GRID — grid of phone-screens with synchronized scroll
// ─────────────────────────────────────────────────────────────────────
function drawFeedGrid(p: any, S: number) {
  const cols = 3;
  const rows = 4;
  const padX = S * 0.06;
  const padY = S * 0.06;
  const gap = S * 0.025;
  const cw = (S - padX * 2 - gap * (cols - 1)) / cols;
  const ch = (S - padY * 2 - gap * (rows - 1)) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = padX + col * (cw + gap);
      const y = padY + row * (ch + gap);

      // Phone outline.
      p.noStroke();
      p.fill(C.smoke[0], C.smoke[1], C.smoke[2], 22);
      p.rect(x, y, cw, ch, 4);

      // Synchronized "Reels" content — same content per row, slightly offset across columns.
      const seed = row * 10 + col;
      const frameY = y + 6;
      const frameH = ch - 12;
      // Image area top.
      p.fill(C.smoke[0], C.smoke[1], C.smoke[2], 60);
      p.rect(x + 6, frameY, cw - 12, frameH * 0.62, 2);

      // Stippled "image" inside the frame, deterministic per row (same content!)
      for (let i = 0; i < 18; i++) {
        const sx = x + 6 + p.noise(seed * 0.1, i * 0.3) * (cw - 12);
        const sy = frameY + p.noise(seed * 0.2, i * 0.5 + 99) * frameH * 0.62;
        const t = p.noise(row * 0.5, i * 0.4);
        p.fill(C.ink[0], C.ink[1], C.ink[2], 80 + t * 80);
        p.circle(sx, sy, 1.5 + t * 1.5);
      }

      // Text-ish lines below.
      p.fill(C.smoke[0], C.smoke[1], C.smoke[2], 90);
      p.rect(x + 6, frameY + frameH * 0.7, cw - 18, 2);
      p.rect(x + 6, frameY + frameH * 0.78, cw - 30, 2);
      p.rect(x + 6, frameY + frameH * 0.86, cw - 24, 2);
    }
  }

  // Convergence note at the bottom — all phones show the same thing.
  p.fill(C.accent[0], C.accent[1], C.accent[2]);
  p.noStroke();
  p.textFont("monospace");
  p.textSize(9);
  p.textAlign(p.CENTER);
  p.text("twelve phones · one feed", S / 2, S - 10);
}

// ─────────────────────────────────────────────────────────────────────
// React component
// ─────────────────────────────────────────────────────────────────────
export default function BrainCanvas({
  variant,
  seed = 7,
  size = 480,
  highlight,
  className,
}: Props) {
  const sketch = useMemo(
    () => makeSketch(variant, seed, size, highlight),
    [variant, seed, size, highlight],
  );
  return (
    <div
      className={className}
      style={{ width: size, height: size, lineHeight: 0 }}
    >
      <P5Canvas sketch={sketch} />
    </div>
  );
}
