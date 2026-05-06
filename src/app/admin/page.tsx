"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  products as baseProducts,
  SUBCATEGORY_LABELS,
  type ProductSubcategory,
} from "@/data/products";
import { useOverrides } from "@/lib/products-overrides";
import { AdminProductForm } from "@/components/AdminProductForm";
import {
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";
import { cn } from "@/lib/utils";

type FilterValue = ProductSubcategory | "all" | "edited";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAdmin, promoteSelfToAdmin } = useAuth();
  const { overrides, resetAll, exportJSON, importJSON } = useOverrides();

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [importText, setImportText] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/account/login?next=/admin");
  }, [loading, user, router]);

  const editedCount = Object.keys(overrides).length;

  const filtered = useMemo(() => {
    return baseProducts.filter((p) => {
      if (filter === "edited" && !overrides[p.slug]) return false;
      if (filter !== "all" && filter !== "edited" && p.subcategory !== filter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.tagline.toLowerCase().includes(q) &&
          !p.slug.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filter, overrides, search]);

  if (loading || !user) {
    return <div className="max-w-4xl mx-auto px-4 py-20" />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <BotanicalWreath className="mx-auto h-14 text-brand-gold mb-3" />
        <h1 className="font-serif text-3xl text-brand-green">
          Доступ ограничен
        </h1>
        <BotanicalDivider className="my-5" />
        <p className="text-brand-green/80">
          Кабинет администратора доступен пользователю с ролью «admin».
        </p>
        <p className="mt-4 text-sm text-brand-green/65">
          В демо-режиме первый зарегистрированный пользователь получает
          права администратора. Если в системе ещё нет администратора —
          можно выполнить промоут себя.
        </p>
        <button
          type="button"
          onClick={() => {
            try {
              promoteSelfToAdmin();
              setInfo("Вы повышены до администратора.");
              setError(null);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Ошибка.");
            }
          }}
          className="mt-6 px-6 py-2 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold"
        >
          Стать администратором
        </button>
        {info && (
          <p className="mt-4 text-sm text-brand-forest">{info}</p>
        )}
        {error && <p className="mt-4 text-sm text-brand-poppy">{error}</p>}
      </div>
    );
  }

  function copyExport() {
    const json = exportJSON();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(json)
        .then(() => setInfo("JSON скопирован в буфер обмена."))
        .catch(() => setInfo(json));
    } else {
      setInfo(json);
    }
  }

  function applyImport() {
    try {
      importJSON(importText);
      setInfo("Импорт выполнен.");
      setError(null);
      setImportText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка импорта.");
      setInfo(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-8">
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-2">
          Кабинет администратора
        </p>
        <h1 className="font-serif text-4xl text-brand-green">
          Редактирование каталога
        </h1>
        <BotanicalDivider className="my-5" />
        <p className="text-sm text-brand-green/75">
          Изменения сохраняются в браузере (localStorage). На статическом
          хостинге GitHub Pages нет серверного бэкенда — экспортируйте JSON и
          применяйте его к <code>src/data/products.ts</code> для постоянного
          сохранения.
        </p>
      </header>

      <section className="mb-8 grid sm:grid-cols-3 gap-3">
        <Stat label="Товаров в каталоге" value={baseProducts.length} />
        <Stat label="С локальными правками" value={editedCount} accent="poppy" />
        <Stat label="Ваша роль" value="admin" accent="forest" />
      </section>

      <section className="mb-6 bg-white/60 border border-brand-green/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Поиск по названию или slug"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-brand-green/20 bg-white text-sm focus:border-brand-gold focus:outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterValue)}
          className="px-3 py-2 rounded-lg border border-brand-green/20 bg-white text-sm focus:border-brand-gold focus:outline-none"
        >
          <option value="all">Все категории</option>
          <option value="edited">Только изменённые</option>
          {Object.entries(SUBCATEGORY_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-xs text-brand-green/65">
          Показано: {filtered.length}
        </span>
      </section>

      <ul className="space-y-3 mb-12">
        {filtered.map((p) => {
          const isOpen = openSlug === p.slug;
          const isEdited = Boolean(overrides[p.slug]);
          return (
            <li
              key={p.slug}
              className="bg-white/60 border border-brand-green/10 rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : p.slug)}
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 text-left hover:bg-brand-cream/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "inline-block w-2 h-2 rounded-full shrink-0",
                      isEdited ? "bg-brand-poppy" : "bg-brand-green/30"
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block font-serif text-lg text-brand-green truncate">
                      {p.name}
                    </span>
                    <span className="block text-xs text-brand-green/60 truncate">
                      {p.tagline} · {SUBCATEGORY_LABELS[p.subcategory]}
                    </span>
                  </span>
                </span>
                <span className="text-brand-gold text-2xl leading-none transition-transform" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                  +
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-brand-green/10 p-4 sm:p-5 bg-brand-cream/40">
                  <AdminProductForm base={p} onClose={() => setOpenSlug(null)} />
                  <div className="mt-3 text-xs">
                    <Link
                      href={`/catalog/${p.slug}`}
                      target="_blank"
                      className="text-brand-green border-b border-brand-gold pb-0.5 hover:text-brand-gold"
                    >
                      Открыть страницу товара ↗
                    </Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-center py-12 text-brand-green/60">
            Ничего не найдено.
          </li>
        )}
      </ul>

      <section className="bg-white/60 border border-brand-green/10 rounded-2xl p-5 sm:p-6">
        <h2 className="font-serif text-2xl text-brand-green">
          Импорт / экспорт
        </h2>
        <BotanicalDivider className="my-4" />
        <p className="text-sm text-brand-green/75">
          Экспортируйте все правки одной строкой JSON, чтобы перенести их в
          репозиторий, либо импортируйте раннее сохранённый набор.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyExport}
            className="px-5 py-2 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90"
          >
            Скопировать JSON
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm(
                  "Удалить все локальные правки? Действие необратимо."
                )
              ) {
                resetAll();
                setInfo("Все правки удалены.");
              }
            }}
            disabled={editedCount === 0}
            className="px-5 py-2 rounded-full border border-brand-poppy/40 text-brand-poppy hover:bg-brand-poppy/5 disabled:opacity-40"
          >
            Очистить всё
          </button>
        </div>

        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-brand-green/80">
            Импорт JSON
          </summary>
          <div className="mt-3 space-y-3">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={6}
              placeholder='{"krymskiy-spasatel": {"price": 450, ...}}'
              className="w-full px-3 py-2 rounded-lg border border-brand-green/20 bg-white text-xs font-mono focus:border-brand-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={applyImport}
              disabled={!importText.trim()}
              className="px-5 py-2 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold disabled:opacity-50"
            >
              Применить импорт
            </button>
          </div>
        </details>

        {info && (
          <p className="mt-4 text-sm text-brand-forest bg-brand-forest/5 border border-brand-forest/20 rounded-lg px-3 py-2">
            {info}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "poppy" | "forest";
}) {
  const accentClass =
    accent === "poppy"
      ? "text-brand-poppy"
      : accent === "forest"
        ? "text-brand-forest"
        : "text-brand-green";
  return (
    <div className="bg-white/70 border border-brand-green/10 rounded-2xl px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-brand-gold mb-1">
        {label}
      </p>
      <p className={cn("font-serif text-2xl", accentClass)}>{value}</p>
    </div>
  );
}
