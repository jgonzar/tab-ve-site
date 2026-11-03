<script lang="ts">
  // What it does: three cards, white, navy, then white and wide. Each pairs a
  // highlighted title with the real thing: two app screens, then the full
  // shared receipt as text. The cards aren't links.
  import Picture from "./Picture.svelte";
  import type { PictureData } from "../../images";

  interface Item {
    title: string;
    body: string;
    alt: string;
  }

  interface Props {
    heading: string;
    subheading: string;
    items: Item[];
    /** The screens for the first two cards, in order */
    screens: PictureData[];
    /** The receipt's lines; a rule drawn with box characters is hidden from screen readers */
    receipt: { text: string; rule: boolean }[];
  }

  let { heading, subheading, items, screens, receipt }: Props = $props();

  // The coin that pops onto a card when it's hovered: the hero's two currencies
  const COINS = ["$", "Bs", "$"];

  // Between the receipt's lines, inside the <pre>
  const NEWLINE = "\n";

  // The paper's foot carries a barcode, drawn once from fixed bar widths. It
  // is decoration only: no data, hidden from screen readers
  const BARS = (() => {
    const widths = [
      2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 3, 2, 1,
      2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 1, 2, 3, 1, 2, 1, 2, 2, 1, 1, 3, 1, 2,
    ];
    const bars: { x: number; w: number }[] = [];
    let x = 0;
    widths.forEach((w, i) => {
      if (i % 2 === 0 && x < 148) bars.push({ x, w });
      x += w;
    });
    return bars;
  })();
</script>

<section class="features" aria-labelledby="features-title">
  <div class="features__head">
    <h2 id="features-title" class="features__title"><span class="hl">{heading}</span></h2>
    <p class="features__sub">{subheading}</p>
  </div>

  <ul class="features__cards">
    {#each items as item, i (item.title)}
      <li class="card">
        <span class="card__coin" aria-hidden="true">{COINS[i]}</span>
        <div class="card__copy">
          <h3 class="card__title"><span class="hl">{item.title}</span></h3>
          <p class="card__body">{item.body}</p>
        </div>
        {#if screens[i]}
          <div class="card__shot">
            <Picture image={screens[i]} alt={item.alt} />
          </div>
        {:else}
          <!-- The full receipt, as real text on a paper strip that feeds out of a
               slot. Everything but the <pre> is decoration. The text scrolls
               sideways on its own if a narrow phone ever needs it, so it can
               take focus -->
          <div class="receipt dots">
            <span class="receipt__slot" aria-hidden="true"></span>
            <div class="receipt__feed">
              <div class="receipt__sheet">
                <div class="receipt__paper">
                  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                  <pre
                    class="card__receipt"
                    tabindex="0"
                    aria-label={item.alt}>{#each receipt as line, n (n)}{#if line.rule}<span
                          aria-hidden="true">{line.text}</span
                        >{:else}{line.text}{/if}{#if n < receipt.length - 1}{NEWLINE}{/if}{/each}</pre>
                  <svg
                    class="receipt__barcode"
                    viewBox="0 0 150 34"
                    width="150"
                    height="34"
                    aria-hidden="true"
                  >
                    {#each BARS as bar (bar.x)}
                      <rect x={bar.x} y="0" width={bar.w} height="34" />
                    {/each}
                  </svg>
                </div>
                <span class="receipt__tape" aria-hidden="true"></span>
              </div>
            </div>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style>
  .features {
    padding-block: 8px 32px;
  }

  /* Stacked on a phone; the subtitle beside the title from 600px */
  .features__head {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 14px;
    margin-bottom: 20px;
  }

  .features__title {
    margin: 0;
    font-size: 1.375rem;
    line-height: 1.3;
  }

  .features__sub {
    margin: 0;
    color: var(--muted);
    font-size: 0.875rem;
  }

  .features__cards {
    display: grid;
    gap: 22px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* A card: a 2px ink outline and a thick ink edge underneath. It lifts and
     tilts when hovered or focused, and arrives tilted as it scrolls in */
  .card {
    position: relative;
    transition:
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    min-width: 0;
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 18px;
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
    font-size: 1.125rem;
    line-height: 1.35;
  }

  .card__body {
    margin: 8px 0 0;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.55;
  }

  .card:nth-child(2) .card__body {
    color: var(--on-ink-muted);
  }

  /* A real screen, cropped to its top, in a thick frame */
  .card__shot {
    align-self: start;
    overflow: hidden;
    border: 4px solid var(--ink);
    border-radius: 14px;
    background: var(--ink);
  }

  .card:nth-child(2) .card__shot {
    border-color: var(--on-ink-frame);
  }

  .card__shot :global(img) {
    display: block;
    width: 100%;
    height: 220px;
    object-fit: cover;
    object-position: top;
  }

  /* Each crop ends in empty space, never through a line of the app:
     the quick-ride card shows the whole modal, Cancel included; the
     summary card ends in the gap under the summary bar */
  .card:nth-child(1) .card__shot :global(img) {
    height: 250px;
    object-position: center 48.5%;
  }

  .card:nth-child(2) .card__shot :global(img) {
    height: 182px;
  }

  /* The receipt: a thermal-paper strip on a dotted band, fed out of a slot.
     The text stays real and selectable; the paper is only its container */
  .receipt {
    position: relative;
    min-width: 0;
    padding: 18px 14px 34px;
    overflow: clip;
    border-radius: 14px;
    background-color: var(--soft);
    --dot-alpha: 0.24;
  }

  /* The printer slot: navy with the violet edge, like the main button */
  .receipt__slot {
    position: relative;
    z-index: 2;
    display: block;
    width: min(100%, 470px);
    height: 24px;
    margin-inline: auto;
    border-radius: 12px;
    background: var(--ink);
    box-shadow: 0 5px 0 var(--violet);
  }

  /* Hides the paper above the slot while it feeds out */
  .receipt__feed {
    display: grid;
    justify-items: center;
    margin-top: -10px;
    clip-path: inset(0 -40px -60px -40px);
  }

  .receipt__sheet {
    position: relative;
    width: min(100%, 430px);
    transform: rotate(-1.6deg);
    filter: drop-shadow(0 10px 16px rgb(11 10 41 / 0.2));
  }

  /* Torn top and bottom edges */
  .receipt__paper {
    padding: 28px 16px 26px;
    background: #fffef8;
    color: var(--ink);
    -webkit-mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% 100% / 12px 51%
        repeat-x,
      conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% 0 / 12px 51%
        repeat-x;
    mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% 100% / 12px 51%
        repeat-x,
      conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% 0 / 12px 51%
        repeat-x;
  }

  .card__receipt {
    margin: 0;
    overflow-x: auto;
    font: 0.65rem/1.5 var(--font-receipt);
    white-space: pre;
  }

  .receipt__barcode {
    display: block;
    margin: 12px auto 0;
    fill: var(--ink);
  }

  /* A strip of the highlighter, taping the paper at its corner */
  .receipt__tape {
    position: absolute;
    top: 44px;
    right: -18px;
    width: 86px;
    height: 26px;
    border-radius: 3px;
    background: var(--lime);
    opacity: 0.92;
    transform: rotate(38deg);
  }

  /* The paper feeds out as the card scrolls into view: scroll-driven, so the
     visitor sets the pace and nothing runs on its own. Without support, or
     under reduced motion, the paper is simply there */
  @keyframes feed {
    from {
      transform: translateY(-100%) rotate(-1.6deg);
    }

    to {
      transform: translateY(0) rotate(-1.6deg);
    }
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .receipt__feed {
        view-timeline: --receipt block;
      }

      .receipt__sheet {
        animation: feed linear both;
        animation-timeline: --receipt;
        animation-range: entry 15% entry 100%;
      }
    }
  }

  /* Text and its screen side by side inside each card from 600px */
  @media (min-width: 600px) {
    .card {
      grid-template-columns: minmax(22ch, 1fr) 180px;
    }

    .features__head {
      flex-direction: row;
    }

    .card:nth-child(n) .card__shot :global(img) {
      height: 250px;
    }

    /* Beside the text the screen is narrower: the crop starts below the
       route chips, inside the summary bar, and ends after the modal, before
       the next ride's button */
    .card:nth-child(1) .card__shot :global(img) {
      height: 232px;
      object-position: center 43%;
    }
  }

  /* The paper is wider than a phone: 12.5px text from 760px */
  @media (min-width: 760px) {
    .features {
      padding-block: 12px 44px;
    }

    .card__receipt {
      font-size: 0.78125rem;
    }

    .receipt {
      padding-inline: 20px;
    }

    .receipt__paper {
      padding-inline: 22px;
    }
  }

  /* Two cards to a row, the receipt card across both with its paper beside
     the text, from 960px; below that the paper sits under the text */
  @media (min-width: 960px) {
    .features__cards {
      grid-template-columns: 1fr 1fr;
    }

    .card:nth-child(3) {
      grid-column: 1 / 3;
      grid-template-columns: minmax(22ch, 0.8fr) minmax(0, 1.2fr);
    }

    /* Beside the tall paper the copy sits level with its middle, not
       stranded at the top above a blank column */
    .card:nth-child(3) .card__copy {
      align-self: center;
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
    border-radius: 50%;
    background: var(--lime);
    color: var(--ink);
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1;
    transform: scale(0) rotate(-40deg);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .card:nth-child(2) .card__coin {
    background: var(--violet);
    color: var(--on-ink);
  }

  /* What a card does when you point at it or tab to it. Hover only where
     there is hover: on a touch screen a tap would leave it stuck */
  @media (hover: hover) {
    .card:hover,
    .card:focus-within {
      transform: translateY(-7px) rotate(-0.7deg);
      box-shadow: 0 13px 0 var(--ink);
    }

    .card:nth-child(2):hover,
    .card:nth-child(2):focus-within {
      box-shadow: 0 13px 0 var(--violet);
    }

    .card:hover .card__coin,
    .card:focus-within .card__coin {
      transform: scale(1) rotate(0);
    }

    /* The highlighter sweeps across the title again */
    .card:hover .card__title .hl {
      animation: sweep 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .card__shot {
      transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .card:hover .card__shot {
      transform: translateY(-5px) rotate(2.2deg) scale(1.05);
    }
  }

  @keyframes sweep {
    from {
      background-size: 0% 100%;
    }

    to {
      background-size: 100% 100%;
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

      .card:nth-child(3) {
        --tilt: -1.6deg;
      }
    }
  }
</style>
