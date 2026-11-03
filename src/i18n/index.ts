// The site's strings. Every visible string lives in en.json and es.json, which
// must hold the same keys (a unit test checks it). The copy is the approved
// table in the plan (question 15).
import en from "./en.json";
import es from "./es.json";
import type { Locale } from "./locales";

export * from "./locales";

export type Strings = typeof en;

const STRINGS: Record<Locale, Strings> = { en, es };

export function strings(locale: Locale): Strings {
  return STRINGS[locale];
}
