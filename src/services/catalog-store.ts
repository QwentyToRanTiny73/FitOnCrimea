import { sanitizeOverrideMap } from "@/data/catalog/sanitize";
import type { OverrideMap, Product, ProductOverride } from "@/data/catalog/types";
import { readJSON, writeJSON, type WriteResult } from "./storage";

export type { OverrideMap, ProductOverride };

/**
 * Черновики правок из админки. Хранятся в браузере администратора,
 * пока их не опубликуют (services/publisher.ts) или не сбросят.
 */
export interface CatalogStore {
  readonly mode: "local-demo" | "remote";
  load(): OverrideMap;
  save(map: OverrideMap): WriteResult;
}

export const localCatalogStore: CatalogStore = {
  mode: "local-demo",
  load: () => sanitizeOverrideMap(readJSON<unknown>("overrides", {})),
  save: (map) => writeJSON("overrides", map),
};

export const mergeProduct = (base: Product, patch?: ProductOverride): Product =>
  patch ? { ...base, ...patch } : base;
