"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BADGE_LABELS } from "@/config/categories";
import type { Product, ProductBadge } from "@/data/catalog";
import { useCatalog, useProduct } from "@/providers";
import { fileToCompressedDataURL } from "@/services/image-upload";
import { assetUrl, cn, formatPrice } from "@/lib/utils";
import { Field, Notice, inputClass, primaryButton, secondaryButton } from "@/components/ui/Form";

interface FormState {
  name: string;
  tagline: string;
  price: number;
  badges: ProductBadge[];
  ozonUrl: string;
  shortDescription: string;
  effect: string;
  composition: string;
  application: string;
  contraindications: string;
  images: string[];
}

const toForm = (p: Product): FormState => ({
  name: p.name,
  tagline: p.tagline,
  price: p.price,
  badges: p.badges ?? [],
  ozonUrl: p.ozonUrl ?? "",
  shortDescription: p.shortDescription,
  effect: p.effect,
  composition: p.composition.join("\n"),
  application: p.application,
  contraindications: p.contraindications,
  images: [...p.images],
});

export function AdminProductForm({ base }: { base: Product }) {
  const { overrides, setOverride, clearOverride } = useCatalog();
  const merged = useProduct(base);
  const [form, setForm] = useState<FormState>(() => toForm(merged));
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [pathInput, setPathInput] = useState("");

  // Синхронизация после сброса или импорта.
  useEffect(() => {
    setForm(toForm(merged));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides[base.slug]]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus(null);
  };

  async function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(files.map((f) => fileToCompressedDataURL(f, 1000, 0.82)));
      set("images", [...form.images, ...urls]);
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось загрузить фото." });
    } finally {
      setBusy(false);
    }
  }

  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= form.images.length) return;
    const next = [...form.images];
    [next[i], next[j]] = [next[j], next[i]];
    set("images", next);
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setOverride(base.slug, {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        price: Math.max(0, Math.round(form.price)),
        badges: form.badges,
        ozonUrl: form.ozonUrl.trim() || undefined,
        shortDescription: form.shortDescription.trim(),
        effect: form.effect.trim(),
        composition: form.composition.split("\n").map((s) => s.trim()).filter(Boolean),
        application: form.application.trim(),
        contraindications: form.contraindications.trim(),
        images: form.images,
      });
      setStatus({ tone: "ok", text: "Сохранено. Изменения уже видны на сайте в этом браузере." });
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось сохранить." });
    }
  }

  const text = (key: keyof FormState, label: string, rows = 3, hint?: string) => (
    <Field label={label} hint={hint}>
      <textarea
        rows={rows}
        value={form[key] as string}
        onChange={(e) => set(key, e.target.value as never)}
        className={cn(inputClass, "resize-y")}
      />
    </Field>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Подзаголовок (ключевые растения)">
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Цена, ₽" hint={`На сайте: ${formatPrice(form.price || 0)}`}>
          <input type="number" min={0} step={10} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="Ссылка на Ozon" hint="Пусто — кнопка «Скоро на Ozon»">
          <input type="url" value={form.ozonUrl} onChange={(e) => set("ozonUrl", e.target.value)} placeholder="https://www.ozon.ru/product/…" className={inputClass} />
        </Field>
      </div>

      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1 text-sm text-brand-green/85">Метки</legend>
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
      </fieldset>

      {text("shortDescription", "Краткое описание", 2)}
      {text("effect", "Показания", 3)}
      {text("composition", "Состав", 6, "По одному компоненту на строку")}
      {text("application", "Способ применения", 3)}
      {text("contraindications", "Противопоказания", 2)}

      <div>
        <p className="mb-2 text-sm text-brand-green/85">Фотографии (первая — обложка)</p>
        {form.images.length > 0 && (
          <ul className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {form.images.map((src, i) => (
              <li key={`${i}-${src.slice(-24)}`} className="relative aspect-square overflow-hidden rounded-xl border border-brand-green/15 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(src)} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/45 px-1 text-sm text-white">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="px-1.5 disabled:opacity-30" aria-label="Левее">←</button>
                  <button type="button" onClick={() => set("images", form.images.filter((_, k) => k !== i))} className="px-1.5" aria-label="Удалить">×</button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="px-1.5 disabled:opacity-30" aria-label="Правее">→</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className={cn(secondaryButton, "cursor-pointer py-2 text-sm")}>
            <input type="file" accept="image/*" multiple className="sr-only" onChange={onUpload} disabled={busy} />
            {busy ? "Обработка…" : "Загрузить фото"}
          </label>
          <div className="flex flex-1 gap-2">
            <input
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              placeholder="/products/slug.webp"
              aria-label="Путь к файлу в public/"
              className={cn(inputClass, "py-2")}
            />
            <button
              type="button"
              disabled={!pathInput.trim()}
              onClick={() => {
                set("images", [...form.images, pathInput.trim()]);
                setPathInput("");
              }}
              className={cn(secondaryButton, "py-2 text-sm")}
            >
              Добавить
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-brand-green/55">
          Загруженные файлы сжимаются до 1000 px и хранятся в браузере (лимит ~5 МБ на все фото).
          Для публикации положите файл в <code>public/products/</code> и укажите путь — так фото
          не раздувает данные.
        </p>
      </div>

      {status && <Notice tone={status.tone}>{status.text}</Notice>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={primaryButton}>
          Сохранить
        </button>
        <button
          type="button"
          disabled={!overrides[base.slug]}
          onClick={() => {
            clearOverride(base.slug);
            setStatus({ tone: "ok", text: "Правки сброшены." });
          }}
          className={secondaryButton}
        >
          Сбросить правки
        </button>
      </div>
    </form>
  );
}
