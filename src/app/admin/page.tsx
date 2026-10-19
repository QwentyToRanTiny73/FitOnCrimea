"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { Notice, inputClass, primaryButton, secondaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SUBCATEGORIES, subcategoryMeta } from "@/config/categories";
import { products as baseProducts, type ProductSubcategory } from "@/data/catalog";
import { useAuth, useCatalog } from "@/providers";
import type { OverrideMap } from "@/services/catalog-store";
import { cn } from "@/lib/utils";

type Filter = ProductSubcategory | "all" | "edited";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const { overrides, replaceAll } = useCatalog();
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/account/login?next=/admin");
  }, [loading, user, router]);

  const editedCount = Object.keys(overrides).length;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseProducts.filter((p) => {
      if (filter === "edited" && !overrides[p.slug]) return false;
      if (filter !== "all" && filter !== "edited" && p.subcategory !== filter) return false;
      return !q || `${p.name} ${p.tagline} ${p.slug}`.toLowerCase().includes(q);
    });
  }, [filter, query, overrides]);

  if (loading || !user) return <div className="min-h-[50vh]" />;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-14 text-center">
        <SectionHeading as="h1" title="Доступ только для администратора" />
        <p className="text-brand-green/80">
          Войдите под учётной записью администратора. Она задаётся при сборке сайта через секреты
          репозитория (см. README).
        </p>
      </div>
    );
  }

  function download() {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "overrides.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as OverrideMap;
      if (typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Ожидается объект JSON.");
      replaceAll(parsed);
      setStatus({ tone: "ok", text: `Импортировано правок: ${Object.keys(parsed).length}.` });
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось прочитать файл." });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        align="left"
        eyebrow="Кабинет администратора"
        title="Редактор каталога"
        lead={
          <p className="text-sm">
            Правки сохраняются в этом браузере и сразу видны на сайте. Чтобы опубликовать их для
            всех: «Скачать JSON» → заменить файл <code>src/data/catalog/overrides.json</code> в
            репозитории → сайт пересоберётся.
          </p>
        }
      />

      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Товаров" value={baseProducts.length} />
        <Stat label="С правками" value={editedCount} accent />
        <Stat label="Вы вошли как" value={user.name} className="col-span-2 sm:col-span-1" />
      </section>

      <section className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-brand-green/10 bg-white/60 p-4">
        <button type="button" onClick={download} disabled={!editedCount} className={cn(primaryButton, "py-2 text-sm")}>
          Скачать JSON
        </button>
        <label className={cn(secondaryButton, "cursor-pointer py-2 text-sm")}>
          <input type="file" accept="application/json" className="sr-only" onChange={importFile} />
          Загрузить JSON
        </label>
        <button
          type="button"
          disabled={!editedCount}
          onClick={() => {
            if (window.confirm("Удалить все правки в этом браузере?")) {
              replaceAll({});
              setStatus({ tone: "ok", text: "Все правки удалены." });
            }
          }}
          className={cn(secondaryButton, "py-2 text-sm text-brand-poppy")}
        >
          Очистить всё
        </button>
        {status && (
          <div className="w-full">
            <Notice tone={status.tone}>{status.text}</Notice>
          </div>
        )}
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или slug"
          aria-label="Поиск товаров"
          className={cn(inputClass, "flex-1")}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Фильтр" className={cn(inputClass, "sm:w-56")}>
          <option value="all">Все разделы</option>
          <option value="edited">Только изменённые</option>
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
          return (
            <li key={p.slug} className="overflow-hidden rounded-2xl border border-brand-green/10 bg-white/70">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.slug)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-cream/60"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", overrides[p.slug] ? "bg-brand-poppy" : meta.dot)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-lg text-brand-green">{overrides[p.slug]?.name ?? p.name}</span>
                  <span className="block truncate text-xs text-brand-green/60">
                    {meta.label} · {p.slug}
                    {overrides[p.slug] && " · изменён"}
                  </span>
                </span>
                <span aria-hidden="true" className={cn("text-2xl text-brand-gold transition-transform", isOpen && "rotate-45")}>
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-brand-green/10 bg-brand-cream/40 p-4 sm:p-6">
                  <AdminProductForm base={p} />
                  <Link href={`/catalog/${p.slug}`} target="_blank" className="mt-4 inline-block text-sm text-brand-green underline decoration-brand-gold underline-offset-4">
                    Открыть страницу товара ↗
                  </Link>
                </div>
              )}
            </li>
          );
        })}
        {list.length === 0 && <li className="py-10 text-center text-brand-green/60">Ничего не найдено.</li>}
      </ul>
    </div>
  );
}

function Stat({ label, value, accent, className }: { label: string; value: string | number; accent?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-brand-green/10 bg-white/70 px-4 py-3", className)}>
      <p className="text-[11px] uppercase tracking-widest text-brand-gold">{label}</p>
      <p className={cn("truncate font-serif text-2xl", accent ? "text-brand-poppy" : "text-brand-green")}>{value}</p>
    </div>
  );
}
