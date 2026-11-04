---
version: 1
slug: "src-pages-lang-index-astro"
primary_target: "src/pages/[lang]/index.astro"
related_targets: ["src/pages/[lang]/credits/index.astro", "src/components"]
---

# Tab landing page (/en/, /es/)

**Scope and mode:** the landing page in both languages, plus the credits pages that share its world. Mode: Persuade.

**Audience:** portfolio visitors from JAGR, mostly on phones and laptops, later prospective clients judging the craft. **Job:** understand what Tab does. **Action:** Try the demo (exactly two buttons: the hero and the closing band). **Proof:** the real app screens and the real receipt text, on sample data. **Constraints:** the approved copy rows 1 to 34 only (row 8 moves to the closing band), a strict CSP with no inline style, 0 client JS beyond the language module, WCAG 2.2 AA, the Lighthouse budgets.

**Memorable moment:** the hero phone tilted on Tab's own route arc, between two pins, with the $ and Bs coins riding the line.

## Direction contract

THESIS: A highlighter sheet. Tab is shown the way a person marks up a printed page: lime highlighter over the words that matter, navy ink, real screens pasted on. It refuses the dark SaaS hero with a centred headline over a row of equal glassy cards.

OWN-WORLD: White sheet, navy `#0b0a29` ink and fills, violet `#4342f5` only as a thick pressed edge under the CTA, lime `#d7fe65` only as highlighter behind labels and titles, a soft band `#ecebf3`. Cards are 2px navy outlines with a thick bottom edge, alternating white, navy, then white wide. Poppins 400 and 700; mono only in the JAGR strip and footer. Line art is Tab's own: a dashed route arc, map pins, $ and Bs coins.

STORY: The visitor reads what Tab is in one line, sees the real home screen on a route, learns the three things it does from real screens and the real receipt, is told it's built for three people and can be tried on sample data, sees the small stack, and opens the demo.

FIRST VIEWPORT: Desktop: a 7/12 text column on the left (the lime eyebrow label, a two-line H1 at about 3.4rem with balanced wrap, the "before" line, the navy CTA with its violet edge and lime arrow circle), and on the right 5/12 the Inicio screen in a navy phone, tilted -5 degrees, over the route arc with pins and coins. Phone: text first, then the phone and its art.

FORM: The A+ highlighter sheet from the user's two references, refined by the taste audit; first on the ordered list, pinned by the user. seed: none (pinned by the user's references; the user confirmed on 2026-11-04 that skipping the roll was intentional)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisions

- The CTA's arrow circle is decoration, not copy; it stays `aria-hidden`.
- Row 5 ("A household app") stays as a label above the headline. The craft floor bans an eyebrow above a heading; the user decided to keep it on 2026-11-04, after comparing it beside the wordmark, so it is an explicit, user-approved exception.
