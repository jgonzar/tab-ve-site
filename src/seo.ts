// Every absolute URL in the head, the sitemap and robots.txt is built here, from
// SITE_URL. A custom domain later is the one-line change in src/site.ts.
import { DEMO_URL, SITE_URL } from "./site";
import { LOCALES, type Locale } from "./i18n";

/** The page's path. Pages end in a slash (vercel.json trailingSlash: true). */
export function pagePath(locale: Locale): string {
  return `/${locale}/`;
}

/** The page's own absolute URL: its canonical, og:url and sitemap <loc>. */
export function pageUrl(locale: Locale, site: string = SITE_URL): string {
  return new URL(pagePath(locale), site).href;
}

export interface Alternate {
  hreflang: Locale | "x-default";
  href: string;
}

/**
 * The hreflang set, the same on every page so it's reciprocal: one link per
 * language, and x-default on `/`, where the redirect picks the language.
 */
export function alternates(site: string = SITE_URL): Alternate[] {
  return [
    ...LOCALES.map((hreflang) => ({ hreflang, href: pageUrl(hreflang, site) })),
    { hreflang: "x-default" as const, href: new URL("/", site).href },
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

/** sitemap.xml: both pages, each listing every alternate. */
export function sitemapXml(site: string = SITE_URL): string {
  const links = alternates(site)
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
    .join("\n");
  const urls = LOCALES.map(
    (locale) => `  <url>\n    <loc>${pageUrl(locale, site)}</loc>\n${links}\n  </url>`,
  ).join("\n");
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
