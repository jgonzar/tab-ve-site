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
      viewBox="0 0 400 400"
      width="400"
      height="400"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <path
        class="hero__arc"
        d="M40 330 C 60 150, 340 230, 360 60"
        stroke="#0b0a29"
        stroke-width="2"
        stroke-dasharray="7 7"
      />
      <circle class="hero__dot" r="6" fill="#d7fe65" stroke="#0b0a29" stroke-width="2" />
      <g transform="translate(40 330)">
        <circle r="17" fill="#0b0a29" />
        <path d="M0 7s-6-5-6-9a6 6 0 0 1 12 0c0 4-6 9-6 9z" stroke="#ffffff" stroke-width="2" />
        <circle cy="-2" r="2" fill="#d7fe65" />
      </g>
      <g transform="translate(360 60)">
        <circle r="17" fill="#0b0a29" />
        <path d="M0 7s-6-5-6-9a6 6 0 0 1 12 0c0 4-6 9-6 9z" stroke="#ffffff" stroke-width="2" />
        <circle cy="-2" r="2" fill="#d7fe65" />
      </g>
      <g transform="translate(70 120)">
        <circle r="21" fill="#d7fe65" stroke="#0b0a29" stroke-width="2" />
        <text
          y="6"
          text-anchor="middle"
          font-family="Poppins, sans-serif"
          font-weight="700"
          font-size="17"
          fill="#0b0a29">$</text
        >
      </g>
      <g transform="translate(330 270)">
        <circle r="23" fill="#4342f5" stroke="#0b0a29" stroke-width="2" />
        <text
          y="6"
          text-anchor="middle"
          font-family="Poppins, sans-serif"
          font-weight="700"
          font-size="15"
          fill="#ffffff">Bs</text
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

  /* One slow float when the page opens, then rest: a single 4s cycle, so
     nothing moves on its own for more than 5 seconds (WCAG 2.2.2), and
     only for those who haven't asked for less motion */
  @media (prefers-reduced-motion: no-preference) {
    .hero__phone {
      animation: float 4s ease-in-out 1;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateX(-50%) rotate(-5deg) translateY(0);
    }

    50% {
      transform: translateX(-50%) rotate(-5deg) translateY(-6px);
    }
  }

  /* The route as in the app's ride sheet: the dashes march from the first pin
     to the second, ten pixels a second, and a dot rides the arc once. Three
     cycles when the page opens, then rest (under 5 seconds, WCAG 2.2.2); the
     visitor's pointer over the art sets them going again. The dot is
     only drawn while it rides. */
  @media (prefers-reduced-motion: no-preference) {
    .hero__arc {
      animation: march 1.4s linear 3;
    }

    /* Invisible at rest, so it never sits anywhere it should not */
    .hero__dot {
      opacity: 0;
      offset-path: path("M40 330 C 60 150, 340 230, 360 60");
      animation: ride 4.2s cubic-bezier(0.45, 0, 0.55, 1) 1;
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

  @keyframes ride {
    from {
      offset-distance: 0%;
      opacity: 1;
    }

    to {
      offset-distance: 100%;
      opacity: 1;
    }
  }

  @media (min-width: 900px) {
    .hero {
      grid-template-columns: 7fr 5fr;
      gap: 40px;
      padding-block: 44px 56px;
    }

    .hero__art {
      height: 470px;
    }

    .hero__phone {
      width: 200px;
    }
  }
</style>
