#!/usr/bin/env node
// Lighthouse on both pages, mobile with simulated throttling (Lighthouse's
// default), against the ticket's budgets. Exits non-zero on a missed budget.
// Each page runs three times and the median run counts, as Lighthouse CI
// does: a single run swings with whatever else the machine is doing.
//
//   node scripts/lighthouse.mjs              serves dist/ locally, then runs
//   node scripts/lighthouse.mjs --url <URL>  runs against a deployment; a
//                                            protected preview needs
//                                            VERCEL_AUTOMATION_BYPASS_SECRET
//
// Chrome comes from CHROME_PATH, or else Playwright's Chromium (install it with
// `pnpm exec playwright install chromium`). Reports land in lighthouse-report/.
//
// Two SEO audits are set aside on a preview only, both because previews are
// protected on purpose: `is-crawlable`, since Vercel sends `X-Robots-Tag:
// noindex` on every preview, and `robots-txt`, since Lighthouse fetches
// robots.txt from inside the page without the bypass header, so Vercel
// Authentication refuses it. Production and the local run keep both, so SEO
// must reach 100 there with every audit.

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { serve } from "./serve-dist.mjs";

const BUDGETS = {
  lcpMs: 2000,
  cls: 0.05,
  tbtMs: 200,
  scriptBytes: 5 * 1024,
  totalBytes: 400 * 1024,
  categories: { accessibility: 1, "best-practices": 1, seo: 1 },
};

const PREVIEW_ONLY_SKIPS = ["is-crawlable", "robots-txt"];

const urlFlag = process.argv.indexOf("--url");
const remote = urlFlag > -1 ? process.argv[urlFlag + 1]?.replace(/\/$/, "") : undefined;
const preview = Boolean(remote) && !/^https:\/\/tab-ve-site\.vercel\.app$/.test(remote ?? "");

let server;
let base = remote;
if (!base) {
  server = await serve(0);
  // localhost, which browsers and Lighthouse treat as a secure origin
  base = `http://localhost:${server.address().port}`;
}

const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH ?? chromium.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox"],
});

const failures = [];
const rows = [];
mkdirSync(new URL("../lighthouse-report", import.meta.url), { recursive: true });

const RUNS = 3;

// One discarded run first: Chrome's own cold start lands as an unattributed
// long task on whichever page is measured first (615 ms of "Other" on CI),
// which says nothing about the page
await lighthouse(`${base}/en/`, {
  port: chrome.port,
  output: "json",
  logLevel: "error",
  extraHeaders: remote && bypass ? { "x-vercel-protection-bypass": bypass } : undefined,
});

/** The run whose performance score is the median. */
function medianRun(results) {
  const sorted = [...results].sort(
    (a, b) => (a.lhr.categories.performance.score ?? 0) - (b.lhr.categories.performance.score ?? 0),
  );
  return sorted[Math.floor(sorted.length / 2)];
}

for (const path of ["/en/", "/es/"]) {
  const results = [];
  for (let i = 0; i < RUNS; i++) {
    results.push(
      await lighthouse(
        `${base}${path}`,
        {
          port: chrome.port,
          output: "html",
          logLevel: "error",
          extraHeaders: remote && bypass ? { "x-vercel-protection-bypass": bypass } : undefined,
        },
        undefined,
      ),
    );
  }
  const result = medianRun(results);
  const lhr = result.lhr;
  const name = path.replaceAll("/", "") || "root";
  writeFileSync(new URL(`../lighthouse-report/${name}.html`, import.meta.url), result.report);
  writeFileSync(
    new URL(`../lighthouse-report/${name}.json`, import.meta.url),
    JSON.stringify(lhr, null, 2),
  );

  const audit = (id) => lhr.audits[id];
  const fail = (msg) => failures.push(`  ${path} ${msg}`);
  if (lhr.runtimeError) fail(`runtime error: ${lhr.runtimeError.message}`);

  const lcp = audit("largest-contentful-paint").numericValue;
  const cls = audit("cumulative-layout-shift").numericValue;
  const tbt = audit("total-blocking-time").numericValue;
  const items = audit("resource-summary").details?.items ?? [];
  const bytes = (type) => items.find((i) => i.resourceType === type)?.transferSize ?? 0;
  const script = bytes("script");
  const total = bytes("total");

  if (lcp > BUDGETS.lcpMs) fail(`LCP ${Math.round(lcp)} ms > ${BUDGETS.lcpMs} ms`);
  if (cls > BUDGETS.cls) fail(`CLS ${cls.toFixed(3)} > ${BUDGETS.cls}`);
  if (tbt > BUDGETS.tbtMs) fail(`TBT ${Math.round(tbt)} ms > ${BUDGETS.tbtMs} ms`);
  if (script > BUDGETS.scriptBytes) fail(`JS ${script} B > ${BUDGETS.scriptBytes} B`);
  if (total > BUDGETS.totalBytes) fail(`total ${total} B > ${BUDGETS.totalBytes} B`);

  const scores = {};
  for (const [id, min] of Object.entries(BUDGETS.categories)) {
    const category = lhr.categories[id];
    // Recompute the score without the audits set aside on a preview
    const skip = preview && id === "seo" ? new Set(PREVIEW_ONLY_SKIPS) : new Set();
    const refs = category.auditRefs.filter((r) => r.weight > 0 && !skip.has(r.id));
    const weight = refs.reduce((sum, r) => sum + r.weight, 0);
    const score = refs.reduce((sum, r) => sum + r.weight * (audit(r.id).score ?? 0), 0) / weight;
    scores[id] = Math.round(score * 100);
    if (score < min) {
      const missed = refs.filter((r) => (audit(r.id).score ?? 0) < 1).map((r) => r.id);
      fail(`${id} ${scores[id]} < ${min * 100}: ${missed.join(", ")}`);
    }
  }
  scores.performance = Math.round((lhr.categories.performance.score ?? 0) * 100);

  rows.push(
    `  ${path.padEnd(5)} perf ${scores.performance}  a11y ${scores.accessibility}  bp ${scores["best-practices"]}  seo ${scores.seo}` +
      `  |  LCP ${Math.round(lcp)} ms  CLS ${cls.toFixed(3)}  TBT ${Math.round(tbt)} ms  JS ${script} B  total ${Math.round(total / 1024)} KB`,
  );
}

chrome.kill();
server?.close();

console.log(
  `Lighthouse on ${remote ?? "dist/ (local)"}${preview ? ` (preview: ${PREVIEW_ONLY_SKIPS.join(", ")} set aside)` : ""}`,
);
console.log(rows.join("\n"));
if (failures.length) {
  console.error(`\n✗ ${failures.length} budget(s) missed:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("✓ Every budget met");
