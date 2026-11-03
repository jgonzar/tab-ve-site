// The SEO head of each page, the link cards, sitemap.xml and robots.txt.
import { expect, test, type APIRequestContext } from "@playwright/test";
import en from "../../src/i18n/en.json" with { type: "json" };
import es from "../../src/i18n/es.json" with { type: "json" };
import { SITE_URL } from "../../src/site";

const PAGES = [
  { locale: "en", path: "/en/", t: en },
  { locale: "es", path: "/es/", t: es },
] as const;

const absolute = (path: string) => new URL(path, SITE_URL).href;

/** Fetches a production URL's path from the target under test (local or preview). */
function fromTarget(request: APIRequestContext, url: string) {
  expect(url.startsWith(`${SITE_URL}/`), `${url} is not built from SITE_URL`).toBe(true);
  return request.get(new URL(url).pathname);
}

/** A PNG's width and height, from its IHDR chunk. */
function pngSize(body: Buffer) {
  expect(body.subarray(1, 4).toString("latin1")).toBe("PNG");
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

for (const { locale, path, t } of PAGES) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("names its language and uses the approved title and description", async ({ page }) => {
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(t.meta.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        t.meta.description,
      );
    });

    test("is its own canonical", async ({ page }) => {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", absolute(path));
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        absolute(path),
      );
    });

    test("lists reciprocal hreflang links, with x-default on /", async ({ page }) => {
      const links = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((els) =>
          els.map((el) => [el.getAttribute("hreflang"), el.getAttribute("href")]),
        );
      expect(Object.fromEntries(links)).toEqual({
        en: absolute("/en/"),
        es: absolute("/es/"),
        "x-default": absolute("/"),
      });
    });

    test("points its link card at a 1200 by 630 PNG that exists", async ({ page, request }) => {
      const image = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(image).toBe(absolute(`/og/og-${locale}.png`));
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        "content",
        String(image),
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      const res = await fromTarget(request, String(image));
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
      expect(pngSize(await res.body())).toEqual({ width: 1200, height: 630 });
    });

    test("has theme-color and favicons that load", async ({ page, request }) => {
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0b0a29");
      const icons = await page
        .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
        .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
      expect(icons.length).toBeGreaterThan(0);
      for (const icon of icons) expect((await request.get(icon)).status()).toBe(200);
    });
  });
}

test("sitemap.xml is valid XML listing both pages with every alternate", async ({
  page,
  request,
}) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("xml");
  const xml = await res.text();
  await page.goto("/en/");
  const parsed = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "application/xml");
    if (doc.querySelector("parsererror")) return null;
    const XHTML = "http://www.w3.org/1999/xhtml";
    return {
      root: [doc.documentElement.localName, doc.documentElement.namespaceURI],
      urls: [...doc.documentElement.children].map((url) => ({
        loc: url.getElementsByTagName("loc")[0]?.textContent,
        alternates: [...url.getElementsByTagNameNS(XHTML, "link")].map((l) => [
          l.getAttribute("rel"),
          l.getAttribute("hreflang"),
          l.getAttribute("href"),
        ]),
      })),
    };
  }, xml);
  if (!parsed) throw new Error("sitemap.xml is not well-formed");
  expect(parsed.root).toEqual(["urlset", "http://www.sitemaps.org/schemas/sitemap/0.9"]);
  const alternates = [
    ["alternate", "en", absolute("/en/")],
    ["alternate", "es", absolute("/es/")],
    ["alternate", "x-default", absolute("/")],
  ];
  expect(parsed.urls).toEqual([
    { loc: absolute("/en/"), alternates },
    { loc: absolute("/es/"), alternates },
  ]);
});

test("robots.txt allows everything and lists the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/plain");
  const lines = (await res.text()).trim().split("\n");
  expect(lines).toEqual(["User-agent: *", "Allow: /", "", `Sitemap: ${absolute("/sitemap.xml")}`]);
  expect((await fromTarget(request, absolute("/sitemap.xml"))).status()).toBe(200);
});

test("a preview is never indexed", async ({ request }) => {
  test.skip(!process.env.PREVIEW_URL, "Vercel adds X-Robots-Tag on previews only");
  const res = await request.get("/en/");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
});
