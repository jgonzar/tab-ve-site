#!/usr/bin/env node
// Renders the link preview cards, public/og/og-en.png and og-es.png
// (1200x630), from scripts/og-template.svg, a copy of Tab's design/og.svg
// with the description as text slots. resvg draws them with Poppins from
// @fontsource (OFL) and no system fonts, so the output is the same on macOS
// and Linux CI (no sips).
//
//   pnpm og            write both cards
//   pnpm og --check    render in memory and compare with the committed
//                      files, pixel by pixel, within a small tolerance (the
//                      visual snapshot; CI runs it, see CHANNEL_TOLERANCE)
//
// Never hotlink tab-ve.vercel.app/og.png: the site serves its own copies.

import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

/** Each card's two description lines. English is Tab's current card, word for word. */
const CARDS = {
  en: ["Offline-first ride payment tracker with", "live BCV exchange-rate conversion."],
  es: ["Pagos de carreras, incluso sin conexión,", "convertidos a la tasa BCV del día."],
} as const;

/** The description must end left of the icon tile, which starts at x 790. */
const MAX_TEXT_RIGHT = 750;

const ROOT = new URL("..", import.meta.url);
const TEMPLATE = readFileSync(new URL("scripts/og-template.svg", ROOT), "utf8");
const OUT = new URL("public/og/", ROOT);
const FONT = new URL("node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff", ROOT);

/**
 * WOFF 1.0 to a plain TrueType font, which resvg can load. Fontsource ships
 * WOFF and WOFF2 only; WOFF is the same tables, each zlib-compressed.
 */
function woffToTtf(woff: Buffer): Buffer {
  if (woff.toString("latin1", 0, 4) !== "wOFF") throw new Error("not a WOFF 1.0 file");
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);
  const tables = Array.from({ length: numTables }, (_, i) => {
    const at = 44 + i * 20;
    const offset = woff.readUInt32BE(at + 4);
    const compLength = woff.readUInt32BE(at + 8);
    const origLength = woff.readUInt32BE(at + 12);
    const raw = woff.subarray(offset, offset + compLength);
    return {
      tag: woff.subarray(at, at + 4),
      checksum: woff.readUInt32BE(at + 16),
      data: compLength < origLength ? inflateSync(raw) : raw,
    };
  });

  const entrySelector = Math.floor(Math.log2(numTables));
  const searchRange = 2 ** entrySelector * 16;
  const header = Buffer.alloc(12 + numTables * 16);
  header.writeUInt32BE(flavor, 0);
  header.writeUInt16BE(numTables, 4);
  header.writeUInt16BE(searchRange, 6);
  header.writeUInt16BE(entrySelector, 8);
  header.writeUInt16BE(numTables * 16 - searchRange, 10);

  const chunks: Buffer[] = [header];
  let offset = header.length;
  tables.forEach((table, i) => {
    const at = 12 + i * 16;
    table.tag.copy(header, at);
    header.writeUInt32BE(table.checksum, at + 4);
    header.writeUInt32BE(offset, at + 8);
    header.writeUInt32BE(table.data.length, at + 12);
    const padded = Buffer.alloc(Math.ceil(table.data.length / 4) * 4);
    table.data.copy(padded);
    chunks.push(padded);
    offset += padded.length;
  });
  return Buffer.concat(chunks);
}

/**
 * The visual snapshot's tolerance, for `--check` (it runs in CI on Linux
 * x64; the committed cards are rendered on macOS arm64). Measured with
 * scripts/og.ts's own renderer on the English card (756,000 pixels):
 *
 * - Anti-aliasing noise: even a different rasterizer entirely (Tab's og.png,
 *   macOS sips drawing outlined paths, against resvg drawing text) differs by
 *   at most 48/255 per channel, and only 20 pixels by more than 32. The same
 *   resvg build on another CPU differs only by rounding, far less than that.
 * - Real changes: one wrong letter ("BVC") moves 471 pixels by more than 32,
 *   a missing comma 14, and the text 1px to the right 6,131. A lost font
 *   (fallback glyphs) moves thousands.
 *
 * So a pixel counts as off when any channel differs by more than 32, and at
 * most 10 may be off: under the missing comma, above stray edge pixels. A
 * percentage like 0.5% (3,780 pixels) would let a wrong word through.
 */
const CHANNEL_TOLERANCE = 32;
const MAX_PIXELS_OFF = 10;

/** How many RGBA pixels differ by more than CHANNEL_TOLERANCE in any channel. */
function pixelsOff(a: Buffer, b: Buffer): number {
  if (a.length !== b.length) return Infinity;
  let off = 0;
  for (let i = 0; i < a.length; i += 4) {
    for (let c = 0; c < 4; c++) {
      if (Math.abs(a[i + c] - b[i + c]) > CHANNEL_TOLERANCE) {
        off++;
        break;
      }
    }
  }
  return off;
}

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const check = process.argv.includes("--check");
const fontDir = mkdtempSync(join(tmpdir(), "tab-og-font-"));
const fontFile = join(fontDir, "Poppins-Regular.ttf");
writeFileSync(fontFile, woffToTtf(readFileSync(FONT)));

const options = {
  fitTo: { mode: "original" as const },
  font: { loadSystemFonts: false, fontFiles: [fontFile], defaultFontFamily: "Poppins" },
};

const failures: string[] = [];
try {
  mkdirSync(OUT, { recursive: true });
  for (const [lang, [line1, line2]] of Object.entries(CARDS)) {
    const svg = TEMPLATE.replace("{{line1}}", escapeXml(line1)).replace(
      "{{line2}}",
      escapeXml(line2),
    );

    // The description alone, to measure where it ends
    const textOnly = svg.replace(/<(path|rect)\b[^>]*\/>/g, "");
    const box = new Resvg(textOnly, options).getBBox();
    const right = box ? box.x + box.width : 0;
    if (!box || right > MAX_TEXT_RIGHT) {
      failures.push(
        `og-${lang}: the description ends at x ${right.toFixed(1)}, past ${MAX_TEXT_RIGHT}`,
      );
    }

    const rendered = new Resvg(svg, options).render();
    const png = rendered.asPng();
    const file = new URL(`og-${lang}.png`, OUT);
    if (check) {
      let committed: Buffer | null = null;
      try {
        committed = (await sharp(readFileSync(file)).ensureAlpha().raw().toBuffer()) as Buffer;
      } catch {
        // reported below
      }
      const off = committed ? pixelsOff(rendered.pixels, committed) : Infinity;
      if (off > MAX_PIXELS_OFF) {
        failures.push(
          `og-${lang}.png differs from the committed file (${off} pixels off by more than ${CHANNEL_TOLERANCE}/255, at most ${MAX_PIXELS_OFF} allowed)`,
        );
      } else console.log(`  = og-${lang}.png (${off} pixels off)`);
    } else {
      writeFileSync(file, png);
      console.log(
        `  og-${lang}.png  ${(png.length / 1024).toFixed(0)} KB, description ends at x ${right.toFixed(1)}`,
      );
    }
  }
} finally {
  rmSync(fontDir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(
    `✗ og: ${failures.join("; ")}${check ? ". Run pnpm og and review the cards." : ""}`,
  );
  process.exit(1);
}
console.log(`✓ og: ${check ? "both cards match" : `wrote ${fileURLToPath(OUT)}`}`);
