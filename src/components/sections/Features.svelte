<script lang="ts">
  // What it does: three cards, white, navy, then white and wide. Each pairs a
  // highlighted title with the real thing: two app screens, then the full
  // shared receipt as text. The cards aren't links.
  import FeatureCard from "./FeatureCard.svelte";
  import ReceiptCard from "./ReceiptCard.svelte";
  import SettleSteps from "./SettleSteps.svelte";
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
</script>

<section class="features" aria-labelledby="features-title">
  <div class="features__head">
    <h2 id="features-title" class="features__title"><span class="hl">{heading}</span></h2>
    <p class="features__sub">{subheading}</p>
  </div>

  <ul class="features__cards">
    {#each items as item, i (item.title)}
      <!-- A card without a screen holds the receipt, with its total and the
           two steps beside the tall paper -->
      <FeatureCard
        title={item.title}
        body={item.body}
        alt={item.alt}
        coin={COINS[i]}
        screen={screens[i]}
      >
        {#snippet extra()}
          {#if !screens[i]}
            <SettleSteps line={receipt.at(-1)?.text} {steps} />
          {/if}
        {/snippet}
        <ReceiptCard {receipt} label={item.alt} />
      </FeatureCard>
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

  @media (min-width: 600px) {
    .features__head {
      flex-direction: row;
    }
  }

  @media (min-width: 760px) {
    .features {
      padding-block: 12px 44px;
    }

    /* The section heading leads the card titles by more than a step */
    .features__title {
      font-size: 1.75rem;
    }
  }

  /* Two cards to a row from 960px (the receipt card spans both) */
  @media (min-width: 960px) {
    .features__cards {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
