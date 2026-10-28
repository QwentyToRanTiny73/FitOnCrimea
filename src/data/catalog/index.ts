import { balms } from "./balms";
import publishedOverrides from "./overrides.json";
import { applyOverrides, sanitizeOverrideMap } from "./sanitize";
import type { Product, ProductCategory } from "./types";

export * from "./types";

/** Базовые товары из кода. Мыло и бальзамы для губ — отдельными файлами рядом с balms.ts. */
export const baseProducts: Product[] = [...balms];

/**
 * overrides.json — правки, опубликованные из админки (кнопкой «Опубликовать»
 * или вручную). Попадают в сборку для всех посетителей.
 */
export const publishedMap = sanitizeOverrideMap(publishedOverrides as unknown);

/** Все товары, включая снятые с витрины (для админки и страниц товаров). */
export const products: Product[] = applyOverrides(baseProducts, publishedMap);

/** Товары на витрине. */
export const visibleProducts = (list: Product[] = products): Product[] => list.filter((p) => !p.hidden);

export const getProductBySlug = (slug: string, list: Product[] = products): Product | undefined =>
  list.find((p) => p.slug === slug);

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  visibleProducts().filter((p) => p.category === category);

export const hasOzonLink = (p: Pick<Product, "ozonUrl">): boolean =>
  Boolean(p.ozonUrl && /^https?:\/\//.test(p.ozonUrl));

export const productSubtitle = (p: Pick<Product, "subtitle" | "name">): string =>
  p.subtitle?.trim() || `Крымский бальзам «${p.name}»`;

/** Ручная подборка из pairsWith, дополненная товарами той же зоны применения. */
export const getRelated = (product: Product, limit = 4): Product[] => {
  const shown = visibleProducts();
  const manual = (product.pairsWith ?? [])
    .map((slug) => getProductBySlug(slug, shown))
    .filter((p): p is Product => Boolean(p));
  const sameZone = shown.filter(
    (p) => p.slug !== product.slug && p.subcategory === product.subcategory && !manual.some((m) => m.slug === p.slug)
  );
  return [...manual, ...sameZone].slice(0, limit);
};
