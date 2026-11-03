// The ES / EN links, the language cookie and the demo link, in a real browser.
import { expect, test, type Page } from "@playwright/test";

/** Fails the test on any console error, CSP violations included. */
function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("with a Spanish browser", () => {
  test.use({ locale: "es-VE" });

  test("/ opens /es/, and the EN link saves English for next time", async ({ page, context }) => {
    const errors = watchConsole(page);
    await page.goto("/");
    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const cookie = (await context.cookies()).find((c) => c.name === "tab_site_lang");
    expect(cookie).toMatchObject({ value: "en", path: "/", secure: true, sameSite: "Lax" });
    const days = ((cookie?.expires ?? 0) - Date.now() / 1000) / 86400;
    expect(days).toBeGreaterThan(364);
    expect(days).toBeLessThan(366);

    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
    expect(errors).toEqual([]);
  });
});

test.describe("with JS off", () => {
  test.use({ javaScriptEnabled: false, locale: "en-US" });

  test("the links still switch language; no cookie is saved", async ({ page, context }) => {
    await page.goto("/en/");
    await page.getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    expect((await context.cookies()).find((c) => c.name === "tab_site_lang")).toBeUndefined();
  });
});

for (const [locale, other, demoLabel] of [
  ["en", "es", "Try the demo"],
  ["es", "en", "Probar la demo"],
] as const) {
  test(`/${locale}/: the language links and the demo link`, async ({ page }) => {
    const errors = watchConsole(page);
    await page.goto(`/${locale}/`);

    const current = page.locator(`a[hreflang="${locale}"]`);
    const alternate = page.locator(`a[hreflang="${other}"]`);
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(current).toHaveAttribute("lang", locale);
    await expect(current).toHaveAttribute("href", `/${locale}/`);
    await expect(alternate).not.toHaveAttribute("aria-current", /.*/);
    await expect(alternate).toHaveAttribute("lang", other);
    await expect(alternate).toHaveAttribute("href", `/${other}/`);

    const demo = page.getByRole("link", { name: demoLabel });
    await expect(demo).toHaveAttribute("href", `https://tab-ve-demo.vercel.app/?lang=${locale}`);
    await expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    expect(errors).toEqual([]);
  });
}

test("the page loads nothing from another origin", async ({ page, baseURL }) => {
  const origins = new Set<string>();
  page.on("request", (r) => origins.add(new URL(r.url()).origin));
  await page.goto("/en/");
  await page.waitForLoadState("networkidle");
  expect([...origins]).toEqual([new URL(String(baseURL)).origin]);
});
