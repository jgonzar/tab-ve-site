// The language list and the cookie name, with no strings attached, so the
// client script can import them without pulling the copy into its bundle.

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Used when nothing else decides: no cookie, no Spanish Accept-Language. */
export const DEFAULT_LOCALE: Locale = "en";

/** The cookie the language links set, and the `/` redirect in vercel.json reads. */
export const LANG_COOKIE = "tab_site_lang";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
