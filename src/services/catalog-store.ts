import type { Product } from "@/data/catalog/types";
import { readJSON, writeJSON, type WriteResult } from "./storage";

export type ProductOverride = Partial<
  Pick<
    Product,
    | "name"
    | "tagline"
    | "price"
    | "badges"
    | "shortDescription"
    | "effect"
    | "composition"
    | "application"
    | "contraindications"
    | "ozonUrl"
    | "images"
  >
>;

export type OverrideMap = Record<string, ProductOverride>;

/**
 * Хранилище правок каталога из админки. Сейчас — localStorage браузера
 * администратора. Замена на CMS/базу: новая реализация того же контракта.
 */
export interface CatalogStore {
  readonly mode: "local-demo" | "remote";
  load(): OverrideMap;
  save(map: OverrideMap): WriteResult;
}

export const localCatalogStore: CatalogStore = {
  mode: "local-demo",
  load: () => readJSON<OverrideMap>("overrides", {}),
  save: (map) => writeJSON("overrides", map),
};

export const mergeProduct = (base: Product, patch?: ProductOverride): Product =>
  patch ? { ...base, ...patch } : base;
