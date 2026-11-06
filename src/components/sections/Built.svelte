<script lang="ts">
  // How it's built: the stack, once, on a navy band at the end.
  interface Props {
    heading: string;
    subheading: string;
    chips: string[];
  }

  let { heading, subheading, chips }: Props = $props();
</script>

<section class="built" aria-labelledby="built-title">
  <div>
    <h2 id="built-title" class="built__title"><span class="hl">{heading}</span></h2>
    <p class="built__sub">{subheading}</p>
  </div>
  <ul class="built__chips">
    {#each chips as chip (chip)}
      <li class="chip">{chip}</li>
    {/each}
  </ul>
</section>

<style>
  .built {
    margin-block: var(--space-1) var(--space-7-5);
    padding: var(--space-6) var(--space-5-5);
    border-radius: var(--radius-band);
    background: var(--ink);
    color: var(--on-ink);
  }

  .built__title {
    margin: 0;
    font-size: var(--text-xl);
    line-height: 1.3;
  }

  .built__sub {
    margin: var(--space-2) 0 var(--space-4);
    color: var(--on-ink-muted);
    font-size: var(--text-xs);
  }

  .built__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .chip {
    padding: var(--space-1-5) var(--space-3);
    border: 1.5px solid var(--on-ink-line);
    border-radius: var(--radius-pill);
    font-size: var(--text-2xs);
  }

  @media (min-width: 720px) {
    .built {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      align-items: center;
      gap: var(--space-6);
      margin-bottom: var(--space-10);
      padding: var(--space-8) var(--space-9);
    }

    .built__sub {
      margin-bottom: 0;
    }
  }
</style>
