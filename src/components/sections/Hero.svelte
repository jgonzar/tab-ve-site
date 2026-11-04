<script lang="ts">
  // The first viewport: what Tab is, in one line, and the real home screen on
  // Tab's own route arc, between two pins, with the $ and Bs coins.
  import DemoButton from "./DemoButton.svelte";
  import Picture from "./Picture.svelte";
  import type { PictureData } from "../../images";

  interface Props {
    eyebrow: string;
    headline: string;
    before: string;
    cta: string;
    demo: string;
    screen: PictureData;
    alt: string;
  }

  let { eyebrow, headline, before, cta, demo, screen, alt }: Props = $props();
</script>

<section class="hero" aria-labelledby="hero-title">
  <div class="hero__copy">
    <p class="hero__label"><span class="hl">{eyebrow}</span></p>
    <h1 id="hero-title" class="hero__title">{headline}</h1>
    <p class="hero__before">{before}</p>
    <div class="hero__cta">
      <DemoButton href={demo} label={cta} />
    </div>
  </div>

  <div class="hero__art">
    <svg
      class="hero__route"
      viewBox="0 0 520 400"
      width="520"
      height="400"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <path class="hero__arc" d="M28 350 C 40 150, 500 280, 492 48" stroke-width="2" />
      <g transform="translate(28 350)">
        <circle class="hero__pin" r="17" />
        <path
          class="hero__pin-mark"
          d="M0 7s-6-5-6-9a6 6 0 0 1 12 0c0 4-6 9-6 9z"
          stroke-width="2"
        />
        <circle class="hero__pin-dot" cy="-2" r="2" />
      </g>
      <g transform="translate(492 48)">
        <circle class="hero__pin" r="17" />
        <path
          class="hero__pin-mark"
          d="M0 7s-6-5-6-9a6 6 0 0 1 12 0c0 4-6 9-6 9z"
          stroke-width="2"
        />
        <circle class="hero__pin-dot" cy="-2" r="2" />
      </g>
      <!-- Both coins sit on the arc, where it clears the phone -->
      <g transform="translate(68 273)">
        <circle class="hero__coin hero__coin--usd" r="21" stroke-width="2" />
        <text class="hero__coin-text hero__coin-text--usd" y="6" text-anchor="middle" font-size="17"
          >$</text
        >
      </g>
      <g transform="translate(460 138)">
        <circle class="hero__coin hero__coin--bs" r="23" stroke-width="2" />
        <text class="hero__coin-text hero__coin-text--bs" y="6" text-anchor="middle" font-size="15"
          >Bs</text
        >
      </g>
    </svg>
    <div class="hero__phone">
      <Picture image={screen} {alt} priority />
    </div>
  </div>
</section>

<style>
  .hero {
    display: grid;
    gap: 24px;
    padding-block: 26px 32px;
    align-items: center;
  }

  .hero__label {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 700;
  }

  .hero__title {
    margin: 14px 0 0;
    font-size: clamp(2.125rem, 7.6vw, 3.4rem);
    line-height: 1.1;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .hero__before {
    margin: 14px 0 0;
    max-width: 34ch;
    color: var(--muted);
    font-size: 0.9375rem;
    line-height: 1.6;
    text-wrap: pretty;
  }

  .hero__cta {
    margin-top: 22px;
  }

  /* The art: the route behind, the phone tilted on top. Clipped sideways
     only, so the tilt never widens the page while the phone's soft shadow
     still falls below the box */
  .hero__art {
    position: relative;
    height: 392px;
    overflow-x: clip;
  }

  .hero__route {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .hero__phone {
    position: absolute;
    top: 6px;
    left: 50%;
    width: 168px;
    border: 5px solid var(--ink);
    border-radius: 26px;
    background: var(--ink);
    overflow: hidden;
    box-shadow: var(--shadow-phone);
    transform: translateX(-50%) rotate(-5deg);
  }

  .hero__phone :global(img) {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 20px;
  }

  /* The route's colours are the tokens, not copies of them */
  .hero__arc {
    stroke: var(--ink);
    stroke-dasharray: 7 7;
  }

  .hero__pin {
    fill: var(--ink);
  }

  .hero__pin-mark {
    stroke: var(--paper);
  }

  .hero__pin-dot {
    fill: var(--lime);
  }

  .hero__coin {
    stroke: var(--ink);
  }

  .hero__coin--usd {
    fill: var(--lime);
  }

  .hero__coin--bs {
    fill: var(--violet);
  }

  .hero__coin-text {
    font-family: var(--font-sans);
    font-weight: 700;
  }

  .hero__coin-text--usd {
    fill: var(--ink);
  }

  .hero__coin-text--bs {
    fill: var(--on-ink);
  }

  /* The route as in the app's ride sheet: the dashes march from the first pin
     to the second, ten pixels a second. Three cycles, then rest (under 5
     seconds, WCAG 2.2.2); the visitor's pointer over the art sets them going
     again. The march is the one motion in the hero: it starts as the entry
     loader lifts (about 2.15 seconds), so none of it runs unseen, and at once
     when there is no loader (the language switch, #top). */
  @media (prefers-reduced-motion: no-preference) {
    .hero__arc {
      animation: march 1.4s linear 2.15s 3 both;
    }

    :global(:root:has(:target)) .hero__arc {
      animation-delay: 0s;
    }

    @media (hover: hover) {
      .hero__art:hover .hero__arc {
        animation: march-on 1.4s linear infinite;
      }
    }
  }

  @keyframes march {
    from {
      stroke-dashoffset: 14;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes march-on {
    from {
      stroke-dashoffset: 14;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  /* The copy gets the wider share while the art is still narrow, then the
     art grows from 1100px */
  @media (min-width: 900px) {
    .hero {
      grid-template-columns: 3fr 2fr;
      gap: 40px;
      padding-block: 44px 56px;
    }

    .hero__before {
      max-width: 38ch;
      font-size: 1.0625rem;
    }

    /* Two lines in English while the copy column is still the narrower share */
    .hero__title {
      font-size: 3rem;
    }
  }

  @media (min-width: 1100px) {
    .hero {
      grid-template-columns: 7fr 5fr;
    }

    .hero__title {
      font-size: 3.4rem;
    }

    .hero__art {
      height: 470px;
    }

    .hero__phone {
      width: 200px;
    }
  }
</style>
