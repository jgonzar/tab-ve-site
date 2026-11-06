<script lang="ts">
  // The close: row 8 as the big line, with "three people" in an outlined
  // pill, the second "Try the demo", the sample-data note and the real icon.
  import DemoButton from "./DemoButton.svelte";
  import Picture from "./Picture.svelte";
  import type { PictureData } from "../../images";

  interface Props {
    line: string;
    /** The words inside the line to set in the pill */
    pill: string;
    cta: string;
    demo: string;
    note: string;
    icon: PictureData;
  }

  let { line, pill, cta, demo, note, icon }: Props = $props();

  // Each sentence starts its own line, in both languages: the first holds
  // the pill, the rest follows. Structure only; the words are row 8's.
  const end = $derived(line.indexOf(". ") + 1);
  const first = $derived(end > 0 ? line.slice(0, end) : line);
  const rest = $derived(end > 0 ? line.slice(end) : "");
  const at = $derived(first.indexOf(pill));
  const parts = $derived(
    at < 0 ? [first, "", ""] : [first.slice(0, at), pill, first.slice(at + pill.length)],
  );
</script>

<section class="closing dots">
  <div class="closing__icon">
    <Picture image={icon} alt="" />
  </div>
  <p class="closing__line">
    <span class="closing__sentence"
      >{parts[0]}{#if parts[1]}<span class="closing__pill">{parts[1]}</span>{/if}{parts[2]}</span
    >{#if rest}<span class="closing__sentence">{rest}</span>{/if}
  </p>
  <div class="closing__cta">
    <DemoButton href={demo} label={cta} />
  </div>
  <p class="closing__note">{note}</p>
</section>

<style>
  .closing {
    position: relative;
    isolation: isolate;
    margin-block: var(--space-1) var(--space-7-5);
    padding: var(--space-7) var(--space-5-5);
    overflow: hidden;
    border-radius: var(--radius-band);
    background: var(--soft);

    /* Dots strongest around the icon, fading toward the text, so the words
       stay clean; the pointer still clears and colours them (global.css) */
    --fade: radial-gradient(ellipse 60% 100% at 90% 70%, #000 10%, transparent 100%);
    --dot-alpha: 0.22;
  }

  .closing__icon {
    width: 56px;
    margin-bottom: var(--space-4);
  }

  .closing__icon :global(img) {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 16px;
  }

  .closing__line {
    margin: 0;
    max-width: 20ch;
    /* Two fixed steps, not a vw clamp: a vw size inherited into the pill
       could stay stale after a viewport change and render the pill smaller.
       Both are off the type scale, sized to the line's own measure */
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  .closing__sentence {
    display: block;
  }

  .closing__pill {
    /* In em, off the spacing scale: it grows with the line's two sizes */
    padding: 0 0.35em;
    border: 2px solid var(--ink);
    border-radius: 999px;
    white-space: nowrap;
  }

  .closing__cta {
    margin-top: var(--space-5-5);
  }

  .closing__note {
    margin: var(--space-3-5) 0 0;
    max-width: 60ch;
    text-wrap: pretty;
    color: var(--muted);
    font-size: var(--text-xs);
  }

  @media (min-width: 720px) {
    /* Each sentence is its own block, so this only lets each sit on one line:
       the Spanish ones are 25 and 30 characters */
    .closing__line {
      max-width: 32ch;
      font-size: 2.3rem;
    }

    .closing {
      margin-block: var(--space-1) var(--space-10);
      padding: var(--space-10) var(--space-11);
    }

    /* The icon sits in the band's corner, the line keeps the left */
    .closing__icon {
      position: absolute;
      right: var(--space-11);
      bottom: var(--space-10);
      width: 96px;
      margin: 0;
    }

    .closing__icon :global(img) {
      border-radius: 26px;
    }

    .closing__note {
      max-width: calc(100% - 140px);
    }
  }
</style>
