import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("screenshots");
await mkdir(outDir, { recursive: true });

const executablePath = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const browser = await chromium.launch({ executablePath, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// HackTech 2026 routes — captures all decks in one pass.
const routes = [
  { path: "/round-1", prefix: "round-1", count: 13 },
  { path: "/round-2", prefix: "round-2", count: 8 },
  { path: "/sponsor/listenlabs", prefix: "sponsor-listenlabs", count: 1 },
  { path: "/sponsor/sideshift", prefix: "sponsor-sideshift", count: 1 },
  { path: "/sponsor/yc", prefix: "sponsor-yc", count: 1 },
  { path: "/sponsor/ironside", prefix: "sponsor-ironside", count: 1 },
];

for (const route of routes) {
  await page.goto(`http://localhost:3000${route.path}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  for (let i = 0; i < route.count; i++) {
    if (route.count > 1) {
      await page.evaluate((idx) => {
        const sections = document.querySelectorAll(".deck > section");
        if (sections[idx]) sections[idx].scrollIntoView({ behavior: "instant", block: "start" });
      }, i);
      await page.waitForTimeout(1100);
    }
    const n = String(i + 1).padStart(2, "0");
    await page.screenshot({
      path: path.join(outDir, `${route.prefix}-${n}.png`),
      fullPage: false,
    });
    console.log(`captured ${route.prefix}-${n}`);
  }
}

await browser.close();
console.log("done");
