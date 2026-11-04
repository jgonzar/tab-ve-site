<script lang="ts">
  // A <picture> from the sources src/images.ts built, with explicit
  // dimensions so nothing shifts while it loads.
  import type { PictureData } from "../../images";

  interface Props {
    image: PictureData;
    alt: string;
    priority?: boolean;
    /** Fetched early and quietly, for an image not shown yet (see the landing page) */
    warm?: boolean;
    class?: string;
  }

  let { image, alt, priority = false, warm = false, class: className = "" }: Props = $props();
</script>

<picture>
  {#each image.sources as source (source.type)}
    <source type={source.type} srcset={source.srcset} sizes={image.sizes} />
  {/each}
  <img
    class={className}
    src={image.src}
    {alt}
    width={image.width}
    height={image.height}
    loading={priority || warm ? "eager" : "lazy"}
    decoding={priority ? "sync" : "async"}
    fetchpriority={priority ? "high" : warm ? "low" : "auto"}
  />
</picture>
