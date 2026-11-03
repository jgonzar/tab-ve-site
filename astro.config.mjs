// @ts-check
import { defineConfig } from "astro/config";

// Static output. Vercel serves dist/ as files, so no adapter is needed; the
// headers and redirects live in vercel.json.
export default defineConfig({
  // Must match SITE_URL in src/site.ts
  site: "https://tab-ve-site.vercel.app",
  output: "static",
  build: {
    // CSP style-src 'self': every stylesheet ships as a file, never inline
    inlineStylesheets: "never",
  },
  devToolbar: { enabled: false },
});
