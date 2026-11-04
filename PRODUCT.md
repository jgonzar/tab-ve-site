# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who click through from JAGR, Angel's personal portfolio site, to see what he built. Later, prospective clients judging the craft of his landing-page work. There is no sales audience: nobody is being converted into a user of Tab.

## Product Purpose

Show Tab and send visitors into its live demo at `tab-ve-demo.vercel.app`. The page has one main action: Try the demo. Success means a visitor understands what Tab does and opens the demo.

## Positioning

Tab is a real household app, in daily use by three people in Venezuela, not a concept. The page shows the real app on sample data, never a mockup of an imagined product.

## Operating Context

- Tab logs rides, with one tap per usual route, and it works offline.
- It shows every total in USD and in bolívares at the day's official BCV rate.
- It shares a plain text receipt of what's pending, and marks rides paid.
- Visitors arrive from JAGR, mostly on phones and laptops. They read in English or Spanish.

## Capabilities and Constraints

- **Copy:** the approved copy, rows 1 to 36, in English and Spanish, lives in the plan artifact `tab-landing` in Traycer epic `dbf8539d`. Any change needs the user's approval.
- **Imagery:** the real app captures (`inicio`, `quick-ride`, `summary`) and the real receipt text (`receipt.txt` per language), produced by the deterministic capture script.
- **The JAGR strip** (black, mono, red caret) links back to the portfolio.
- **Technical bar:**
  - a strict CSP with no third-party origins and no inline scripts or styles
  - WCAG 2.2 AA
  - Lighthouse budgets: LCP 2.0 s or less, CLS 0.05 or less, JS 5 KB or less, page 400 KB or less
  - two languages, at `/en/` and `/es/`
- **Stack:** Astro, as a static site, deployed on Vercel.

## Brand Commitments

- **Identity:** the name Tab, the "tab." wordmark, and the "b." icon.
- **Palette:** navy `#0b0a29`, violet `#4342f5`, lime `#d7fe65`.
- **Type:** Poppins.
- **Voice:** sentence case, with no em or en dashes.

## Evidence on Hand

Real app captures and receipt text in `src/assets/captures/`, and the OG cards in `public/og/`. There are no testimonials, client logos, usage statistics or press, and none may be invented.

## Product Principles

- The demo is the destination. Everything on the page leads there.
- Show the real thing: real screens, real receipt text, sample data labelled as such.
- A showcase, not a sales page: no pricing, no sign-up, no services pitch.
- It's a reference build, so its craft and technical quality are part of the message.

## Accessibility & Inclusion

WCAG 2.2 AA in both languages, 44px targets, and reduced motion respected.
