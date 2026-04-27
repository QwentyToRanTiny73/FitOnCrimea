"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import {
  products,
  type ProductSubcategory,
  SUBCATEGORY_LABELS,
} from "@/data/products";

type FilterValue = ProductSubcategory | "all";

const VALID_CATEGORIES: FilterValue[] = [
  "all",
  "face",
  "body",
  "hair",
  "joints",
  "respiratory",
  "repellent",
  "other",
];

function CatalogContent() {
  const params = useSearchParams();
  const initial = useMemo<FilterValue>(() => {
    const raw = params.get("cat");
    if (!raw) return "all";
    return (VALID_CATEGORIES as string[]).includes(raw)
      ? (raw as FilterValue)
      : "all";
  }, [params]);

  const [active, setActive] = useState<FilterValue>(initial);

  useEffect(() => {
    setActive(initial);
  }, [initial]);

  const counts = useMemo(() => {
    const result: Record<FilterValue, number> = {
      all: products.length,
      face: 0,
      body: 0,
      hair: 0,
      joints: 0,
      respiratory: 0,
      repellent: 0,
      other: 0,
    };
    for (const p of products) {
      result[p.subcategory] += 1;
    }
    return result;
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.subcategory === active);
  }, [active]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-10">
        <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
          Каталог
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-green">
          Бальзамы «Фитон Крым»
        </h1>
        <p className="mt-4 max-w-2xl text-brand-green/75">
          {active === "all"
            ? "Полный ассортимент бальзамов — от регенерирующих и суставных до уходовых за лицом и волосами."
            : `Подборка: ${SUBCATEGORY_LABELS[active]}.`}
        </p>
      </header>

      <div className="mb-8">
        <CategoryFilter active={active} onChange={setActive} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-green/70 py-20 text-center">
          Пока нет товаров в этой категории.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-20" />}>
      <CatalogContent />
    </Suspense>
  );
}
