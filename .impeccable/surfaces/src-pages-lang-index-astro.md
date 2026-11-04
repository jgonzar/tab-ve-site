---
version: 1
slug: "src-pages-lang-index-astro"
primary_target: "src/pages/[lang]/index.astro"
related_targets: ["src/pages/[lang]/credits/index.astro", "src/components"]
---

# Tab landing page (/en/, /es/)

**Scope and mode:** the landing page in both languages, plus the credits pages that share its world. Mode: Persuade.

**Audience:** portfolio visitors from JAGR, mostly on phones and laptops, later prospective clients judging the craft. **Job:** understand what Tab does. **Action:** Try the demo (exactly two buttons: the hero and the closing band). **Proof:** the real app screens and the real receipt text, on sample data. **Constraints:** the approved copy rows 1 to 36 only (row 8 moves to the closing band; row 7 carries its "Before Tab:" lead-in), a strict CSP with no inline style, no client JS beyond the language and dot-field modules, WCAG 2.2 AA, the Lighthouse budgets.

**Memorable moment:** the hero phone tilted on Tab's own route arc, between two pins, with the $ and Bs coins sitting on the line where it clears the phone, and the dashes marching along it as the entry loader lifts.

## Direction contract

THESIS: A highlighter sheet. Tab is shown the way a person marks up a printed page: lime highlighter over the words that matter, navy ink, real screens pasted on. It refuses the dark SaaS hero with a centred headline over a row of equal glassy cards.

OWN-WORLD: White sheet, navy `#0b0a29` ink and fills, violet `#4342f5` only as a thick pressed edge under the CTA, lime `#d7fe65` only as highlighter behind labels and titles, a soft band `#ecebf3`. Cards are 2px navy outlines with a thick bottom edge, alternating white, navy, then white wide. Poppins 400 and 700; mono only in the JAGR strip and footer. Line art is Tab's own: a dashed route arc, map pins, $ and Bs coins.

STORY: The visitor reads what Tab is in one line, sees the real home screen on a route, learns the three things it does from real screens and the real receipt, is told it's built for three people and can be tried on sample data, sees the small stack, and ends on the demo: the stack band comes before the closing band, so the last thing on the page is "Try the demo".

FIRST VIEWPORT: Desktop (1100px and up): a 7/12 text column on the left (the lime eyebrow label, a two-line H1 at 3.4rem with balanced wrap, the "before" line, the navy CTA with its violet edge and lime arrow circle), and on the right 5/12 the Inicio screen in a navy phone, tilted -5 degrees, over the widened route arc with pins and the two coins on it. From 900px to 1099px the copy takes 3/5, the H1 is 3rem (still two lines in English) and the phone is the 168px one. Phone: text first, then the phone and its art, the dot ground gathered around the art.

FORM: The A+ highlighter sheet from the user's two references, refined by the taste audit; first on the ordered list, pinned by the user. seed: none (pinned by the user's references; the user confirmed on 2026-11-04 that skipping the roll was intentional)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisions

- The CTA's arrow circle is decoration, not copy; it stays `aria-hidden`.
- Row 5 ("A household app") stays as a label above the headline. The craft floor bans an eyebrow above a heading; the user decided to keep it on 2026-11-04, after comparing it beside the wordmark, so it is an explicit, user-approved exception.
- L8 fix round (the user decided each, 2026-11-04, the reviewer's option A):
  - D1: under 430px the receipt wraps with a hanging indent at full size, nothing clipped, nothing scrolling; it is one block per line in a named group with no tab stop. The receipt card is one column below 960px (paper under the text) and side by side from 960px; an earlier note saying 760px was wrong.
  - D2: at 960px and up the receipt card's left column groups the copy, the total panel and the labelled steps at the top, 28px apart.
  - D3: the hero's one motion is the dash march, held until the loader lifts (2.15s). The riding dot and the phone float are removed.
  - D4: the language links end in `#top`; the loader and the march's delay are skipped when `#top` is the target (a switch, not a first visit), in CSS alone.
  - D5: a card reacts to the pointer with its coin and the highlighter sweep only; no lift, tilt, edge growth or lean.
  - D6: the stack band comes before the closing band.
  - D7: the hero lead starts "Before Tab:" / "Antes de Tab:" (approved copy change).
  - D8: both coins sit on the arc where it clears the phone, and the arc is widened.
  - F20 (the JAGR strip's focus ring is clipped at the top edge) is not fixed here: the strip is a versioned copy, so the fix belongs in its source (`outline-offset: -4px`) and is then copied again.
