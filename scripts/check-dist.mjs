#!/usr/bin/env node
// Checks the built HTML against the CSP, so a violation fails CI instead of
// breaking the page silently in the browser:
//   - no inline <script> (every script must have a same-origin src), and no
//     script but the two modules we write: the language links' cookie
//     (src/scripts/lang-cookie.ts) and the dot fields' pointer feed
//     (src/scripts/dots.ts). The Svelte sections render at build time and ship
//     no JavaScript (plan decision 17)
//   - no <style> element and no style="" attribute (style-src 'self')
//   - no inline event handlers (onclick= and the like)
//   - no resource loaded from another origin (src, srcset, and <link> hrefs).
//     Plain <a href> links are navigation, not loads, so they're allowed.
// Run after `pnpm build`.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = new URL("../dist", import.meta.url).pathname;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name.endsWith(".html")) yield p;
  }
}

// Astro names a page or component's own <script> after it: the language links
// and the landing page (which loads dots.ts)
const OUR_MODULES =
  /^\/_astro\/(?:LanguageLinks|index)\.astro_astro_type_script_index_0_lang\.[\w-]+\.js$/;
const isRemote = (url) => /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(url.trim());
const problems = [];
let count = 0;

for (const file of walk(DIST)) {
  count++;
  const html = readFileSync(file, "utf8");
  const where = relative(DIST, file);
  const report = (msg) => problems.push(`  ${where}: ${msg}`);

  for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
    if (!/\bsrc\s*=/i.test(m[1])) report(`inline <script${m[1]}>`);
    const src = /\bsrc\s*=\s*["']([^"']*)["']/i.exec(m[1])?.[1] ?? "";
    if (src && !OUR_MODULES.test(src)) report(`a script other than our two modules: ${src}`);
  }
  if (/<style\b/i.test(html)) report("inline <style> element");
  if (/<[a-z][^>]*\sstyle\s*=/i.test(html)) report("style= attribute");
  for (const m of html.matchAll(/<[a-z][^>]*\s(on[a-z]+)\s*=/gi)) report(`inline handler ${m[1]}=`);

  for (const m of html.matchAll(/\s(src|srcset|poster)\s*=\s*["']([^"']*)["']/gi)) {
    const urls =
      m[1].toLowerCase() === "srcset"
        ? m[2].split(",").map((s) => s.trim().split(/\s+/)[0])
        : [m[2]];
    for (const u of urls) if (u && isRemote(u)) report(`${m[1]} loads another origin: ${u}`);
  }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const href = /\shref\s*=\s*["']([^"']*)["']/i.exec(m[0])?.[1];
    const rel = /\srel\s*=\s*["']([^"']*)["']/i.exec(m[0])?.[1] ?? "";
    // canonical and alternate links are addresses, not loads
    if (href && isRemote(href) && !/\b(canonical|alternate)\b/i.test(rel)) {
      report(`<link rel="${rel}"> loads another origin: ${href}`);
    }
  }
}

if (count === 0) {
  console.error("✗ Dist check: no HTML in dist/. Run `pnpm build` first.");
  process.exit(1);
}

if (problems.length) {
  console.error(`\n✗ Dist check failed: ${problems.length} problem(s) in ${count} page(s).\n`);
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`✓ Dist check: ${count} page(s), no inline script or style, no third-party loads`);
