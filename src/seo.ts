// Every absolute URL in the head, the sitemap and robots.txt is built here, from
// SITE_URL. A custom domain later is the one-line change in src/site.ts.
import { DEMO_URL, SITE_URL } from "./site";
import { LOCALES, type Locale } from "./i18n";

/** The site's pages, each in every language: the landing page and the credits. */
export const PAGES = ["home", "credits"] as const;
export type Page = (typeof PAGES)[number];

/** The page's path. Pages end in a slash (vercel.json trailingSlash: true). */
export function pagePath(locale: Locale, page: Page = "home"): string {
  return page === "home" ? `/${locale}/` : `/${locale}/${page}/`;
}

/** The page's own absolute URL: its canonical, og:url and sitemap <loc>. */
export function pageUrl(locale: Locale, site: string = SITE_URL, page: Page = "home"): string {
  return new URL(pagePath(locale, page), site).href;
}

export interface Alternate {
  hreflang: Locale | "x-default";
  href: string;
}

/**
 * The hreflang set, the same in every language of a page so it's reciprocal:
 * one link per language, plus x-default. For the landing page that's `/`,
 * where the redirect picks the language; the credits have no picker, so their
 * x-default is the English page.
 */
export function alternates(site: string = SITE_URL, page: Page = "home"): Alternate[] {
  const fallback = page === "home" ? new URL("/", site).href : pageUrl("en", site, page);
  return [
    ...LOCALES.map((hreflang) => ({ hreflang, href: pageUrl(hreflang, site, page) })),
    { hreflang: "x-default" as const, href: fallback },
  ];
}

/** The language's link preview card (1200 by 630 PNG, from L3). */
export function ogImage(locale: Locale, site: string = SITE_URL): string {
  return new URL(`/og/og-${locale}.png`, site).href;
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** og:locale values. Spanish is Venezuela's, where Tab is used. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_VE" };

/** "Try the demo" opens the demo in the page's language (the demo reads ?lang=, L5). */
export function demoUrl(locale: Locale, demo: string = DEMO_URL): string {
  const url = new URL(demo);
  url.searchParams.set("lang", locale);
  return url.href;
}

/** sitemap.xml: every page in every language, each listing its alternates. */
export function sitemapXml(site: string = SITE_URL): string {
  const urls = PAGES.flatMap((page) => {
    const links = alternates(site, page)
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
      .join("\n");
    return LOCALES.map(
      (locale) => `  <url>\n    <loc>${pageUrl(locale, site, page)}</loc>\n${links}\n  </url>`,
    );
  }).join("\n");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

/** robots.txt: everything may be crawled; the sitemap is listed. */
export function robotsTxt(site: string = SITE_URL): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", site).href}\n`;
}
