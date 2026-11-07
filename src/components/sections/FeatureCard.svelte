<script lang="ts">
  // One feature card: a highlighted title and its body, then the real thing.
  // A card with a screen shows it in a thick frame; one without shows what
  // the caller passes (the receipt). The card isn't a link: pointed at, it
  // pops its coin and sweeps its title.
  import type { Snippet } from "svelte";
  import Picture from "./Picture.svelte";
  import type { PictureData } from "../../images";

  interface Props {
    title: string;
    body: string;
    /** The screen's alt text */
    alt: string;
    /** The coin that pops onto the card's corner: "$" or "Bs" */
    coin: string;
    /** The app screen; without one the card shows `children` instead */
    screen?: PictureData;
    /** Under the body, in the copy column */
    extra?: Snippet;
    children?: Snippet;
  }

  let { title, body, alt, coin, screen, extra, children }: Props = $props();
</script>

<!-- A card without a screen holds the receipt and takes its wider layout -->
<li class="card" class:card--receipt={!screen}>
  <span class="card__coin" aria-hidden="true">{coin}</span>
  <div class="card__copy">
    <h3 class="card__title"><span class="hl">{title}</span></h3>
    <p class="card__body">{body}</p>
    {@render extra?.()}
  </div>
  {#if screen}
    <div class="card__shot">
      <Picture image={screen} {alt} />
    </div>
  {:else}
    {@render children?.()}
  {/if}
</li>

<style>
  /* A card: a 2px ink outline and a thick ink edge underneath. It arrives
     tilted as it scrolls in and, being no link, does nothing on hover but pop
     its coin and sweep its title */
  .card {
    position: relative;
    min-width: 0;
    display: grid;
    align-content: start;
    gap: var(--space-3-5);
    padding: var(--space-4-5);
    border: 2px solid var(--ink);
    border-radius: var(--radius-card);
    background: var(--paper);
    box-shadow: 0 var(--edge) 0 var(--ink);
  }

  .card:nth-child(2) {
    background: var(--ink);
    color: var(--on-ink);
  }

  .card__title {
    margin: 0;
    font-size: var(--text-lg);
    line-height: 1.35;
  }

  .card__body {
    margin: var(--space-2) 0 0;
    color: var(--muted);
    /* 14.4px, between two steps of the type scale: set for the card's measure */
    font-size: 0.9rem;
    line-height: 1.55;
    text-wrap: pretty;
  }

  .card:nth-child(2) .card__body {
    color: var(--on-ink-muted);
  }

  /* A real screen in a thick frame, cropped by ratio, not by height, so the
     same part shows at every width. Each crop starts and ends in empty space,
     never through a line of the app: the quick-ride card shows the whole modal
     from its tab to Cancel; the summary card runs from the summary bar to the
     gap under the first ride */
  .card__shot {
    align-self: start;
    overflow: hidden;
    border: 4px solid var(--ink);
    border-radius: var(--radius-inset);
    background: var(--ink);
  }

  .card:nth-child(2) .card__shot {
    border-color: var(--on-ink-frame);
  }

  .card__shot :global(img) {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .card:nth-child(1) .card__shot :global(img) {
    aspect-ratio: 1.318;
    object-position: center 50.3%;
  }

  .card:nth-child(2) .card__shot :global(img) {
    aspect-ratio: 1.0245;
    object-position: center 13.6%;
  }

  /* Text and its screen side by side inside each card from 600px */
  @media (min-width: 600px) {
    /* The screen grows with the card instead of leaving a blank half */
    .card {
      grid-template-columns: minmax(22ch, 1fr) minmax(180px, 0.9fr);
    }

    /* The receipt's paper is too wide to sit beside the text until 960px */
    .card--receipt {
      grid-template-columns: 1fr;
    }
  }

  /* The receipt card across both columns with its paper beside the text,
     from 960px; below that the paper sits under the text */
  @media (min-width: 960px) {
    .card--receipt {
      grid-column: 1 / 3;
      grid-template-columns: minmax(22ch, 0.8fr) minmax(0, 1.2fr);
    }

    /* The copy starts at the top; under it the total and the two steps
       take the column the tall paper leaves */
    .card--receipt .card__copy {
      display: flex;
      flex-direction: column;
      align-self: start;
    }
  }

  /* The coin: the hero's $ or Bs, popping onto the card's corner */
  .card__coin {
    position: absolute;
    top: -15px;
    right: 16px;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border: 2px solid var(--ink);
    border-radius: var(--radius-round);
    background: var(--lime);
    color: var(--ink);
    font-size: var(--text-2xs);
    font-weight: 700;
    line-height: 1;
    transform: scale(0) rotate(-40deg);
    transition: transform var(--dur-lg) var(--ease-out);
  }

  .card:nth-child(2) .card__coin {
    background: var(--violet);
    color: var(--on-ink);
  }

  /* What a card does when you point at it or tab to it: a coin pops on and
     the highlighter sweeps across the title. Nothing lifts, tilts or leans,
     since a card is no link. Hover only where there is hover: on a touch
     screen a tap would leave it stuck */
  @media (hover: hover) {
    .card:hover .card__coin,
    .card:focus-within .card__coin {
      transform: scale(1) rotate(0);
    }

    .card:hover .card__title .hl {
      animation: sweep var(--dur-2xl) var(--ease-out);
    }
  }

  /* Each card arrives at its own angle and settles straight as it scrolls
     into view. The individual rotate and translate properties, so it never
     fights the hover's transform. Scroll-driven, so the visitor sets the
     pace; without support, or under reduced motion, the cards just sit */
  @keyframes settle {
    from {
      rotate: var(--tilt, 3deg);
      translate: 0 44px;
    }

    to {
      rotate: 0deg;
      translate: 0 0;
    }
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .card {
        animation: settle linear both;
        animation-timeline: view();
        animation-range: entry 0% entry 85%;
      }

      .card:nth-child(1) {
        --tilt: -3.5deg;
      }

      .card:nth-child(2) {
        --tilt: 3deg;
      }

      /* The receipt card leans as its paper does, wherever it sits: the
         doubled class matches the positional rules above and comes later */
      .card.card--receipt {
        --tilt: -1.6deg;
      }
    }
  }
</style>
