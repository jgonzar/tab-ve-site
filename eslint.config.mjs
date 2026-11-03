import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", ".astro/", ".vercel/", "node_modules/"]),
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs.recommended,
  {
    // Repo scripts and config files run in Node
    files: ["scripts/**/*.mjs", "*.mjs"],
    languageOptions: { globals: globals.node },
  },
]);
