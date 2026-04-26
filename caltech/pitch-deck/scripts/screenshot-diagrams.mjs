// Screenshot the standalone HTML architecture diagrams as high-res PNGs
// for embedding in slides + sharing in Devpost / Slack / sponsor emails.
//
// Run from caltech/pitch-deck/:
//   node scripts/screenshot-diagrams.mjs
//
// Requires the dev server to be running (pnpm dev) on http://localhost:3000.

import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images");

const TARGETS = [
  {
    url: "http://localhost:3000/diagrams/swarm-architecture.html",
    out: "swarm-architecture.png",
  },
  {
    url: "http://localhost:3000/diagrams/simulation-architecture.html",
    out: "simulation-architecture.png",
  },
  {
    url: "http://localhost:3000/diagrams/website-architecture.html",
    out: "website-architecture.png",
  },
];

const VIEWPORT_WIDTH = 1100;
const SCALE = 2; // 2x retina

console.log(`screenshotting ${TARGETS.length} diagrams at ${SCALE}x retina ...`);

const browser = await chromium.launch();
const context = await browser.newContext({
  deviceScaleFactor: SCALE,
  viewport: { width: VIEWPORT_WIDTH, height: 1200 },
});

for (const t of TARGETS) {
  const page = await context.newPage();
  try {
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 15000 });
    // wait for any final layout settling
    await page.waitForTimeout(300);
    const out = path.join(OUT_DIR, t.out);
    await page.screenshot({ path: out, fullPage: true, type: "png" });
    const sizeKB = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`  ✓ ${t.out} (${sizeKB}KB)`);
  } catch (err) {
    console.error(`  ✗ ${t.out} failed: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`done → ${OUT_DIR}`);
