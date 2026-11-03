// Responsive images for the Svelte sections. Svelte components can't use
// Astro's <Picture>, so the page builds the sources with astro:assets here
// (AVIF and WebP at 1x to 3x of the width shown) and hands the components
// plain data to render as a <picture>.
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

export interface PictureData {
  /** The WebP fallback for <img src> */
  src: string;
  width: number;
  height: number;
  sizes: string;
  sources: { type: string; srcset: string }[];
}

/**
 * @param width the largest CSS width the image is shown at
 * @param height the CSS height for that width; defaults to the image's ratio
 * @param widths the candidate widths, when 1x to 3x of one width isn't enough
 */
export async function picture(
  image: ImageMetadata,
  {
    width,
    height,
    sizes,
    widths: chosen,
  }: { width: number; height?: number; sizes: string; widths?: number[] },
): Promise<PictureData> {
  const h = height ?? Math.round((width * image.height) / image.width);
  // 1x to 3x of the shown width, unless the layout needs its own set; never
  // wider than the capture itself
  const widths = (chosen ?? [width, width * 2, width * 3]).filter((w) => w <= image.width);
  const [avif, webp] = await Promise.all(
    (["avif", "webp"] as const).map((format) =>
      getImage({ src: image, format, widths, width, quality: 70 }),
    ),
  );
  if (!avif || !webp) throw new Error("getImage returned nothing");
  return {
    src: webp.src,
    width,
    height: h,
    sizes,
    sources: [
      { type: "image/avif", srcset: avif.srcSet.attribute },
      { type: "image/webp", srcset: webp.srcSet.attribute },
    ],
  };
}
