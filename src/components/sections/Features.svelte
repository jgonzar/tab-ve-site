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
    /** The two steps named under the receipt card's icons (copy rows 35 and 36) */
    steps: { share: string; paid: string };
    /** The screens for the first two cards, in order */
    screens: PictureData[];
    /** The receipt's lines; a rule drawn with box characters is hidden from screen readers */
    receipt: { text: string; rule: boolean }[];
  }

  let { heading, subheading, items, steps, screens, receipt }: Props = $props();

  // The coin that pops onto a card when it's hovered: the hero's two currencies
  const COINS = ["$", "Bs", "$"];

  // The receipt's own total line, read back for the big figure beside it:
  // "5 rides  •  Total: $34.50  (Bs 30,209.93)". No words of its own, so the
  // figure can only ever say what the receipt says
  const total = $derived.by(() => {
    const m = receipt.at(-1)?.text.match(/^(\d+ \S+)\s+•\s+Total:\s+(\$[\d.,]+)\s+\((.+)\)\s*$/);
    return m ? { rides: m[1], usd: m[2], bs: m[3] } : null;
  });

  // How far a receipt line hangs when it has to wrap: a numbered ride ("3. ")
  // hangs under its text, the lines beneath it keep their own indent. Classes,
  // not inline styles (the CSP)
  const hang = (text: string) => {
    const numbered = text.match(/^\d+\.\s/);
    return numbered ? numbered[0].length : text.length - text.trimStart().length;
  };

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
          {#if !screens[i] && total}
            <!-- Beside the tall paper: its total as a figure (decoration, the
                 receipt text holds every number) and the two steps the card
                 names, each an icon with its label as visible text, so the
                 accessible name is the visible one -->
            <div class="settle">
              <div class="settle__total" aria-hidden="true">
                <span class="settle__rides">{total.rides}</span>
                <span class="settle__usd">{total.usd}</span>
                <span class="settle__bs">{total.bs}</span>
              </div>
              <div class="settle__steps">
                <span class="settle__step">
                  <span class="settle__icon settle__icon--share">
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      ><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="6" r="2.6" /><circle
                        cx="18"
                        cy="18"
                        r="2.6"
                      /><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6" /></svg
                    >
                  </span>
                  <span class="settle__label">{steps.share}</span>
                </span>
                <svg
                  class="settle__trail"
                  viewBox="0 0 120 10"
                  width="120"
                  height="10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 5H118" stroke="#0b0a29" stroke-width="2" stroke-dasharray="7 7" />
                </svg>
                <span class="settle__step">
                  <span class="settle__icon settle__icon--paid">
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
                    >
                  </span>
                  <span class="settle__label">{steps.paid}</span>
                </span>
              </div>
            </div>
          {/if}
        </div>
        {#if screens[i]}
          <div class="card__shot">
            <Picture image={screens[i]} alt={item.alt} />
          </div>
        {:else}
          <!-- The full receipt, as real text on a paper strip that feeds out of a
               slot. Everything but the <pre> is decoration. Each line is its own
               block and wraps with a hanging indent where the paper is narrow,
               so nothing is cut off, nothing scrolls and nothing needs a tab
               stop; the group role gives the text its name -->
          <div class="receipt dots">
            <span class="receipt__slot" aria-hidden="true"></span>
            <div class="receipt__feed">
              <div class="receipt__sheet">
                <div class="receipt__paper">
                  <pre
                    class="card__receipt"
                    role="group"
                    aria-label={item.alt}>{#each receipt as line, n (n)}<span
                        class="receipt__line receipt__line--hang{hang(line.text)}"
                        class:receipt__line--rule={line.rule}
                        aria-hidden={line.rule ? "true" : undefined}>{line.text}</span
                      >{/each}</pre>
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

  /* A card: a 2px ink outline and a thick ink edge underneath. It arrives
     tilted as it scrolls in and, being no link, does nothing on hover but pop
     its coin and sweep its title */
  .card {
    position: relative;
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
    border-radius: 14px;
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

  /* Hides the paper above the slot while it feeds out. One track that can
     shrink: an auto track took the text's full width and the band clipped it */
  .receipt__feed {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    margin-top: -10px;
    clip-path: inset(0 -40px -60px -40px);
  }

  .receipt__sheet {
    position: relative;
    min-width: 0;
    width: min(100%, 430px);
    transform: rotate(-1.6deg);
    filter: drop-shadow(0 10px 16px rgb(11 10 41 / 0.2));
  }

  /* Torn top and bottom edges */
  .receipt__paper {
    padding: 28px 16px 26px;
    background: var(--thermal-paper);
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
    font: 0.65rem/1.5 var(--font-receipt);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .receipt__line {
    display: block;
    min-height: 1lh;
  }

  /* The box rules are decoration: they stay on one line and give way at the
     paper's edge rather than wrap */
  .receipt__line--rule {
    overflow: hidden;
    white-space: nowrap;
    overflow-wrap: normal;
  }

  /* A wrapped line hangs by as much as it starts with */
  .receipt__line--hang2 {
    padding-left: 2ch;
    text-indent: -2ch;
  }

  .receipt__line--hang3 {
    padding-left: 3ch;
    text-indent: -3ch;
  }

  .receipt__line--hang4 {
    padding-left: 4ch;
    text-indent: -4ch;
  }

  .receipt__line--hang5 {
    padding-left: 5ch;
    text-indent: -5ch;
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

  /* On a phone the first lines run the paper's full width: no tape over them */
  @media (max-width: 429px) {
    .receipt__tape {
      display: none;
    }
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
    /* The screen grows with the card instead of leaving a blank half */
    .card {
      grid-template-columns: minmax(22ch, 1fr) minmax(180px, 0.9fr);
    }

    /* The receipt's paper is too wide to sit beside the text until 960px */
    .card:nth-child(3) {
      grid-template-columns: 1fr;
    }

    .features__head {
      flex-direction: row;
    }
  }

  /* The paper is wider than a phone: 12.5px text from 760px */
  @media (min-width: 760px) {
    .features {
      padding-block: 12px 44px;
    }

    /* The section heading leads the card titles by more than a step */
    .features__title {
      font-size: 1.75rem;
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

    /* The copy starts at the top; under it the total and the two steps
       take the column the tall paper leaves */
    .card:nth-child(3) .card__copy {
      display: flex;
      flex-direction: column;
      align-self: start;
    }

    /* Copy, total and steps grouped at the top, 28px apart; the paper runs
       on alone below them */
    .card:nth-child(3) .settle {
      display: grid;
      gap: 28px;
      margin-top: 28px;
    }
  }

  /* Hidden on a phone, where the paper sits right under the text */
  .settle {
    display: none;
  }

  .settle__total {
    display: grid;
    gap: 2px;
    max-width: 360px;
    padding: 22px 24px 26px;
    border-radius: 16px;
    background: var(--ink);
    box-shadow: 0 6px 0 var(--violet);
    color: var(--on-ink);
  }

  .settle__rides,
  .settle__bs {
    color: var(--on-ink-muted);
    font-size: 0.875rem;
  }

  .settle__usd {
    color: var(--lime);
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .settle__steps {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  /* An icon over its label */
  .settle__step {
    display: grid;
    justify-items: center;
    gap: 8px;
    min-width: 0;
  }

  .settle__icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 2px solid var(--ink);
    border-radius: 50%;
  }

  .settle__icon--share {
    background: var(--lime);
    color: var(--ink);
  }

  .settle__icon--paid {
    background: var(--ink);
    color: var(--lime);
  }

  /* Ink on the white card: 19.27:1. One line where there is room; where the
     column is tight (Spanish beside a wide system mono) it wraps to two,
     centred under its icon, rather than spill out of the card */
  .settle__label {
    color: var(--ink);
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.3;
    text-align: center;
    text-wrap: balance;
  }

  /* Level with the icons' middle, the labels hanging below */
  .settle__trail {
    flex: 1 1 24px;
    min-width: 16px;
    max-width: 120px;
    height: 10px;
    margin-top: 23px;
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
      animation: sweep 0.55s cubic-bezier(0.22, 1, 0.36, 1);
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
