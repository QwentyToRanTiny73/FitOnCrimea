"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products as publishedProducts, type Product } from "@/data/catalog";
import { applyOverrides } from "@/data/catalog/sanitize";
import { catalogStore } from "@/services";
import { mergeProduct, type OverrideMap, type ProductOverride } from "@/services/catalog-store";

interface CatalogContextValue {
  /** Черновики правок администратора (в этом браузере). */
  overrides: OverrideMap;
  /** Все товары с черновиками, включая скрытые и новые. */
  allProducts: Product[];
  /** Товары на витрине. */
  products: Product[];
  setOverride: (slug: string, patch: ProductOverride) => void;
  clearOverride: (slug: string) => void;
  replaceAll: (map: OverrideMap) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<OverrideMap>({});

  useEffect(() => setOverrides(catalogStore.load()), []);

  const commit = useCallback((next: OverrideMap) => {
    const res = catalogStore.save(next);
    if (!res.ok) {
      throw new Error(
        res.reason === "quota"
          ? "Хранилище браузера переполнено. Опубликуйте или удалите часть фото."
          : "Браузер запрещает сохранять данные."
      );
    }
    setOverrides(next);
  }, []);

  const setOverride = useCallback(
    (slug: string, patch: ProductOverride) => commit({ ...overrides, [slug]: { ...overrides[slug], ...patch } }),
    [commit, overrides]
  );

  const clearOverride = useCallback(
    (slug: string) => {
      const { [slug]: _drop, ...rest } = overrides;
      void _drop;
      commit(rest);
    },
    [commit, overrides]
  );

  const allProducts = useMemo(() => applyOverrides(publishedProducts, overrides), [overrides]);
  const products = useMemo(() => allProducts.filter((p) => !p.hidden), [allProducts]);

  const value = useMemo<CatalogContextValue>(
    () => ({ overrides, allProducts, products, setOverride, clearOverride, replaceAll: commit }),
    [overrides, allProducts, products, setOverride, clearOverride, commit]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}

/** Товар с черновиками админа; на сервере и до гидрации — опубликованные данные. */
export function useProduct(base: Product): Product {
  const { overrides } = useCatalog();
  return mergeProduct(base, overrides[base.slug]);
}
