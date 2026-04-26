import { chromium } from "playwright";

const executablePath = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const browser = await chromium.launch({ executablePath, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on("console", (msg) => console.log("[browser]", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll(".deck > section"));
  return sections.slice(0, 3).map((s, i) => {
    const canvases = s.querySelectorAll("canvas").length;
    const h1 = s.querySelector("h1, h2");
    const rect = h1 ? h1.getBoundingClientRect() : null;
    return {
      idx: i,
      canvasCount: canvases,
      titleText: h1?.textContent?.slice(0, 40),
      titleWidth: rect?.width,
      titleRight: rect?.right,
      viewportWidth: window.innerWidth,
    };
  });
});

console.log(JSON.stringify(info, null, 2));

await browser.close();
