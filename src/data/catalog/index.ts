import { balms } from "./balms";
import publishedOverrides from "./overrides.json";
import type { Product, ProductCategory } from "./types";

export * from "./types";

const published = publishedOverrides as Record<string, Partial<Product>>;

/**
 * Единый список товаров. Новый тип продукции (мыло, бальзамы для губ)
 * добавляется отдельным файлом рядом с balms.ts и подключается сюда.
 *
 * overrides.json — правки, выгруженные из админки («Скачать JSON»)
 * и закоммиченные в репозиторий: так они попадают в сборку для всех.
 */
export const products: Product[] = [...balms].map((p) =>
  published[p.slug] ? { ...p, ...published[p.slug] } : p
);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  products.filter((p) => p.category === category);

export const hasOzonLink = (p: Pick<Product, "ozonUrl">): boolean =>
  Boolean(p.ozonUrl && /^https?:\/\//.test(p.ozonUrl));

/** Ручная подборка из pairsWith, дополненная товарами той же зоны применения. */
export const getRelated = (product: Product, limit = 4): Product[] => {
  const manual = (product.pairsWith ?? [])
    .map(getProductBySlug)
    .filter((p): p is Product => Boolean(p));
  const sameZone = products.filter(
    (p) =>
      p.slug !== product.slug &&
      p.subcategory === product.subcategory &&
      !manual.some((m) => m.slug === p.slug)
  );
  return [...manual, ...sameZone].slice(0, limit);
};
