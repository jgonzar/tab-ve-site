#!/usr/bin/env node
// Proves the captures are deterministic: takes every shot again into a temp
// folder and compares it, byte for byte, with the committed files in
// src/assets/captures/. Needs the local demo running (`pnpm capture:demo`).
//
//   pnpm capture:verify [baseUrl]

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { CAPTURES_DIR, DEMO_URL, LANGS } from "./capture-config.ts";

const committed = fileURLToPath(CAPTURES_DIR);
const fresh = mkdtempSync(join(tmpdir(), "tab-capture-verify-"));

const capture = fileURLToPath(new URL("./capture.ts", import.meta.url));
const result = spawnSync(process.execPath, [capture, process.argv[2] ?? DEMO_URL, fresh], {
  stdio: "inherit",
});
if (result.status !== 0) {
  rmSync(fresh, { recursive: true, force: true });
  process.exit(result.status ?? 1);
}

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const list = (root: string) =>
  LANGS.flatMap((lang) => readdirSync(join(root, lang)).map((f) => `${lang}/${f}`)).sort();

const problems: string[] = [];
const names = new Set([...list(committed), ...list(fresh)]);
for (const name of [...names].sort()) {
  const a = join(committed, name);
  const b = join(fresh, name);
  let ha = "missing";
  let hb = "missing";
  try {
    ha = sha256(a);
  } catch {
    // reported below
  }
  try {
    hb = sha256(b);
  } catch {
    // reported below
  }
  const same = ha === hb && ha !== "missing";
  console.log(`  ${same ? "=" : "≠"} ${name}  ${hb}`);
  if (!same) problems.push(`${name}: committed ${ha}, new ${hb}`);
}
rmSync(fresh, { recursive: true, force: true });

if (problems.length) {
  console.error(
    `\n✗ capture:verify: ${problems.length} file(s) differ:\n  ${problems.join("\n  ")}`,
  );
  process.exit(1);
}
console.log(`✓ capture:verify: ${names.size} files byte-identical to src/assets/captures/`);
