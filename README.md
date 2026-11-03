# tab-ve-site

The landing page for [Tab](https://tab-ve-demo.vercel.app), a household ride tracker, and part of
JAGR, Ángel's portfolio. Its one job is to lead to the demo.

A static [Astro](https://astro.build) site: no client framework, no JavaScript shipped by default,
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
check on `main`.

| Job          | What it runs                                                                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `quality`    | frozen install, the dash check (`scripts/check-dashes.mjs`, every file in the repo), `astro check`, ESLint, the Prettier check, Vitest unit tests, the build, the built-HTML check (`scripts/check-dist.mjs`: no inline script or style, no third-party loads) and the header check (`scripts/check-headers.mjs`, local) |
| `e2e`        | Playwright on Chromium against `dist/` served with the `vercel.json` headers and redirects: the `/` redirect matrix, the head, the sitemap, robots, the language links and cookie                                                                                                                                        |
| `audit`      | `pnpm audit --audit-level=high`                                                                                                                                                                                                                                                                                          |
| `gitleaks`   | gitleaks 8.30.1 (checksum verified) over the full history                                                                                                                                                                                                                                                                |
| `commitlint` | Conventional Commits on every commit of the PR, with no em or en dashes                                                                                                                                                                                                                                                  |

`.github/workflows/preview.yml` runs against each PR's Vercel preview once it's ready, using the URL
from Vercel's deployment status event: `preview-headers` checks the served headers, and
`preview-e2e` runs the Playwright suite against Vercel itself (including its automatic
`X-Robots-Tag: noindex` on previews). The accessibility, link and Lighthouse jobs join it later.

Supply chain: exact versions, a frozen lockfile, `minimumReleaseAge` of 3 days in
`pnpm-workspace.yaml` (Renovate waits the same), install scripts only for esbuild and sharp, and
Renovate on a weekly, grouped schedule (`renovate.json`).

## Security baseline

Every response served as a file (the pages, assets, `sitemap.xml`, `robots.txt`, `security.txt`)
gets these headers from `vercel.json`. Redirects don't: Vercel answers a `redirects` or
`trailingSlash` redirect with its status and `Location` only, so the 307 at `/` and the 308s carry no
custom headers. They have no body to protect, and scanners grade the final 200.

| Header                       | Value                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'` |
| `X-Content-Type-Options`     | `nosniff`                                                                                                                                               |
| `X-Frame-Options`            | `DENY`                                                                                                                                                  |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                                                                       |
| `Permissions-Policy`         | every listed feature denied (`camera=()`, `microphone=()`, `geolocation=()`, `payment=()`, `usb=()`, `browsing-topics=()` and more)                     |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                                                                                           |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains` (`preload` waits for a custom domain)                                                                             |

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

## The JAGR strip

`src/components/JagrStrip.astro` is the strip's one versioned source (see its header comment). Memo
and Jenova copy it unchanged.
