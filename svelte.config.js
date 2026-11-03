import { vitePreprocess } from "@astrojs/svelte";

// The page's sections are Svelte components, rendered at build time only:
// no `client:*` directive anywhere, so none of them ships any JavaScript.
export default {
  preprocess: vitePreprocess(),
};
