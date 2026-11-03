// The `/` redirect matrix over HTTP: locally against serve-dist (vercel.json
// emulated), and against the preview (Vercel itself).
import { expect, test } from "@playwright/test";

const LANDING = ["/en/", "/es/"];

const matrix: [string, Record<string, string>, string][] = [
  ["no cookie, Accept-Language es-VE", { "accept-language": "es-VE,es;q=0.9" }, "/es/"],
  ["no cookie, Accept-Language en-US", { "accept-language": "en-US,en;q=0.9" }, "/en/"],
  ["English first, Spanish second", { "accept-language": "en-US,es;q=0.8" }, "/en/"],
  [
    "cookie es, Accept-Language English",
    { cookie: "tab_site_lang=es", "accept-language": "en-US" },
    "/es/",
  ],
  [
    "cookie en, Accept-Language Spanish",
    { cookie: "tab_site_lang=en", "accept-language": "es-VE" },
    "/en/",
  ],
  [
    "junk cookie falls through to es-VE",
    { cookie: "tab_site_lang=fr", "accept-language": "es-VE" },
    "/es/",
  ],
  [
    "junk cookie falls through to en-US",
    { cookie: "tab_site_lang=esx", "accept-language": "en-US" },
    "/en/",
  ],
  ["no Accept-Language at all", { "accept-language": "" }, "/en/"],
];

/** Where a Location header points, as a path on this site, or throws if it leaves. */
function sameSitePath(location: string, base: string): string {
  const target = new URL(location, base);
  expect(target.origin, `redirect left the site: ${location}`).toBe(new URL(base).origin);
  return target.pathname;
}

for (const [name, headers, expected] of matrix) {
  test(`/ with ${name}: 307 to ${expected}`, async ({ request, baseURL }) => {
    const res = await request.get("/", { headers, maxRedirects: 0 });
    expect(res.status()).toBe(307);
    const location = res.headers()["location"] ?? "";
    expect(sameSitePath(location, String(baseURL))).toBe(expected);
    // The redirect itself carries the security baseline
    expect(res.headers()["content-security-policy"]).toContain("default-src 'none'");
  });
}

test("the pages answer 200 in their own language, so nothing flashes", async ({ request }) => {
  for (const path of LANDING) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain(`<html lang="${path.slice(1, 3)}"`);
  }
});

test("a page without its trailing slash gets a 308 to it", async ({ request, baseURL }) => {
  for (const path of LANDING) {
    const res = await request.get(path.slice(0, -1), { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(sameSitePath(res.headers()["location"] ?? "", String(baseURL))).toBe(path);
  }
});

test("no response ever redirects off-site", async ({ request, baseURL }) => {
  const paths = [
    "/",
    "//evil.example",
    "//evil.example/",
    "///evil.example/en",
    "/%2F%2Fevil.example",
    "/en",
    "/es",
  ];
  const headerSets: Record<string, string>[] = [
    {},
    { cookie: "tab_site_lang=//evil.example", "accept-language": "es//evil.example" },
    { cookie: "tab_site_lang=https://evil.example", "accept-language": "https://evil.example" },
  ];
  for (const path of paths) {
    for (const headers of headerSets) {
      // Absolute, so a path like //evil.example is sent as a path, not a host
      const res = await request.get(`${baseURL}${path}`, { headers, maxRedirects: 0 });
      const location = res.headers()["location"];
      if (location !== undefined) sameSitePath(location, String(baseURL));
    }
  }
});
