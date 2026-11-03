// Reads the `headers` rules from vercel.json and resolves which headers a path
// gets, the way Vercel does: every rule whose `source` matches applies, and a
// later rule wins for the same header. The sources here only use the `(.*)`
// wildcard, which is all this needs to understand; anything else throws, so a
// new pattern can't be silently mismatched.

import { readFileSync } from "node:fs";

const ROOT = new URL("../..", import.meta.url).pathname;

export function loadConfig() {
  return JSON.parse(readFileSync(`${ROOT}vercel.json`, "utf8"));
}

/** A vercel.json `source` as a RegExp. Only literal paths and `(.*)` are understood. */
export function sourcePattern(source) {
  if (/[:*+?{}[\]]/.test(source.replaceAll("(.*)", ""))) {
    throw new Error(`vercel.json source not understood by scripts/lib: ${source}`);
  }
  const escaped = source
    .split("(.*)")
    .map((part) => part.replace(/[.^$|\\/]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${escaped}$`);
}

export function loadRules(config = loadConfig()) {
  return (config.headers ?? []).map(({ source, headers }) => ({
    source,
    test: sourcePattern(source),
    headers,
  }));
}

// Paths Vercel answers itself, without any vercel.json headers. Seen on the
// previews: /.well-known/security.txt got none of them, from the `/(.*)` rule
// or from an explicit `/.well-known/(.*)` rule, while other files got all.
const PLATFORM_PATHS = /^\/\.well-known\//;

/**
 * The headers vercel.json gives `pathname` on Vercel, as a Map of lower-case
 * name to value. Empty for the paths Vercel answers itself.
 */
export function headersFor(rules, pathname) {
  const out = new Map();
  if (PLATFORM_PATHS.test(pathname)) return out;
  for (const rule of rules) {
    if (!rule.test.test(pathname)) continue;
    for (const { key, value } of rule.headers) out.set(key.toLowerCase(), value);
  }
  return out;
}
