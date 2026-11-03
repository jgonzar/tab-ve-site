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
    lineHeight: 1.55
  jagr-mono:
    fontFamily: "Share Tech Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  highlight: "5px"
  control: "12px"
  card: "18px"
  band: "20px"
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
  receipt:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    typography: "{typography.receipt}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  lang-link:
    textColor: "{colors.dim}"
    rounded: "10px"
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

Tab is shown the way a person marks up a printed page. The page is a white sheet with navy ink for text, outlines and fills. Lime is a highlighter dragged behind the words that matter. Real app screens and the real receipt text are pasted onto the sheet inside thick ink frames. Violet appears only as a pressed edge under the main action, on the focus ring and as the period of the wordmark. The look replaced an earlier dark SaaS treatment and rejects its pattern: a centred headline over a row of equal glassy cards.

The density is calm and print-like: one column of content inside a 1120px sheet, short lines, cards that alternate white, navy, then white and wide. Line art is Tab's own: a dashed route arc between two map pins with a lime $ coin and a violet Bs coin. Depth is physical, not atmospheric: cards and the main button sit on a solid bottom edge, like card stock or a key, and the one soft shadow belongs to the floating phone.

The page is framed by the JAGR thread, a black mono strip above and a black mono footer below, which carries JAGR's own values and is not part of Tab's palette.

The system is shaped by hard constraints. A strict CSP forbids inline styles, so every state and variant is a class, an attribute selector or an `nth-child` rule, never a style attribute. The page ships 0 client JS beyond the language module, so nothing is interactive beyond links and CSS states. Every target is at least 44px. The only ambient motion is one 4s float of the hero phone, and only under `prefers-reduced-motion: no-preference`.

**Key Characteristics:**

- White paper, navy ink, lime only as highlighter, violet only as an edge or focus mark.
- 2px ink outlines with a solid 6px ink edge underneath on cards.
- Real screens in thick ink frames, never mockups.
- Poppins 400 and 700 only; mono belongs to the receipt and the JAGR thread.
- Real colours for every text and border, never opacity; every text at least 4.5:1, every control border at least 3:1.
- States through classes and structural selectors only (strict CSP).

## Colors

A white sheet inked in deep navy, with one lime highlighter and one violet edge.

### Primary

- **Sheet ink** (ink): text, card outlines, the card edge, the navy card and stack band fills, the phone frame, screen frames, the route art. 19.27:1 on paper, 16.28:1 on soft.

### Secondary

- **Highlighter lime** (lime): only behind ink text (16.75:1), as the highlighter on section and card titles, the CTA's arrow circle, text selection, the skip link and the $ coin. Lime is never text and never sits on the white page without ink on it (1.08:1).

### Tertiary

- **Pressed violet** (violet): only the thick edge under the demo button, the 2px focus ring, the wordmark's period and the Bs coin. 6.29:1 on paper.

### Neutral

- **Paper** (paper): the page.
- **Soft band** (soft): the closing band and the receipt background.
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

**The Real Colour Rule.** Every colour is a solid token with its measured ratio beside it in tokens.css. Never reach a lighter tone with opacity.

## Typography

**Display Font:** Poppins 700 (with a metric-matched local Arial fallback, then system sans)
**Body Font:** Poppins 400
**Label/Mono Font:** the system mono stack for the receipt; Share Tech Mono for the JAGR thread only

**Character:** one geometric sans in two weights does all the talking, set tight in headings and relaxed in body, so the page reads like a clean printed sheet. Mono appears only where the real thing is mono (the receipt text) or where JAGR's own voice frames the page.

### Hierarchy

- **Display** (700, clamp(2.125rem, 7.6vw, 3.4rem), 1.1, -0.025em, balanced wrap): the hero H1 only.
- **Headline** (700, 1.65rem, rising to 2.3rem from 720px, 1.25, -0.02em, balanced wrap): the closing band's line. Fixed steps, not a vw clamp, so the inline pill never renders stale.
- **Title** (700, 1.375rem, 1.3): section headings, highlighted. The stack band uses 1.25rem.
- **Card title** (700, 1.125rem, 1.35): card headings, highlighted.
- **Body** (400, 1rem, 1.6): base text. Secondary text steps down to 0.9375rem (hero lead, max 34ch), 0.9rem at 1.55 (card bodies) and 0.875rem (subheads, notes, max 60ch), in muted.
- **Label** (700, 0.9375rem): the demo button. Language links use 700 at 0.875rem with 0.04em tracking; chips use 400 at 0.8125rem.
- **Receipt** (400, 0.65rem, 1.55, rising to 0.78125rem from 760px): system mono, preserved whitespace, which carries the box-drawing glyphs.
- **JAGR mono** (400, 0.8125rem, 0.16em, uppercase): the strip and the footer's back link; the footer body is 0.875rem at 0.06em.

### Named Rules

**The Two Weights Rule.** Poppins ships in 400 and 700 only. Hierarchy comes from size, tracking and the highlighter, not from more weights.

**The Mono Is Real Rule.** Mono is for the real receipt text (system mono stack) and the JAGR thread (Share Tech Mono). Share Tech Mono never sets Tab's own content.

## Layout

One centred sheet: `page-max` (1120px) with a fluid `gutter` (clamp(20px, 4.3vw, 48px)). The JAGR strip runs edge to edge but aligns its row to the same column. Mobile first; every section stacks on a phone.

- **Hero:** text then art on phones (art 392px tall, phone 168px wide); from 900px a 7fr / 5fr grid with a 40px gap, art 470px tall, phone 200px wide.
- **Features:** cards stack with a 22px gap. From 600px text and screen sit side by side inside each card (text min 22ch, screen 180px). From 760px the receipt card goes side by side (0.8fr / 1.2fr). From 960px two cards share a row and the receipt card spans both.
- **Closing band:** padded 28px 22px, then 40px 44px from 720px with the app icon in the bottom right corner.
- **Stack band:** padded 24px 22px, then a 1fr / 1.4fr grid at 32px 36px from 720px.
- **Footer:** one column under 640px, a spaced row above.
- **Rhythm:** a small set of steps recurs: 8px (tight pairs, chip gaps), 14px (heading to lead, card inner gap), 22px (lead to CTA, card gap, band padding on phones), with 30px and 40px between bands.
- **Targets:** every link and control is at least 44px (`tap-min`); the demo button is 50px.

## Elevation & Depth

Flat paper with a physical edge. Depth is a solid, unblurred bottom edge in the outline's colour, offset straight down, never sideways. It reads as the thickness of card stock or a key, the world's native material. The single soft shadow belongs to the floating hero phone, the one object lifted off the page.

### Shadow Vocabulary

- **Card edge** (`box-shadow: 0 6px 0 var(--ink)`): under every feature card.
- **Pressed edge** (`box-shadow: 0 5px 0 var(--violet)`, 6px on hover, 0 when pressed): under the demo button only.
- **Phone float** (`box-shadow: 0 18px 34px rgb(11 10 41 / 0.22)`): the hero phone only.
- **Current ring** (`box-shadow: inset 0 0 0 2px var(--ink)`): the current language link.

### Named Rules

**The Straight Down Rule.** Edges drop vertically with 0 blur in the outline's own colour. No diagonal offsets, no blurred card shadows.

**The One Float Rule.** Only the hero phone floats: one soft shadow, one 4s cycle when the page opens, under `prefers-reduced-motion: no-preference` only.

## Shapes

Soft, friendly corners on a firm outline. Controls round at 12px, cards at 18px, bands at 20px; chips, pills and the arrow circle are full pills (999px); the highlighter rounds at 5px. Outlines are 2px ink on cards, the closing pill and the current language; chips use 1.5px on-ink line. Screens sit in thick ink frames (4px on cards, 5px around the phone) with their own inner rounding (14px card frame, 26px phone). Highlights clone their rounding and padding on every wrapped line.

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

- **Closing band:** soft fill, 20px corners, the headline line with an inline 2px ink outlined pill around the key phrase, the second demo button, a muted note and the real app icon.
- **Stack band:** ink fill, 20px corners, a highlighted title, an on-ink muted subhead and the chips.

### Navigation

- **Top bar:** the "tab." wordmark (ink letters, violet period, 1.5rem tall) on the left; the language links on the right.
- **Language links:** 44px squares, 10px corners, dim at 700 with 0.04em tracking; hover to ink; current page in ink with a 2px inset ink ring. Plain links that work with JS off.
- **JAGR strip and footer:** void black, Share Tech Mono, uppercase at 0.16em, a red clip-path caret pointing back, red on hover, a jagr-fg focus ring. The strip is copied unchanged from its versioned source.

### Receipt

The real shared receipt as text, never an image: a `pre` on soft with 12px corners, padding 14px 16px, the system mono stack, scrolling sideways on its own (and focusable) when a narrow phone needs it. Box-drawing rules are hidden from screen readers.

### Hero art

The real home screen in a navy phone frame tilted -5 degrees, over Tab's dashed route arc (2px ink, 7 7 dash) between two ink map pins, with the lime $ coin and the violet Bs coin riding the line. The art clips sideways only, so the tilt never widens the page.

## Do's and Don'ts

### Do:

- **Do** put lime only behind ink words, with the 5px rounded highlighter that clones on every wrapped line.
- **Do** use the straight down edge (0 6px 0 ink) under cards and the violet pressed edge under the demo button only.
- **Do** keep every text at least 4.5:1 and every control border at least 3:1 with solid tokens, and record the ratio beside any new token.
- **Do** express every state and variant as a class, an attribute selector or an `nth-child` rule (the CSP forbids inline styles).
- **Do** give every link and control at least 44px.
- **Do** show real screens and the real receipt text, cropped to end in empty space.
- **Do** gate any motion behind `prefers-reduced-motion: no-preference` and keep it under 5 seconds.

### Don't:

- **Don't** return to the dark SaaS hero: a centred headline over a row of equal glassy cards.
- **Don't** use lime as text, as a large field, or on paper without ink on top of it (1.08:1).
- **Don't** use violet as a fill or text colour beyond the edge, the focus ring, the wordmark's period and the Bs coin.
- **Don't** reach lighter tones with opacity; add a real colour token instead.
- **Don't** offset an edge sideways or blur a card shadow; only the hero phone has a soft shadow.
- **Don't** set Tab's content in Share Tech Mono or bring JAGR red into Tab's own sections.
- **Don't** add Poppins weights beyond 400 and 700.
- **Don't** put a small highlighted label above a heading. The hero's label ("A household app") is the one exception, kept as the approved mock has it while the user decides whether it moves beside the wordmark; don't copy it as a pattern.
