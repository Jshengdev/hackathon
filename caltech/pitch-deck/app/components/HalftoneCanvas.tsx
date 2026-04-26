"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";
import { useMemo } from "react";

export type HalftoneVariant =
  | "scatter"
  | "portrait"
  | "glasses"
  | "plant"
  | "hand"
  | "room"
  | "vault"
  | "feed-grid"
  | "silhouette"
  | "dissolve"
  | "particles"
  | "empty-frame"
  | "constellation"
  | "spiral"
  | "orbit";

type Props = {
  variant: HalftoneVariant;
  seed?: number;
  size?: number; // px width of square
  density?: number; // grid cell size, smaller = denser
  className?: string;
};

// Palette aligned with globals.css — cool slate + single cool-blue accent
const COLORS = {
  ink: [29, 29, 31],
  smoke: [58, 61, 69],
  graphite: [90, 99, 107],
  slate: [134, 134, 139],
  accent: [0, 113, 227],
  accentSoft: [74, 111, 165],
  ivory: [247, 247, 245],
};

function pickColor(p: number): [number, number, number] {
  // Weighted: mostly cool grays, rare accent flecks.
  const arr = [
    COLORS.ink,
    COLORS.smoke,
    COLORS.graphite,
    COLORS.slate,
    COLORS.graphite,
    COLORS.accentSoft,
  ];
  return arr[Math.floor(p * arr.length) % arr.length] as [number, number, number];
}

function makeSketch(variant: HalftoneVariant, seed: number, canvasSize: number, density: number): Sketch {
  return (p) => {
    let src: ReturnType<typeof p.createGraphics>;
    const step = density;

    p.setup = () => {
      p.createCanvas(canvasSize, canvasSize);
      p.pixelDensity(2);
      p.noLoop();
      p.noStroke();
      src = p.createGraphics(canvasSize, canvasSize);
      src.pixelDensity(2);
      src.noStroke();
      drawSource(src);
      render();
    };

    p.windowResized = () => {
      // no-op; canvas size is prop driven
    };

    function drawSource(g: ReturnType<typeof p.createGraphics>) {
      g.clear();
      p.randomSeed(seed);
      p.noiseSeed(seed);
      const w = canvasSize;
      const h = canvasSize;
      g.fill(0);

      switch (variant) {
        case "portrait":
          drawPortrait(g, w, h);
          break;
        case "glasses":
          drawGlasses(g, w, h);
          break;
        case "plant":
          drawPlant(g, w, h);
          break;
        case "hand":
          drawHand(g, w, h);
          break;
        case "room":
          drawRoom(g, w, h);
          break;
        case "vault":
          drawVault(g, w, h);
          break;
        case "feed-grid":
          drawFeedGrid(g, w, h);
          break;
        case "silhouette":
          drawSilhouette(g, w, h);
          break;
        case "dissolve":
          drawDissolve(g, w, h);
          break;
        case "particles":
          drawParticles(g, w, h);
          break;
        case "empty-frame":
          drawEmptyFrame(g, w, h);
          break;
        case "constellation":
          drawConstellation(g, w, h);
          break;
        case "spiral":
          drawSpiral(g, w, h);
          break;
        case "orbit":
          drawOrbit(g, w, h);
          break;
        case "scatter":
        default:
          drawScatter(g, w, h);
          break;
      }
    }

    function render() {
      p.clear();
      const w = p.width;
      const h = p.height;

      if (variant === "feed-grid") {
        // render feed grid directly without halftone sampling — it's already cellular
        p.image(src, 0, 0);
        return;
      }

      src.loadPixels();
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const jitter = (variant === "dissolve" || variant === "particles" || variant === "constellation") ? step * 0.6 : step * 0.15;
          const jx = x + (p.random() - 0.5) * jitter;
          const jy = y + (p.random() - 0.5) * jitter;
          const px = Math.floor(jx);
          const py = Math.floor(jy);
          if (px < 0 || py < 0 || px >= w || py >= h) continue;
          const idx = 4 * (py * (src.width * src.pixelDensity()) + px * src.pixelDensity());
          const a = src.pixels[idx + 3] / 255;
          if (a < 0.05) continue;
          const shade = (src.pixels[idx] + src.pixels[idx + 1] + src.pixels[idx + 2]) / (3 * 255);
          const noiseSample = p.noise(x * 0.02, y * 0.02);
          const [r, g2, b] = pickColor(noiseSample);
          const alpha = 255 * a * (0.55 + 0.35 * (1 - shade));
          p.fill(r, g2, b, alpha);
          const r2 = p.random();
          const radius = (step * 0.45) * (0.55 + a * 0.7);
          if (r2 < 0.2) {
            p.rect(jx - radius / 2, jy - radius / 2, radius, radius);
          } else if (r2 < 0.35) {
            p.push();
            p.translate(jx, jy);
            p.rotate(Math.PI / 4);
            p.rect(-radius / 2, -radius / 2, radius, radius);
            p.pop();
          } else {
            p.circle(jx, jy, radius);
          }
        }
      }
    }

    // ===== Shape sources =====

    function drawPortrait(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.fill(0, 220);
      // head
      g.ellipse(w / 2, h * 0.45, w * 0.5, h * 0.62);
      // hair
      g.beginShape();
      g.vertex(w * 0.27, h * 0.4);
      g.bezierVertex(w * 0.27, h * 0.16, w * 0.73, h * 0.16, w * 0.73, h * 0.4);
      g.bezierVertex(w * 0.78, h * 0.55, w * 0.7, h * 0.65, w * 0.65, h * 0.66);
      g.bezierVertex(w * 0.62, h * 0.5, w * 0.38, h * 0.5, w * 0.35, h * 0.66);
      g.bezierVertex(w * 0.3, h * 0.65, w * 0.22, h * 0.55, w * 0.27, h * 0.4);
      g.endShape(g.CLOSE);
      // shoulders
      g.fill(0, 180);
      g.ellipse(w / 2, h * 0.95, w * 0.95, h * 0.3);
      // eyes (erase)
      g.erase();
      g.ellipse(w * 0.42, h * 0.45, w * 0.06, h * 0.02);
      g.ellipse(w * 0.58, h * 0.45, w * 0.06, h * 0.02);
      g.rect(w * 0.47, h * 0.57, w * 0.06, h * 0.005);
      g.noErase();
    }

    function drawGlasses(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.push();
      g.translate(w / 2, h / 2);
      g.noFill();
      g.stroke(0, 240);
      g.strokeWeight(w * 0.02);
      // left lens
      g.rect(-w * 0.38, -h * 0.12, w * 0.3, h * 0.24, w * 0.02);
      // right lens
      g.rect(w * 0.08, -h * 0.12, w * 0.3, h * 0.24, w * 0.02);
      // bridge
      g.line(-w * 0.08, -h * 0.02, w * 0.08, -h * 0.02);
      // temples
      g.line(-w * 0.38, -h * 0.08, -w * 0.48, -h * 0.12);
      g.line(w * 0.38, -h * 0.08, w * 0.48, -h * 0.12);
      g.pop();
      // fill lenses lightly for sampling
      g.noStroke();
      g.fill(0, 80);
      g.rect(w * 0.12, h * 0.38, w * 0.3, h * 0.24, w * 0.02);
      g.rect(w * 0.58, h * 0.38, w * 0.3, h * 0.24, w * 0.02);
    }

    function drawPlant(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      // pot
      g.fill(0, 220);
      g.beginShape();
      g.vertex(w * 0.32, h * 0.72);
      g.vertex(w * 0.68, h * 0.72);
      g.vertex(w * 0.62, h * 0.95);
      g.vertex(w * 0.38, h * 0.95);
      g.endShape(g.CLOSE);
      // leaves
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const angle = p.map(t, 0, 1, -Math.PI / 2 - 1.1, -Math.PI / 2 + 1.1);
        const len = h * (0.35 + 0.15 * Math.sin(t * Math.PI));
        const cx = w / 2;
        const cy = h * 0.72;
        g.push();
        g.translate(cx, cy);
        g.rotate(angle);
        g.fill(0, 200);
        g.ellipse(0, -len / 2, len * 0.22, len);
        g.pop();
      }
    }

    function drawHand(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.fill(0, 220);
      // palm
      g.rect(w * 0.32, h * 0.42, w * 0.36, h * 0.32, w * 0.1);
      // wrist
      g.rect(w * 0.38, h * 0.7, w * 0.24, h * 0.22, w * 0.06);
      // fingers (pinch pose — thumb + index meeting, others curled)
      // thumb
      g.push();
      g.translate(w * 0.38, h * 0.45);
      g.rotate(-0.6);
      g.rect(-w * 0.04, -h * 0.18, w * 0.08, h * 0.18, w * 0.04);
      g.pop();
      // index
      g.push();
      g.translate(w * 0.46, h * 0.42);
      g.rotate(-0.1);
      g.rect(-w * 0.04, -h * 0.3, w * 0.08, h * 0.3, w * 0.04);
      g.pop();
      // middle
      g.push();
      g.translate(w * 0.54, h * 0.42);
      g.rotate(0.05);
      g.rect(-w * 0.04, -h * 0.2, w * 0.08, h * 0.2, w * 0.04);
      g.pop();
      // ring
      g.push();
      g.translate(w * 0.6, h * 0.44);
      g.rotate(0.12);
      g.rect(-w * 0.035, -h * 0.14, w * 0.07, h * 0.14, w * 0.03);
      g.pop();
      // pinch pulse circle
      g.noFill();
      g.stroke(0, 200);
      g.strokeWeight(w * 0.006);
      g.circle(w * 0.42, h * 0.28, w * 0.09);
      g.circle(w * 0.42, h * 0.28, w * 0.15);
    }

    function drawRoom(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.stroke(0, 220);
      g.strokeWeight(w * 0.005);
      g.noFill();
      // floor line
      g.line(0, h * 0.78, w, h * 0.78);
      // back wall corner
      g.line(w * 0.15, h * 0.22, w * 0.15, h * 0.78);
      g.line(w * 0.85, h * 0.22, w * 0.85, h * 0.78);
      g.line(w * 0.15, h * 0.22, w * 0.85, h * 0.22);
      // window
      g.rect(w * 0.58, h * 0.32, w * 0.22, h * 0.32);
      g.line(w * 0.69, h * 0.32, w * 0.69, h * 0.64);
      g.line(w * 0.58, h * 0.48, w * 0.8, h * 0.48);
      // light pool on floor
      g.fill(0, 60);
      g.noStroke();
      g.ellipse(w * 0.5, h * 0.82, w * 0.55, h * 0.08);
      // single figure silhouette
      g.fill(0, 200);
      g.ellipse(w * 0.3, h * 0.52, w * 0.08, h * 0.08);
      g.rect(w * 0.27, h * 0.56, w * 0.06, h * 0.22, w * 0.02);
    }

    function drawVault(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      // glassmorphic floating tiles
      const tiles = 11;
      for (let i = 0; i < tiles; i++) {
        const tx = p.random(w * 0.1, w * 0.9);
        const ty = p.random(h * 0.15, h * 0.85);
        const tw = p.random(w * 0.08, w * 0.22);
        const th = p.random(h * 0.08, h * 0.18);
        const opacity = p.random(120, 220);
        g.fill(0, opacity);
        g.rect(tx - tw / 2, ty - th / 2, tw, th, w * 0.01);
      }
      // central figure hint
      g.fill(0, 150);
      g.ellipse(w * 0.5, h * 0.55, w * 0.06, h * 0.08);
      g.rect(w * 0.47, h * 0.6, w * 0.06, h * 0.2, w * 0.02);
    }

    function drawFeedGrid(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      // Already-halftoned feed — renders directly (variant bypasses halftone sampling)
      const cols = 4;
      const rows = 4;
      const padding = w * 0.04;
      const cellW = (w - padding * 2) / cols;
      const cellH = (h - padding * 2) / rows;
      // background wash
      const [ir, ig, ib] = COLORS.ivory;
      g.fill(ir, ig, ib);
      g.rect(0, 0, w, h);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = padding + col * cellW;
          const y = padding + row * cellH;
          const innerPad = cellW * 0.05;
          // Each cell shows near-identical dotted pattern (the "optimized-out" reference)
          const dotStep = cellW * 0.1;
          for (let dy = y + innerPad; dy < y + cellH - innerPad; dy += dotStep) {
            for (let dx = x + innerPad; dx < x + cellW - innerPad; dx += dotStep) {
              const n = p.noise(dx * 0.05, dy * 0.05, (row * cols + col) * 0.02);
              const [r, gg, b] = pickColor(n);
              const alpha = 120 + n * 100;
              g.fill(r, gg, b, alpha);
              g.noStroke();
              g.circle(dx, dy, dotStep * 0.6);
            }
          }
        }
      }
    }

    function drawSilhouette(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.fill(0, 230);
      // head + shoulders figure standing
      g.ellipse(w * 0.5, h * 0.3, w * 0.18, h * 0.22);
      g.beginShape();
      g.vertex(w * 0.3, h * 0.58);
      g.vertex(w * 0.7, h * 0.58);
      g.vertex(w * 0.74, h * 0.95);
      g.vertex(w * 0.26, h * 0.95);
      g.endShape(g.CLOSE);
      // neck
      g.rect(w * 0.46, h * 0.42, w * 0.08, h * 0.14);
    }

    function drawDissolve(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      // Left side solid block → right side dissolved particles
      g.fill(0, 220);
      g.rect(0, h * 0.2, w * 0.45, h * 0.6);
      for (let i = 0; i < 800; i++) {
        const t = p.random();
        const x = w * 0.45 + t * t * w * 0.55;
        const y = p.random(h * 0.2, h * 0.8);
        const s = p.random(2, 7);
        g.fill(0, 220 * (1 - t));
        g.circle(x, y, s);
      }
    }

    function drawParticles(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      for (let i = 0; i < 1200; i++) {
        const x = p.random(w);
        const y = p.random(h);
        const d = p.dist(x, y, w / 2, h / 2);
        const maxD = p.dist(0, 0, w / 2, h / 2);
        const prob = 1 - d / maxD;
        if (p.random() < prob * 0.75) {
          g.fill(0, 120 + 120 * prob);
          g.circle(x, y, p.random(2, 6));
        }
      }
    }

    function drawEmptyFrame(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.noFill();
      g.stroke(0, 230);
      g.strokeWeight(w * 0.015);
      g.rect(w * 0.22, h * 0.2, w * 0.56, h * 0.6);
      g.strokeWeight(w * 0.005);
      g.line(w * 0.22, h * 0.2, w * 0.78, h * 0.8);
      g.line(w * 0.78, h * 0.2, w * 0.22, h * 0.8);
    }

    function drawConstellation(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      // scattered nodes connected by faint lines
      const nodes: { x: number; y: number }[] = [];
      for (let i = 0; i < 28; i++) {
        nodes.push({ x: p.random(w * 0.1, w * 0.9), y: p.random(h * 0.1, h * 0.9) });
      }
      g.stroke(0, 60);
      g.strokeWeight(w * 0.002);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          if (d < w * 0.18) g.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
      }
      g.noStroke();
      g.fill(0, 230);
      for (const n of nodes) {
        g.circle(n.x, n.y, w * 0.018);
      }
    }

    function drawSpiral(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.noStroke();
      g.fill(0, 210);
      for (let t = 0; t < 180; t++) {
        const angle = t * 0.35;
        const r = t * (w / 240);
        const x = w / 2 + Math.cos(angle) * r;
        const y = h / 2 + Math.sin(angle) * r;
        g.circle(x, y, Math.max(1, w * 0.015 * (1 - t / 200)));
      }
    }

    function drawOrbit(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      g.noFill();
      g.stroke(0, 200);
      g.strokeWeight(w * 0.002);
      for (let i = 0; i < 5; i++) {
        g.ellipse(w / 2, h / 2, w * (0.25 + i * 0.12), h * (0.25 + i * 0.12));
      }
      g.noStroke();
      g.fill(0, 220);
      g.circle(w / 2, h / 2, w * 0.08);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = w * (0.18 + p.random() * 0.22);
        g.circle(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, w * 0.02);
      }
    }

    function drawScatter(g: ReturnType<typeof p.createGraphics>, w: number, h: number) {
      for (let i = 0; i < 600; i++) {
        g.fill(0, p.random(120, 220));
        g.circle(p.random(w), p.random(h), p.random(2, 7));
      }
    }
  };
}

export default function HalftoneCanvas({
  variant,
  seed = 42,
  size = 560,
  density = 10,
  className,
}: Props) {
  const sketch = useMemo(() => makeSketch(variant, seed, size, density), [variant, seed, size, density]);
  return (
    <div
      className={className}
      style={{ width: size, height: size, maxWidth: "100%" }}
    >
      <P5Canvas sketch={sketch} />
    </div>
  );
}
