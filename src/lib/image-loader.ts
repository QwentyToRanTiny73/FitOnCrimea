import { IMAGE_WIDTHS } from "./image-widths.mjs";

/**
 * Загрузчик next/image для статического сайта: вместо оригинала отдаёт
 * уменьшенную копию из /_img/ (их делает scripts/optimize-images.mjs).
 * data:-картинки черновиков, внешние адреса и прочие файлы — как есть.
 */
const LOCAL = /^\/(?:products|design|brochure)\/.+\.(?:webp|jpe?g|png)$|^\/massage-points\.jpg$/i;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  if (/^(?:data:|blob:|https?:)/.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = base && src.startsWith(`${base}/`) ? src.slice(base.length) : src;
  if (!LOCAL.test(path)) return src;
  const w = IMAGE_WIDTHS.find((x) => x >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `${base}/_img${path.replace(/\.(?:webp|jpe?g|png)$/i, "")}-${w}.webp`;
}
