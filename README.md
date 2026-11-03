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
pnpm check          # every CI gate below, in order
```

## Quality gates

CI (`.github/workflows/ci.yml`) runs on every PR and on every push to `main`. Each job is a required
check on `main`.

| Job          | What it runs                                                                                                                                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `quality`    | frozen install, the dash check (`scripts/check-dashes.mjs`, every file in the repo), `astro check`, ESLint, the Prettier check, the build, the built-HTML check (`scripts/check-dist.mjs`: no inline script or style, no third-party loads) and the header check (`scripts/check-headers.mjs`, local) |
| `audit`      | `pnpm audit --audit-level=high`                                                                                                                                                                                                                                                                       |
| `gitleaks`   | gitleaks 8.30.1 (checksum verified) over the full history                                                                                                                                                                                                                                             |
| `commitlint` | Conventional Commits on every commit of the PR, with no em or en dashes                                                                                                                                                                                                                               |

`.github/workflows/preview.yml` runs against each PR's Vercel preview once it's ready, using the URL
from Vercel's deployment status event. It checks the served headers now; the e2e, accessibility,
link and Lighthouse jobs join it later.

Supply chain: exact versions, a frozen lockfile, `minimumReleaseAge` of 3 days in
`pnpm-workspace.yaml` (Renovate waits the same), install scripts only for esbuild and sharp, and
Renovate on a weekly, grouped schedule (`renovate.json`).

## Security baseline

Every path gets these headers from `vercel.json`:

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

To check the headers against the build: `pnpm build && pnpm check:headers` (it serves `dist/` with
the `vercel.json` headers). To check a deployment:
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
