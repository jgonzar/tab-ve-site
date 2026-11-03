// One source for every absolute URL the site prints. astro.config.mjs reads
// SITE_URL too, so canonical and sitemap links can never disagree.

/** The site's production address (plan decision 2). Claimed on the first production deploy. */
export const SITE_URL = "https://tab-ve-site.vercel.app";

/** JAGR, the portfolio this page belongs to. The strip and the footer link back here. */
export const JAGR_URL = "https://portfolio-site-beige-omega-23.vercel.app";

/** Tab's quest page on JAGR, where the strip and the footer lead (it ships with L6). */
export const JAGR_QUEST_URL = `${JAGR_URL}/quests/tab`;

/** The demo: a shared sandbox on sample data. Every "Try the demo" button leads here. */
export const DEMO_URL = "https://tab-ve-demo.vercel.app";
