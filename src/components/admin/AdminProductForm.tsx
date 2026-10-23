"use client";

import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { BADGE_LABELS, CATEGORIES, SUBCATEGORIES } from "@/config/categories";
import { SLUG_RE, slugify } from "@/data/catalog/sanitize";
import { products as publishedProducts } from "@/data/catalog";
import type { Product, ProductBadge, ProductCategory, ProductOverride, ProductSubcategory } from "@/data/catalog";
import { useCatalog } from "@/providers";
import { fileToCompressedDataURL } from "@/services/image-upload";
import { assetUrl, cn, formatPrice } from "@/lib/utils";
import { Field, Notice, inputClass, primaryButton, secondaryButton } from "@/components/ui/Form";

interface FormState {
  slug: string;
  name: string;
  tagline: string;
  subtitle: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  price: number;
  weight: string;
  badges: ProductBadge[];
  hidden: boolean;
  ozonUrl: string;
  shortDescription: string;
  effect: string;
  description: string;
  composition: string;
  application: string;
  contraindications: string;
  images: string[];
}

const toForm = (p: Product): FormState => ({
  slug: p.slug,
  name: p.name,
  tagline: p.tagline,
  subtitle: p.subtitle ?? "",
  category: p.category,
  subcategory: p.subcategory,
  price: p.price,
  weight: p.weight,
  badges: p.badges ?? [],
  hidden: Boolean(p.hidden),
  ozonUrl: p.ozonUrl ?? "",
  shortDescription: p.shortDescription,
  effect: p.effect,
  description: p.description ?? "",
  composition: p.composition.join("\n"),
  application: p.application,
  contraindications: p.contraindications,
  images: [...p.images],
});

function toOverride(f: FormState): ProductOverride {
  return {
    name: f.name.trim(),
    tagline: f.tagline.trim(),
    subtitle: f.subtitle.trim() || undefined,
    category: f.category,
    subcategory: f.subcategory,
    price: Math.max(0, Math.round(f.price || 0)),
    weight: f.weight.trim() || "15 г",
    badges: f.badges,
    hidden: f.hidden,
    ozonUrl: f.ozonUrl.trim() || undefined,
    shortDescription: f.shortDescription.trim(),
    effect: f.effect.trim(),
    description: f.description.trim() || undefined,
    composition: f.composition.split("\n").map((s) => s.trim()).filter(Boolean),
    application: f.application.trim(),
    contraindications: f.contraindications.trim(),
    images: f.images,
  };
}

/** Только поля, которые отличаются от текущей карточки. */
function diff(next: ProductOverride, current: Product): ProductOverride {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(next)) {
    const cur = (current as unknown as Record<string, unknown>)[k];
    const same = JSON.stringify(v ?? (Array.isArray(cur) ? [] : "")) === JSON.stringify(cur ?? (Array.isArray(v) ? [] : ""));
    const bothFalsy = !v && !cur && typeof v !== "number";
    if (!same && !bothFalsy) out[k] = v;
  }
  return out as ProductOverride;
}

export const emptyProduct = (): Product => ({
  id: "",
  slug: "",
  name: "",
  tagline: "",
  category: "balm",
  subcategory: "body",
  price: 400,
  weight: "15 г",
  shortDescription: "",
  effect: "",
  composition: [],
  application: "",
  contraindications: "",
  images: [],
});

export function AdminProductForm({
  base,
  mode = "edit",
  onCreated,
}: {
  base: Product;
  mode?: "edit" | "create";
  onCreated?: (slug: string) => void;
}) {
  const { overrides, allProducts, setOverride, clearOverride } = useCatalog();
  const isCreate = mode === "create";
  const current = useMemo(
    () => (isCreate ? base : allProducts.find((p) => p.slug === base.slug) ?? base),
    [isCreate, base, allProducts]
  );
  const [form, setForm] = useState<FormState>(() => toForm(current));
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pathInput, setPathInput] = useState("");

  // Синхронизация после сброса, импорта или публикации.
  useEffect(() => {
    if (!isCreate) setForm(toForm(current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides[base.slug]]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus(null);
  };

  async function addFiles(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      setStatus({ tone: "error", text: "Перетащите файлы изображений (JPEG, PNG, WebP)." });
      return;
    }
    setBusy(true);
    try {
      const urls = await Promise.all(images.map((f) => fileToCompressedDataURL(f, 1000, 0.82)));
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      setStatus({ tone: "ok", text: `Добавлено фото: ${urls.length}. Не забудьте «Сохранить».` });
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось прочитать фото." });
    } finally {
      setBusy(false);
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(Array.from(e.dataTransfer.files));
  };

  const move = (i: number, to: number) => {
    if (to < 0 || to >= form.images.length) return;
    const next = [...form.images];
    const [item] = next.splice(i, 1);
    next.splice(to, 0, item);
    set("images", next);
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const data = toOverride(form);
    try {
      if (isCreate) {
        const slug = form.slug.trim();
        if (!data.name) return setStatus({ tone: "error", text: "Укажите название." });
        if (!SLUG_RE.test(slug)) return setStatus({ tone: "error", text: "Адрес — латиница, цифры и дефис, например «novyy-balzam»." });
        if (allProducts.some((p) => p.slug === slug)) return setStatus({ tone: "error", text: "Товар с таким адресом уже есть." });
        setOverride(slug, data);
        onCreated?.(slug);
        return;
      }
      const changes = diff(data, current);
      if (!Object.keys(changes).length) return setStatus({ tone: "ok", text: "Изменений нет." });
      setOverride(base.slug, changes);
      setStatus({ tone: "ok", text: "Сохранено в черновик — изменения уже видны в этом браузере. Опубликуйте их во вкладке «Публикация»." });
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось сохранить." });
    }
  }

  const text = (key: keyof FormState, label: string, rows = 3, hint?: string) => (
    <Field label={label} hint={hint}>
      <textarea rows={rows} value={form[key] as string} onChange={(e) => set(key, e.target.value as never)} className={cn(inputClass, "resize-y")} />
    </Field>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название *">
          <input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: isCreate && !slugTouched ? slugify(name) : f.slug }));
            }}
            className={inputClass}
            required
          />
        </Field>
        <Field label="Адрес страницы" hint={isCreate ? "Латиницей, заполняется сам из названия" : "Адрес нельзя менять — сломаются ссылки"}>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value.toLowerCase());
            }}
            readOnly={!isCreate}
            className={cn(inputClass, !isCreate && "bg-brand-beige text-brand-green/60")}
          />
        </Field>
        <Field label="Растения (красная строка)" hint="Например: «Лимон и мята»">
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Подзаголовок" hint={`Пусто — «Крымский бальзам «${form.name || "…"}»»`}>
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Линейка">
          <select value={form.category} onChange={(e) => set("category", e.target.value as ProductCategory)} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Раздел (задача) *">
          <select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value as ProductSubcategory)} className={inputClass}>
            {SUBCATEGORIES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Цена, ₽ *" hint={`На сайте: ${formatPrice(form.price || 0)}`}>
          <input type="number" min={0} step={10} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="Вес / объём">
          <input value={form.weight} onChange={(e) => set("weight", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Ссылка на Ozon" hint="Пусто — кнопка «Скоро на Ozon»" className="sm:col-span-2">
          <input type="url" value={form.ozonUrl} onChange={(e) => set("ozonUrl", e.target.value)} placeholder="https://www.ozon.ru/product/…" className={inputClass} />
        </Field>
      </div>

      <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="mb-1 text-sm text-brand-green/85">Отметки</legend>
        {(Object.keys(BADGE_LABELS) as ProductBadge[]).map((b) => (
          <label key={b} className="flex items-center gap-2 text-sm text-brand-green">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-green"
              checked={form.badges.includes(b)}
              onChange={(e) => set("badges", e.target.checked ? [...form.badges, b] : form.badges.filter((x) => x !== b))}
            />
            {BADGE_LABELS[b]}
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-brand-poppy">
          <input type="checkbox" className="h-4 w-4 accent-brand-poppy" checked={form.hidden} onChange={(e) => set("hidden", e.target.checked)} />
          Снять с витрины
        </label>
      </fieldset>

      {text("shortDescription", "Кратко (для карточки)", 2)}
      {text("effect", "Показания", 3)}
      {text("description", "Описание (текст брошюры)", 5)}
      {text("composition", "Состав", 6, "По одному компоненту на строку")}
      {text("application", "Способ применения", 3)}
      {text("contraindications", "Противопоказания", 2)}

      <div>
        <p className="mb-2 text-sm text-brand-green/85">Фотографии — первая станет обложкой</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "rounded-xl border-2 border-dashed p-4 transition-colors",
            dragging ? "border-brand-crimson bg-brand-poppy/5" : "border-brand-amber bg-brand-cream"
          )}
        >
          {form.images.length > 0 && (
            <ul className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {form.images.map((src, i) => (
                <li key={`${i}-${src.slice(-24)}`} className="relative aspect-square overflow-hidden rounded-lg border-2 border-brand-amber/60 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(src)} alt={`Фото ${i + 1}`} className="h-full w-full object-contain" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-sm bg-brand-crimson px-1.5 text-[10px] font-bold uppercase text-white">обложка</span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 text-sm text-white">
                    <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="px-2 py-1 disabled:opacity-30" aria-label="Левее">
                      ←
                    </button>
                    <button type="button" onClick={() => move(i, 0)} disabled={i === 0} className="px-2 py-1 disabled:opacity-30" aria-label="Сделать обложкой" title="Сделать обложкой">
                      ★
                    </button>
                    <button type="button" onClick={() => set("images", form.images.filter((_, k) => k !== i))} className="px-2 py-1" aria-label="Удалить фото">
                      ×
                    </button>
                    <button type="button" onClick={() => move(i, i + 1)} disabled={i === form.images.length - 1} className="px-2 py-1 disabled:opacity-30" aria-label="Правее">
                      →
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <label className={cn(primaryButton, "cursor-pointer py-2 text-sm")}>
              <input type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={(e) => { void addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
              {busy ? "Обработка…" : "Выбрать фото с компьютера"}
            </label>
            <span className="text-sm text-brand-green/70">или перетащите файлы сюда</span>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <input value={pathInput} onChange={(e) => setPathInput(e.target.value)} placeholder="/products/имя-файла.webp" aria-label="Путь к файлу в public/" className={cn(inputClass, "py-2")} />
          <button
            type="button"
            disabled={!pathInput.trim()}
            onClick={() => {
              set("images", [...form.images, pathInput.trim()]);
              setPathInput("");
            }}
            className={cn(secondaryButton, "py-2 text-sm")}
          >
            Добавить путь
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-brand-green/60">
          Фото уменьшаются до 1000 px и хранятся в браузере до публикации. При публикации они сохраняются в
          папку <code>public/products/</code> репозитория.
        </p>
      </div>

      {status && <Notice tone={status.tone}>{status.text}</Notice>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={primaryButton}>
          {isCreate ? "Создать товар" : "Сохранить"}
        </button>
        {!isCreate && overrides[base.slug] && (
          <button
            type="button"
            onClick={() => {
              const isNew = !isPublished(base.slug);
              if (isNew && !window.confirm("Удалить новый товар из черновиков?")) return;
              clearOverride(base.slug);
              setStatus({ tone: "ok", text: isNew ? "Черновик товара удалён." : "Правки сброшены." });
            }}
            className={cn(secondaryButton, "text-brand-poppy")}
          >
            {isPublished(base.slug) ? "Сбросить правки" : "Удалить черновик"}
          </button>
        )}
      </div>
    </form>
  );
}

/** Товар уже есть на опубликованном сайте (а не только в черновиках). */
function isPublished(slug: string): boolean {
  return publishedProducts.some((p) => p.slug === slug);
}
