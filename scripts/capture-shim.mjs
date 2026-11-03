// Preloaded into the local Tab demo's server (node --import), never into this
// site. scripts/capture-demo.ts starts Tab with it. Three jobs, and no change to
// Tab's code:
//
// 1. The database. Tab talks to Postgres through Neon's HTTP driver
//    (@neondatabase/serverless), which POSTs every query to an /sql endpoint
//    with the global fetch. This answers those requests from an in-memory
//    PGlite instead, in the same process: a fresh, empty, throwaway database
//    on every start, with Tab's schema applied from CAPTURE_SCHEMA_SQL. Tab's
//    own lazy demo reset then seeds it on the first request.
// 2. The BCV rate. Tab's server reads it from ve.dolarapi.com; this answers
//    that request with the fixed CAPTURE_BCV_RATE.
// 3. The clock. Date starts at CAPTURE_NOW when the server starts, then runs
//    normally, so the seed (relative to "now") is the same on every run.
//
// Every other outbound fetch is refused, so the server can never reach a real
// database or any other network service.

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const { CAPTURE_NOW, CAPTURE_BCV_RATE, CAPTURE_SCHEMA_SQL, DATABASE_URL } = process.env;
if (!CAPTURE_NOW || !CAPTURE_BCV_RATE || !CAPTURE_SCHEMA_SQL || !DATABASE_URL) {
  throw new Error(
    "capture-shim: CAPTURE_NOW, CAPTURE_BCV_RATE, CAPTURE_SCHEMA_SQL and DATABASE_URL are required",
  );
}

// Only this process: Tab's build tooling spawns children (the Paraglide
// compile) with this environment, and they need no database
delete process.env.NODE_OPTIONS;

// --- 3. The clock

const RealDate = Date;
const offset = new RealDate(CAPTURE_NOW).getTime() - RealDate.now();
if (Number.isNaN(offset))
  throw new Error(`capture-shim: CAPTURE_NOW is not a date: ${CAPTURE_NOW}`);

class ShiftedDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(RealDate.now() + offset);
    else super(...args);
  }
  static now() {
    return RealDate.now() + offset;
  }
}
globalThis.Date = ShiftedDate;

// --- 1. The database

// The database host in DATABASE_URL is a reserved .invalid name, so a request
// that got past this shim could never resolve. The driver posts to
// https://api.<host minus its first label>/sql.
const dbHost = new URL(DATABASE_URL).hostname;
const SQL_ENDPOINT = `https://${dbHost.replace(/^[^.]+\./, "api.")}/sql`;
if (!dbHost.endsWith(".invalid"))
  throw new Error("capture-shim: the DATABASE_URL host must end in .invalid");

// PGlite comes from Tab's own dependencies (a devDependency there)
const requireFromTab = createRequire(join(process.cwd(), "package.json"));
const { PGlite } = await import(pathToFileURL(requireFromTab.resolve("@electric-sql/pglite")).href);

const pg = new PGlite();
await pg.exec(readFileSync(CAPTURE_SCHEMA_SQL, "utf8"));

// The driver sends every parameter as text and parses every value itself
// from the text and the column's type id (Neon-Raw-Text-Output), so values
// pass through PGlite untouched in both directions.
const identity = new Proxy({}, { get: () => (value) => value });
const RAW = { rowMode: "array", parsers: identity, serializers: identity };

function toNeonResult(query, result) {
  return {
    command: query.trim().split(/\s+/)[0].toUpperCase(),
    rowCount: result.affectedRows ?? result.rows.length,
    fields: result.fields.map((f) => ({ name: f.name, dataTypeID: f.dataTypeID })),
    rows: result.rows,
  };
}

const ERROR_FIELDS = [
  "severity",
  "code",
  "detail",
  "hint",
  "position",
  "schema",
  "table",
  "column",
  "constraint",
  "routine",
];

function errorResponse(e) {
  const body = { message: e instanceof Error ? e.message : String(e) };
  for (const field of ERROR_FIELDS) if (e?.[field] !== undefined) body[field] = e[field];
  return new Response(JSON.stringify(body), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

// One query, or a batch ({ queries }) run as one transaction, as Neon does
async function answerSql(body) {
  try {
    if (Array.isArray(body.queries)) {
      const results = await pg.transaction(async (tx) => {
        const out = [];
        for (const q of body.queries)
          out.push(toNeonResult(q.query, await tx.query(q.query, q.params, RAW)));
        return out;
      });
      return Response.json({ results });
    }
    return Response.json(toNeonResult(body.query, await pg.query(body.query, body.params, RAW)));
  } catch (e) {
    return errorResponse(e);
  }
}

// --- 2. The rate, and the fetch gate

const RATE_URL = "https://ve.dolarapi.com/v1/dolares/oficial";
const rate = Number(CAPTURE_BCV_RATE);

const realFetch = globalThis.fetch;
globalThis.fetch = async function captureFetch(input, init) {
  const request = new Request(input, init);
  if (request.url === SQL_ENDPOINT && request.method === "POST")
    return answerSql(await request.json());
  if (request.url === RATE_URL) return Response.json({ fuente: "oficial", promedio: rate });
  // Requests to the server itself (SvelteKit's own fetch can loop back)
  const { hostname } = new URL(request.url);
  if (hostname === "127.0.0.1" || hostname === "localhost") return realFetch(request);
  throw new Error(`capture-shim: blocked an outbound request to ${request.url}`);
};

console.log(`[capture-shim] PGlite in memory, BCV ${rate}, clock from ${CAPTURE_NOW}`);
