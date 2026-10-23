import type { MetadataRoute } from "next";
import { visibleProducts } from "@/data/catalog";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

// Служебные разделы (кабинет, избранное, админка) в карту не включаются.
const PAGES: Array<[path: string, priority: number]> = [
  ["/", 1],
  ["/catalog/", 0.9],
  ["/massage-points/", 0.7],
  ["/about/", 0.6],
  ["/faq/", 0.6],
  ["/contacts/", 0.5],
  ["/privacy/", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(([path, priority]) => ({ url: absoluteUrl(path), priority })),
    ...visibleProducts().map((p) => ({ url: absoluteUrl(`/catalog/${p.slug}/`), priority: 0.8 })),
  ];
}
