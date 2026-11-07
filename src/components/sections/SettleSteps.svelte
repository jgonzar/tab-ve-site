<script lang="ts">
  // Beside the tall receipt paper: its total as a big figure and the two
  // steps the card names. The figure is decoration (the receipt text holds
  // every number); each step is an icon with its label as visible text, so
  // the accessible name is the visible one. Shown from 960px only, where the
  // paper sits beside the text.
  interface Props {
    /** The receipt's last line, its total */
    line: string | undefined;
    /** The two steps named under the icons (copy rows 35 and 36) */
    steps: { share: string; paid: string };
  }

  let { line, steps }: Props = $props();

  // The receipt's own total line, read back for the big figure:
  // "5 rides  •  Total: $34.50  (Bs 30,209.93)". No words of its own, so the
  // figure can only ever say what the receipt says
  const total = $derived.by(() => {
    const m = line?.match(/^(\d+ \S+)\s+•\s+Total:\s+(\$[\d.,]+)\s+\((.+)\)\s*$/);
    return m ? { rides: m[1], usd: m[2], bs: m[3] } : null;
  });
</script>

{#if total}
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
        <path d="M2 5H118" stroke="currentColor" stroke-width="2" stroke-dasharray="7 7" />
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

<style>
  /* Hidden on a phone, where the paper sits right under the text */
  .settle {
    display: none;
  }

  /* Copy, total and steps grouped at the top, 28px apart; the paper runs
     on alone below them. Only the receipt card renders this block */
  @media (min-width: 960px) {
    .settle {
      display: grid;
      gap: var(--space-7);
      margin-top: var(--space-7);
    }
  }

  .settle__total {
    display: grid;
    /* 2px, under the spacing scale: the figure's three lines read as one */
    gap: 2px;
    max-width: 360px;
    padding: var(--space-5-5) var(--space-6) var(--space-6-5);
    border-radius: var(--radius-tile);
    background: var(--ink);
    box-shadow: 0 var(--edge) 0 var(--violet);
    color: var(--on-ink);
  }

  .settle__rides,
  .settle__bs {
    color: var(--on-ink-muted);
    font-size: var(--text-xs);
  }

  .settle__usd {
    color: var(--lime);
    /* A figure, not text: its own size, above the type scale */
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .settle__steps {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2-5);
  }

  /* An icon over its label */
  .settle__step {
    display: grid;
    justify-items: center;
    gap: var(--space-2);
    min-width: 0;
  }

  .settle__icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 2px solid var(--ink);
    border-radius: var(--radius-round);
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
    font-size: var(--text-xs);
    font-weight: 700;
    line-height: 1.3;
    text-align: center;
    text-wrap: balance;
  }

  /* Level with the icons' middle, the labels hanging below */
  .settle__trail {
    color: var(--ink);
    flex: 1 1 24px;
    min-width: 16px;
    max-width: 120px;
    height: 10px;
    /* Geometry, not spacing: half the 56px icon less half the 10px trail */
    margin-top: 23px;
  }
</style>
