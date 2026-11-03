#!/usr/bin/env node
// The page's screenshots, taken from a LOCAL Tab demo (scripts/capture-demo.ts),
// never from the live shared one: the live demo could show a stranger's text,
// and it isn't reproducible. See the README, "Captures".
//
//   pnpm capture [baseUrl] [outDir]
//
// baseUrl defaults to the local demo's address and must be a loopback host.
// outDir defaults to src/assets/captures/. Writes raw PNGs (no phone frame;
// the page draws that once) as <outDir>/<lang>/<shot>.png, each in es and en.
//
// Two runs give byte-identical files (`pnpm capture:verify`):
// - the clock is frozen at CAPTURE_NOW, in Caracas, in the browser and (through
//   scripts/capture-shim.mjs) on the demo's server
// - the BCV rate is fixed on the server, and stubbed here too
// - a fixed viewport and DPR, reduced motion, no transitions or animations,
//   and the fonts loaded before each shot
// - the tour is marked seen and the person is picked through the app's own
//   storage keys, and the language through its own cookie
// - the demo banner is hidden by a stylesheet this script injects; the app
//   itself is never changed

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type BrowserContext, type Page } from "playwright";
import {
  ACTIVE_USER,
  BCV_RATE,
  CAPTURE_NOW,
  CAPTURES_DIR,
  DEMO_URL,
  DPR,
  LANGS,
  TIME_ZONE,
  VIEWPORT,
  type Lang,
} from "./capture-config.ts";

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

const base = new URL(process.argv[2] ?? DEMO_URL);
if (!LOOPBACK.has(base.hostname)) {
  console.error(
    `✗ capture: refusing ${base.origin}. Only a local demo (localhost) can be captured.`,
  );
  process.exit(1);
}
const outDir = process.argv[3] ? pathToFileURL(`${resolve(process.argv[3])}/`) : CAPTURES_DIR;

// Capture-only CSS: no motion, no caret, no scrollbars, and no demo banner
// (it says the data is shared, which isn't true of these screens).
const CAPTURE_CSS = `
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
  ::-webkit-scrollbar { display: none !important; }
  [data-demo-banner] { display: none !important; }
`;

// The app's own device storage: the person picked on "¿Quién eres?", and the
// demo's first-pick flag, so no tour is offered
const STORAGE = {
  tab_active_user: JSON.stringify(ACTIVE_USER),
  tab_tour_offered: "1",
};

async function newContext(browser: Awaited<ReturnType<typeof chromium.launch>>, lang: Lang) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    isMobile: true,
    hasTouch: true,
    locale: lang === "es" ? "es-VE" : "en-US",
    timezoneId: TIME_ZONE,
    reducedMotion: "reduce",
    colorScheme: "dark",
    serviceWorkers: "block",
  });
  await context.clock.install({ time: new Date(CAPTURE_NOW) });
  await context.addCookies([{ name: "tab_lang", value: lang, url: base.origin }]);
  await context.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
  }, STORAGE);
  // The server already has the fixed rate; this covers a client-side refetch
  await context.route("**/api/tasa-bcv", (route) =>
    route.fulfill({
      json: { tasa: BCV_RATE, obtenidaEn: new Date(CAPTURE_NOW).toISOString(), stale: false },
    }),
  );
  // Nothing leaves the machine
  await context.route(
    (url) => !LOOPBACK.has(url.hostname),
    (route) => route.abort("blockedbyclient"),
  );
  return context;
}

async function open(context: BrowserContext, path: string): Promise<Page> {
  const page = await context.newPage();
  await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: CAPTURE_CSS });
  await settle(page);
  return page;
}

/** Fonts loaded, images decoded, and two frames painted. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await page.clock.runFor(1000);
}

async function shoot(page: Page, lang: Lang, name: string) {
  const dir = new URL(`${lang}/`, outDir);
  await mkdir(dir, { recursive: true });
  const png = await page.screenshot({ animations: "disabled", caret: "hide", scale: "device" });
  await writeFile(new URL(`${name}.png`, dir), png);
  console.log(`  ${lang}/${name}.png  ${(png.length / 1024).toFixed(0)} KB`);
}

const SHOTS: { name: string; take: (context: BrowserContext, lang: Lang) => Promise<Page> }[] = [
  // 1. The hero: Inicio, as a person sees it on arrival
  { name: "inicio", take: (context) => open(context, "/") },
  // 2. One tap per ride: the quick-ride card, open on the first chip
  {
    name: "quick-ride",
    take: async (context) => {
      const page = await open(context, "/");
      await page.locator('[data-tour="quick-routes"] button').first().click();
      await page.locator('[data-overlay] [role="dialog"]').waitFor({ state: "visible" });
      await settle(page);
      return page;
    },
  },
  // 3. Dollars and bolívares: the summary bar, stuck at the top, over the
  // first ride card with a price. The card before it ends exactly at the
  // bar's bottom edge (the list's own 12px gap), so it's fully hidden.
  {
    name: "summary",
    take: async (context) => {
      const page = await open(context, "/");
      await page.evaluate(() => {
        const bar = document.querySelector('[data-tour="summary"]');
        const card = document.querySelectorAll('[data-tour="ride"]')[1];
        if (!bar || !card) throw new Error("capture: no summary bar or second ride card");
        const stuckBottom =
          parseFloat(getComputedStyle(bar).top) + bar.getBoundingClientRect().height;
        const gap = 12;
        window.scrollTo(0, window.scrollY + card.getBoundingClientRect().top - stuckBottom - gap);
      });
      await settle(page);
      return page;
    },
  },
  // 4. Settle up: Historial, the paid rides (see the README on why not the receipt)
  { name: "historial", take: (context) => open(context, "/historial") },
];

const browser = await chromium.launch();
try {
  for (const lang of LANGS) {
    for (const shot of SHOTS) {
      const context = await newContext(browser, lang);
      const page = await shot.take(context, lang);
      await shoot(page, lang, shot.name);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`✓ capture: ${LANGS.length * SHOTS.length} shots from ${base.origin}`);
