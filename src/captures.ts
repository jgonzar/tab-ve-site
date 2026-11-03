// The app's screens, per language, from L3's deterministic captures in
// src/assets/captures/{lang}/. Three are images; the shared receipt is text.
import type { ImageMetadata } from "astro";
import type { Locale } from "./i18n";

export type Screen = "inicio" | "quick-ride" | "summary";

const images = import.meta.glob<{ default: ImageMetadata }>("./assets/captures/*/*.png", {
  eager: true,
});

const receipts = import.meta.glob<string>("./assets/captures/*/receipt.txt", {
  eager: true,
  query: "?raw",
  import: "default",
});

export function screen(locale: Locale, name: Screen): ImageMetadata {
  const image = images[`./assets/captures/${locale}/${name}.png`];
  if (!image) throw new Error(`No capture ${locale}/${name}.png`);
  return image.default;
}

/** The receipt's lines; a line drawn only with box rules is marked as one. */
export function receipt(locale: Locale): { text: string; rule: boolean }[] {
  const text = receipts[`./assets/captures/${locale}/receipt.txt`];
  if (text === undefined) throw new Error(`No receipt ${locale}/receipt.txt`);
  return text
    .replace(/\n+$/, "")
    .split("\n")
    .map((line) => ({ text: line, rule: /^─+$/.test(line) }));
}
