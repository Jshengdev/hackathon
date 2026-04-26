"use client";

import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { dotColors, palette, pickDot } from "../palette";
import { clamp01, easeInOut, easeOut, lerp, makeNoise, mulberry32 } from "../lib/rng";

export type HalftoneVariant =
  | "feed-grid-converge"
  | "particles-implode-explode"
  | "hand-pinch"
  | "vault-unfold"
  | "constellation-draw"
  | "wordmark-dust"
  | "glasses-scan"
  | "room-unfold"
  | "capture-pulse";

type Props = {
  variant: HalftoneVariant;
  frame: number;
  durationInFrames: number;
  seed?: number;
  width: number;
  height: number;
};

/**
 * Single Canvas2D halftone renderer.
 *
 * Every variant is a pure function of (frame, durationInFrames, seed). We render
 * into a canvas on mount, then re-render whenever the frame changes — Remotion
 * dispatches React re-renders per frame, so this matches that model.
 */
export function Halftone({ variant, frame, durationInFrames, seed = 42, width, height }: Props) {
  const t = clamp01(frame / Math.max(1, durationInFrames - 1));

  const canvasRef = useMemo(() => {
    const off = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(width, height) : null;
    return off;
  }, [width, height]);

  // Draw into a DOM canvas via ref.
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <HalftoneCanvas
        variant={variant}
        t={t}
        seed={seed}
        width={width}
        height={height}
        _off={canvasRef}
      />
    </AbsoluteFill>
  );
}

function HalftoneCanvas({
  variant,
  t,
  seed,
  width,
  height,
  _off,
}: {
  variant: HalftoneVariant;
  t: number;
  seed: number;
  width: number;
  height: number;
  _off: OffscreenCanvas | null;
}) {
  // Re-render via inline rAF-less draw. Using a callback ref so the canvas
  // paints synchronously with each React render (once per Remotion frame).
  const setRef = (node: HTMLCanvasElement | null) => {
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    switch (variant) {
      case "feed-grid-converge":
        drawFeedGridConverge(ctx, t, seed, width, height);
        break;
      case "particles-implode-explode":
        drawParticlesImplodeExplode(ctx, t, seed, width, height);
        break;
      case "hand-pinch":
        drawHandPinch(ctx, t, seed, width, height);
        break;
      case "vault-unfold":
        drawVaultUnfold(ctx, t, seed, width, height);
        break;
      case "constellation-draw":
        drawConstellationDraw(ctx, t, seed, width, height);
        break;
      case "wordmark-dust":
        drawWordmarkDust(ctx, t, seed, width, height);
        break;
      case "glasses-scan":
        drawGlassesScan(ctx, t, seed, width, height);
        break;
      case "room-unfold":
        drawRoomUnfold(ctx, t, seed, width, height);
        break;
      case "capture-pulse":
        drawCapturePulse(ctx, t, seed, width, height);
        break;
    }
    ctx.restore();
  };

  return (
    <canvas
      ref={setRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ───────────────── Drawers ─────────────────

type Ctx = CanvasRenderingContext2D;
type RGB = readonly [number, number, number];

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * Variant 1: 4×4 mosaic of halftone tiles. Each tile starts with its own noise
 * seed (variety), and over time all 16 tiles converge toward the SAME pattern —
 * the visual metaphor for "your taste got optimized out."
 */
function drawFeedGridConverge(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const e = easeInOut(t);
  const cols = 4;
  const rows = 4;
  const pad = W * 0.04;
  const cellW = (W - pad * 2) / cols;
  const cellH = (H - pad * 2) / rows;
  const step = Math.max(6, cellW * 0.055);

  // Target noise — what every cell is converging toward
  const targetNoise = makeNoise(seed + 999);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = pad + col * cellW;
      const y0 = pad + row * cellH;
      const cellSeed = seed + row * cols + col;
      const ownNoise = makeNoise(cellSeed);
      const innerPad = cellW * 0.08;

      // Subtle cell frame
      ctx.strokeStyle = palette.hair;
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, cellW - 1, cellH - 1);

      for (let dy = y0 + innerPad; dy < y0 + cellH - innerPad; dy += step) {
        for (let dx = x0 + innerPad; dx < x0 + cellW - innerPad; dx += step) {
          // Normalize the sample position to the tile so all tiles can share
          // the same "target" texture at t=1.
          const nx = ((dx - x0) / cellW) * 14;
          const ny = ((dy - y0) / cellH) * 14;
          const own = ownNoise(nx, ny);
          const target = targetNoise(nx, ny);
          const n = lerp(own, target, e);
          const color = pickDot(n);
          const alpha = 0.25 + n * 0.6;
          ctx.fillStyle = rgba(color, alpha);
          const r = step * (0.28 + n * 0.28);
          ctx.beginPath();
          ctx.arc(dx, dy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

/**
 * Variant 2: particle field that first implodes toward center (convergence),
 * then explodes outward radially (divergence). The flip happens at t=0.5.
 */
function drawParticlesImplodeExplode(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const cx = W / 2;
  const cy = H / 2;
  const maxR = Math.min(W, H) * 0.42;
  const count = 900;

  // Two-phase: 0→0.5 = implode, 0.5→1 = explode
  const phase = t < 0.5 ? "in" : "out";
  const pt = phase === "in" ? easeInOut(t / 0.5) : easeOut((t - 0.5) / 0.5);

  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r0 = lerp(maxR * 0.15, maxR, rand());
    const r =
      phase === "in"
        ? lerp(r0, maxR * 0.08, pt)
        : lerp(maxR * 0.08, r0 * 1.35, pt);
    const jitter = (rand() - 0.5) * (phase === "out" ? 12 * pt : 2);
    const px = cx + Math.cos(a) * r + jitter;
    const py = cy + Math.sin(a) * r + jitter;
    const size = lerp(1.4, 4, rand());
    const color =
      phase === "out" && rand() < 0.08
        ? ([0, 113, 227] as RGB) // accent fleck on explosion
        : dotColors[Math.floor(rand() * dotColors.length)];
    const alpha = phase === "in" ? 0.35 + pt * 0.4 : 0.75 - pt * 0.4;
    ctx.fillStyle = rgba(color, alpha);
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central pulse ring at the flip point
  if (t > 0.42 && t < 0.58) {
    const pulse = 1 - Math.abs(t - 0.5) / 0.08;
    ctx.strokeStyle = rgba([0, 113, 227], pulse * 0.6);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.14 + pulse * 18, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/**
 * Variant 3: hand silhouette halftone, pinch gesture. Thumb + index close to
 * meet over first half, then a blue ring pulses outward from the pinch point.
 */
function drawHandPinch(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const noise = makeNoise(seed);

  // Pinch progress (thumb + index close over 0→0.55)
  const pinch = easeInOut(clamp01(t / 0.55));
  // Ring pulse over 0.5→1
  const ring = easeOut(clamp01((t - 0.5) / 0.5));

  // Draw halftone silhouette of a hand in pinch pose, offscreen-style
  // We'll sample a procedurally-described hand shape and halftone it.

  // Hand base rects + finger angles (parametric)
  const palmX = W * 0.32;
  const palmY = H * 0.44;
  const palmW = W * 0.36;
  const palmH = H * 0.3;

  // Render hand as a mask into a temp canvas, then halftone-sample it.
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const m = mask.getContext("2d");
  if (!m) return;
  m.fillStyle = "#000";

  roundedRect(m, palmX, palmY, palmW, palmH, W * 0.08);
  m.fill();

  // Thumb — rotates toward index as pinch → 1
  const thumbAngle = lerp(-0.9, -0.35, pinch);
  m.save();
  m.translate(W * 0.38, H * 0.47);
  m.rotate(thumbAngle);
  roundedRect(m, -W * 0.045, -H * 0.22, W * 0.09, H * 0.22, W * 0.04);
  m.fill();
  m.restore();

  // Index — rotates slightly toward thumb
  const indexAngle = lerp(-0.05, -0.22, pinch);
  m.save();
  m.translate(W * 0.46, H * 0.44);
  m.rotate(indexAngle);
  roundedRect(m, -W * 0.04, -H * 0.32, W * 0.08, H * 0.32, W * 0.04);
  m.fill();
  m.restore();

  // Middle, ring (static curl)
  m.save();
  m.translate(W * 0.55, H * 0.44);
  m.rotate(0.05);
  roundedRect(m, -W * 0.04, -H * 0.2, W * 0.08, H * 0.2, W * 0.035);
  m.fill();
  m.restore();
  m.save();
  m.translate(W * 0.62, H * 0.46);
  m.rotate(0.14);
  roundedRect(m, -W * 0.035, -H * 0.15, W * 0.07, H * 0.15, W * 0.03);
  m.fill();
  m.restore();

  // Wrist
  roundedRect(m, W * 0.38, H * 0.72, W * 0.24, H * 0.22, W * 0.06);
  m.fill();

  // Halftone-sample the mask
  const img = m.getImageData(0, 0, W, H);
  const step = Math.max(6, W * 0.014);
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const idx = 4 * (Math.floor(y) * W + Math.floor(x));
      const a = img.data[idx + 3] / 255;
      if (a < 0.1) continue;
      const jx = x + (rand() - 0.5) * step * 0.2;
      const jy = y + (rand() - 0.5) * step * 0.2;
      const n = noise(x * 0.04, y * 0.04);
      const color = pickDot(n);
      ctx.fillStyle = rgba(color, 0.5 + a * 0.35);
      ctx.beginPath();
      ctx.arc(jx, jy, step * (0.3 + a * 0.25), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pinch point marker
  const px = lerp(W * 0.36, W * 0.44, pinch);
  const py = lerp(H * 0.27, H * 0.3, pinch);

  // Pinch indicator glow as pinch closes
  if (pinch > 0.7) {
    const glow = (pinch - 0.7) / 0.3;
    ctx.fillStyle = rgba([0, 113, 227], 0.15 + glow * 0.5);
    ctx.beginPath();
    ctx.arc(px, py, 10 + glow * 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ring pulse outward after pinch
  if (ring > 0) {
    const ringR = ring * W * 0.55;
    ctx.strokeStyle = rgba([0, 113, 227], 0.6 * (1 - ring));
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = rgba([0, 113, 227], 0.25 * (1 - ring));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py, ringR * 0.65, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/**
 * Variant 4: glassmorphic tiles unfolding outward from center. Each tile has a
 * staggered reveal time — a spatial "vault unfold".
 */
function drawVaultUnfold(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const tiles = 14;
  const cx = W / 2;
  const cy = H / 2;

  // Pre-compute tile positions (stable across frames)
  const tileSpecs: {
    tx: number;
    ty: number;
    tw: number;
    th: number;
    opacity: number;
    delay: number;
    rot: number;
  }[] = [];
  for (let i = 0; i < tiles; i++) {
    const angle = rand() * Math.PI * 2;
    const r = lerp(W * 0.12, W * 0.38, rand());
    tileSpecs.push({
      tx: cx + Math.cos(angle) * r,
      ty: cy + Math.sin(angle) * r,
      tw: lerp(W * 0.08, W * 0.18, rand()),
      th: lerp(H * 0.06, H * 0.15, rand()),
      opacity: lerp(0.4, 0.9, rand()),
      delay: rand() * 0.55,
      rot: (rand() - 0.5) * 0.12,
    });
  }

  for (const s of tileSpecs) {
    const local = clamp01((t - s.delay) / 0.45);
    if (local <= 0) continue;
    const e = easeOut(local);
    const scale = 0.3 + e * 0.7;
    const alpha = e * s.opacity;

    ctx.save();
    ctx.translate(s.tx, s.ty);
    ctx.rotate(s.rot);
    ctx.globalAlpha = alpha;

    const w = s.tw * scale;
    const h = s.th * scale;
    // Glass fill
    ctx.fillStyle = rgba([255, 255, 255], 0.55);
    roundedRect(ctx, -w / 2, -h / 2, w, h, 6);
    ctx.fill();
    // Hairline border
    ctx.strokeStyle = rgba([29, 29, 31], 0.25);
    ctx.lineWidth = 1;
    ctx.stroke();
    // Inner halftone speckle
    const noise = makeNoise(seed + Math.floor(s.tx));
    const dotStep = 4;
    for (let y = -h / 2 + 4; y < h / 2 - 2; y += dotStep) {
      for (let x = -w / 2 + 4; x < w / 2 - 2; x += dotStep) {
        const n = noise((x + 100) * 0.1, (y + 100) * 0.1);
        if (n < 0.48) continue;
        const color = pickDot(n);
        ctx.fillStyle = rgba(color, 0.35);
        ctx.beginPath();
        ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

/**
 * Variant 5: constellation. Nodes fade in, connecting lines draw between close pairs.
 */
function drawConstellationDraw(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const count = 34;
  const nodes: { x: number; y: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: rand() * W * 0.8 + W * 0.1,
      y: rand() * H * 0.8 + H * 0.1,
      delay: rand() * 0.55,
    });
  }
  // Lines (drawn first, underneath)
  const linkDist = W * 0.18;
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d > linkDist) continue;
      const linkDelay = Math.max(nodes[i].delay, nodes[j].delay) + 0.1;
      const local = clamp01((t - linkDelay) / 0.35);
      if (local <= 0) continue;
      const progress = easeOut(local);
      const ax = lerp(nodes[i].x, nodes[j].x, 0);
      const ay = lerp(nodes[i].y, nodes[j].y, 0);
      const bx = lerp(nodes[i].x, nodes[j].x, progress);
      const by = lerp(nodes[i].y, nodes[j].y, progress);
      ctx.strokeStyle = rgba([90, 99, 107], 0.28 * (1 - d / linkDist));
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }
  // Nodes
  for (const n of nodes) {
    const local = clamp01((t - n.delay) / 0.25);
    if (local <= 0) continue;
    const e = easeOut(local);
    ctx.fillStyle = rgba([29, 29, 31], 0.85 * e);
    ctx.beginPath();
    ctx.arc(n.x, n.y, 3 + e * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Variant 6: wordmark dust — a fine noise field drifting across the frame, used
 * as the backdrop for the shpatial ident. Very subtle.
 */
function drawWordmarkDust(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const drift = t * 24;
  const count = 220;
  for (let i = 0; i < count; i++) {
    const bx = rand() * W;
    const by = rand() * H;
    const x = (bx + drift * (0.4 + rand() * 0.8)) % W;
    const y = (by + drift * 0.2) % H;
    ctx.fillStyle = rgba([29, 29, 31], 0.06 + rand() * 0.08);
    ctx.beginPath();
    ctx.arc(x, y, rand() * 1.6 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Variant 7: glasses-scan — halftone glasses silhouette with a scan sweep,
 * reticules appearing on "objects" after activation. The tool arrives.
 */
function drawGlassesScan(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const noise = makeNoise(seed + 11);

  const cy = H * 0.5;
  const cxL = W * 0.35;
  const cxR = W * 0.65;
  const lensR = Math.min(W, H) * 0.18;

  // Mask: two lens circles + bridge + temples
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const m = mask.getContext("2d");
  if (!m) return;
  m.fillStyle = "#000";
  m.lineWidth = Math.max(8, W * 0.012);
  m.strokeStyle = "#000";
  m.beginPath();
  m.arc(cxL, cy, lensR, 0, Math.PI * 2);
  m.stroke();
  m.beginPath();
  m.arc(cxR, cy, lensR, 0, Math.PI * 2);
  m.stroke();
  // Bridge
  m.beginPath();
  m.moveTo(cxL + lensR, cy);
  m.lineTo(cxR - lensR, cy);
  m.stroke();
  // Temples
  m.beginPath();
  m.moveTo(cxL - lensR, cy);
  m.lineTo(cxL - lensR - W * 0.09, cy - H * 0.02);
  m.stroke();
  m.beginPath();
  m.moveTo(cxR + lensR, cy);
  m.lineTo(cxR + lensR + W * 0.09, cy - H * 0.02);
  m.stroke();

  // Halftone-sample the glasses outline
  const img = m.getImageData(0, 0, W, H);
  const step = Math.max(5, W * 0.012);
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const idx = 4 * (Math.floor(y) * W + Math.floor(x));
      const a = img.data[idx + 3] / 255;
      if (a < 0.1) continue;
      const n = noise(x * 0.05, y * 0.05);
      const color = pickDot(n);
      ctx.fillStyle = rgba(color, 0.5 + a * 0.35);
      ctx.beginPath();
      ctx.arc(x + (rand() - 0.5) * step * 0.25, y + (rand() - 0.5) * step * 0.25, step * (0.3 + a * 0.28), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Scan sweep across lenses (t: 0.15 → 0.55)
  const scanT = clamp01((t - 0.15) / 0.4);
  if (scanT > 0 && scanT < 1) {
    const scanX = lerp(W * 0.18, W * 0.82, scanT);
    const grad = ctx.createLinearGradient(scanX - 40, 0, scanX + 40, 0);
    grad.addColorStop(0, rgba([0, 113, 227], 0));
    grad.addColorStop(0.5, rgba([0, 113, 227], 0.45));
    grad.addColorStop(1, rgba([0, 113, 227], 0));
    ctx.fillStyle = grad;
    ctx.fillRect(scanX - 40, cy - lensR * 1.2, 80, lensR * 2.4);
  }

  // Reticule targets after scan completes
  if (t > 0.6) {
    const targets = [
      { x: W * 0.22, y: H * 0.28, delay: 0 },
      { x: W * 0.78, y: H * 0.3, delay: 0.08 },
      { x: W * 0.28, y: H * 0.74, delay: 0.16 },
      { x: W * 0.74, y: H * 0.72, delay: 0.22 },
    ];
    for (const tg of targets) {
      const local = clamp01((t - 0.6 - tg.delay) / 0.2);
      if (local <= 0) continue;
      const e = easeOut(local);
      const r = 14 + e * 4;
      ctx.strokeStyle = rgba([0, 113, 227], 0.6 * e);
      ctx.lineWidth = 1.5;
      // Corner brackets (L-shaped)
      const b = 6;
      ctx.beginPath();
      ctx.moveTo(tg.x - r, tg.y - r + b);
      ctx.lineTo(tg.x - r, tg.y - r);
      ctx.lineTo(tg.x - r + b, tg.y - r);
      ctx.moveTo(tg.x + r - b, tg.y - r);
      ctx.lineTo(tg.x + r, tg.y - r);
      ctx.lineTo(tg.x + r, tg.y - r + b);
      ctx.moveTo(tg.x + r, tg.y + r - b);
      ctx.lineTo(tg.x + r, tg.y + r);
      ctx.lineTo(tg.x + r - b, tg.y + r);
      ctx.moveTo(tg.x - r + b, tg.y + r);
      ctx.lineTo(tg.x - r, tg.y + r);
      ctx.lineTo(tg.x - r, tg.y + r - b);
      ctx.stroke();
      // Center dot
      ctx.fillStyle = rgba([0, 113, 227], 0.7 * e);
      ctx.beginPath();
      ctx.arc(tg.x, tg.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Bridge pulse at activation
  if (t > 0.5 && t < 0.68) {
    const pulse = 1 - Math.abs(t - 0.59) / 0.09;
    ctx.fillStyle = rgba([0, 113, 227], 0.28 * pulse);
    ctx.beginPath();
    ctx.arc(W * 0.5, cy, 8 + pulse * 18, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Variant 8: room-unfold — floor grid in perspective + glass tiles rising from
 * floor points and settling into orbit. The "unfold as 3D collage in your room".
 */
function drawRoomUnfold(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const horizon = H * 0.52;

  // Floor grid — halftone dots in perspective
  const rows = 18;
  for (let r = 0; r < rows; r++) {
    const rt = r / rows;
    const y = horizon + (H - horizon) * rt * rt;
    const cols = 24 + Math.floor(rt * 18);
    for (let c = 0; c < cols; c++) {
      const ct = c / (cols - 1);
      const spread = lerp(0.15, 0.92, rt);
      const x = W * 0.5 + (ct - 0.5) * W * spread;
      const alpha = 0.08 + rt * 0.2;
      ctx.fillStyle = rgba([29, 29, 31], alpha);
      ctx.beginPath();
      ctx.arc(x, y, 1 + rt * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Back wall dust
  const noise = makeNoise(seed + 7);
  const wallStep = 10;
  for (let y = 0; y < horizon; y += wallStep) {
    for (let x = 0; x < W; x += wallStep) {
      const n = noise(x * 0.02, y * 0.03);
      if (n < 0.55) continue;
      ctx.fillStyle = rgba([29, 29, 31], 0.05 + n * 0.08);
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Glass tiles — rising from floor anchors
  type Tile = { anchorX: number; anchorY: number; restX: number; restY: number; w: number; h: number; delay: number; float: number };
  const tiles: Tile[] = [];
  const tileCount = 7;
  for (let i = 0; i < tileCount; i++) {
    const ax = W * (0.2 + rand() * 0.6);
    const ay = horizon + (H - horizon) * (0.2 + rand() * 0.6);
    const rx = ax + (rand() - 0.5) * W * 0.08;
    const ry = lerp(horizon - H * 0.1, H * 0.18, rand());
    tiles.push({
      anchorX: ax,
      anchorY: ay,
      restX: rx,
      restY: ry,
      w: lerp(W * 0.09, W * 0.16, rand()),
      h: lerp(H * 0.1, H * 0.17, rand()),
      delay: rand() * 0.5,
      float: rand() * Math.PI * 2,
    });
  }

  for (let i = 0; i < tiles.length; i++) {
    const s = tiles[i];
    const local = clamp01((t - s.delay) / 0.5);
    if (local <= 0) continue;
    const e = easeOut(local);
    const x = lerp(s.anchorX, s.restX, e);
    const y = lerp(s.anchorY, s.restY, e) + Math.sin(t * 6 + s.float) * 4 * e;
    const scale = lerp(0.2, 1, e);
    const alpha = e * 0.9;
    const w = s.w * scale;
    const h = s.h * scale;

    // Rising trail
    if (local < 0.85) {
      ctx.strokeStyle = rgba([0, 113, 227], 0.15 * (1 - local));
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(s.anchorX, s.anchorY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    // Glass fill
    ctx.fillStyle = rgba([255, 255, 255], 0.58);
    roundedRect(ctx, -w / 2, -h / 2, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = rgba([29, 29, 31], 0.3);
    ctx.lineWidth = 1;
    ctx.stroke();
    // Inner speckle
    const tileNoise = makeNoise(seed + i * 13);
    for (let py = -h / 2 + 4; py < h / 2 - 2; py += 4) {
      for (let px = -w / 2 + 4; px < w / 2 - 2; px += 4) {
        const n = tileNoise((px + 50) * 0.1, (py + 50) * 0.1);
        if (n < 0.5) continue;
        ctx.fillStyle = rgba(pickDot(n), 0.35);
        ctx.beginPath();
        ctx.arc(px, py, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Anchor dot on floor
    if (local > 0.05) {
      ctx.fillStyle = rgba([0, 113, 227], 0.4);
      ctx.beginPath();
      ctx.arc(s.anchorX, s.anchorY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Constellation links between tiles (late)
  if (t > 0.7) {
    const linkT = clamp01((t - 0.7) / 0.3);
    const linkE = easeOut(linkT);
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        const a = tiles[i];
        const b = tiles[j];
        const dx = a.restX - b.restX;
        const dy = a.restY - b.restY;
        const d = Math.hypot(dx, dy);
        if (d > W * 0.22) continue;
        ctx.strokeStyle = rgba([0, 113, 227], 0.22 * linkE);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.restX, a.restY);
        ctx.lineTo(b.restX, b.restY);
        ctx.stroke();
      }
    }
  }
}

/**
 * Variant 9: capture-pulse — noisy field where a subset of particles converges
 * into a portrait silhouette, then radiates outward. "What you notice gets kept."
 */
function drawCapturePulse(ctx: Ctx, t: number, seed: number, W: number, H: number) {
  const rand = mulberry32(seed);
  const cx = W / 2;
  const cy = H * 0.55;

  // Portrait target mask: head (circle) + shoulders (rounded trapezoid)
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const m = mask.getContext("2d");
  if (!m) return;
  m.fillStyle = "#000";
  m.beginPath();
  m.arc(cx, cy - H * 0.12, H * 0.14, 0, Math.PI * 2);
  m.fill();
  // Shoulders
  m.beginPath();
  m.moveTo(cx - W * 0.22, H * 0.85);
  m.quadraticCurveTo(cx - W * 0.16, cy + H * 0.02, cx, cy + H * 0.04);
  m.quadraticCurveTo(cx + W * 0.16, cy + H * 0.02, cx + W * 0.22, H * 0.85);
  m.lineTo(cx + W * 0.22, H);
  m.lineTo(cx - W * 0.22, H);
  m.closePath();
  m.fill();
  const img = m.getImageData(0, 0, W, H);

  const count = 800;
  // Particle set — each has a random origin and a target sampled from the mask
  const particles: { ox: number; oy: number; tx: number; ty: number; stays: boolean; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    const ox = rand() * W;
    const oy = rand() * H;
    // Try to find a mask-hit target by sampling
    let tx = ox;
    let ty = oy;
    let stays = false;
    for (let tries = 0; tries < 6; tries++) {
      const cxS = rand() * W;
      const cyS = rand() * H;
      const idx = 4 * (Math.floor(cyS) * W + Math.floor(cxS));
      if (img.data[idx + 3] > 128) {
        tx = cxS;
        ty = cyS;
        stays = true;
        break;
      }
    }
    particles.push({ ox, oy, tx, ty, stays, delay: rand() * 0.3 });
  }

  // Phase: converge 0→0.55, hold 0.55→0.85, disperse residual particles
  const converge = clamp01(t / 0.55);
  const convE = easeInOut(converge);

  for (const p of particles) {
    const local = clamp01((t - p.delay) / 0.6);
    if (local <= 0) continue;
    let x = p.ox;
    let y = p.oy;
    if (p.stays) {
      x = lerp(p.ox, p.tx, convE);
      y = lerp(p.oy, p.ty, convE);
    } else {
      // Non-portrait particles drift outward post 0.55
      if (t > 0.55) {
        const out = easeOut((t - 0.55) / 0.45);
        const dx = (p.ox - cx) * (1 + out * 0.8);
        const dy = (p.oy - cy) * (1 + out * 0.8);
        x = cx + dx;
        y = cy + dy;
      }
    }
    const alpha = p.stays
      ? 0.3 + convE * 0.5
      : lerp(0.35, 0.05, clamp01((t - 0.55) / 0.35));
    const color = p.stays && t > 0.55 && rand() < 0.08 ? ([0, 113, 227] as RGB) : dotColors[Math.floor(rand() * dotColors.length)];
    ctx.fillStyle = rgba(color, alpha);
    ctx.beginPath();
    ctx.arc(x, y, p.stays ? 1.6 + convE * 0.8 : 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Capture ring pulse at t≈0.58
  if (t > 0.55 && t < 0.78) {
    const pulse = clamp01((t - 0.55) / 0.23);
    const e = easeOut(pulse);
    ctx.strokeStyle = rgba([0, 113, 227], 0.5 * (1 - e));
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - H * 0.02, 20 + e * Math.min(W, H) * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = rgba([0, 113, 227], 0.25 * (1 - e));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy - H * 0.02, 20 + e * Math.min(W, H) * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ────────────── helpers ──────────────
function roundedRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
