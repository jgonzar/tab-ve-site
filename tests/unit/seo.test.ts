import { describe, expect, it } from "vitest";
import { LOCALES } from "../../src/i18n";
import { SITE_URL } from "../../src/site";
import {
  alternates,
  demoUrl,
  ogImage,
  pagePath,
  pageUrl,
  robotsTxt,
  sitemapXml,
} from "../../src/seo";

describe("page URLs", () => {
  it("live under the language prefix, with a trailing slash", () => {
    expect(pagePath("en")).toBe("/en/");
    expect(pagePath("es")).toBe("/es/");
  });

  it("are absolute and built from SITE_URL", () => {
    expect(SITE_URL).toBe("https://tab-ve-site.vercel.app");
    expect(pageUrl("en")).toBe("https://tab-ve-site.vercel.app/en/");
    expect(pageUrl("es")).toBe("https://tab-ve-site.vercel.app/es/");
  });

  it("follow a different site in one change", () => {
    expect(pageUrl("es", "https://tab.example")).toBe("https://tab.example/es/");
    expect(
      alternates("https://tab.example").every((a) => a.href.startsWith("https://tab.example/")),
    ).toBe(true);
  });
});

describe("alternates", () => {
  const set = alternates();

  it("list every language once, plus x-default on /", () => {
    expect(set.map((a) => a.hreflang)).toEqual(["en", "es", "x-default"]);
    expect(set.find((a) => a.hreflang === "x-default")?.href).toBe(`${SITE_URL}/`);
  });

  it("point each language at its own canonical, so every page's set is reciprocal", () => {
    for (const locale of LOCALES) {
      expect(set.find((a) => a.hreflang === locale)?.href).toBe(pageUrl(locale));
    }
  });
});

describe("link cards and the demo link", () => {
  it("use the language's card", () => {
    expect(ogImage("en")).toBe(`${SITE_URL}/og/og-en.png`);
    expect(ogImage("es")).toBe(`${SITE_URL}/og/og-es.png`);
  });

  it("open the demo in the page's language", () => {
    expect(demoUrl("en")).toBe("https://tab-ve-demo.vercel.app/?lang=en");
    expect(demoUrl("es")).toBe("https://tab-ve-demo.vercel.app/?lang=es");
  });
});

describe("sitemap.xml", () => {
  const xml = sitemapXml();

  it("declares the sitemap and xhtml namespaces", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
  });

  it("lists both pages, each with every alternate", () => {
    const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1] ?? "");
    expect(urls).toHaveLength(LOCALES.length);
    LOCALES.forEach((locale, i) => {
      expect(urls[i]).toContain(`<loc>${pageUrl(locale)}</loc>`);
      for (const a of alternates()) {
        expect(urls[i]).toContain(
          `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`,
        );
      }
    });
  });

  it("needs no escaping (no &, <, > or quotes in any URL)", () => {
    for (const a of alternates()) expect(a.href).not.toMatch(/[&<>"']/);
  });
});

describe("robots.txt", () => {
  it("allows everything and lists the sitemap", () => {
    expect(robotsTxt()).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  });
});
