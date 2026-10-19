"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, SUBCATEGORIES, categoryMeta } from "@/config/categories";
import type { Product, ProductCategory, ProductSubcategory } from "@/data/catalog";
import { useCatalog } from "@/providers";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/ui/Icons";
import { ComingSoon } from "./ComingSoon";
import { ProductCard } from "./ProductCard";

type Sort = "popular" | "name";

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

function matches(p: Product, q: string): boolean {
  if (!q) return true;
  const hay = norm(
    [p.name, p.tagline, p.shortDescription, p.effect, ...p.composition].join(" ")
  );
  return norm(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { products } = useCatalog();

  const type = (CATEGORIES.some((c) => c.key === params.get("type"))
    ? params.get("type")
    : "balm") as ProductCategory;
  const cat = (SUBCATEGORIES.some((s) => s.key === params.get("cat"))
    ? params.get("cat")
    : null) as ProductSubcategory | null;
  const q = params.get("q") ?? "";
  const sort = (params.get("sort") === "name" ? "name" : "popular") as Sort;

  // Локальное значение поля: курсор не прыгает, а сброс фильтров очищает поле.
  const [query, setQuery] = useState(q);
  useEffect(() => {
    if (norm(q) !== norm(query.trim())) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const ofType = useMemo(() => products.filter((p) => p.category === type), [products, type]);

  const counts = useMemo(() => {
    const c: Partial<Record<ProductSubcategory, number>> = {};
    for (const p of ofType) c[p.subcategory] = (c[p.subcategory] ?? 0) + 1;
    return c;
  }, [ofType]);

  const visible = useMemo(() => {
    const list = ofType.filter((p) => (!cat || p.subcategory === cat) && matches(p, q));
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return [...list].sort((a, b) => Number(!!b.badges?.includes("hit")) - Number(!!a.badges?.includes("hit")));
  }, [ofType, cat, q, sort]);

  const meta = categoryMeta(type);

  return (
    <div>
      <div role="tablist" aria-label="Тип продукции" className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {CATEGORIES.map((c) => {
          const active = c.key === type;
          return (
            <button
              key={c.key}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => update({ type: c.key === "balm" ? null : c.key, cat: null })}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-brand-green bg-brand-green text-brand-beige"
                  : "border-brand-green/20 bg-white/70 text-brand-green hover:border-brand-gold"
              )}
            >
              {c.label}
              {!c.available && <span className="ml-1.5 text-[10px] uppercase opacity-70">скоро</span>}
            </button>
          );
        })}
      </div>

      {!meta.available ? (
        <ComingSoon category={meta} />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Поиск по каталогу</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-green/50" />
              <input
                id="search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  update({ q: e.target.value.trim() || null });
                }}
                placeholder="Название, растение или показание: «кашель», «лаванда»…"
                className="w-full rounded-full border border-brand-green/20 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-brand-green/80">
              Сортировка
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value === "name" ? "name" : null })}
                className="rounded-full border border-brand-green/20 bg-white px-3 py-2 text-sm focus:border-brand-gold focus:outline-none"
              >
                <option value="popular">Сначала хиты</option>
                <option value="name">По названию</option>
              </select>
            </label>
          </div>

          <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip active={!cat} onClick={() => update({ cat: null })} label="Все" count={ofType.length} />
            {SUBCATEGORIES.filter((s) => counts[s.key]).map((s) => (
              <Chip
                key={s.key}
                active={cat === s.key}
                onClick={() => update({ cat: cat === s.key ? null : s.key })}
                label={s.label}
                count={counts[s.key] ?? 0}
                dot={s.dot}
              />
            ))}
          </div>

          <p className="mb-4 text-sm text-brand-green/60" aria-live="polite">
            Найдено: {visible.length}
          </p>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-brand-green/10 bg-white/60 py-16 text-center">
              <p className="text-brand-green/75">Ничего не нашлось.</p>
              <button
                type="button"
                onClick={() => update({ q: null, cat: null })}
                className="mt-4 text-sm text-brand-green underline decoration-brand-gold underline-offset-4"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {visible.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 4} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
  count,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dot?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-brand-green bg-brand-green text-brand-beige"
          : "border-brand-green/20 bg-white/60 text-brand-green hover:border-brand-gold"
      )}
    >
      {dot && <span className={cn("h-2 w-2 rounded-full", dot)} />}
      {label}
      <span className={cn("text-xs", active ? "text-brand-beige/70" : "text-brand-green/50")}>{count}</span>
    </button>
  );
}
