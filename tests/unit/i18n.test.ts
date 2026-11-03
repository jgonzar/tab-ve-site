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
