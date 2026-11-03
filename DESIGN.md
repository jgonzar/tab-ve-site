---
name: Tab
description: The Tab landing page, a highlighter sheet. Navy ink on white paper, lime highlighter, violet edge, real app screens pasted on.
colors:
  paper: "#ffffff"
  soft: "#ecebf3"
  ink: "#0b0a29"
  muted: "#4a4868"
  dim: "#5b5a78"
  on-ink: "#ffffff"
  on-ink-muted: "#c9c8e3"
  on-ink-line: "#7a77c2"
  on-ink-frame: "#2a2870"
  thermal-paper: "#fffef8"
  lime: "#d7fe65"
  violet: "#4342f5"
  jagr-void: "#000000"
  jagr-fg: "#ededed"
  jagr-fg-dim: "#bcbcbc"
  jagr-red: "#ff0033"
typography:
  display:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 7.6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  title-compact:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  headline-wide:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.3rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  credits-title:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 7vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.1
  title-card:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Poppins, Poppins Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
  receipt:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "0.65rem"
    fontWeight: 400
    lineHeight: 1.5
  jagr-mono:
    fontFamily: "Share Tech Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  tape: "3px"
  highlight: "5px"
  link: "10px"
  control: "12px"
  frame: "14px"
  icon: "16px"
  card: "18px"
  band: "20px"
  phone: "26px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "22px"
  card: "18px"
  edge: "6px"
  tap-min: "44px"
  gutter: "clamp(20px, 4.3vw, 48px)"
  page-max: "1120px"
components:
  button-demo:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px 0 20px"
    height: "50px"
  button-demo-arrow:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "28px"
  highlighter:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.highlight}"
    padding: "0.05em 0.3em"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  screen-frame-phone:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.phone}"
    padding: "5px"
  screen-frame-card:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "4px"
  app-icon:
    rounded: "{rounded.icon}"
  card-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  band-soft:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.band}"
    padding: "40px 44px"
  band-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.band}"
    padding: "32px 36px"
  chip:
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  receipt-band:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.frame}"
    padding: "18px 14px 34px"
  receipt-slot:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "24px"
    width: "470px"
  receipt-paper:
    backgroundColor: "{colors.thermal-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.receipt}"
    padding: "28px 16px 26px"
    width: "430px"
  receipt-tape:
    backgroundColor: "{colors.lime}"
    rounded: "{rounded.tape}"
    width: "86px"
    height: "26px"
  lang-link:
    textColor: "{colors.dim}"
    rounded: "{rounded.link}"
    padding: "0 0.5rem"
    size: "{spacing.tap-min}"
  lang-link-current:
    textColor: "{colors.ink}"
  jagr-strip:
    backgroundColor: "{colors.jagr-void}"
    textColor: "{colors.jagr-fg}"
    typography: "{typography.jagr-mono}"
    height: "{spacing.tap-min}"
---

# Design System: Tab

## Overview

**Creative North Star: "The highlighter sheet"**

Tab is shown the way a person marks up a printed page. The page is a white sheet with navy ink for text, outlines and fills. Lime is a highlighter dragged behind the words that matter. Real app screens are pasted onto the sheet inside thick ink frames, and the real receipt text is printed on a strip of thermal paper. Violet appears only as a pressed edge under the main action, on the focus ring and as the period of the wordmark. The look replaced an earlier dark SaaS treatment and rejects its pattern: a centred headline over a row of equal glassy cards.

The density is calm and print-like: one column of content inside a 1120px sheet, short lines, cards that alternate white, navy, then white and wide. Line art is Tab's own: a dashed route arc between two map pins with a lime $ coin and a violet Bs coin. Depth is physical, not atmospheric: cards and the main button sit on a solid bottom edge, like card stock or a key, and the soft shadows belong to the two objects lifted off the sheet, the floating phone and the receipt paper. The hero and the closing band sit on a still dot ground, like the dotted grid of a notebook page, so the wide margins read as paper rather than blank.

The page is framed by the JAGR thread, a black mono strip above and a black mono footer below, which carries JAGR's own values and is not part of Tab's palette.

The system is shaped by hard constraints. A strict CSP forbids inline styles, so every state and variant is a class, an attribute selector or an `nth-child` rule, never a style attribute. The page ships 0 client JS beyond the language module, so nothing is interactive beyond links and CSS states. Every target is at least 44px. Motion is limited and always optional: one 4s float of the hero phone, plus two scroll-driven moves (the receipt paper feeding out and the route trail drawing itself), all under `prefers-reduced-motion: no-preference`, and the scroll-driven ones also behind `@supports`. Without support or under reduced motion everything is simply there.

**Key Characteristics:**

- White paper, navy ink, lime only as highlighter, violet only as an edge or focus mark.
- 2px ink outlines with a solid 6px ink edge underneath on cards.
- Real screens in thick ink frames, never mockups.
- Still dot grids as ground; the route trail and receipt are the only scroll-driven motion.
- Poppins 400 and 700 only; mono belongs to the receipt and the JAGR thread.
- Real colours for every text and border, never opacity; every text at least 4.5:1, every control border at least 3:1.
- States through classes and structural selectors only (strict CSP).

## Colors

A white sheet inked in deep navy, with one lime highlighter and one violet edge.

### Primary

- **Sheet ink** (ink): text, card outlines, the card edge, the navy card and stack band fills, the phone frame, screen frames, the route art. 19.27:1 on paper, 16.28:1 on soft.

### Secondary

- **Highlighter lime** (lime): only behind ink text (16.75:1), as the highlighter on section and card titles, the CTA's arrow circle, text selection, the skip link, the $ coin, the route pins' centres and the tape strip on the receipt corner. Lime is never text and never sits on the white page without ink on it (1.08:1).

### Tertiary

- **Pressed violet** (violet): only the thick edge under the demo button, the 2px focus ring, the wordmark's period and the Bs coin. 6.29:1 on paper.

### Neutral

- **Paper** (paper): the page.
- **Soft band** (soft): the closing band and the band the receipt sits on.
- **Thermal paper** (thermal-paper): the receipt strip only, a warm off-white so the strip reads as a different stock from the white page. Ink on it is about 19:1.
- **Muted ink** (muted): secondary text on paper and soft (8.68:1 and 7.34:1).
- **Dim ink** (dim): the inactive language link only (6.61:1).
- **On-ink white** (on-ink): text on navy surfaces (19.27:1).
- **On-ink muted** (on-ink-muted): secondary text on navy (11.80:1).
- **On-ink line** (on-ink-line): chip outlines on navy (4.81:1).
- **On-ink frame** (on-ink-frame): the screenshot frame inside the navy card. Decorative only.
- **JAGR void, fg, fg-dim, red** (jagr-void, jagr-fg, jagr-fg-dim, jagr-red): the JAGR strip and footer only (17.94:1, 11.06:1 and 5.30:1 on void). Red is the caret and the link hover, nothing else.

### Named Rules

**The Highlighter Rule.** Lime lives behind ink words, never as text and never as a field on its own. It marks headings, not paragraphs.

**The One Edge Rule.** Violet is a mark, not a surface: the CTA's edge, the focus ring, the wordmark's period, the Bs coin. Nothing else is violet.

**The Real Colour Rule.** Every colour is a solid token with its measured ratio beside it in tokens.css. Never reach a lighter tone with opacity. Text and borders only: the dot grids are decoration and the only place a translucent ink is built.

**The One Warm Paper Rule.** Thermal paper (#fffef8) is the single off-white and belongs to the receipt strip. Every other paper surface is the white page or the soft band.

## Typography

**Display Font:** Poppins 700 (with a metric-matched local Arial fallback, then system sans)
**Body Font:** Poppins 400
**Label/Mono Font:** the system mono stack for the receipt; Share Tech Mono for the JAGR thread only

**Character:** one geometric sans in two weights does all the talking, set tight in headings and relaxed in body, so the page reads like a clean printed sheet. Mono appears only where the real thing is mono (the receipt text) or where JAGR's own voice frames the page.

### Hierarchy

- **Display** (700, clamp(2.125rem, 7.6vw, 3.4rem), 1.1, -0.025em, balanced wrap): the hero H1 only.
- **Headline** (700, 1.65rem, 1.25, -0.02em, balanced wrap): the closing band's line on phones. Fixed steps, not a vw clamp, so the inline pill never renders stale.
- **Headline wide** (700, 2.3rem, 1.25, -0.02em): the same line from 720px.
- **Title** (700, 1.375rem, 1.3): section headings, highlighted.
- **Compact title** (700, 1.25rem, 1.3): the stack band's heading and the credits page's section headings.
- **Credits title** (700, clamp(2rem, 7vw, 2.75rem), 1.1): the credits page's H1 only.
- **Card title** (700, 1.125rem, 1.35): card headings, highlighted.
- **Body** (400, 1rem, 1.6): base text. Secondary text steps down to 0.9375rem (hero lead, max 34ch), 0.9rem at 1.55 (card bodies) and 0.875rem (subheads, notes, max 60ch), in muted.
- **Label** (700, 0.9375rem): the demo button. Language links use 700 at 0.875rem with 0.04em tracking; chips use 400 at 0.8125rem.
- **Receipt** (400, 0.65rem, 1.5, rising to 0.78125rem from 760px): system mono, preserved whitespace, which carries the box-drawing glyphs.
- **JAGR mono** (400, 0.8125rem, 0.16em, uppercase): the strip and the footer's back link; the footer body is 0.875rem at 0.06em.

### Named Rules

**The Two Weights Rule.** Poppins ships in 400 and 700 only. Hierarchy comes from size, tracking and the highlighter, not from more weights.

**The Mono Is Real Rule.** Mono is for the real receipt text (system mono stack) and the JAGR thread (Share Tech Mono). Share Tech Mono never sets Tab's own content.

## Layout

One centred sheet: `page-max` (1120px) with a fluid `gutter` (clamp(20px, 4.3vw, 48px)). The JAGR strip runs edge to edge but aligns its row to the same column. Mobile first; every section stacks on a phone.

- **Hero:** text then art on phones (art 392px tall, phone 168px wide); from 900px a 7fr / 5fr grid with a 40px gap, art 470px tall, phone 200px wide.
- **Route trail:** from 1280px a dashed ink line (2px, 6px dashes, 13px period) runs down the left margin, 38px outside the 1120px column, with a 14px pin (lime centre in an ink dot, ringed in paper) level with each section's heading. It draws itself as the page scrolls (`animation-timeline: scroll(root)`, behind `@supports` and `prefers-reduced-motion: no-preference`); without either, the whole line is there. Under 1280px it is hidden.
- **Dot ground:** the hero and the closing band each carry a still grid of 1.4px ink dots on an 18px pitch, in a radial mask that fades them toward the edges. The ground spans full width behind the column.
- **Features:** cards stack with a 22px gap. From 600px text and screen sit side by side inside each card (text min 22ch, screen 180px). From 760px the receipt card goes side by side (0.8fr / 1.2fr). From 960px two cards share a row and the receipt card spans both.
- **Closing band:** padded 28px 22px, then 40px 44px from 720px with the app icon in the bottom right corner.
- **Stack band:** padded 24px 22px, then a 1fr / 1.4fr grid at 32px 36px from 720px.
- **Footer:** one column under 640px, a spaced row above.
- **Rhythm:** a small set of steps recurs: 8px (tight pairs, chip gaps), 14px (heading to lead, card inner gap), 22px (lead to CTA, card gap, band padding on phones), with 30px and 40px between bands.
- **Targets:** every link and control is at least 44px (`tap-min`); the demo button is 50px.

## Elevation & Depth

Flat paper with a physical edge. Depth is a solid, unblurred bottom edge in the outline's colour, offset straight down, never sideways. It reads as the thickness of card stock or a key, the world's native material. The soft shadows belong to the two objects lifted off the page, the floating hero phone and the receipt paper.

### Shadow Vocabulary

- **Card edge** (`box-shadow: 0 6px 0 var(--ink)`): under every feature card.
- **Pressed edge** (`box-shadow: 0 5px 0 var(--violet)`, 6px on hover, 0 when pressed): under the demo button only.
- **Phone float** (`box-shadow: 0 18px 34px rgb(11 10 41 / 0.22)`): the hero phone only.
- **Receipt paper** (`filter: drop-shadow(0 10px 16px rgb(11 10 41 / 0.2))`): the thermal paper only. A filter, so it follows the torn edges.
- **Printer slot edge** (`box-shadow: 0 5px 0 var(--violet)`): under the navy slot above the receipt, the same pressed edge as the demo button.
- **Current ring** (`box-shadow: inset 0 0 0 2px var(--ink)`): the current language link.

### Named Rules

**The Straight Down Rule.** Edges drop vertically with 0 blur in the outline's own colour. No diagonal offsets, no blurred card shadows. The two lifted objects are the only soft shadows.

**The Two Lifted Objects Rule.** Only the hero phone and the receipt paper are lifted off the sheet, each with one soft shadow. The phone floats once for 4s when the page opens; the paper feeds out as its card scrolls into view. Both run under `prefers-reduced-motion: no-preference` only, and the paper's feed also behind `@supports (animation-timeline: view())`.

**The Scroll Sets The Pace Rule.** Scroll-driven motion (the paper feed, the route trail) is tied to the visitor's scroll with a linear timeline, so nothing runs on its own, and it is gated by `@supports` and reduced motion so the static state is the complete design.

## Shapes

Soft, friendly corners on a firm outline. A small named scale: tape 3px, highlighter 5px, language links 10px, controls 12px (the demo button, the printer slot), screen frames and the receipt band 14px, the closing app icon 16px, cards 18px, bands 20px, the hero phone and the closing icon at desktop 26px; chips, pills and the arrow circle are full pills (999px). Outlines are 2px ink on cards, the closing pill and the current language; chips use 1.5px on-ink line. Screens sit in thick ink frames (4px on cards with 14px rounding, 5px around the phone with 26px). The receipt paper is the one deliberately cut shape: torn zigzag top and bottom edges, 12px teeth, made with a conic-gradient mask. Highlights clone their rounding and padding on every wrapped line.

## Components

### Buttons

The demo button is the page's one action, tactile and pressable. The page has exactly two (hero and closing band).

- **Shape:** gently rounded (12px), 50px tall.
- **Primary:** ink fill, on-ink label at 700, a 28px lime arrow circle with an ink arrow, padding 0 16px 0 20px.
- **Hover:** lifts 1px and the violet edge grows to 6px; the arrow nudges 1px up and right (160ms).
- **Active:** sinks 5px onto its edge, which goes to 0 (120ms, cubic-bezier(0.22, 1, 0.36, 1)).
- **Focus:** the global 2px violet ring at a 3px offset.

### Chips

- **Style:** outlined pills on the navy stack band: 1.5px on-ink line border, on-ink text at 0.8125rem, padding 6px 12px, 8px gaps. Not interactive.

### Cards / Containers

- **Corner Style:** 18px.
- **Background:** alternating by position: white, navy (second card), then white and wide. Set with `nth-child`, never a style attribute.
- **Shadow Strategy:** the card edge (see Elevation & Depth).
- **Border:** 2px ink.
- **Internal Padding:** 18px, with 14px between copy and screen.
- **Contents:** a highlighted title, a muted body, and either a real screen cropped from its top in a 4px ink frame (on-ink frame inside the navy card) or the receipt. Every crop ends in empty space, never through a line of the app. Cards are not links.

### Bands

- **Closing band:** soft fill, 20px corners, the headline line with an inline 2px ink outlined pill around the key phrase, the second demo button, a muted note and the real app icon (16px corners, 26px from 720px). A still dot ground fades in behind the icon corner.
- **Stack band:** ink fill, 20px corners, a highlighted title, an on-ink muted subhead and the chips.

### Navigation

- **Top bar:** the "tab." wordmark (ink letters, violet period, 1.5rem tall) on the left; the language links on the right.
- **Language links:** 44px squares, 10px corners, dim at 700 with 0.04em tracking; hover to ink; current page in ink with a 2px inset ink ring. Plain links that work with JS off.
- **JAGR strip and footer:** void black, Share Tech Mono, uppercase at 0.16em, a red clip-path caret pointing back, red on hover, a jagr-fg focus ring. The strip is copied unchanged from its versioned source.

### Receipt

The real shared receipt as text, never an image, printed on thermal paper. From the top: a navy printer slot (24px tall, 12px corners, the violet 5px edge, up to 470px wide), then the paper (up to 430px wide, thermal-paper fill, padding 28px 16px 26px, tilted -1.6 degrees, torn top and bottom edges, the soft receipt drop shadow), then a decorative barcode at its foot and a lime tape strip (86px by 26px, 3px corners, rotated 38 degrees) across the top right corner. The slot and paper sit on a soft band (14px corners, padding 18px 14px 34px) with a still dot ground. The paper feeds out of the slot as the card scrolls into view, scroll-driven and behind the guards described in Elevation & Depth. The text is a `pre` in the system mono stack that scrolls sideways on its own (and is focusable) when a narrow phone needs it; the box-drawing rules, barcode, slot and tape are hidden from screen readers.

### Hero art

The real home screen in a navy phone frame tilted -5 degrees, over Tab's dashed route arc (2px ink, 7 7 dash) between two ink map pins, with the lime $ coin and the violet Bs coin riding the line. The art clips sideways only, so the tilt never widens the page. Behind the hero sits the still dot ground.

## Do's and Don'ts

### Do:

- **Do** put lime only behind ink words, with the 5px rounded highlighter that clones on every wrapped line.
- **Do** use the straight down edge (0 6px 0 ink) under cards and the violet pressed edge under the demo button only.
- **Do** keep every text at least 4.5:1 and every control border at least 3:1 with solid tokens, and record the ratio beside any new token.
- **Do** express every state and variant as a class, an attribute selector or an `nth-child` rule (the CSP forbids inline styles).
- **Do** give every link and control at least 44px.
- **Do** show real screens and the real receipt text, cropped to end in empty space.
- **Do** gate any motion behind `prefers-reduced-motion: no-preference`, keep timed motion under 5 seconds, and drive longer motion from scroll behind `@supports` so the static state is complete.
- **Do** build texture from still dots (1.4px, 18px pitch, radial mask) and keep it out of text areas.

### Don't:

- **Don't** return to the dark SaaS hero: a centred headline over a row of equal glassy cards.
- **Don't** use lime as text, as a large field, or on paper without ink on top of it (1.08:1).
- **Don't** use violet as a fill or text colour beyond the edge, the focus ring, the wordmark's period and the Bs coin.
- **Don't** reach lighter tones with opacity; add a real colour token instead.
- **Don't** offset an edge sideways or blur a card shadow; only the hero phone and the receipt paper have a soft shadow.
- **Don't** set Tab's content in Share Tech Mono or bring JAGR red into Tab's own sections.
- **Don't** use thermal paper, torn edges or tape anywhere but the receipt.
- **Don't** add Poppins weights beyond 400 and 700.
- **Don't** put a small highlighted label above a heading. The hero's label ("A household app") is the one exception, kept as the approved mock has it while the user decides whether it moves beside the wordmark; don't copy it as a pattern.
