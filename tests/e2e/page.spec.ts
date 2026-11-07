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
      // Row 8 is the closing band's big line, with its pill
      const closing = main.locator(".closing__line");
      await expect(closing).toHaveText(t.hero.sub);
      await expect(closing.locator(".closing__pill")).toHaveText(t.hero.subPill);

      // The section titles are the highlighted labels, with rows 11 and 16 beside them
      const h2 = await main.locator("h2").allTextContents();
      expect(h2).toEqual([t.features.eyebrow, t.built.eyebrow]);
      await expect(main.getByText(t.features.title, { exact: true })).toBeVisible();
      await expect(main.getByText(t.built.title, { exact: true })).toBeVisible();
      const h3 = await main.locator("h3").allTextContents();
      expect(h3).toEqual(t.features.items.map((f) => f.title));
      for (const f of t.features.items) {
        await expect(main.getByText(f.body, { exact: true })).toBeVisible();
      }

      // "Settle up" is the full receipt, as text, named with copy row 15
      const receipt = main.locator("pre.card__receipt");
      await expect(receipt).toContainText("$34.50");
      await expect(receipt).toHaveAttribute("aria-label", t.features.items[2]?.alt ?? "");

      // Its two steps carry their labels as visible text (copy rows 35 and 36),
      // and the icons add no name of their own: the name is the visible text
      const steps = main.locator(".settle__step");
      await expect(steps).toHaveText([t.features.steps.share, t.features.steps.paid]);
      await expect(steps.locator("[aria-label], [title]")).toHaveCount(0);
      await expect(steps.locator("svg[aria-hidden='true']")).toHaveCount(2);

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
      const features = page.locator(".card img");
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
  test("the hero's one motion is the route's dash march, held until the loader lifts", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/");
    const arc = await page.locator(".hero__arc").evaluate((el) => ({
      name: getComputedStyle(el).animationName,
      delay: getComputedStyle(el).animationDelay,
    }));
    expect(arc.name).toContain("march");
    expect(arc.delay).toBe("2.15s");
    // Nothing else in the hero runs: no float on the phone, no riding dot
    const phone = await page
      .locator(".hero__phone")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(phone).toBe("none");
    await expect(page.locator(".hero__dot")).toHaveCount(0);
  });

  test("and stays still under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/");
    for (const selector of [".hero__phone", ".hero__arc"]) {
      const name = await page
        .locator(selector)
        .evaluate((el) => getComputedStyle(el).animationName);
      expect(name, selector).toBe("none");
    }
  });
});

test.describe("the dot fields follow the pointer", () => {
  const radius = (page: import("@playwright/test").Page, selector: string) =>
    page
      .locator(selector)
      .evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--r")) || 0);

  test("clear and colour around it, then settle when it leaves", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/");
    expect(await radius(page, ".ground")).toBe(0);

    const box = await page.locator(".ground").boundingBox();
    if (!box) throw new Error("no hero field");
    await page.mouse.move(box.x + box.width / 2, box.y + 120);
    await page.mouse.move(box.x + box.width / 2 + 60, box.y + 160, { steps: 6 });
    await expect.poll(() => radius(page, ".ground")).toBeGreaterThan(100);
    const mx = await page
      .locator(".ground")
      .evaluate((el) => getComputedStyle(el).getPropertyValue("--mx"));
    expect(parseFloat(mx)).toBeGreaterThan(300);

    // Out of the field, onto the top of the page: it gives the dots back
    await page.mouse.move(box.x + box.width / 2, 4, { steps: 4 });
    await expect.poll(() => radius(page, ".ground"), { timeout: 4000 }).toBe(0);
  });

  test("stay still for anyone who asked for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/");
    const box = await page.locator(".ground").boundingBox();
    if (!box) throw new Error("no hero field");
    await page.mouse.move(box.x + 300, box.y + 200, { steps: 6 });
    await page.waitForTimeout(400);
    expect(await radius(page, ".ground")).toBe(0);
  });
});

test.describe("the entry loader", () => {
  test("covers the page, then lifts off and stays gone", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/");
    const intro = page.locator(".intro");
    await expect(intro).toHaveAttribute("aria-hidden", "true");
    expect(await intro.evaluate((el) => getComputedStyle(el).position)).toBe("fixed");
    // Never in the way of a click or a tab stop, even while it is up
    expect(await intro.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
    // About 2.1 seconds, then it rests wholly above the viewport
    await expect
      .poll(() => intro.evaluate((el) => el.getBoundingClientRect().bottom), { timeout: 5000 })
      .toBeLessThanOrEqual(0);
  });

  test("is not drawn under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/");
    expect(await page.locator(".intro").evaluate((el) => getComputedStyle(el).display)).toBe(
      "none",
    );
  });

  test("is only on the landing page", async ({ page }) => {
    await page.goto("/en/credits/");
    await expect(page.locator(".intro")).toHaveCount(0);
  });
});

test("both coins sit on the route's arc, clear of the phone", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");
    const phone = await page.locator(".hero__phone").boundingBox();
    const arc = await page.locator(".hero__arc").boundingBox();
    if (!phone || !arc) throw new Error("no hero art");
    for (const kind of ["usd", "bs"]) {
      const coin = await page.locator(`.hero__coin--${kind}`).boundingBox();
      if (!coin) throw new Error(`no ${kind} coin`);
      const cx = coin.x + coin.width / 2;
      // Inside the arc's own span, and past the phone's edge, not over it
      expect(cx, `${kind} at ${width}px`).toBeGreaterThan(arc.x);
      expect(cx, `${kind} at ${width}px`).toBeLessThan(arc.x + arc.width);
      const over = Math.min(coin.x + coin.width, phone.x + phone.width) - Math.max(coin.x, phone.x);
      expect(over, `${kind} overlaps the phone at ${width}px`).toBeLessThanOrEqual(2);
    }
  }
});

test.describe("the loader is shown once per session", () => {
  const display = (page: import("@playwright/test").Page) =>
    page.locator(".intro").evaluate((el) => getComputedStyle(el).display);
  const delay = (page: import("@playwright/test").Page) =>
    page.locator(".hero__arc").evaluate((el) => getComputedStyle(el).animationDelay);

  test("drawn on the first visit, never again in the same session", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/es/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "");
    expect(await display(page)).toBe("grid");
    // ...and the hero's march waits for it
    expect(await delay(page)).toBe("2.15s");

    // A language switch inside the session: no sheet, the march starts at once
    await page.locator('a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/#top$/);
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/);
    expect(await display(page)).toBe("none");
    expect(await delay(page)).toBe("0s");

    // A reload, and the skip link afterwards, do not bring it back either
    await page.reload();
    expect(await display(page)).toBe("none");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    expect(await display(page)).toBe("none");
  });

  test("a new session (a fresh tab) sees it again", async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/");
    expect(await display(page)).toBe("grid");
    const other = await context.newPage();
    await other.emulateMedia({ reducedMotion: "no-preference" });
    await other.goto("/en/");
    expect(await display(other)).toBe("grid");
  });

  test("never drawn under prefers-reduced-motion, even on a first visit", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/");
    expect(await display(page)).toBe("none");
  });

  test("never drawn when sessionStorage is blocked, and the page still works", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "sessionStorage", {
        get() {
          throw new Error("blocked");
        },
      });
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/en/");
    expect(await display(page)).toBe("none");
    expect(errors).toEqual([]);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("the flag script is a plain blocking script in <head>, under 300 bytes", async ({
    page,
    request,
  }) => {
    await page.goto("/en/");
    const script = page.locator('head script[src*="/_astro/intro."]');
    await expect(script).toHaveCount(1);
    expect(await script.getAttribute("type")).toBeNull();
    expect(await script.getAttribute("defer")).toBeNull();
    expect(await script.getAttribute("async")).toBeNull();
    const src = (await script.getAttribute("src")) ?? "";
    const body = await (await request.get(src)).body();
    expect(body.length).toBeLessThan(300);
  });
});

test.describe("with JavaScript off", () => {
  test.use({ javaScriptEnabled: false });

  test("the loader is never drawn and the hero's march starts at once", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/");
    expect(await page.locator(".intro").evaluate((el) => getComputedStyle(el).display)).toBe(
      "none",
    );
    expect(
      await page.locator(".hero__arc").evaluate((el) => getComputedStyle(el).animationDelay),
    ).toBe("0s");
  });
});

test.describe("a language switch crossfades the page, not the chrome", () => {
  test("the strip and the top bar are named, and nothing runs for reduced motion", async ({
    page,
  }) => {
    const name = (selector: string) =>
      page.locator(selector).evaluate((el) => getComputedStyle(el).viewTransitionName);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/");
    expect(await name(".jagr-strip")).toBe("jagr-strip");
    expect(await name(".top-bar")).toBe("top-bar");
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await name(".jagr-strip")).toBe("none");
    expect(await name(".top-bar")).toBe("none");
  });

  test("the opt-in rule is in the stylesheet, under no-preference", async ({ page }) => {
    await page.goto("/en/");
    const found = await page.evaluate(() => {
      const walk = (rules: CSSRuleList, inMotionQuery: boolean): boolean =>
        [...rules].some((rule) => {
          if (rule.constructor.name === "CSSViewTransitionRule") return inMotionQuery;
          const media = rule instanceof CSSMediaRule && /no-preference/.test(rule.conditionText);
          return "cssRules" in rule
            ? walk(rule.cssRules as CSSRuleList, inMotionQuery || media)
            : false;
        });
      return [...document.styleSheets].some((sheet) => {
        try {
          return walk(sheet.cssRules, false);
        } catch {
          return false;
        }
      });
    });
    expect(found).toBe(true);
  });

  test("the other language's hero screen is warmed, hidden and unread", async ({ page }) => {
    await page.goto("/en/");
    const warm = page.locator('[hidden] img[fetchpriority="low"]');
    await expect(warm).toHaveCount(1);
    await expect(warm).toHaveAttribute("alt", "");
    expect(await warm.locator("xpath=ancestor::*[@aria-hidden='true']").count()).toBeGreaterThan(0);
    // It is the Spanish home screen, and the Spanish page warms the English one
    const sources = await warm
      .locator("xpath=preceding-sibling::source")
      .evaluateAll((els) => els.map((el) => el.getAttribute("srcset")));
    const own = await page.locator(".hero__phone source").first().getAttribute("srcset");
    expect(sources.join()).not.toContain((own ?? "").split(" ")[0]);
  });
});

test.describe("the cards react to the pointer with a coin and a sweep, nothing else", () => {
  test("no lift, tilt, deeper edge or lean on hover", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/");
    const card = page.locator(".card").first();
    const read = () =>
      card.evaluate((el) => {
        const cs = getComputedStyle(el);
        const shot = getComputedStyle(el.querySelector(".card__shot") ?? el);
        return { transform: cs.transform, shadow: cs.boxShadow, shot: shot.transform };
      });
    const before = await read();
    await card.hover();
    await page.waitForTimeout(500);
    expect(await read()).toEqual(before);
    // The coin still pops on
    expect(await card.locator(".card__coin").evaluate((el) => getComputedStyle(el).transform)).toBe(
      "matrix(1, 0, 0, 1, 0, 0)",
    );
  });
});

test("the page ends on the closing band, after the stack band", async ({ page }) => {
  await page.goto("/en/");
  const order = await page
    .locator("main > .container > section")
    .evaluateAll((els) => els.map((el) => el.className.split(" ")[0]));
  expect(order.slice(-2)).toEqual(["built", "closing"]);
});

test("the receipt is plain text in a named group: no tab stop, no scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/en/");
  const pre = page.locator("pre.card__receipt");
  await expect(pre).toHaveAttribute("role", "group");
  await expect(pre).not.toHaveAttribute("tabindex", /.*/);
  expect(await pre.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe("the receipt card's steps", () => {
  for (const locale of ["en", "es"] as const) {
    test(`/${locale}/ hides them below 960px and fits them from 960px`, async ({ page }) => {
      await page.setViewportSize({ width: 959, height: 900 });
      await page.goto(`/${locale}/`);
      await expect(page.locator(".settle")).toBeHidden();

      await page.setViewportSize({ width: 960, height: 900 });
      const settle = page.locator(".settle");
      await expect(settle).toBeVisible();
      const box = await settle.boundingBox();
      const steps = await page.locator(".settle__step").evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right, scroll: el.scrollWidth - el.clientWidth };
        }),
      );
      if (!box) throw new Error("no settle block");
      for (const step of steps) {
        expect(step.left).toBeGreaterThanOrEqual(box.x - 1);
        expect(step.right).toBeLessThanOrEqual(box.x + box.width + 1);
        expect(step.scroll).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("the receipt fits its paper", () => {
  // The band clipped every line it could not hold, and the overflow test
  // passed because the clip hid the overflow. So measure the text itself: the
  // right edge of every rendered line of the receipt must fall inside the band
  // that clips it (a few pixels of slack for the paper's tilt).
  for (const locale of ["en", "es"] as const) {
    for (const width of [320, 390, 768, 1024]) {
      test(`/${locale}/ at ${width}px: no line of the receipt is cut off`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}/`);
        await page.evaluate(() => document.fonts.ready);
        const { bandRight, lines } = await page.evaluate(() => {
          const pre = document.querySelector("pre.card__receipt");
          const band = document.querySelector(".receipt");
          if (!pre || !band) throw new Error("no receipt");
          const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
          const found: { text: string; right: number }[] = [];
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const text = node.textContent ?? "";
            if (!text.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            // Each rect is one rendered line of this text; rules are
            // decoration and may be clipped on purpose
            for (const rect of range.getClientRects()) {
              if (/^[─\s]+$/.test(text)) continue;
              found.push({ text: text.trim().slice(0, 40), right: rect.right });
            }
          }
          return { bandRight: band.getBoundingClientRect().right, lines: found };
        });
        expect(lines.length).toBeGreaterThan(5);
        for (const line of lines) {
          expect(line.right, `"${line.text}" runs past the band`).toBeLessThanOrEqual(
            bandRight + 4,
          );
        }
      });
    }
  }
});

// A page shorter than the window keeps its footer at the bottom of it: the
// credits are short, so a tall window used to show a white band under it
for (const locale of ["en", "es"]) {
  test(`/${locale}/credits/ keeps the footer at the bottom of a tall window`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1245 });
    await page.goto(`/${locale}/credits/`);
    const bottom = await page
      .locator("footer")
      .evaluate((el) => Math.round(el.getBoundingClientRect().bottom));
    expect(bottom).toBe(1245);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(1245);
  });
}
