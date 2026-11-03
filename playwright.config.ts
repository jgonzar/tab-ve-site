import { defineConfig, devices } from "@playwright/test";

// Two targets, one suite:
// - local (default): dist/ served by scripts/serve-dist.mjs, which applies the
//   vercel.json headers, trailingSlash and redirects. Run `pnpm build` first.
// - a live deployment: PREVIEW_URL=<url>. A protected preview also needs
//   VERCEL_AUTOMATION_BYPASS_SECRET; every request then carries the bypass.
const PORT = 4398;
const preview = process.env.PREVIEW_URL?.replace(/\/$/, "");
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    // localhost, not 127.0.0.1: browsers keep Secure cookies on http://localhost
    baseURL: preview ?? `http://localhost:${PORT}`,
    extraHTTPHeaders:
      preview && bypass
        ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "true" }
        : {},
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: preview
    ? undefined
    : {
        command: `node scripts/serve-dist.mjs ${PORT}`,
        url: `http://127.0.0.1:${PORT}/en/`,
        reuseExistingServer: !process.env.CI,
      },
});
