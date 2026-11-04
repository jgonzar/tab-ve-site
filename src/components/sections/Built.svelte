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
    margin-block: 4px 30px;
    padding: 24px 22px;
    border-radius: var(--radius-band);
    background: var(--ink);
    color: var(--on-ink);
  }

  .built__title {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.3;
  }

  .built__sub {
    margin: 8px 0 16px;
    color: var(--on-ink-muted);
    font-size: 0.875rem;
  }

  .built__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .chip {
    padding: 6px 12px;
    border: 1.5px solid var(--on-ink-line);
    border-radius: 999px;
    font-size: 0.8125rem;
  }

  @media (min-width: 720px) {
    .built {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      align-items: center;
      gap: 24px;
      margin-bottom: 40px;
      padding: 32px 36px;
    }

    .built__sub {
      margin-bottom: 0;
    }
  }
</style>
