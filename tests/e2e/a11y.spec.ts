// axe on every page, in both languages, at a phone and a desktop width:
// zero violations of WCAG 2.2 A and AA, or of axe's best practices.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PATHS = ["/en/", "/es/", "/en/credits/", "/es/credits/"];

for (const width of [390, 1280]) {
  for (const path of PATHS) {
    test(`${path} at ${width}px has no axe violations`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(" ")),
      }));
      expect(summary).toEqual([]);
    });
  }
}
