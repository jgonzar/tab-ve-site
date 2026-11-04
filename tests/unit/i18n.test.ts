import { describe, expect, it } from "vitest";
import en from "../../src/i18n/en.json";
import es from "../../src/i18n/es.json";
import { DEFAULT_LOCALE, isLocale, LOCALES, strings } from "../../src/i18n";

/** Every leaf key, as dotted paths, sorted. */
function keys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value)
    .flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

function leaves(value: unknown): unknown[] {
  if (value === null || typeof value !== "object") return [value];
  return Object.values(value).flatMap(leaves);
}

describe("i18n parity", () => {
  it("en.json and es.json hold exactly the same keys", () => {
    expect(keys(es)).toEqual(keys(en));
  });

  it("no string is empty", () => {
    for (const value of [...leaves(en), ...leaves(es)]) {
      expect(typeof value).toBe("string");
      expect((value as string).trim()).not.toBe("");
    }
  });

  it("translates everything except brand and stack terms", () => {
    // Identical in both languages on purpose: the language names (each in
    // itself) and the stack chips (product names, copy row 17)
    const SAME = /^(lang\.|built\.chips\.)/;
    const flat = (value: unknown, prefix = ""): [string, unknown][] =>
      value !== null && typeof value === "object"
        ? Object.entries(value).flatMap(([k, v]) => flat(v, prefix ? `${prefix}.${k}` : k))
        : [[prefix, value]];
    const esValues = new Map(flat(es));
    const untranslated = flat(en)
      .filter(([key, value]) => !SAME.test(key) && esValues.get(key) === value)
      .map(([key]) => key);
    expect(untranslated).toEqual([]);
  });

  it("pills a phrase that row 8 really contains, in both languages", () => {
    for (const t of [en, es]) expect(t.hero.sub).toContain(t.hero.subPill);
  });

  it("labels the receipt card's two steps with the approved copy (rows 35 and 36)", () => {
    expect(en.features.steps).toEqual({ share: "Share", paid: "Mark paid" });
    expect(es.features.steps).toEqual({ share: "Compartir", paid: "Marcar pagado" });
  });

  it("serves each locale its own file", () => {
    expect(strings("en")).toBe(en);
    expect(strings("es")).toBe(es);
  });
});

describe("locales", () => {
  it("are en and es, defaulting to en", () => {
    expect(LOCALES).toEqual(["en", "es"]);
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("accept only en and es", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("es")).toBe(true);
    for (const junk of ["", "EN", "fr", "es-VE", " es", "en\n", null, undefined, 1, {}]) {
      expect(isLocale(junk)).toBe(false);
    }
  });
});
