// Resolves a request against vercel.json `trailingSlash` and `redirects`, the
// way Vercel does, so the `/` language redirect can be tested before any
// preview exists. One source of truth: the rules are read from vercel.json.
//
// Covered: literal and `(.*)` sources, `has` and `missing` on cookies and
// headers, string values (a full match) and the object operators eq, neq, inc,
// ninc, pre, suf and re. Anything else throws, so a new rule can't be silently
// mismatched. The preview e2e run checks the same matrix on Vercel itself.

import { sourcePattern } from "./vercel-headers.mjs";

const OPERATORS = {
  eq: (v, x) => v === x,
  neq: (v, x) => v !== x,
  inc: (v, x) => x.includes(v),
  ninc: (v, x) => !x.includes(v),
  pre: (v, x) => v.startsWith(x),
  suf: (v, x) => v.endsWith(x),
  re: (v, x) => new RegExp(x).test(v),
};

/** Cookie header to a Map. The first cookie of a name wins, as in browsers. */
export function parseCookies(header = "") {
  const out = new Map();
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 1) continue;
    const name = part.slice(0, i).trim();
    if (!out.has(name)) out.set(name, part.slice(i + 1).trim());
  }
  return out;
}

function conditionHolds({ type, key, value }, request) {
  let actual;
  if (type === "cookie") actual = request.cookies.get(key);
  else if (type === "header") actual = request.headers[key.toLowerCase()];
  else throw new Error(`vercel.json has/missing type not emulated: ${type}`);
  if (actual === undefined) return false;
  if (value === undefined) return true;
  if (typeof value === "string") return new RegExp(`^(?:${value})$`).test(actual);
  return Object.entries(value).every(([op, expected]) => {
    if (!OPERATORS[op]) throw new Error(`vercel.json has/missing operator not emulated: ${op}`);
    return OPERATORS[op](actual, expected);
  });
}

/**
 * The redirect Vercel would answer with, or null to serve the file.
 * @param {object} config parsed vercel.json
 * @param {{ pathname: string, search?: string, headers: Record<string, string | undefined> }} request
 *   headers keyed in lower case, as Node gives them
 * @returns {{ status: number, location: string } | null}
 */
export function resolveRedirect(config, { pathname, search = "", headers }) {
  // Collapse leading slashes, so a request for //host can never become a
  // protocol-relative Location that leaves the site
  const path = `/${pathname.replace(/^\/+/, "")}`;

  if (config.trailingSlash === true && !path.endsWith("/") && !/\.[^/]*$/.test(path)) {
    return { status: 308, location: `${path}/${search}` };
  }

  const request = { headers, cookies: parseCookies(headers.cookie) };
  for (const rule of config.redirects ?? []) {
    if (!sourcePattern(rule.source).test(path)) continue;
    if (!(rule.has ?? []).every((c) => conditionHolds(c, request))) continue;
    if ((rule.missing ?? []).some((c) => conditionHolds(c, request))) continue;
    const status = rule.statusCode ?? (rule.permanent === false ? 307 : 308);
    return { status, location: `${rule.destination}${search}` };
  }
  return null;
}
