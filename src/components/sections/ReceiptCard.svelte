<script lang="ts">
  // The full shared receipt, as real text on a thermal-paper strip that feeds
  // out of a printer slot, with a barcode at its foot and a strip of tape.
  interface Props {
    /** The receipt's lines; a rule drawn with box characters is hidden from screen readers */
    receipt: { text: string; rule: boolean }[];
    /** The receipt's accessible name */
    label: string;
  }

  let { receipt, label }: Props = $props();

  // A price's "(Bs 5,253.90)" stays whole when its line wraps: split the line
  // around it and keep that part on one line. The text itself is untouched
  const pieces = (text: string) =>
    text
      .split(/(\(Bs\.?\s[^)]*\))/)
      .filter(Boolean)
      .map((t) => ({ t, whole: /^\(Bs/.test(t) }));

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

<!-- Everything but the <pre> is decoration. Each line is its own block and
     wraps with a hanging indent where the paper is narrow, so nothing is cut
     off, nothing scrolls and nothing needs a tab stop; the group role gives
     the text its name -->
<div class="receipt dots">
  <span class="receipt__slot" aria-hidden="true"></span>
  <div class="receipt__feed">
    <div class="receipt__sheet">
      <div class="receipt__paper">
        <pre
          class="card__receipt"
          role="group"
          aria-label={label}>{#each receipt as line, n (n)}<span
              class="receipt__line receipt__line--hang{hang(line.text)}"
              class:receipt__line--rule={line.rule}
              aria-hidden={line.rule ? "true" : undefined}
              >{#each pieces(line.text) as piece, k (k)}{#if piece.whole}<span
                    class="receipt__whole">{piece.t}</span
                  >{:else}{piece.t}{/if}{/each}</span
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

<style>
  /* The receipt: a thermal-paper strip on a dotted band, fed out of a slot.
     The text stays real and selectable; the paper is only its container */
  .receipt {
    position: relative;
    min-width: 0;
    /* 34px, off the spacing scale: the band's foot under the tilted paper */
    padding: var(--space-4-5) var(--space-3-5) 34px;
    overflow: clip;
    border-radius: var(--radius-inset);
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
    border-radius: var(--radius-slot);
    background: var(--ink);
    box-shadow: 0 var(--edge-press) 0 var(--violet);
  }

  /* Hides the paper above the slot while it feeds out. One track that can
     shrink: an auto track took the text's full width and the band clipped it */
  .receipt__feed {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    /* An overlap, not a gap: the paper starts under the slot's lower edge */
    margin-top: -10px;
    clip-path: inset(0 -40px -60px -40px);
  }

  .receipt__sheet {
    position: relative;
    min-width: 0;
    width: min(100%, 430px);
    transform: rotate(-1.6deg);
    filter: drop-shadow(var(--shadow-paper));
  }

  /* Torn top and bottom edges */
  .receipt__paper {
    padding: var(--space-7) var(--space-4) var(--space-6-5);
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

  /* The receipt's two text sizes are off the type scale: they are set by
     how many mono characters a line of the paper must hold */
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

  .receipt__whole {
    white-space: nowrap;
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
    margin: var(--space-3) auto 0;
    fill: var(--ink);
  }

  /* A strip of the highlighter, taping the paper at its corner */
  .receipt__tape {
    position: absolute;
    top: 44px;
    right: -18px;
    width: 86px;
    height: 26px;
    border-radius: var(--radius-tape);
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

  /* The paper is wider than a phone: 12.5px text from 760px */
  @media (min-width: 760px) {
    .card__receipt {
      font-size: 0.78125rem;
    }

    .receipt {
      padding-inline: var(--space-5);
    }

    .receipt__paper {
      padding-inline: var(--space-5-5);
    }
  }
</style>
