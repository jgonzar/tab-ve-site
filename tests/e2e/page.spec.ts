// The page itself, in both languages: every section, the links, the images,
// the layout at every width, and the accessibility basics axe can't judge.
import { expect, test } from "@playwright/test";
import en from "../../src/i18n/en.json" with { type: "json" };
import es from "../../src/i18n/es.json" with { type: "json" };
import { JAGR_QUEST_URL } from "../../src/site";

const PAGES = [
  { locale: "en", t: en },
  { locale: "es", t: es },
] as const;

/** Every string in a copy file, as [dotted key, value] pairs. */
function flat(value: unknown, prefix = ""): [string, string][] {
  return value !== null && typeof value === "object"
    ? Object.entries(value).flatMap(([k, v]) => flat(v, prefix ? `${prefix}.${k}` : k))
    : [[prefix, String(value)]];
}

for (const { locale, t } of PAGES) {
  test.describe(`/${locale}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test("renders every section, in order, with the approved copy", async ({ page }) => {
      const main = page.locator("main");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(t.hero.headline);
      await expect(main.getByText(t.hero.eyebrow, { exact: true })).toBeVisible();
      await expect(main.getByText(t.hero.before, { exact: true })).toBeVisible();
      await expect(main.getByText(t.hero.sub, { exact: true })).toBeVisible();

      const h2 = await main.locator("h2").allTextContents();
      expect(h2).toEqual([t.features.title, t.built.title]);
      const h3 = await main.locator("h3").allTextContents();
      expect(h3).toEqual(t.features.items.map((f) => f.title));
      for (const f of t.features.items) {
        await expect(main.getByText(f.body, { exact: true })).toBeVisible();
      }

      // "Settle up" is the receipt, as text, captioned with copy row 15
      const receipt = main.locator("figure.receipt");
      await expect(receipt.locator("pre")).toContainText("$34.50");
      await expect(receipt.locator("figcaption")).toHaveText(t.features.items[2]?.alt ?? "");

      await expect(main.locator(".chip")).toHaveText(t.built.chips);
      await expect(main.getByText(t.demo.note, { exact: true })).toBeVisible();

      const footer = page.locator("footer");
      await expect(footer.getByText(t.footer.privacy, { exact: true })).toBeVisible();
    });

    test("both demo buttons open the demo in this language", async ({ page }) => {
      const demo = page.getByRole("link", { name: t.demo.cta, exact: true });
      await expect(demo).toHaveCount(2);
      for (const link of await demo.all()) {
        await expect(link).toHaveAttribute(
          "href",
          `https://tab-ve-demo.vercel.app/?lang=${locale}`,
        );
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });

    test("the strip and the footer lead to Tab's quest on JAGR", async ({ page }) => {
      const strip = page.locator("nav.jagr-strip a");
      const back = page.locator("footer").getByRole("link", { name: t.footer.back });
      for (const link of [strip, back]) {
        await expect(link).toHaveAttribute("href", JAGR_QUEST_URL);
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });

    test("the credits are one click away", async ({ page }) => {
      await page.locator("footer").getByRole("link", { name: t.footer.credits }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/credits/$`));
      await expect(page.locator("h1")).toHaveText(t.credits.title);
      for (const name of [t.credits.poppinsLicence, t.credits.shareTechLicence]) {
        const href = await page.getByRole("link", { name }).getAttribute("href");
        const res = await page.request.get(String(href));
        expect(res.status()).toBe(200);
        expect(await res.text()).toContain("SIL Open Font License");
      }
    });

    test("the hero screen loads first; the feature screens are lazy", async ({ page }) => {
      const hero = page.locator(".hero img");
      await expect(hero).toHaveAttribute("loading", "eager");
      await expect(hero).toHaveAttribute("fetchpriority", "high");
      await expect(hero).toHaveAttribute("alt", t.hero.alt);
      const features = page.locator(".feature img");
      await expect(features).toHaveCount(2);
      for (const [i, img] of (await features.all()).entries()) {
        await expect(img).toHaveAttribute("loading", "lazy");
        await expect(img).toHaveAttribute("alt", t.features.items[i]?.alt ?? "");
      }
      // AVIF first, then WebP, each at 1x to 3x, with explicit dimensions
      const sources = await page
        .locator(".hero source")
        .evaluateAll((els) =>
          els.map((el) => [el.getAttribute("type"), el.getAttribute("srcset")?.split(",").length]),
        );
      expect(sources).toEqual([
        ["image/avif", 3],
        ["image/webp", 3],
      ]);
      await expect(hero).toHaveAttribute("width", /\d+/);
      await expect(hero).toHaveAttribute("height", /\d+/);
    });
  });
}

test("/es/ shows no English copy", async ({ page }) => {
  await page.goto("/es/");
  const text = await page.locator("body").innerText();
  // Brand and stack terms are the same in both languages (copy rows 1, 4, 17)
  const SAME = /^(lang\.|built\.chips\.)/;
  const esValues = new Map(flat(es));
  const english = flat(en)
    .filter(([key, value]) => !SAME.test(key) && esValues.get(key) !== value)
    .filter(([, value]) => text.includes(value))
    .map(([key]) => key);
  expect(english).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/en/", "/es/", "/en/credits/", "/es/credits/"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} at ${width}px`).toBe(0);
    }
  });
}

test("every visible link is at least 44px tall", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  for (const path of ["/en/", "/es/credits/"]) {
    await page.goto(path);
    const small = await page
      .locator("a:visible")
      .evaluateAll((links) =>
        links
          .map((a) => [
            a.textContent?.trim() || a.getAttribute("aria-label"),
            a.getBoundingClientRect().height,
          ])
          .filter(([, height]) => Number(height) < 44),
      );
    expect(small, path).toEqual([]);
  }
});

test("the skip link is first and moves focus to the content", async ({ page }) => {
  await page.goto("/en/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: en.skip });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test.describe("motion", () => {
  test("the hero floats when motion is welcome", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/");
    const name = await page
      .locator(".hero__phone")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toContain("float");
  });

  test("and stays still under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/");
    const name = await page
      .locator(".hero__phone")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe("none");
  });
});
