# tab-ve-site

The landing page for [Tab](https://tab-ve-demo.vercel.app), a household ride tracker, and part of
JAGR, Ángel's portfolio. Its one job is to lead to the demo.

A static [Astro](https://astro.build) site: no client framework, almost no JavaScript (two small modules),
no third-party requests, and a strict CSP. Production lives at `tab-ve-site.vercel.app` once the
first production deploy is made.

## Run it

CI and Vercel run Node `24.22.2` (`.nvmrc`). Locally, any Node 24 from `24.16.0` matches `engines`
(eslint-plugin-astro's floor). An older 24 still installs and passes `pnpm check`, with an
"Unsupported engine" warning; to match CI exactly, switch with `fnm use` or `nvm use`, which read
`.nvmrc`. pnpm is `11.28.9` (`packageManager`; pnpm switches to it on its own).

```sh
pnpm install --frozen-lockfile
pnpm dev            # http://localhost:4321
pnpm check          # the `quality` gates below, in order (unit tests included)
pnpm build && pnpm test:e2e   # the Playwright suite, against dist/ served like Vercel
```

The e2e suite needs Chromium once: `pnpm exec playwright install --only-shell chromium`. To run it
against a deployment instead, set `PREVIEW_URL` (and `VERCEL_AUTOMATION_BYPASS_SECRET` for a
protected preview).

## Languages and routing

- Two static pages, `/en/` and `/es/` (Astro i18n, `prefixDefaultLocale`). Every string lives in
  `src/i18n/en.json` and `es.json`, with the same keys (a unit test checks it).
- `/` is a 307 from `vercel.json` `redirects`, never client JS: the `tab_site_lang` cookie (`es` or
  `en`) wins, then an `Accept-Language` starting with `es`, else `/en/`. The targets are literals.
- The ES / EN links are plain links. `src/scripts/lang-cookie.ts` (an external file) saves the
  choice on click: `Secure; SameSite=Lax; Path=/; Max-Age=31536000`. With JS off, the links still
  work and nothing is saved.
- `scripts/serve-dist.mjs` applies the same `vercel.json` headers, `trailingSlash` and redirects
  locally (`scripts/lib/vercel-redirects.mjs`), so the redirect matrix runs without a deploy. As on
  Vercel, the headers go on files only, never on a redirect.
- The head (canonical, `hreflang` with `x-default`, link cards), `sitemap.xml` and `robots.txt` are
  built in `src/seo.ts` from `SITE_URL` in `src/site.ts`: a custom domain is a one-line change.

## Quality gates

CI (`.github/workflows/ci.yml`) runs on every PR and on every push to `main`. Each job is a required
check on `main`, except `og-cards`, until it has passed on Linux (see "Link preview cards").

| Job          | What it runs                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `quality`    | frozen install, the dash check (`scripts/check-dashes.mjs`, every file in the repo), `astro check`, ESLint, the Prettier check, Vitest unit tests, the build, the built-HTML check (`scripts/check-dist.mjs`: no inline script or style, no third-party loads) and the header check (`scripts/check-headers.mjs`, local)                                                                                                                                                             |
| `e2e`        | Playwright on Chromium against `dist/` served with the `vercel.json` headers and redirects: the `/` redirect matrix, the head, the sitemap, robots, the language links and cookie, every section in both languages, the demo and JAGR links, the credits, no overflow from 320 to 1440px, 44px targets, the skip link, the hero float and reduced motion, axe (WCAG 2.2 AA and best practices) on all four pages at 390 and 1280, and visual snapshots of both pages at 390 and 1280 |
| `lighthouse` | `pnpm lighthouse`: both pages, mobile, the median of 5 runs, against the budgets: LCP 2.0 s, CLS 0.05, TBT 200 ms, JS 5 KB, total 400 KB, Accessibility, Best Practices and SEO all 100                                                                                                                                                                                                                                                                                              |
| `links`      | lychee 0.24.2 (checksum verified) on every link in the built HTML, internal and external (`lychee.toml`)                                                                                                                                                                                                                                                                                                                                                                             |
| `og-cards`   | `pnpm og --check`: the link cards rendered again and compared with the committed PNGs, within a small pixel tolerance                                                                                                                                                                                                                                                                                                                                                                |
| `audit`      | `pnpm audit --audit-level=high`                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `gitleaks`   | gitleaks 8.30.1 (checksum verified) over the full history                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `commitlint` | Conventional Commits on every commit of the PR, with no em or en dashes                                                                                                                                                                                                                                                                                                                                                                                                              |

`.github/workflows/preview.yml` runs against each PR's Vercel preview once it's ready, using the URL
from Vercel's deployment status event: `preview-headers` checks the served headers, and
`preview-e2e` runs the Playwright suite against Vercel itself (including its automatic
`X-Robots-Tag: noindex` on previews), and `preview-lighthouse` runs the budgets against the preview,
with two SEO audits set aside, both caused by the preview's protection: `is-crawlable` (every preview
is `noindex`) and `robots-txt` (Lighthouse fetches it from inside the page without the bypass
header). The `lighthouse` job on `dist/` keeps both, as will the check on production.

**Visual baselines** live in `tests/e2e/visual.spec.ts-snapshots/`, one set per platform; CI compares
the Linux ones. After a deliberate visual change, take the new Linux screenshots from the
`playwright-report` artifact of the failing `e2e` run (`test-results/*/*-actual.png`) and commit them
under the baseline names. Local macOS baselines are ignored by git.

Supply chain: exact versions, a frozen lockfile, `minimumReleaseAge` of 3 days in
`pnpm-workspace.yaml` (Renovate waits the same), install scripts only for esbuild and sharp, and
Renovate on a weekly, grouped schedule (`renovate.json`).

## Security baseline

Every response served as a file (the pages, assets, `sitemap.xml`, `robots.txt`, the licences)
gets these headers from `vercel.json`. Two exceptions, both Vercel's own behaviour:

- **Redirects:** Vercel answers a `redirects` or `trailingSlash` redirect with its status and
  `Location` only, so the 307 at `/` and the 308s carry no custom headers.
- **`/.well-known/`:** Vercel serves this folder itself, so `security.txt` gets only Vercel's
  defaults (HSTS with `preload`), from the `/(.*)` rule or from a rule of its own alike.

Neither matters for the grade: a redirect and a plain-text file have no page to protect, and
scanners grade the final HTML 200.

| Header                       | Value                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'` |
| `X-Content-Type-Options`     | `nosniff`                                                                                                                                                                   |
| `X-Frame-Options`            | `DENY`                                                                                                                                                                      |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                                                                                           |
| `Permissions-Policy`         | every listed feature denied (`camera=()`, `microphone=()`, `geolocation=()`, `payment=()`, `usb=()`, `browsing-topics=()` and more)                                         |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                                                                                                               |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains` (`preload` waits for a custom domain)                                                                                                 |

`connect-src 'self'` is there for Lighthouse: it reads `robots.txt` with a fetch from inside the
page, which `default-src 'none'` alone would block (and the SEO score with it). The page itself
makes no requests from script.

Hashed assets under `/_astro/` are cached for a year, immutable. Fonts (Poppins, Share Tech Mono)
are self-hosted from Fontsource; their OFL notices ship in `public/licenses/`.
`/.well-known/security.txt` gives the security contact.

To check the headers against the build: `pnpm build && pnpm check:headers` (it serves `dist/` the
way Vercel does: headers on files, status and `Location` only on redirects). It checks the headers on
every file, and the status and `Location` of the redirects. To check a deployment:
`VERCEL_AUTOMATION_BYPASS_SECRET=... node scripts/check-headers.mjs --url <preview URL>`.

### Header grades

Previews stay behind Vercel Authentication; protection is never switched off for a scan. So the
grades are proven in two places:

- **On every preview:** the CI criteria check above (`preview-headers`), plus securityheaders.com
  on the preview URL with the bypass query,
  `?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true`.
- **After the production promote:** Mozilla Observatory on `tab-ve-site.vercel.app`. Observatory
  scans a bare host and can't pass the bypass, so it grades production only.

| Scanner             | URL                            | Grade | Date |
| ------------------- | ------------------------------ | ----- | ---- |
| securityheaders.com | pending the first preview      |       |      |
| Mozilla Observatory | pending the production promote |       |      |

## Deploys

- Every PR gets a Vercel preview, behind Vercel Authentication.
- Merging to `main` deploys nothing: `vercel.json` turns off Git deployments for `main`.
- Production is promoted by hand, only on Ángel's explicit go.

## Captures and link cards

### Screenshots

The page's phone screens are raw PNGs in `src/assets/captures/{es,en}/` (Astro resizes and hashes
them at build). The phone around them is drawn once in CSS, by `src/components/PhoneFrame.astro`, so
the bitmaps carry no frame.

| File             | Shows                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| `inicio.png`     | The hero: Inicio, with the quick routes, the summary bar and the rides     |
| `quick-ride.png` | "One tap per ride": the quick-ride card, open on the first route           |
| `summary.png`    | "Dollars and bolívares": the summary bar, stuck at the top, over a ride    |
| `receipt.txt`    | "Settle up": the shared text summary (the receipt), as Compartir builds it |

They come from a **local** Tab demo on a fresh, throwaway database, never from the live shared demo
(which could show a visitor's text, and isn't reproducible). Nothing is captured in CI.

**1. Start the local demo** (needs a Tab checkout, pnpm and Node 24; no Docker):

```sh
pnpm capture:demo --tab <path to a Tab checkout>
```

`scripts/capture-demo.ts`:

- exports Tab at `TAB_REF` (in `scripts/capture-config.ts`) with `git archive` into a work dir
  (default `<tmp>/tab-capture-demo-<TAB_REF>`, or `--dir`). The checkout itself is only read.
- installs (`--frozen-lockfile`) and builds it there, once per ref, and writes Tab's schema as SQL
  with `drizzle-kit export`
- serves it with `vite preview` on `http://127.0.0.1:4173`, with `DEMO_MODE=on` and an environment
  built from scratch (no inherited variables, and it refuses to start if the export has a `.env`)

The server runs with `scripts/capture-shim.mjs` preloaded (`node --import`). Tab's code is
unchanged; the shim:

- **answers the database.** Tab uses Neon's HTTP driver, which POSTs each query to an `/sql`
  endpoint with `fetch`. The shim answers those requests from an in-memory
  [PGlite](https://pglite.dev) (Tab's own devDependency) in the same process, with Tab's schema
  applied. `DATABASE_URL` points at a reserved `.invalid` host, so nothing could ever reach a real
  database. Every start is an empty database, and Tab's own lazy 4-hour reset seeds it with the demo
  data (Ana, Luis, Carla) on the first request.
- **fixes the BCV rate** (`BCV_RATE`) by answering Tab's request to ve.dolarapi.com
- **shifts the server clock** to start at `CAPTURE_NOW`, so the seed, which is relative to "now", is
  the same on every run
- **refuses every other outbound request**

**2. Capture**, in another terminal:

```sh
pnpm capture           # writes src/assets/captures/{es,en}/*.png and receipt.txt
pnpm capture:verify    # captures again into a temp folder and compares, byte for byte
```

`scripts/capture.ts` takes the base URL as an optional argument and refuses any host but localhost.
Each shot gets a fresh browser context with the clock frozen at `CAPTURE_NOW` in America/Caracas, a
390×844 viewport at DPR 3, reduced motion plus CSS that turns off transitions and animations, the
fonts loaded, the language set through Tab's `tab_lang` cookie, the person (Ana) and the tour flag
set through Tab's own `localStorage` keys, and the demo banner hidden by an injected stylesheet. The
rate request is stubbed in the browser too, and any non-local request is blocked.

Two runs give byte-identical files. Commit the PNGs after any change to `scripts/capture-config.ts`,
the shots, or `TAB_REF`. Re-shooting after a Tab UI change means bumping `TAB_REF` and running both
steps again.

**Why the receipt is text.** The shared summary has no screen of its own in Tab: Compartir hands
the text to the phone's share sheet (or the clipboard). A screenshot would mean drawing a messaging
screen around it, which isn't Tab's UI. So the capture saves the text itself, `receipt.txt` per
language, by catching what Compartir passes to `navigator.share`, and the page renders it as real
text inside the phone frame. It's verified byte for byte, like the PNGs.

### Link preview cards

`public/og/og-en.png` and `og-es.png` (1200×630) are committed, and `pnpm og` regenerates them.
`scripts/og.ts` fills the two description lines of `scripts/og-template.svg` (Tab's `design/og.svg`,
with those lines as text slots) and renders it with resvg, using Poppins Regular from
`@fontsource/poppins` (OFL, converted from WOFF in memory) and no system fonts, so it gives the same
result on macOS and Linux. The English text is Tab's current card. The site never hotlinks
`tab-ve.vercel.app/og.png`.

`pnpm og --check` is the visual snapshot, and CI's `og-cards` job runs it. It renders both cards in
memory and compares them with the committed files pixel by pixel. A pixel is off when a channel
differs by more than 32/255, and at most 10 pixels may be off. Anti-aliasing drift stays well
under that bar: even a different rasterizer altogether (macOS sips on Tab's outlines) differs by at
most 48/255, on just 20 pixels past 32, and the same resvg build on another CPU only differs by
rounding. The check still catches a missing comma (14 pixels) or one wrong letter (about 470). The measurements are in `scripts/og.ts`. The cards are rendered on
macOS arm64, so `og-cards` isn't a required check until it has passed on Linux x64.

## Motion

The sections are Svelte components rendered at build time, so they ship no JavaScript. The only
scripts are two small external modules (`script-src 'self'` is untouched; `pnpm check:dist` fails
on any other):

- `src/scripts/lang-cookie.ts`: saves the language choice when a language link is used.
- `src/scripts/dots.ts`: feeds the pointer into the dot fields. It sets `--mx`, `--my` and
  `--r` on the `.dots` element under the pointer, and the look is all CSS (`.dots` in
  `src/styles/global.css`): the faint dots clear around the pointer and brand-coloured ones take
  their place. It runs only for a fine pointer that can hover and no request for reduced motion;
  on a phone, or for anyone who asked for calm, the dots stay still. The hero, the closing band and
  the receipt band are dot fields.

The rest is CSS: cards lift, tilt and pop a coin on hover and focus; the highlighter re-sweeps the
title; the button's arrow turns; the footer link's underline draws itself; the cards settle straight
and the receipt feeds out of its slot as they scroll into view (scroll-driven, so the visitor sets
the pace, and static where unsupported). The hero's route marches its dashes and a dot rides it
for three cycles, then rests, and again while the pointer is over it. Nothing moves on its own for
more than 5 seconds (WCAG 2.2.2), and reduced motion turns it all off.

The entry loader (`src/components/Loader.astro`, landing page only, through `<Base intro>`) is a
violet sheet that draws the route, pops the wordmark in and lifts away in about 2.1 seconds. It is
CSS only, `aria-hidden` and without pointer events, so the page underneath is never held back for
a keyboard or a screen reader; it ends `visibility: hidden`, and reduced motion never shows it.

## The JAGR strip

`src/components/JagrStrip.astro` is the strip's one versioned source (see its header comment). Memo
and Jenova copy it unchanged. Since v1.1.0 the link target is a prop: each site passes its own quest
page (`JAGR_QUEST_URL` here). Until L6 ships `/quests/tab` on JAGR, that link 404s, and `lychee.toml`
allows it.
