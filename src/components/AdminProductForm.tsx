"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { mergeProduct, useOverrides } from "@/lib/products-overrides";
import { fileToCompressedDataURL } from "@/lib/image-upload";
import { cn, formatPrice } from "@/lib/utils";

interface Props {
  base: Product;
  onClose?: () => void;
}

interface FormState {
  name: string;
  tagline: string;
  price: number;
  shortDescription: string;
  effect: string;
  compositionText: string;
  application: string;
  contraindications: string;
  ozonUrl: string;
  images: string[];
}

function toForm(p: Product): FormState {
  return {
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    shortDescription: p.shortDescription,
    effect: p.effect,
    compositionText: p.composition.join("\n"),
    application: p.application,
    contraindications: p.contraindications,
    ozonUrl: p.ozonUrl,
    images: [...p.images],
  };
}

export function AdminProductForm({ base, onClose }: Props) {
  const { overrides, setOverride, clearOverride } = useOverrides();
  const merged = mergeProduct(base, overrides[base.slug]);

  const [form, setForm] = useState<FormState>(() => toForm(merged));
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(toForm(merged));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.slug, overrides[base.slug]]);

  const overridden = Boolean(overrides[base.slug]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setInfo(null);
    setError(null);
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const datas = await Promise.all(
        files.map((f) => fileToCompressedDataURL(f, 1000, 0.82))
      );
      update("images", [...form.images, ...datas]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  function removeImage(idx: number) {
    update(
      "images",
      form.images.filter((_, i) => i !== idx)
    );
  }

  function moveImage(idx: number, dir: -1 | 1) {
    const next = [...form.images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update("images", next);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    try {
      const composition = form.compositionText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      setOverride(base.slug, {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        price: Math.max(0, Math.round(form.price)),
        shortDescription: form.shortDescription.trim(),
        effect: form.effect.trim(),
        composition,
        application: form.application.trim(),
        contraindications: form.contraindications.trim(),
        ozonUrl: form.ozonUrl.trim() || "#",
        images: form.images,
      });
      setInfo("Сохранено в локальном хранилище.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения.");
    }
  }

  function handleReset() {
    clearOverride(base.slug);
    setInfo("Изменения сброшены до исходных данных.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 border border-brand-green/15 rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-gold mb-1">
            slug: {base.slug}
          </p>
          <h3 className="font-serif text-2xl text-brand-green">{merged.name}</h3>
          {overridden && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-brand-poppy/10 text-brand-poppy border border-brand-poppy/30">
              Есть локальные изменения
            </span>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-brand-green/70 hover:text-brand-green"
          >
            Свернуть
          </button>
        )}
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Название">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Подзаголовок">
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Цена, ₽">
          <input
            type="number"
            min={0}
            step={10}
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            className={inputClass}
          />
          <span className="text-xs text-brand-green/60 mt-1 block">
            На сайте: {formatPrice(form.price)}
          </span>
        </Field>
        <Field label="Ozon URL">
          <input
            type="url"
            value={form.ozonUrl}
            onChange={(e) => update("ozonUrl", e.target.value)}
            placeholder="https://www.ozon.ru/product/..."
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Краткое описание">
        <textarea
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          rows={2}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field label="Действие">
        <textarea
          value={form.effect}
          onChange={(e) => update("effect", e.target.value)}
          rows={3}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field
        label="Состав"
        hint="По одному ингредиенту на строку"
      >
        <textarea
          value={form.compositionText}
          onChange={(e) => update("compositionText", e.target.value)}
          rows={6}
          className={cn(inputClass, "resize-y font-mono text-sm")}
        />
      </Field>

      <Field label="Применение">
        <textarea
          value={form.application}
          onChange={(e) => update("application", e.target.value)}
          rows={3}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field label="Противопоказания">
        <textarea
          value={form.contraindications}
          onChange={(e) => update("contraindications", e.target.value)}
          rows={2}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <div>
        <label className="block text-sm text-brand-green/85 mb-2">
          Изображения
        </label>
        {form.images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {form.images.map((src, idx) => (
              <div
                key={`${idx}-${src.slice(0, 32)}`}
                className="relative aspect-square rounded-lg overflow-hidden border border-brand-green/15 bg-white"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm flex justify-between items-center text-white text-[11px] px-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    className="px-1 disabled:opacity-30"
                    aria-label="Сдвинуть влево"
                  >
                    ←
                  </button>
                  <span>{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === form.images.length - 1}
                    className="px-1 disabled:opacity-30"
                    aria-label="Сдвинуть вправо"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="px-1 text-brand-poppy"
                    aria-label="Удалить"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-green/60 mb-2">
            Изображений пока нет. Добавьте файлы ниже.
          </p>
        )}

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/30 text-sm text-brand-green hover:border-brand-gold cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={busy}
          />
          {busy ? "Обрабатываю..." : "Загрузить фото"}
        </label>
        <p className="mt-2 text-[11px] text-brand-green/55 leading-relaxed">
          Файлы сжимаются до 1000 px по длинной стороне, JPEG q=0.82, и
          сохраняются как data URL в localStorage. Лимит браузера ~5 МБ
          суммарно — для долгосрочного хранения подключите CDN.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {info && (
        <p className="text-sm text-brand-forest bg-brand-forest/5 border border-brand-forest/20 rounded-lg px-3 py-2">
          {info}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="px-6 py-2 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!overridden}
          className="px-6 py-2 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-poppy disabled:opacity-50"
        >
          Сбросить
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-brand-green/20 bg-white focus:border-brand-gold focus:outline-none text-sm";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-brand-green/85 mb-1">{label}</span>
      {children}
      {hint && (
        <span className="block text-[11px] text-brand-green/55 mt-1">
          {hint}
        </span>
      )}
    </label>
  );
}
