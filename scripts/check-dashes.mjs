#!/usr/bin/env node
// Project rule (Ángel): no em dashes or en dashes anywhere: copy, code, comments,
// docs and config. Ported from JAGR's scripts/check-dashes.mjs, widened from
// src/ to every file in the repo (tracked, plus new files not yet ignored), so
// the copy files and the docs are covered too. Commit messages get the same
// rule from commitlint.config.mjs.
// Exits non-zero and names each offending file:line:column.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

// The characters themselves (written as escapes, so this file passes its own
// check) plus their HTML entity spellings
const PATTERN = /[\u2013\u2014]|&(?:mdash|ndash);|&#(?:8211|8212|x201[34]);/gi;
const EN_DASH = /\u2013|ndash|8211|2013/i;

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  {
    cwd: ROOT,
    encoding: "utf8",
  },
)
  .split("\0")
  .filter(Boolean);

const hits = [];
for (const file of files) {
  let buf;
  try {
    buf = readFileSync(join(ROOT, file));
  } catch {
    continue; // deleted in the working tree
  }
  if (buf.includes(0)) continue; // binary
  buf
    .toString("utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const m of line.matchAll(PATTERN)) {
        const kind = EN_DASH.test(m[0]) ? "en dash" : "em dash";
        hits.push(`  ${file}:${i + 1}:${m.index + 1}  ${kind}  ${line.trim().slice(0, 100)}`);
      }
    });
}

if (hits.length) {
  console.error(
    `\n✗ Dash check failed: ${hits.length} em/en dash(es) (project rule: none allowed).\n`,
  );
  console.error(hits.join("\n"));
  console.error("\nRewrite with a period, comma, colon or parentheses.\n");
  process.exit(1);
}

console.log(`✓ Dash check: no em or en dashes in ${files.length} files`);
