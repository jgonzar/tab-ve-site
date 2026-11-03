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

  // Between the receipt's lines, inside the <pre>
  const NEWLINE = "\n";
</script>

<section class="features" aria-labelledby="features-title">
  <div class="features__head">
    <h2 id="features-title" class="features__title"><span class="hl">{heading}</span></h2>
    <p class="features__sub">{subheading}</p>
  </div>

  <ul class="features__cards">
    {#each items as item, i (item.title)}
      <li class="card">
        <div class="card__copy">
          <h3 class="card__title"><span class="hl">{item.title}</span></h3>
          <p class="card__body">{item.body}</p>
        </div>
        {#if screens[i]}
          <div class="card__shot">
            <Picture image={screens[i]} alt={item.alt} />
          </div>
        {:else}
          <!-- The full receipt, as real text. It scrolls sideways on its own
               if a narrow phone ever needs it, so it can take focus -->
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <pre
            class="card__receipt"
            tabindex="0"
            aria-label={item.alt}>{#each receipt as line, n (n)}{#if line.rule}<span
                  aria-hidden="true">{line.text}</span
                >{:else}{line.text}{/if}{#if n < receipt.length - 1}{NEWLINE}{/if}{/each}</pre>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style>
  .features {
    padding-block: 8px 32px;
  }

  .features__head {
    display: flex;
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

  /* A card: a 2px ink outline and a thick ink edge underneath */
  .card {
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

  /* The quick-ride card sits mid-screen */
  .card:nth-child(1) .card__shot :global(img) {
    object-position: center 46%;
  }

  .card__receipt {
    margin: 0;
    padding: 14px 16px;
    overflow-x: auto;
    border-radius: 12px;
    background: var(--soft);
    color: var(--ink);
    font: 0.65rem/1.55 var(--font-receipt);
    white-space: pre;
  }

  /* Text and its screen side by side inside each card from 600px */
  @media (min-width: 600px) {
    .card {
      grid-template-columns: minmax(22ch, 1fr) 180px;
    }

    .card__shot :global(img) {
      height: 250px;
    }
  }

  /* The receipt beside its text once both fit: about 640px of card */
  @media (min-width: 760px) {
    .features {
      padding-block: 12px 44px;
    }

    .card:nth-child(3) {
      grid-template-columns: minmax(22ch, 0.8fr) minmax(0, 1.2fr);
    }

    .card__receipt {
      font-size: 0.78125rem;
    }
  }

  /* Two cards to a row, the receipt card across both, from 960px */
  @media (min-width: 960px) {
    .features__cards {
      grid-template-columns: 1fr 1fr;
    }

    .card:nth-child(3) {
      grid-column: 1 / 3;
    }
  }
</style>
