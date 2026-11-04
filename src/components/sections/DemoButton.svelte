<script lang="ts">
  // "Try the demo": navy, with a thick violet edge underneath that presses in
  // when it's clicked, and a lime arrow circle. The page has exactly two.
  interface Props {
    href: string;
    label: string;
  }

  let { href, label }: Props = $props();
</script>

<a class="demo" {href} rel="noopener noreferrer">
  <span>{label}</span>
  <span class="demo__arrow" aria-hidden="true">
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0b0a29"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  </span>
</a>

<style>
  .demo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 50px;
    padding: 0 16px 0 20px;
    border-radius: var(--radius-control);
    background: var(--ink);
    color: var(--on-ink);
    font-size: 0.9375rem;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 5px 0 var(--violet);
    transition:
      transform 120ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 120ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .demo:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 0 var(--violet);
  }

  /* The ring clears the pressed edge instead of merging with it */
  .demo:focus-visible {
    outline-offset: 9px;
  }

  /* The press: the button sinks onto its edge */
  .demo:active {
    transform: translateY(5px);
    box-shadow: 0 0 0 var(--violet);
  }

  .demo__arrow {
    display: inline-grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: var(--lime);
    transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* The arrow circle nudges up and turns a quarter */
  .demo:hover .demo__arrow {
    transform: translate(3px, -3px) rotate(45deg);
  }
</style>
