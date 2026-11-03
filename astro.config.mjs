// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// Static output. Vercel serves dist/ as files, so no adapter is needed; the
// headers and redirects live in vercel.json.
export default defineConfig({
  // Must match SITE_URL in src/site.ts
  site: "https://tab-ve-site.vercel.app",
  output: "static",
  // Svelte for the sections (decision 17), rendered to HTML at build time
  integrations: [svelte()],
  // Matches vercel.json trailingSlash: true, so every page has one URL
  trailingSlash: "always",
  i18n: {
    // Must match LOCALES in src/i18n/index.ts
    locales: ["en", "es"],
    defaultLocale: "en",
    routing: {
      // Both languages live under a prefix: /en/ and /es/
      prefixDefaultLocale: true,
      // `/` is answered by the vercel.json redirect (cookie, then
      // Accept-Language, then English), never by a page or client JS
      redirectToDefaultLocale: false,
    },
  },
  build: {
    // CSP style-src 'self': every stylesheet ships as a file, never inline
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      // CSP script-src 'self': never inline a small script as a data: URL
      assetsInlineLimit: 0,
    },
  },
  devToolbar: { enabled: false },
});
