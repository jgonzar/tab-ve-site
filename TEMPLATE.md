# Using this site as a template

This repo is Tab's landing page, and most of it is not about Tab. This file splits what another
landing page can reuse unchanged from what belongs to Tab. Paths are relative to the repo root.

The reusable parts are meant to live in the landing studio's Astro starter, with a de-branded copy of
this design as a sellable item built on it. Until then, copy them from here.

## Reusable as is

| Part                   | Where                                                                                                              | Notes                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout skeleton        | `src/layouts/Base.astro`, `TopBar.astro`, `SiteFooter.astro`, `LanguageLinks.astro`                                | Remove the JAGR strip and the `intro` loader if you do not want them.                                                                                                                               |
| Language routing       | `astro.config.mjs` (i18n), `vercel.json` `redirects`, `src/scripts/lang-cookie.ts`, `src/i18n/locales.ts`          | Cookie name `tab_site_lang` is the only Tab-specific string; rename it in `locales.ts`, `vercel.json` and the tests. Add a locale by extending `locales.ts`, the JSON files and the redirect rules. |
| Head and SEO helpers   | `src/seo.ts`, `src/site.ts`, `src/components/SeoHead.astro`, `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` | Canonical, `hreflang` with `x-default`, link cards, sitemap, robots. Change `SITE_URL` first.                                                                                                       |
| Security headers       | `vercel.json` `headers`, `public/.well-known/security.txt`                                                         | Strict CSP with no third-party origins. Edit the CSP before adding any external script, font or image host.                                                                                         |
| Local Vercel emulation | `scripts/serve-dist.mjs`, `scripts/lib/vercel-headers.mjs`, `scripts/lib/vercel-redirects.mjs`                     | Serves `dist/` with the `vercel.json` headers, trailing slash and redirects.                                                                                                                        |
| Checks                 | `scripts/check-dashes.mjs`, `check-dist.mjs`, `check-headers.mjs`, `lighthouse.mjs`, `blocking-time.mjs`           | The dash check is a house style rule; drop it if you do not want it. Lighthouse budgets are at the top of `lighthouse.mjs`.                                                                         |
| CI                     | `.github/workflows/ci.yml`, `preview.yml`, `commitlint.config.mjs`, `lychee.toml`, `renovate.json`                 | Job names are the required checks in branch protection. `preview.yml` needs Vercel deployment status events.                                                                                        |
| Test suites            | `tests/unit/{i18n,seo,redirects,intro,blocking-time}.test.ts`, `tests/e2e/*.spec.ts`, `playwright.config.ts`       | The e2e specs assert Tab's headings and sections; rewrite the selectors and strings, keep the structure (redirect matrix, head, overflow, axe).                                                     |
| OG card renderer       | `scripts/og.ts`, `scripts/lib`, `public/og/`                                                                       | Renders `scripts/og-template.svg` with resvg and Poppins, same output on macOS and Linux. Replace the SVG and the two description lines.                                                            |
| Capture harness        | `scripts/capture*.ts`, `scripts/capture-shim.mjs`                                                                  | Shoots a local demo of an app with a throwaway database. Useful only if your page shows an app; see below for what to change.                                                                       |
| Motion and sections    | `src/scripts/dots.ts`, `src/components/sections/*`, `Loader.astro`, `PhoneFrame.astro`                             | Generic building blocks (dot field, CSS phone frame inside the sections, feature card, closing band). Their text comes from the JSON files.                                                         |
| Tooling config         | `.nvmrc`, `.prettierrc.json`, `eslint.config.mjs`, `tsconfig.json`, `pnpm-workspace.yaml`, `svelte.config.js`      | Exact versions, frozen lockfile, 3-day release-age rule.                                                                                                                                            |

## Specific to Tab, replace or remove

| Part               | Where                                                                 | What to do                                                                                                       |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Theme tokens       | `src/styles/tokens.css`, `DESIGN.md`, `.impeccable/`                  | Palette (paper, ink, lime, violet), contrast ratios in the comments, and the token unit test (`tokens.test.ts`). |
| Copy               | `src/i18n/en.json`, `es.json`, `PRODUCT.md`                           | All of it. Keep the two files in step.                                                                           |
| Wordmark and icons | `src/components/Wordmark.astro`, `src/assets/brand/`, `public/icons/` | Tab's brand. Not licensed for reuse. See "Fonts and licences" in the README.                                     |
| Captures           | `src/assets/captures/{en,es}/`, `src/captures.ts`                     | Phone screens and `receipt.txt` of Tab. Replace with your own or remove the screens sections.                    |
| Capture setup      | `scripts/capture-config.ts`, `scripts/capture-demo.ts`                | `TAB_REF`, selectors, the Tab checkout, Tab's `localStorage` and cookie keys.                                    |
| Link cards         | `public/og/*.png`, `scripts/og-template.svg`                          | Tab's artwork. Regenerate with `pnpm og`.                                                                        |
| URLs               | `src/site.ts`                                                         | `SITE_URL`, `JAGR_URL`, `JAGR_QUEST_URL`, `DEMO_URL`.                                                            |
| JAGR strip         | `src/components/JagrStrip.astro`                                      | Part of Ángel's portfolio thread. Remove it from `Base.astro` in any other product.                              |
| Stack band, chips  | `src/components/sections/Built.svelte`, `built.chips` in the JSON     | Tab's own stack list.                                                                                            |
| Credits page       | `src/pages/[lang]/credits/`, `credits` in the JSON                    | Rewrite for your assets and licences.                                                                            |
| Visual baselines   | `tests/e2e/visual.spec.ts-snapshots/`                                 | Regenerate after any visual change (see the README).                                                             |

## Checklist for a new landing page

1. Copy the repo, remove `.git`, and set `name` and `description` in `package.json`.
2. Set `SITE_URL` and the other URLs in `src/site.ts`; rename the language cookie.
3. Replace `tokens.css`, the copy, the brand files, the captures and the link cards.
4. Delete the JAGR strip and the credits entries you do not need.
5. Run `pnpm install --frozen-lockfile && pnpm check && pnpm build && pnpm test:e2e`. Update the
   e2e strings, then retake the visual baselines.
6. Add every new font and image, with its licence, to the credits page and `public/licenses/`.
7. Imprint and privacy pages, which EU sites need, are not included. Add a page and a footer link,
   and leave the CSP as is.
8. Vercel Hobby is non-commercial. Client sites go on Vercel Pro or the client's own account.
