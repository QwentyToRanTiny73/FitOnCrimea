"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAUTION_TEXT,
  MASSAGE_POINTS,
  SYMPTOM_FILTERS,
  TECHNIQUE,
  ZONE_LABELS,
  ZONE_TIPS,
  type MassagePoint,
} from "@/data/massage-points";
import { useCatalog } from "@/providers";
import { assetUrl, cn } from "@/lib/utils";
import { ProductImage } from "@/components/catalog/ProductImage";
import { ArrowIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";

const IMAGE = "/massage-points.jpg";
/** Показываем верхние 68% картинки: ниже — напечатанный список, он есть на странице текстом. */
const CROP = 0.68;
const pos = ([x, y]: [number, number]) => ({ left: `${x}%`, top: `${(y / CROP).toFixed(2)}%` });

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");
const stem = (w: string) => (w.length >= 6 ? w.slice(0, -2) : w);
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function MassageExplorer() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const f = SYMPTOM_FILTERS.find((x) => x.label === filter);
    const words = norm(query).split(/\s+/).filter(Boolean).map(stem);
    return new Set(
      MASSAGE_POINTS.filter((p) => {
        const text = norm(p.indications);
        if (f && !f.words.some((w) => text.includes(w))) return false;
        return words.every((w) => text.includes(w));
      }).map((p) => p.n)
    );
  }, [filter, query]);

  const select = useCallback((n: number | null) => {
    setActive(n);
    const url = n ? `#t${n}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, "", url);
    panelRef.current?.scrollTo({ top: 0 });
    // На ПК панель закреплена, но у конца списка может уйти вверх — доводим её до экрана.
    if (n && window.matchMedia("(min-width: 1024px)").matches) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const top = panelRef.current?.getBoundingClientRect().top ?? 0;
          if (top < 72) window.scrollBy({ top: top - 88, behavior: "smooth" });
        })
      );
    }
  }, []);

  // Ссылка вида /massage-points/#t5 открывает нужную точку
  useEffect(() => {
    const read = () => {
      const m = /^#t(\d{1,2})$/.exec(window.location.hash);
      const n = m ? Number(m[1]) : null;
      if (n && MASSAGE_POINTS.some((p) => p.n === n)) setActive(n);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const ordered = MASSAGE_POINTS.filter((p) => visible.has(p.n));
  const point = MASSAGE_POINTS.find((p) => p.n === active) ?? null;
  const step = (dir: 1 | -1) => {
    const list = ordered.length ? ordered : MASSAGE_POINTS;
    const i = list.findIndex((p) => p.n === active);
    select(list[(i + dir + list.length) % list.length].n);
  };
  const lit = (n: number) => n === active || n === hovered;

  return (
    <div>
      {/* Фильтры */}
      <div className="mb-6 space-y-3">
        <label className="relative block">
          <span className="sr-only">Поиск по симптому</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-green/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Симптом: например, «бессонница»"
            className="w-full rounded-full border-2 border-brand-amber bg-brand-cream py-2.5 pl-10 pr-4 text-base focus:border-brand-crimson focus:outline-none sm:text-sm"
          />
        </label>
        <div className="flex flex-wrap gap-2 text-sm">
          {[null, ...SYMPTOM_FILTERS.map((f) => f.label)].map((label) => (
            <button
              key={label ?? "all"}
              type="button"
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 transition-colors",
                filter === label
                  ? "border-brand-green bg-brand-green text-brand-cream"
                  : "border-brand-amber bg-brand-cream text-brand-green hover:border-brand-crimson"
              )}
            >
              {label ?? "Все точки"}
            </button>
          ))}
        </div>
        <p className="text-sm text-brand-green/70" aria-live="polite">
          Подходит точек: {visible.size}
          {visible.size === 0 && " — попробуйте другое слово"}
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          {/* Схема с кнопками на номерах */}
          <figure
            className="paper-page relative w-full overflow-hidden rounded-2xl border-2 border-brand-amber/70"
            style={{ aspectRatio: `1400 / ${Math.round(2048 * CROP)}` }}
          >
            <Image
              src={assetUrl(IMAGE)}
              alt="Схема акупунктурных точек: три фигуры, точки пронумерованы от 1 до 26"
              width={1400}
              height={2048}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="absolute inset-x-0 top-0 h-auto w-full select-none"
              draggable={false}
            />
            {point &&
              point.dots.map((d, i) => (
                <span key={`d${i}`} className="pointer-events-none absolute h-0 w-0" style={pos(d)} aria-hidden="true">
                  <span className="absolute -left-3 -top-3 h-6 w-6 animate-ping rounded-full bg-brand-poppy/60" />
                  <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-poppy" />
                </span>
              ))}
            {hovered && hovered !== active &&
              MASSAGE_POINTS.find((p) => p.n === hovered)?.dots.map((d, i) => (
                <span key={`h${i}`} className="pointer-events-none absolute h-0 w-0" style={pos(d)} aria-hidden="true">
                  <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-amber" />
                </span>
              ))}
            {MASSAGE_POINTS.flatMap((p) =>
              p.labels.map((l, i) => (
                <button
                  key={`${p.n}-${i}`}
                  type="button"
                  onClick={() => select(p.n === active ? null : p.n)}
                  onMouseEnter={() => setHovered(p.n)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`Точка ${p.n}: ${p.indications}`}
                  aria-pressed={p.n === active}
                  style={pos(l)}
                  className={cn(
                    "absolute flex aspect-square w-[6%] min-w-[24px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all sm:text-xs",
                    lit(p.n)
                      ? "scale-110 border-white bg-brand-crimson text-white shadow-lg"
                      : visible.has(p.n)
                        ? cn("border-brand-crimson/80 hover:bg-brand-crimson/20", p.faint ? "bg-brand-cream text-brand-crimson" : "bg-brand-cream/30 text-transparent")
                        : "border-transparent bg-brand-beige/60 text-transparent"
                  )}
                >
                  {p.n}
                </button>
              ))
            )}
          </figure>
          <p className="mt-2 text-center text-xs text-brand-green/70">
            Нажмите на номер, чтобы увидеть описание.{" "}
            <a href={assetUrl(IMAGE)} target="_blank" rel="noopener" className="underline decoration-brand-amber underline-offset-2">
              Схема целиком
            </a>
          </p>

          {/* Список точек — точный выбор пальцем и для экранных дикторов */}
          <h2 className="mb-3 mt-8 font-serif text-xl font-bold text-brand-green">Все точки</h2>
          <ol className="overflow-hidden rounded-2xl border-2 border-brand-amber/60 bg-brand-cream">
            {ordered.map((p) => (
              <li key={p.n} className="border-b border-brand-amber/40 last:border-b-0">
                <button
                  type="button"
                  onClick={() => select(p.n)}
                  onMouseEnter={() => setHovered(p.n)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={p.n === active}
                  className={cn(
                    "flex w-full items-start gap-4 px-4 py-3 text-left transition-colors hover:bg-brand-amber/15",
                    p.n === active && "bg-brand-amber/25"
                  )}
                >
                  <span className="w-7 shrink-0 text-right font-display text-xl leading-none text-brand-crimson">{p.n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug text-brand-green sm:text-base">{p.indications}</span>
                    <span className="mt-0.5 block text-xs text-brand-green/60">
                      {p.where}
                      {p.caution === "urgent" && <span className="ml-2 font-semibold text-brand-poppy">· сначала врач</span>}
                    </span>
                  </span>
                  <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
                </button>
              </li>
            ))}
            {ordered.length === 0 && <li className="px-4 py-8 text-center text-brand-green/70">Ничего не нашлось.</li>}
          </ol>
        </div>

        <div className="lg:sticky lg:top-20">
          {/* Панель описания: на телефоне — шторка снизу, на ПК — карточка */}
          {point && (
            <button
              type="button"
              aria-label="Закрыть описание"
              onClick={() => select(null)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
          )}
          <div
            ref={panelRef}
            role="region"
            aria-label="Описание точки"
            aria-live="polite"
            className={
              point
                ? "fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-brand-cream shadow-[0_-10px_30px_rgba(60,40,10,0.25)] lg:static lg:z-auto lg:max-h-[calc(100vh-6rem)] lg:rounded-2xl lg:shadow-none"
                : "hidden lg:block"
            }
          >
            {point ? (
              <PointDetail point={point} onClose={() => select(null)} onStep={step} />
            ) : (
              <div className="paper-page rounded-2xl p-6 text-center text-brand-green/80">
                <p className="title-crimson font-serif text-xl font-bold uppercase">Выберите точку</p>
                <p className="mt-2 text-sm">Нажмите на номер на схеме или в списке — здесь появятся показания, место и методика массажа.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PointDetail({
  point,
  onClose,
  onStep,
}: {
  point: MassagePoint;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const { products } = useCatalog();
  const balms = (point.balms ?? [])
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article className="paper-page relative rounded-t-3xl p-5 sm:p-6 lg:rounded-2xl">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-brand-amber lg:hidden" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Точка {point.n} · {ZONE_LABELS[point.zone]}
          </p>
          <h2 className="title-crimson mt-1 font-serif text-2xl font-bold leading-tight">{sentence(point.indications)}</h2>
          <p className="mt-1 text-sm text-brand-green/80">
            <span className="font-semibold text-brand-green">Где на схеме:</span> {point.where}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-amber bg-brand-cream text-brand-green lg:hidden"
        >
          <MenuIcon open className="h-5 w-5" />
        </button>
      </div>

      {point.caution && (
        <p
          role="note"
          className={cn(
            "mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed",
            point.caution === "urgent"
              ? "border-brand-poppy/40 bg-brand-poppy/10 font-semibold text-brand-poppy"
              : "border-brand-gold/40 bg-brand-amber/10 text-brand-green"
          )}
        >
          {CAUTION_TEXT[point.caution]}
        </p>
      )}

      <section className="mt-5">
        <h3 className="font-serif text-lg font-bold text-brand-green">Как массировать</h3>
        <p className="mt-2 rounded-xl border-l-4 border-brand-crimson bg-brand-cream px-4 py-3 text-sm leading-relaxed text-brand-green">
          <span className="font-semibold">{ZONE_LABELS[point.zone]}:</span> {ZONE_TIPS[point.zone]}
        </p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-brand-green/90">
          {TECHNIQUE.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-brand-green/60">
          Общие правила точечного массажа. В брошюре для точек указаны только показания.
        </p>
      </section>

      {balms.length > 0 && (
        <section className="mt-5">
          <h3 className="font-serif text-lg font-bold text-brand-green">Бальзамы с такими показаниями</h3>
          <ul className="mt-2 space-y-2">
            {balms.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/catalog/${p.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-brand-amber/70 bg-brand-cream p-2 pr-3 transition-colors hover:border-brand-crimson"
                >
                  <ProductImage product={p} sizes="56px" className="h-14 w-14 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif font-bold text-brand-green">{p.name}</span>
                    <span className="block truncate text-xs text-brand-green/70">{p.effect}</span>
                  </span>
                  <ArrowIcon className="h-4 w-4 shrink-0 text-brand-crimson" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-amber/50 pt-4">
        <button type="button" onClick={() => onStep(-1)} className="rounded-full border border-brand-amber px-4 py-2 text-sm font-semibold text-brand-green hover:border-brand-crimson">
          ← Предыдущая
        </button>
        <button type="button" onClick={() => onStep(1)} className="rounded-full border border-brand-amber px-4 py-2 text-sm font-semibold text-brand-green hover:border-brand-crimson">
          Следующая →
        </button>
      </div>
    </article>
  );
}
