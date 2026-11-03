// Visual snapshots of both pages at a phone and a desktop width, with
// animations off. Baselines are per platform (Playwright adds the suffix); CI
// compares against the committed Linux ones in visual.spec.ts-snapshots/.
// Refresh them with `pnpm test:e2e --update-snapshots` on Linux, or from the
// playwright-report artifact of a CI run.
import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  for (const locale of ["en", "es"]) {
    test(`/${locale}/ at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      await page.evaluate(() => document.fonts.ready);
      // Bring every lazy image in, so the snapshot is complete
      for (const img of await page.locator('img[loading="lazy"]').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page).toHaveScreenshot(`${locale}-${width}.png`, {
        fullPage: true,
        animations: "disabled",
      });
    });
  }
}
