// Saves the visitor's language choice when they use the ES / EN links, so the
// `/` redirect (vercel.json) sends them to it next time. Ships as an external
// file (CSP script-src 'self'). Only `en` or `es` is ever written; the links
// navigate on their own, so with JS off nothing breaks and nothing is saved.
import { isLocale, LANG_COOKIE } from "../i18n/locales";

const ONE_YEAR = 60 * 60 * 24 * 365;

document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest?.("a[data-lang]");
  const lang = link?.getAttribute("data-lang");
  if (!isLocale(lang)) return;
  document.cookie = `${LANG_COOKIE}=${lang}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; Secure`;
});
