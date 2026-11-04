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
  card-coin:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "32px"
  card-coin-ink:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-ink}"
  lang-link:
    textColor: "{colors.dim}"
    rounded: "{rounded.link}"
    padding: "0 0.5rem"
    size: "{spacing.tap-min}"
  lang-link-current:
    textColor: "{colors.ink}"
  entry-loader:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-ink}"
  settle-total:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.lime}"
    rounded: "16px"
    padding: "22px 24px 26px"
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

The density is calm and print-like: one column of content inside a 1120px sheet, short lines, cards that alternate white, navy, then white and wide. Line art is Tab's own: a dashed route arc between two map pins with a lime $ coin and a violet Bs coin, the same route the entry loader draws in white on violet. Depth is physical, not atmospheric: cards and the main button sit on a solid bottom edge, like card stock or a key, and the soft shadows belong to the two objects lifted off the sheet, the floating phone and the receipt paper. The hero, the closing band and the receipt band sit on a dot ground, like the dotted grid of a notebook page, so the wide margins read as paper rather than blank. Faint ink dots are still until a pointer arrives; then they clear around it and violet, navy and lime dots take their place on the same lattice.

The page is framed by the JAGR thread, a black mono strip above and a black mono footer below, which carries JAGR's own values and is not part of Tab's palette.

The system is shaped by hard constraints. A strict CSP forbids inline styles, so every state and variant is a class, an attribute selector or an `nth-child` rule, never a style attribute. Client JS is two small modules, the language cookie and the pointer module for the dot fields (about 0.6 KB gzipped, an external file so the CSP is untouched); nothing else is interactive beyond links and CSS states. Every target is at least 44px. Motion is limited, optional and answers the visitor. The automatic motion is bounded: a 2.1s entry loader on the landing page, one 4s float of the hero phone, and three marching cycles of the hero's route, then rest. Scroll sets the pace of the receipt paper feeding out and of each card settling straight. The pointer (or focus) drives the dot field, the card response, the button arrow, the footer underline and a replay of the marching route and the receipt card's step trail. All of it sits under `prefers-reduced-motion: no-preference` (the dot module also needs a fine, hovering pointer), the scroll-driven parts also behind `@supports`, and all new pointer and scroll easing is the exponential ease-out cubic-bezier(0.22, 1, 0.36, 1) with no overshoot or bounce (the loader's own timing is the one recorded exception). Without support or under reduced motion everything is simply there.

**Key Characteristics:**

- White paper, navy ink, lime only as highlighter, violet only as an edge or focus mark.
- 2px ink outlines with a solid 6px ink edge underneath on cards.
- Real screens in thick ink frames, never mockups.
- Dot fields as ground, still until a pointer clears them and brand-coloured dots follow it.
- Cards that lift, tilt and grow their ink edge when pointed at, and arrive tilted as they scroll in.
- Motion answers the visitor (scroll, pointer, focus); only the entry loader, the hero phone's single float and three cycles of the hero route run by themselves, each once and then still.
- Poppins 400 and 700 only; mono belongs to the receipt and the JAGR thread.
- Real colours for every text and border, never opacity; every text at least 4.5:1, every control border at least 3:1.
- States through classes and structural selectors only (strict CSP).

## Colors

A white sheet inked in deep navy, with one lime highlighter and one violet edge.

### Primary

- **Sheet ink** (ink): text, card outlines, the card edge, the navy card and stack band fills, the phone frame, screen frames, the hero's route art. 19.27:1 on paper, 16.28:1 on soft.

### Secondary

- **Highlighter lime** (lime): only behind ink text (16.75:1), as the highlighter on section and card titles, the CTA's arrow circle, text selection, the skip link, the $ coins (the hero's and the first and third cards'), the tape strip on the receipt corner, the receipt card's total figure on its ink panel and share step, and the dot, pin centres and period in the loader and the hero's route (decoration). Lime is never text and never sits on the white page without ink on it (1.08:1). The one other lime is the third colour of the pointer's dots, decoration that exists only under the pointer.

### Tertiary

- **Pressed violet** (violet): the thick edge under the demo button, the 2px focus ring, the wordmark's period, the Bs coin (the hero's and the navy card's), the navy card's grown edge on hover, the receipt card's total panel edge, one of the three pointer dot colours and, for about 2.1s on load, the entry loader's full-screen sheet (white wordmark on it, 6.29:1). 6.29:1 on paper.

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

**The One Edge Rule.** Violet is a mark, not a surface: the CTA's edge, the focus ring, the wordmark's period, the Bs coins, the navy card's hover edge, the receipt card's total panel edge and the pointer's violet dots. Nothing else is violet. The one other violet is the entry loader's sheet, which is gone in about 2.1s and never part of the resting page.

**The Real Colour Rule.** Every colour is a solid token with its measured ratio beside it in tokens.css. Never reach a lighter tone with opacity. Text and borders only: the faint dots are decoration and the only place a translucent ink is built.

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
- **Dot ground:** the hero, the closing band and the receipt band each carry a field of 1.4px ink dots on an 18px pitch (`--dot-alpha` 0.18, 0.22 and 0.24), in a radial mask (`--fade`) that thins them toward the edges. The hero's field spans full width behind the column. Over the faint dots sit three layers of brand dots (violet, navy, lime; 3.4px to 3.6px, one colour per column) on the same lattice, hidden until the pointer arrives.
- **Features:** cards stack with a 22px gap. From 600px text and screen sit side by side inside each card (text min 22ch, screen 180px). From 760px the receipt card goes side by side (0.8fr / 1.2fr). From 960px two cards share a row and the receipt card spans both; there its left column stacks the copy, the total panel and the two icon steps (hidden below 960px).
- **Closing band:** padded 28px 22px, then 40px 44px from 720px with the app icon in the bottom right corner.
- **Stack band:** padded 24px 22px, then a 1fr / 1.4fr grid at 32px 36px from 720px.
- **Footer:** one column under 640px, a spaced row above.
- **Rhythm:** a small set of steps recurs: 8px (tight pairs, chip gaps), 14px (heading to lead, card inner gap), 22px (lead to CTA, card gap, band padding on phones), with 30px and 40px between bands.
- **Targets:** every link and control is at least 44px (`tap-min`); the demo button is 50px.

## Elevation & Depth

Flat paper with a physical edge. Depth is a solid, unblurred bottom edge in the outline's colour, offset straight down, never sideways. It reads as the thickness of card stock or a key, the world's native material. The soft shadows belong to the two objects lifted off the page, the floating hero phone and the receipt paper.

### Shadow Vocabulary

- **Card edge** (`box-shadow: 0 6px 0 var(--ink)`): under every feature card; 13px on hover and focus (violet on the navy card).
- **Pressed edge** (`box-shadow: 0 5px 0 var(--violet)`, 6px on hover, 0 when pressed): under the demo button only.
- **Phone float** (`box-shadow: 0 18px 34px rgb(11 10 41 / 0.22)`): the hero phone only.
- **Receipt paper** (`filter: drop-shadow(0 10px 16px rgb(11 10 41 / 0.2))`): the thermal paper only. A filter, so it follows the torn edges.
- **Printer slot edge** (`box-shadow: 0 5px 0 var(--violet)`): under the navy slot above the receipt, the same pressed edge as the demo button.
- **Current ring** (`box-shadow: inset 0 0 0 2px var(--ink)`): the current language link.

### Named Rules

**The Straight Down Rule.** Edges drop vertically with 0 blur in the outline's own colour. No diagonal offsets, no blurred card shadows. The two lifted objects are the only soft shadows.

**The Two Lifted Objects Rule.** Only the hero phone and the receipt paper have a soft shadow. The phone floats once for 4s when the page opens; the paper feeds out as its card scrolls into view. Both run under `prefers-reduced-motion: no-preference` only, and the paper's feed also behind `@supports (animation-timeline: view())`. A card that rises on hover is lifted by its solid edge growing, never by a soft shadow.

**The Visitor Sets The Pace Rule.** Everything but the hero float answers the visitor, so none of it needs a pause control. Scroll-driven motion (the paper feed, each card settling from its own tilt) uses a linear `view()` timeline, behind `@supports` and reduced motion. The card's individual `rotate` and `translate` properties carry the scroll arrival so they never fight the hover's `transform`. Pointer and focus motion (cards, button arrow, footer underline, dot field) uses the exponential ease-out cubic-bezier(0.22, 1, 0.36, 1) with no overshoot or bounce, and hover effects sit inside `@media (hover: hover)`. The static state is always the complete design. Two automatic motions fit this: the hero's marching route runs three cycles on load (1.4s each, 10px/s like the app's ride sheet, under 5s, WCAG 2.2.2) and then rests, replaying only while the pointer is over the art, and the receipt card's step trail marches only while the card is hovered.

**The Loader Is Decoration Rule.** The entry loader never gates the page. The document underneath is complete and focusable from the first frame; the violet sheet is `aria-hidden`, has `pointer-events: none`, takes no tab stop, and is CSS only (no script, so the CSP is untouched). It plays once, about 2.1s, on the landing page only, and is not drawn at all under `prefers-reduced-motion`. It runs transform and clip-path only, and it ends fully off screen with nothing left to read or focus. Its easing is its own: a snap-in lift (cubic-bezier(0.76, 0, 0.24, 1)) and a single bounce on the period, the one place the page overshoots; do not copy either into pointer or scroll motion.

**The Pointer Dots Rule.** A `.dots` field reacts to the pointer through three custom properties (`--mx`, `--my`, `--r`) set by `src/scripts/dots.ts`: faint dots clear within about 150px of the pointer and violet, navy and lime dots take their place, eased so they follow smoothly. The look is all CSS (two masks and a circle). The module runs only for `(hover: hover) and (pointer: fine)` without reduced motion; otherwise the dots stay still. It is decoration over paper and soft bands, kept out of text areas, and the field is deliberate: do not strip it as a grid-background finding.

## Shapes

Soft, friendly corners on a firm outline. A small named scale: tape 3px, highlighter 5px, language links 10px, controls 12px (the demo button, the printer slot), screen frames and the receipt band 14px, the closing app icon 16px, cards 18px, bands 20px, the hero phone and the closing icon at desktop 26px; chips, pills and the arrow circle are full pills (999px). Outlines are 2px ink on cards, the closing pill and the current language; chips use 1.5px on-ink line. Screens sit in thick ink frames (4px on cards with 14px rounding, 5px around the phone with 26px). The receipt paper is the one deliberately cut shape: torn zigzag top and bottom edges, 12px teeth, made with a conic-gradient mask. Highlights clone their rounding and padding on every wrapped line.

## Components

### Buttons

The demo button is the page's one action, tactile and pressable. The page has exactly two (hero and closing band).

- **Shape:** gently rounded (12px), 50px tall.
- **Primary:** ink fill, on-ink label at 700, a 28px lime arrow circle with an ink arrow, padding 0 16px 0 20px.
- **Hover:** lifts 1px and the violet edge grows to 6px; the arrow circle nudges 3px up and right and turns 45 degrees (160ms).
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
- **Hover / Focus:** on hover (only where hover exists) and on focus within, the card lifts 7px and tilts -0.7 degrees, its edge grows from 6px to 13px (violet on the navy card), a 32px coin (the hero's $ or Bs: lime with an ink 2px outline, violet on the navy card) pops into the top right corner, the title's highlighter sweeps in again (the `.hl` gradient's `background-size`, 0.55s) and the screen leans out (up 5px, 2.2 degrees, 1.05 scale). Transitions are 0.3s to 0.4s on the exponential ease-out.
- **On scroll:** each card arrives at its own tilt (-3.5, 3 and -1.6 degrees, 44px low) and settles straight, scroll-driven and behind the guards in Elevation & Depth.
- **Contents:** a highlighted title, a muted body, and either a real screen cropped from its top in a 4px ink frame (on-ink frame inside the navy card) or the receipt. Every crop ends in empty space, never through a line of the app. Cards are not links.

### Bands

- **Closing band:** soft fill, 20px corners, the headline line with an inline 2px ink outlined pill around the key phrase, the second demo button, a muted note and the real app icon (16px corners, 26px from 720px). A dot ground fades in behind the icon corner.
- **Stack band:** ink fill, 20px corners, a highlighted title, an on-ink muted subhead and the chips.

### Navigation

- **Top bar:** the "tab." wordmark (ink letters, violet period, 1.5rem tall) on the left; the language links on the right.
- **Language links:** 44px squares, 10px corners, dim at 700 with 0.04em tracking; hover to ink; current page in ink with a 2px inset ink ring. Plain links that work with JS off.
- **JAGR strip and footer:** void black, Share Tech Mono, uppercase at 0.16em, a red clip-path caret pointing back, red on hover, a jagr-fg focus ring. The strip is copied unchanged from its versioned source. The footer's back link gets a hand-drawn JAGR red underline (2.5px, round caps) that draws itself on hover and focus (an SVG path with `pathLength`, dash offset, 0.5s on the exponential ease-out).

### Receipt

The real shared receipt as text, never an image, printed on thermal paper. From the top: a navy printer slot (24px tall, 12px corners, the violet 5px edge, up to 470px wide), then the paper (up to 430px wide, thermal-paper fill, padding 28px 16px 26px, tilted -1.6 degrees, torn top and bottom edges, the soft receipt drop shadow), then a decorative barcode at its foot and a lime tape strip (86px by 26px, 3px corners, rotated 38 degrees) across the top right corner. The slot and paper sit on a soft band (14px corners, padding 18px 14px 34px) with a dot ground. On wide screens (960px and up) the card's left column carries, under its copy, a total panel and two icon steps. The panel is an ink fill with 16px corners and a violet 6px edge, holding the receipt's own total read back from its last line: rides and Bs in on-ink muted at 0.875rem, the USD figure in lime at 3.5rem 700. No new copy. At the card's foot sit two 56px round steps, share (lime fill, ink icon) and paid (ink fill, lime check), each with a 2px ink outline, joined by a 7 7 dashed trail that marches from share to paid while the card is hovered (hover devices, no reduced motion). All of it is `aria-hidden` and hidden below 960px. The paper feeds out of the slot as the card scrolls into view, scroll-driven and behind the guards described in Elevation & Depth. The text is a `pre` in the system mono stack that scrolls sideways on its own (and is focusable) when a narrow phone needs it; the box-drawing rules, barcode, slot and tape are hidden from screen readers.

### Entry loader

The landing page opens on a full-screen violet sheet (`Loader.astro`, wired through `<Base intro>`, landing page only): a white wordmark with a lime period, and under it a white dashed route (2.5px, 7 7) drawn pin to pin with a lime dot riding it, between two ink pins with lime centres. The wordmark pops in as the dot lands (0.6s), the period drops and bounces last (1s), then the sheet lifts off the top (0.6s from 1.55s, transform only). About 2.1s in all. It is drawn from the hero's route and the wordmark's period drop, without a dot lattice on purpose: the lattice was dropped as too many dots. It is `aria-hidden`, ignores the pointer, takes no tab stop, is CSS only and is not drawn under `prefers-reduced-motion`. See The Loader Is Decoration Rule.

### Hero art

The real home screen in a navy phone frame tilted -5 degrees, over Tab's dashed route arc (2px ink, 7 7 dash) between two ink map pins, with the lime $ coin and the violet Bs coin riding the line. The dashes march from the first pin to the second at 10px a second (14px per 1.4s linear cycle, as in the app's QuickRideModal), and a 6px lime dot with an ink outline rides the arc once (4.2s). Both run three cycles when the page opens, then rest (WCAG 2.2.2), and replay while the pointer is over the art (hover devices only). The dot is invisible at rest and never drawn under reduced motion. The art clips sideways only, so the tilt never widens the page. Behind the hero sits the dot ground.

## Do's and Don'ts

### Do:

- **Do** put lime only behind ink words, with the 5px rounded highlighter that clones on every wrapped line.
- **Do** use the straight down edge (0 6px 0 ink) under cards and the violet pressed edge under the demo button only.
- **Do** keep every text at least 4.5:1 and every control border at least 3:1 with solid tokens, and record the ratio beside any new token.
- **Do** express every state and variant as a class, an attribute selector or an `nth-child` rule (the CSP forbids inline styles).
- **Do** give every link and control at least 44px.
- **Do** show real screens and the real receipt text, cropped to end in empty space.
- **Do** gate any motion behind `prefers-reduced-motion: no-preference`, keep automatic motion to one short cycle, drive longer motion from scroll behind `@supports` and from the pointer behind `@media (hover: hover)`, so the static state is complete.
- **Do** ease new pointer and scroll motion with cubic-bezier(0.22, 1, 0.36, 1) and keep it free of overshoot and bounce.
- **Do** keep any entry or automatic motion decoration only: CSS, `aria-hidden`, never blocking the page, absent under reduced motion, and resting within 5 seconds.
- **Do** build texture from dot fields (1.4px faint dots, 18px pitch, masked), keep it out of text areas, and let the pointer module drive any new field through `.dots`.
- **Do** use the individual `rotate` and `translate` properties for scroll-driven motion on an element that also moves with `transform`.

### Don't:

- **Don't** return to the dark SaaS hero: a centred headline over a row of equal glassy cards.
- **Don't** use lime as text, as a large field, or on paper without ink on top of it (1.08:1).
- **Don't** use violet as a fill or text colour beyond the edges, the focus ring, the wordmark's period, the Bs coins and the pointer dots. The loader's sheet is the one timed exception.
- **Don't** gate the page behind the loader, add script to it, or play it on any page but the landing page.
- **Don't** add a trail, pins or any scroll-drawn line in the margin; it was tried and removed.
- **Don't** make the dots react without a fine hovering pointer, or load more client JS for decoration.
- **Don't** reach lighter tones with opacity; add a real colour token instead.
- **Don't** offset an edge sideways or blur a card shadow; only the hero phone and the receipt paper have a soft shadow.
- **Don't** set Tab's content in Share Tech Mono or bring JAGR red into Tab's own sections.
- **Don't** use thermal paper, torn edges or tape anywhere but the receipt.
- **Don't** add Poppins weights beyond 400 and 700.
- **Don't** put a small highlighted label above a heading. The hero's label ("A household app") is the one exception: the user chose to keep it above the headline on 2026-11-04, after seeing it beside the wordmark too, as the approved mock and both reference pages have it. Don't copy it as a pattern.
