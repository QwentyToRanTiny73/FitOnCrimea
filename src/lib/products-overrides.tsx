"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products as baseProducts, type Product } from "@/data/products";

const STORAGE_KEY = "phyton-crimea:overrides";

export type ProductOverride = Partial<
  Pick<
    Product,
    | "name"
    | "tagline"
    | "price"
    | "shortDescription"
    | "effect"
    | "composition"
    | "application"
    | "contraindications"
    | "ozonUrl"
    | "images"
  >
>;

type OverrideMap = Record<string, ProductOverride>;

interface OverridesContextValue {
  overrides: OverrideMap;
  loading: boolean;
  setOverride: (slug: string, patch: ProductOverride) => void;
  clearOverride: (slug: string) => void;
  resetAll: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

const OverridesContext = createContext<OverridesContextValue | null>(null);

function read(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OverrideMap) : {};
  } catch {
    return {};
  }
}

function write(map: OverrideMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      throw new Error(
        "Превышен лимит браузерного хранилища. Удалите часть изображений или сожмите их."
      );
    }
    throw err;
  }
}

export function ProductOverridesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOverrides(read());
    setLoading(false);
  }, []);

  const setOverride = useCallback((slug: string, patch: ProductOverride) => {
    setOverrides((prev) => {
      const next: OverrideMap = {
        ...prev,
        [slug]: { ...(prev[slug] ?? {}), ...patch },
      };
      write(next);
      return next;
    });
  }, []);

  const clearOverride = useCallback((slug: string) => {
    setOverrides((prev) => {
      const { [slug]: _drop, ...rest } = prev;
      void _drop;
      write(rest);
      return rest;
    });
  }, []);

  const resetAll = useCallback(() => {
    write({});
    setOverrides({});
  }, []);

  const exportJSON = useCallback(() => JSON.stringify(overrides, null, 2), [
    overrides,
  ]);

  const importJSON = useCallback((json: string) => {
    const parsed = JSON.parse(json) as OverrideMap;
    write(parsed);
    setOverrides(parsed);
  }, []);

  const value = useMemo<OverridesContextValue>(
    () => ({
      overrides,
      loading,
      setOverride,
      clearOverride,
      resetAll,
      exportJSON,
      importJSON,
    }),
    [overrides, loading, setOverride, clearOverride, resetAll, exportJSON, importJSON]
  );

  return (
    <OverridesContext.Provider value={value}>
      {children}
    </OverridesContext.Provider>
  );
}

export function useOverrides(): OverridesContextValue {
  const ctx = useContext(OverridesContext);
  if (!ctx)
    throw new Error("useOverrides must be used inside <ProductOverridesProvider>");
  return ctx;
}

export function mergeProduct(
  base: Product,
  override?: ProductOverride
): Product {
  if (!override) return base;
  return { ...base, ...override };
}

export function useProduct(slug: string): Product | undefined {
  const { overrides } = useOverrides();
  return useMemo(() => {
    const base = baseProducts.find((p) => p.slug === slug);
    if (!base) return undefined;
    return mergeProduct(base, overrides[slug]);
  }, [slug, overrides]);
}

export function useProducts(): Product[] {
  const { overrides } = useOverrides();
  return useMemo(
    () => baseProducts.map((p) => mergeProduct(p, overrides[p.slug])),
    [overrides]
  );
}
