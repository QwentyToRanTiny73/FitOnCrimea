"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SUBCATEGORIES, subcategoryMeta } from "@/config/categories";
import { products as publishedProducts, type ProductSubcategory } from "@/data/catalog";
import { useCatalog } from "@/providers";
import { OctagonJar } from "@/components/ui/Brochure";
import { inputClass } from "@/components/ui/Form";
import { assetUrl, cn, formatPrice } from "@/lib/utils";
import { AdminProductForm } from "./AdminProductForm";

export type Filter = ProductSubcategory | "all" | "drafts" | "hidden" | "no-ozon" | "no-photo";
const STATUS_FILTERS: string[] = ["all", "drafts", "hidden", "no-ozon", "no-photo"];
export const isFilter = (v: string): v is Filter => STATUS_FILTERS.includes(v) || SUBCATEGORIES.some((s) => s.key === v);

/** Список товаров: поиск, фильтры по разделу и состоянию, правка в раскрывающейся карточке. */
export function ProductsPanel({
  open,
  setOpen,
  initialFilter = "all",
}: {
  open: string | null;
  setOpen: (slug: string | null) => void;
  initialFilter?: Filter;
}) {
  const { allProducts, overrides, setOverride } = useCatalog();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (filter === "drafts" && !overrides[p.slug]) return false;
      if (filter === "hidden" && !p.hidden) return false;
      if (filter === "no-ozon" && (p.ozonUrl || p.hidden)) return false;
      if (filter === "no-photo" && (p.images.length || p.hidden)) return false;
      if (!STATUS_FILTERS.includes(filter) && p.subcategory !== filter) return false;
      return !q || `${p.name} ${p.tagline} ${p.slug}`.toLowerCase().includes(q);
    });
  }, [allProducts, overrides, filter, query]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию"
          aria-label="Поиск товаров"
          className={cn(inputClass, "flex-1")}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Фильтр" className={cn(inputClass, "sm:w-60")}>
          <option value="all">Все товары ({allProducts.length})</option>
          <option value="drafts">С неопубликованными правками</option>
          <option value="hidden">Снятые с витрины</option>
          <option value="no-ozon">Без ссылки Ozon</option>
          <option value="no-photo">Без фото</option>
          {SUBCATEGORIES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-3">
        {list.map((p) => {
          const isOpen = open === p.slug;
          const meta = subcategoryMeta(p.subcategory);
          const isNew = !publishedProducts.some((x) => x.slug === p.slug);
          return (
            <li key={p.slug} className="overflow-hidden rounded-xl border-2 border-brand-amber/60 bg-brand-cream">
              <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(p.images[0])} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <OctagonJar name={p.name} label={meta.jar} className="h-full w-full p-0.5" />
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                  aria-expanded={isOpen}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate font-serif text-lg font-bold text-brand-green">{p.name}</span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-green/70">
                    <span>{meta.label}</span>
                    <span>· {formatPrice(p.price)}</span>
                    {isNew && <Chip tone="crimson">новый</Chip>}
                    {overrides[p.slug] && !isNew && <Chip tone="crimson">черновик</Chip>}
                    {p.hidden && <Chip tone="poppy">скрыт</Chip>}
                    {!p.ozonUrl && <Chip tone="muted">нет ссылки Ozon</Chip>}
                    {!p.images.length && <Chip tone="muted">нет фото</Chip>}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOverride(p.slug, { hidden: !p.hidden })}
                  className="hidden shrink-0 rounded-full border border-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-green hover:border-brand-crimson sm:block"
                >
                  {p.hidden ? "Показать" : "Скрыть"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                  aria-label={isOpen ? "Свернуть" : "Редактировать"}
                  className={cn("shrink-0 text-2xl text-brand-crimson transition-transform", isOpen && "rotate-45")}
                >
                  +
                </button>
              </div>
              {isOpen && (
                <div className="border-t-2 border-brand-amber/50 bg-brand-beige/60 p-4 sm:p-6">
                  <AdminProductForm base={p} />
                  {!isNew && (
                    <Link href={`/catalog/${p.slug}`} target="_blank" className="mt-4 inline-block text-sm text-brand-green underline decoration-brand-amber underline-offset-4">
                      Открыть страницу товара ↗
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
        {list.length === 0 && <li className="py-10 text-center text-brand-green/70">Ничего не найдено.</li>}
      </ul>
    </>
  );
}

function Chip({ tone, children }: { tone: "crimson" | "poppy" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-sm px-1.5 py-px text-[10px] font-bold uppercase tracking-wide",
        tone === "crimson" && "bg-brand-crimson text-white",
        tone === "poppy" && "bg-brand-poppy/15 text-brand-poppy",
        tone === "muted" && "bg-brand-green/10 text-brand-green/70"
      )}
    >
      {children}
    </span>
  );
}
