#!/usr/bin/env node
// Serves dist/ the way Vercel does: its trailingSlash and redirects (the `/`
// language redirect) before any file, then the file with the vercel.json
// headers. Like Vercel, a redirect from trailingSlash or `redirects` carries
// only its status and Location, none of the custom headers (seen on the first
// real deployment). So the security baseline and the redirect matrix can be
// checked before a preview exists (`astro preview` ignores vercel.json). Local
// use and CI only; Vercel serves the real site.
//   node scripts/serve-dist.mjs [port]     (default 4321)

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";
import { headersFor, loadConfig, loadRules } from "./lib/vercel-headers.mjs";
import { resolveRedirect } from "./lib/vercel-redirects.mjs";

const DIST = new URL("../dist", import.meta.url).pathname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

// Clean URLs, like Vercel's static output: /a serves a.html or a/index.html
function resolveFile(pathname) {
  const base = normalize(join(DIST, decodeURIComponent(pathname)));
  if (!base.startsWith(DIST)) return null;
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export function serve(port = 4321) {
  const config = loadConfig();
  const rules = loadRules(config);
  const server = createServer((req, res) => {
    const { pathname, search } = new URL(req.url ?? "/", "http://localhost");
    const redirect = resolveRedirect(config, { pathname, search, headers: req.headers });
    if (redirect) {
      res.writeHead(redirect.status, { location: redirect.location }).end();
      return;
    }
    for (const [key, value] of headersFor(rules, pathname)) res.setHeader(key, value);
    const file = resolveFile(pathname);
    const notFound = resolveFile("/404");
    if (!file && !notFound) {
      res.writeHead(404, { "content-type": TYPES[".txt"] }).end("Not found");
      return;
    }
    const target = file ?? notFound;
    res.writeHead(file ? 200 : 404, {
      "content-type": TYPES[extname(target)] ?? "application/octet-stream",
    });
    createReadStream(target).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const port = Number(process.argv[2] ?? 4321);
  await serve(port);
  console.log(`Serving dist/ with vercel.json headers and redirects at http://127.0.0.1:${port}`);
}
