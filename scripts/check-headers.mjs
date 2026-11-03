#!/usr/bin/env node
// Proves the security baseline is served, not only declared.
//
//   node scripts/check-headers.mjs              serves dist/ locally with the
//                                               vercel.json headers, then checks
//   node scripts/check-headers.mjs --url <URL>  checks a live deployment, such as
//                                               a PR preview. A protected preview
//                                               needs VERCEL_AUTOMATION_BYPASS_SECRET.
//
// Three checks:
// 1. Every path served as a file (200) gets exactly the headers vercel.json
//    declares for it.
// 2. The redirects answer with the right status and Location. Vercel sends
//    no custom headers on a redirect, so none are asserted there; scanners
//    grade the final 200.
// 3. The declared set meets what Mozilla Observatory and securityheaders.com
//    grade for an A+ (no unsafe CSP sources, HSTS of 6 months or more, nosniff,
//    framing denied, a private referrer policy, a Permissions-Policy). The
//    HTTPS redirect can only be seen on a live URL, so the local run skips it.

import { readdirSync } from "node:fs";
import { headersFor, loadRules } from "./lib/vercel-headers.mjs";
import { serve } from "./serve-dist.mjs";

const urlFlag = process.argv.indexOf("--url");
const remote = urlFlag > -1 ? process.argv[urlFlag + 1] : undefined;
if (urlFlag > -1 && !remote) {
  console.error("✗ --url needs a value");
  process.exit(1);
}

const rules = loadRules();
const failures = [];
const fail = (msg) => failures.push(`  ${msg}`);

let server;
let base = remote?.replace(/\/$/, "");
if (!base) {
  server = await serve(0);
  base = `http://127.0.0.1:${server.address().port}`;
}

const requestHeaders = {};
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (remote && bypass) requestHeaders["x-vercel-protection-bypass"] = bypass;

async function get(path) {
  const res = await fetch(`${base}${path}`, { headers: requestHeaders, redirect: "manual" });
  return res;
}

// The files to check: both pages, a hashed asset, the generated files, a file
// in public/ and a dotfile. Each gets the headers.
const HOME = "/en/";
const home = await get(HOME);
const html = await home.text();
if (home.status !== 200)
  fail(
    `${HOME} returned ${home.status}${remote && !bypass ? " (protected preview? set VERCEL_AUTOMATION_BYPASS_SECRET)" : ""}`,
  );

let asset = /(?:href|src)="(\/_astro\/[^"]+)"/.exec(html)?.[1];
if (!asset && !remote) {
  const first = readdirSync(new URL("../dist/_astro", import.meta.url)).find(
    (f) => !f.startsWith("."),
  );
  if (first) asset = `/_astro/${first}`;
}
const paths = [
  HOME,
  "/es/",
  "/sitemap.xml",
  "/robots.txt",
  "/.well-known/security.txt",
  "/icons/favicon-32.png",
  asset,
].filter(Boolean);

// The redirects: `/` with no cookie and no Spanish Accept-Language, and a page
// without its trailing slash. Status and Location only.
const REDIRECTS = [
  { path: "/", status: 307, location: "/en/" },
  { path: "/es", status: 308, location: "/es/" },
];

// 1. Served equals declared, on every file
for (const path of paths) {
  const res = path === HOME ? home : await get(path);
  if (res.status !== 200) fail(`${path} returned ${res.status}, expected 200`);
  for (const [key, value] of headersFor(rules, path)) {
    const actual = res.headers.get(key);
    if (actual !== value)
      fail(
        `${path} ${key}: expected "${value}", got ${actual === null ? "nothing" : `"${actual}"`}`,
      );
  }
}

// 2. The redirects: status and a same-site Location
for (const { path, status, location } of REDIRECTS) {
  const res = await get(path);
  if (res.status !== status) fail(`${path} returned ${res.status}, expected ${status}`);
  const to = new URL(res.headers.get("location") ?? "", `${base}${path}`);
  if (to.origin !== new URL(base).origin || to.pathname !== location) {
    fail(`${path} Location: expected ${location}, got "${res.headers.get("location")}"`);
  }
}

// 3. The A+ criteria, on the page's own headers
const h = (key) => (remote ? home.headers.get(key) : headersFor(rules, HOME).get(key)) ?? "";

const csp = Object.fromEntries(
  h("content-security-policy")
    .split(";")
    .map((d) => d.trim().split(/\s+/))
    .filter(([name]) => name)
    .map(([name, ...sources]) => [name.toLowerCase(), sources]),
);
if (!csp["default-src"]) fail("CSP: no default-src");
for (const [name, sources] of Object.entries(csp)) {
  for (const s of sources) {
    if (/^'unsafe-|^\*$|^https?:$|^data:$/i.test(s)) fail(`CSP ${name}: unsafe source ${s}`);
  }
}
for (const name of ["frame-ancestors", "base-uri", "form-action"]) {
  if (!csp[name]) fail(`CSP: no ${name}`);
}

const maxAge = Number(/max-age=(\d+)/.exec(h("strict-transport-security"))?.[1] ?? 0);
if (maxAge < 15552000) fail(`HSTS max-age ${maxAge} is under 6 months`);
if (h("x-content-type-options").toLowerCase() !== "nosniff")
  fail("X-Content-Type-Options is not nosniff");
if (!/^(deny|sameorigin)$/i.test(h("x-frame-options")) && !csp["frame-ancestors"])
  fail("framing is not denied");
if (
  !/^(no-referrer|same-origin|strict-origin|strict-origin-when-cross-origin)$/i.test(
    h("referrer-policy"),
  )
) {
  fail(`Referrer-Policy "${h("referrer-policy")}" is not private`);
}
if (!h("permissions-policy")) fail("no Permissions-Policy");
if (h("cross-origin-opener-policy") !== "same-origin") fail("COOP is not same-origin");

if (remote && base.startsWith("https://")) {
  const plain = await fetch(base.replace(/^https:/, "http:"), {
    headers: requestHeaders,
    redirect: "manual",
  });
  const to = plain.headers.get("location") ?? "";
  if (!(plain.status >= 300 && plain.status < 400 && to.startsWith("https://"))) {
    fail(`HTTP does not redirect to HTTPS (status ${plain.status})`);
  }
}

server?.close();

if (failures.length) {
  console.error(`\n✗ Header check failed on ${base}: ${failures.length} problem(s).\n`);
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `✓ Header check: ${paths.length} files on ${remote ? base : "dist/ (local, vercel.json headers)"} serve the declared headers and meet the A+ criteria; ${REDIRECTS.length} redirects answer as expected`,
);
