// Visual snapshots of both pages at a phone and a desktop width, with
// animations off. Baselines are per platform (Playwright adds the suffix); CI
// compares against the committed Linux ones in visual.spec.ts-snapshots/.
// Refresh them with `pnpm test:e2e --update-snapshots` on Linux, or from the
// playwright-report artifact of a CI run.
import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1280]) {
  for (const locale of ["en", "es"]) {
    test(`/${locale}/ at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      await page.evaluate(() => document.fonts.ready);
      // Load every lazy image without scrolling, so the snapshot is complete.
      // Scrolling first leaves Chromium's full-page capture painting some
      // text from a stale raster (the closing pill came out at 75%); a
      // viewport screenshot of the same state paints it correctly.
      await page.evaluate(() => {
        for (const img of document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) {
          img.loading = "eager";
        }
      });
      for (const img of await page.locator("img").all()) {
        await expect(img).toHaveJSProperty("complete", true);
      }
      await expect(page).toHaveScreenshot(`${locale}-${width}.png`, {
        fullPage: true,
        animations: "disabled",
      });
    });
  }
}
