#!/usr/bin/env node
// Runs a local, throwaway Tab demo for `pnpm capture`. See the README, "Captures".
//
//   pnpm capture:demo --tab <path to a Tab checkout> [--dir <work dir>]
//
// The Tab checkout is only read: `git archive <TAB_REF>` exports that commit
// into the work dir (default: <tmp>/tab-capture-demo-<TAB_REF>), and the
// install, build and server all run there. Then it serves the demo
// (DEMO_MODE=on) at DEMO_URL until Ctrl-C.
//
// The database is a fresh in-memory PGlite on every start, inside the server
// process (scripts/capture-shim.mjs), so it never reaches a real database. The
// server's environment is built from scratch here: PATH, HOME and the capture
// settings, nothing inherited, and no .env file is allowed in the export.

import { spawn, spawnSync, type SpawnSyncOptions } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { BCV_RATE, CAPTURE_NOW, DEMO_PORT, TAB_REF, TIME_ZONE } from "./capture-config.ts";

const { values } = parseArgs({
  options: { tab: { type: "string" }, dir: { type: "string" } },
});
if (!values.tab) {
  console.error("✗ capture:demo needs --tab <path to a Tab checkout>");
  process.exit(1);
}
const tab = resolve(values.tab);
const dir = resolve(values.dir ?? join(tmpdir(), `tab-capture-demo-${TAB_REF}`));
const capture = join(dir, ".capture");
const ready = join(capture, `ready-${TAB_REF}`);

function run(command: string, args: string[], options: SpawnSyncOptions = {}) {
  console.log(`$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { cwd: dir, stdio: "inherit", ...options });
  if (result.status !== 0) {
    console.error(`✗ capture:demo: ${command} exited with ${result.status}`);
    process.exit(1);
  }
  return result;
}

// --- Export, install, build (once per TAB_REF)

if (!existsSync(ready)) {
  if (existsSync(dir) && readdirSync(dir).length > 0) {
    console.error(
      `✗ capture:demo: ${dir} is not empty and not a finished export. Remove it first.`,
    );
    process.exit(1);
  }
  mkdirSync(capture, { recursive: true });

  // git archive | tar, without a shell
  const archive = spawnSync("git", ["-C", tab, "archive", "--format=tar", TAB_REF], {
    maxBuffer: 1 << 30,
  });
  if (archive.status !== 0) {
    console.error(`✗ capture:demo: git archive ${TAB_REF} failed in ${tab}\n${archive.stderr}`);
    process.exit(1);
  }
  run("tar", ["-x", "-f", "-"], { input: archive.stdout, stdio: ["pipe", "inherit", "inherit"] });

  run("pnpm", ["install", "--frozen-lockfile"]);
  run("pnpm", ["run", "build"]);

  // Tab's schema as SQL, for the shim to apply to each fresh database
  const ddl = run(
    join(dir, "node_modules/.bin/drizzle-kit"),
    ["export", "--dialect", "postgresql", "--schema", "./src/lib/server/schema.ts"],
    { stdio: ["ignore", "pipe", "inherit"] },
  );
  writeFileSync(join(capture, "schema.sql"), ddl.stdout);
  writeFileSync(ready, `${new Date().toISOString()}\n`);
}

// --- Serve

const envFiles = readdirSync(dir).filter((f) => f.startsWith(".env") && f !== ".env.example");
if (envFiles.length > 0) {
  console.error(`✗ capture:demo: refusing to start with ${envFiles.join(", ")} in ${dir}`);
  process.exit(1);
}

const shim = new URL("./capture-shim.mjs", import.meta.url).href;
const env = {
  PATH: process.env.PATH ?? "",
  HOME: process.env.HOME ?? "",
  TZ: TIME_ZONE,
  DEMO_MODE: "on",
  // A reserved .invalid host: the shim answers it, and nothing else could
  DATABASE_URL: "postgresql://capture:capture@db.capture.invalid/demo",
  CAPTURE_NOW,
  CAPTURE_BCV_RATE: String(BCV_RATE),
  CAPTURE_SCHEMA_SQL: join(capture, "schema.sql"),
  NODE_OPTIONS: `--import=${shim}`,
};

console.log(`Serving the local Tab demo (${TAB_REF}) from ${dir}`);
const server = spawn(
  join(dir, "node_modules/.bin/vite"),
  ["preview", "--host", "127.0.0.1", "--port", String(DEMO_PORT), "--strictPort"],
  { cwd: dir, env, stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => server.kill(signal));
server.on("exit", (code) => process.exit(code ?? 0));
