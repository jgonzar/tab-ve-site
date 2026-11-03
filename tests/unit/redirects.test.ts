// The `/` language redirect, resolved from the real vercel.json by the same
// emulation scripts/serve-dist.mjs uses. The e2e suite runs this matrix over
// HTTP, locally and against the preview.
import { describe, expect, it } from "vitest";
import { loadConfig } from "../../scripts/lib/vercel-headers.mjs";
import { parseCookies, resolveRedirect } from "../../scripts/lib/vercel-redirects.mjs";

const config = loadConfig();
const resolve = (pathname: string, headers: Record<string, string> = {}) =>
  resolveRedirect(config, { pathname, headers });

describe("the / redirect matrix", () => {
  const cases: [string, Record<string, string>, string][] = [
    ["no cookie, es-VE", { "accept-language": "es-VE,es;q=0.9" }, "/es/"],
    ["no cookie, bare es", { "accept-language": "es" }, "/es/"],
    ["no cookie, en-US", { "accept-language": "en-US,en;q=0.9" }, "/en/"],
    ["English first, Spanish second", { "accept-language": "en-US,es;q=0.8" }, "/en/"],
    ["no headers at all", {}, "/en/"],
    ["cookie es beats English", { cookie: "tab_site_lang=es", "accept-language": "en-US" }, "/es/"],
    ["cookie en beats Spanish", { cookie: "tab_site_lang=en", "accept-language": "es-VE" }, "/en/"],
    ["junk cookie, es-VE", { cookie: "tab_site_lang=fr", "accept-language": "es-VE" }, "/es/"],
    ["junk cookie, en-US", { cookie: "tab_site_lang=esx", "accept-language": "en-US" }, "/en/"],
    ["junk cookie, no header", { cookie: "tab_site_lang=//evil.example" }, "/en/"],
    ["other cookies only", { cookie: "a=1; b=es", "accept-language": "es-VE" }, "/es/"],
  ];

  for (const [name, headers, location] of cases) {
    it(`${name}: 307 to ${location}`, () => {
      expect(resolve("/", headers)).toEqual({ status: 307, location });
    });
  }
});

describe("never off-site", () => {
  const paths = ["//evil.example", "///evil.example", "//evil.example/en", "/en", "/es"];
  const junk = { cookie: "tab_site_lang=//evil.example", "accept-language": "es//evil.example" };

  for (const pathname of paths) {
    it(`${pathname} stays on this site`, () => {
      const location = resolve(pathname, junk)?.location ?? "/";
      expect(location).toMatch(/^\/(?!\/)/);
    });
  }

  it("redirect targets are literals from a fixed list", () => {
    const targets = (config.redirects as { destination: string }[]).map((r) => r.destination);
    expect(new Set(targets)).toEqual(new Set(["/en/", "/es/"]));
  });

  it("every redirect is temporary (307)", () => {
    for (const r of config.redirects as { permanent?: boolean }[]) expect(r.permanent).toBe(false);
  });
});

describe("trailing slash", () => {
  it("adds one to pages with a 308", () => {
    expect(resolve("/en")).toEqual({ status: 308, location: "/en/" });
  });

  it("leaves files and the pages themselves alone", () => {
    expect(resolve("/en/")).toBeNull();
    expect(resolve("/sitemap.xml")).toBeNull();
    expect(resolve("/.well-known/security.txt")).toBeNull();
  });
});

describe("cookie parsing", () => {
  it("keeps the first cookie of a name", () => {
    expect(parseCookies("tab_site_lang=es; tab_site_lang=en").get("tab_site_lang")).toBe("es");
  });
});
