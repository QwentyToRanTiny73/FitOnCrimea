"use client";

import Link from "next/link";
import { DragEvent, FormEvent, useState } from "react";
import { MAIN_NAV } from "@/config/site";
import { SUBCATEGORIES } from "@/config/categories";
import {
  BANNER_SPEC,
  DESIGN_SLOTS,
  SLOT_GROUPS,
  resolveSlot,
  type Banner,
  type DesignImage,
  type DesignSlot,
} from "@/data/design";
import { safeHref } from "@/data/design/sanitize";
import { useCatalog, useDesign } from "@/providers";
import { ACCEPT_ATTR, formatBytes, prepareImage, type PreparedImage } from "@/services/image-upload";
import { Notice, inputClass, primaryButton, secondaryButton } from "@/components/ui/Form";
import { assetUrl, cn } from "@/lib/utils";
import { ExternalIcon, ImageIcon, PlusIcon } from "./AdminIcons";

type Status = { tone: "ok" | "error" | "info"; text: string } | null;

/** Сообщение о загруженной картинке: размер после сжатия и предупреждение о малом размере. */
function describe(img: PreparedImage, recommended: { w: number; h: number }): Status {
  const small = Math.max(img.sourceWidth, img.sourceHeight) < Math.max(recommended.w, recommended.h) / 2;
  const kind = img.type === "image/png" ? "PNG с прозрачностью" : "JPEG";
  const base = `Загружено: ${img.width}×${img.height} px, ${formatBytes(img.bytes)}, ${kind}.`;
  return small
    ? { tone: "info", text: `${base} Картинка небольшая (${img.sourceWidth}×${img.sourceHeight}) — на больших экранах может быть нечёткой.` }
    : { tone: "ok", text: `${base} Это черновик — опубликуйте, чтобы увидели все.` };
}

const toDesignImage = (img: PreparedImage, alt: string): DesignImage => ({ src: img.dataUrl, width: img.width, height: img.height, alt });

export function DesignPanel() {
  const { hasDraft } = useDesign();
  const groups = Object.keys(SLOT_GROUPS) as Array<DesignSlot["group"]>;

  return (
    <div className="space-y-8">
      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-brand-green/85">
          Замените картинки сайта своими или добавьте баннеры на главную. Подходят <b>JPEG и PNG</b> (PNG с прозрачным фоном
          сохранит прозрачность). Картинка уменьшается и сжимается прямо здесь, до загрузки на сайт.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-brand-green/85">
          Изменения сначала — черновик: их видите только вы в этом браузере. Чтобы увидели все, откройте «Публикация».
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/" target="_blank" className={cn(secondaryButton, "gap-2 py-2 text-sm")}>
            Посмотреть главную <ExternalIcon className="h-4 w-4" />
          </Link>
          {hasDraft && <span className="self-center text-sm font-semibold text-brand-crimson">Есть неопубликованные изменения оформления</span>}
        </div>
      </section>

      <BannersEditor />

      {groups.map((g) => (
        <section key={g} aria-labelledby={`grp-${g}`}>
          <h2 id={`grp-${g}`} className="title-crimson mb-3 font-serif text-lg font-bold uppercase sm:text-xl">
            {SLOT_GROUPS[g]}
          </h2>
          <ul className={cn("grid gap-4", g === "icons" ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-3")}>
            {DESIGN_SLOTS.filter((s) => s.group === g).map((s) => (
              <li key={s.key}>
                <SlotCard slot={s} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ── Картинка в постоянном месте сайта ───────────────────────── */

function SlotCard({ slot }: { slot: DesignSlot }) {
  const { design, draft, setSlot, discardSlot } = useDesign();
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const img = resolveSlot(design, slot.key);
  const inDraft = draft.images ? slot.key in draft.images : false;
  const custom = Boolean(design.images?.[slot.key]);
  const decorative = slot.group === "icons";

  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setStatus(null);
    try {
      const prepared = await prepareImage(file, { maxSide: slot.maxSide });
      setSlot(slot.key, toDesignImage(prepared, ""));
      setStatus(describe(prepared, slot.recommended));
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось загрузить картинку." });
    } finally {
      setBusy(false);
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void upload(e.dataTransfer.files[0]);
  };

  const badge = inDraft
    ? draft.images?.[slot.key] === null
      ? "черновик: вернуть исходную"
      : "черновик"
    : custom
      ? "своя картинка"
      : "из брошюры";

  return (
    <article
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      aria-label={slot.label}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border-2 bg-brand-cream transition-colors",
        dragging ? "border-brand-crimson" : inDraft ? "border-brand-crimson/60" : "border-brand-amber/60"
      )}
    >
      <div className="flex items-center justify-center border-b border-brand-amber/40 bg-brand-beige/60 p-3">
        {slot.shape === "circle" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={assetUrl(img.src)} alt="" className="h-24 w-24 rounded-full border-2 border-brand-amber object-cover sm:h-28 sm:w-28" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={assetUrl(img.src)} alt="" className="h-36 w-full object-contain" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-serif text-base font-bold leading-tight text-brand-green">{slot.label}</h3>
          <span
            className={cn(
              "rounded-sm px-1.5 py-px text-[10px] font-bold uppercase tracking-wide",
              inDraft ? "bg-brand-crimson text-white" : custom ? "bg-brand-forest/15 text-brand-forest" : "bg-brand-green/10 text-brand-green/70"
            )}
          >
            {badge}
          </span>
        </div>
        {!decorative && <p className="text-xs text-brand-green/70">{slot.where}</p>}
        <p className="text-xs text-brand-green/60">
          Лучше {slot.recommended.w}×{slot.recommended.h} px{slot.shape === "circle" ? ", квадрат — покажется кругом" : ""}
        </p>

        {!decorative && custom && (
          <AltField
            key={img.src.slice(-40)}
            value={img.alt ?? ""}
            onCommit={(alt) => {
              const current = design.images?.[slot.key];
              if (current && current.alt !== alt) setSlot(slot.key, { ...current, alt });
            }}
          />
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <label className={cn(primaryButton, "cursor-pointer px-4 py-2 text-sm", busy && "pointer-events-none opacity-60")}>
            <input
              type="file"
              accept={ACCEPT_ATTR}
              className="sr-only"
              disabled={busy}
              aria-label={`Заменить: ${slot.label}`}
              onChange={(e) => {
                void upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {busy ? "Обрабатываю…" : "Заменить"}
          </label>
          {custom && (
            <button type="button" onClick={() => setSlot(slot.key, null)} className={cn(secondaryButton, "px-4 py-2 text-sm")}>
              Вернуть исходную
            </button>
          )}
          {inDraft && (
            <button type="button" onClick={() => discardSlot(slot.key)} className="px-2 py-2 text-sm text-brand-green/75 underline decoration-brand-amber underline-offset-2">
              Отменить
            </button>
          )}
        </div>
        {status && <Notice tone={status.tone}>{status.text}</Notice>}
      </div>
    </article>
  );
}

/** Описание картинки: сохраняется, когда поле теряет фокус, а не на каждую букву. */
function AltField({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
  const [text, setText] = useState(value);
  return (
    <div>
      <label className="block">
        <span className="mb-1 block text-xs text-brand-green/80">Что на картинке (для незрячих и поиска)</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 200))}
          onBlur={() => onCommit(text.trim())}
          placeholder="Например: море и скалы в венке из полевых цветов"
          className={cn(inputClass, "py-2 text-sm")}
        />
      </label>
      {!text.trim() && <p className="mt-1 text-xs text-brand-crimson">Добавьте описание — без него картинку «не видят» поисковики.</p>}
    </div>
  );
}

/* ── Баннеры на главной ──────────────────────────────────────── */

const newId = () => `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function BannersEditor() {
  const { design, draft, setBanners, discardBanners } = useDesign();
  const banners = design.banners ?? [];
  const [editing, setEditing] = useState<Banner | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = (list: Banner[]) => {
    try {
      setBanners(list);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить.");
      return false;
    }
  };

  const move = (i: number, to: number) => {
    if (to < 0 || to >= banners.length) return;
    const next = [...banners];
    const [b] = next.splice(i, 1);
    next.splice(to, 0, b);
    save(next);
  };

  return (
    <section aria-labelledby="banners-title" className="paper-page rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="banners-title" className="title-crimson font-serif text-lg font-bold uppercase sm:text-xl">
            Баннеры на главной
          </h2>
          <p className="mt-1 text-sm text-brand-green/75">
            Показываются под первым экраном, перед «Что вас беспокоит?». До {BANNER_SPEC.max} штук. Лучше {BANNER_SPEC.recommended.w}×
            {BANNER_SPEC.recommended.h} px.
          </p>
        </div>
        {editing === null && banners.length < BANNER_SPEC.max && (
          <button type="button" onClick={() => setEditing("new")} className={cn(primaryButton, "gap-2 px-4 py-2 text-sm")}>
            <PlusIcon className="h-5 w-5" /> Добавить баннер
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {editing !== null && (
        <BannerForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={(b) => {
            const exists = banners.some((x) => x.id === b.id);
            if (save(exists ? banners.map((x) => (x.id === b.id ? b : x)) : [...banners, b])) setEditing(null);
          }}
        />
      )}

      {banners.length > 0 ? (
        <ul className="mt-4 divide-y divide-brand-amber/40">
          {banners.map((b, i) => (
            <li key={b.id} className="flex flex-wrap items-center gap-3 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(b.image.src)} alt="" className="h-14 w-24 shrink-0 rounded-lg border border-brand-amber/60 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif font-bold text-brand-green">{b.title || b.image.alt || "Баннер без заголовка"}</p>
                <p className="truncate text-xs text-brand-green/65">
                  {b.hidden ? "скрыт · " : ""}
                  {b.href ? `ссылка: ${b.href}` : "без ссылки"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <IconButton label={`Выше: ${b.title || "баннер"}`} onClick={() => move(i, i - 1)} disabled={i === 0}>
                  ↑
                </IconButton>
                <IconButton label={`Ниже: ${b.title || "баннер"}`} onClick={() => move(i, i + 1)} disabled={i === banners.length - 1}>
                  ↓
                </IconButton>
                <button type="button" onClick={() => setEditing(b)} className="rounded-full border border-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-green hover:border-brand-crimson">
                  Изменить
                </button>
                <button
                  type="button"
                  onClick={() => save(banners.map((x) => (x.id === b.id ? { ...x, hidden: !x.hidden } : x)))}
                  className="rounded-full border border-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-green hover:border-brand-crimson"
                >
                  {b.hidden ? "Показать" : "Скрыть"}
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm("Удалить баннер?") && save(banners.filter((x) => x.id !== b.id))}
                  className="rounded-full border border-brand-poppy/40 px-3 py-1.5 text-xs font-semibold text-brand-poppy hover:border-brand-poppy"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        editing === null && (
          <p className="mt-4 flex items-center gap-3 rounded-xl border-2 border-dashed border-brand-amber/70 px-4 py-6 text-sm text-brand-green/70">
            <ImageIcon className="h-8 w-8 shrink-0 text-brand-gold" />
            Баннеров нет — на главной этого блока не видно.
          </p>
        )
      )}

      {draft.banners && (
        <button type="button" onClick={discardBanners} className="mt-3 text-sm text-brand-green/75 underline decoration-brand-amber underline-offset-2">
          Отменить неопубликованные изменения баннеров
        </button>
      )}
    </section>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-amber text-brand-green hover:border-brand-crimson disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function BannerForm({ initial, onSave, onCancel }: { initial: Banner | null; onSave: (b: Banner) => void; onCancel: () => void }) {
  const { products } = useCatalog();
  const [image, setImage] = useState<DesignImage | null>(initial?.image ?? null);
  const [alt, setAlt] = useState(initial?.image.alt ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [linkLabel, setLinkLabel] = useState(initial?.linkLabel ?? "");
  const [hidden, setHidden] = useState(initial?.hidden ?? false);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const LINKS: Array<[string, string]> = [
    ["", "Без ссылки"],
    ...MAIN_NAV.map((n) => [n.href, n.label] as [string, string]),
    ...SUBCATEGORIES.map((s) => [`/catalog?cat=${s.key}`, `Каталог → ${s.label}`] as [string, string]),
    ...products.map((p) => [`/catalog/${p.slug}`, `Товар → ${p.name}`] as [string, string]),
  ];
  const known = LINKS.some(([v]) => v === href);
  const [custom, setCustom] = useState(Boolean(href) && !known);

  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setStatus(null);
    try {
      const prepared = await prepareImage(file, { maxSide: BANNER_SPEC.maxSide });
      setImage(toDesignImage(prepared, alt));
      setStatus(describe(prepared, BANNER_SPEC.recommended));
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Не удалось загрузить картинку." });
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!image) return setStatus({ tone: "error", text: "Добавьте картинку баннера (JPEG или PNG)." });
    if (!alt.trim()) return setStatus({ tone: "error", text: "Опишите, что на картинке, — это увидят незрячие посетители и поисковики." });
    const link = href.trim() ? safeHref(href) : undefined;
    if (href.trim() && !link) return setStatus({ tone: "error", text: "Ссылка: адрес сайта, начинающийся с /, или полный адрес https://…" });
    onSave({
      id: initial?.id ?? newId(),
      image: { ...image, alt: alt.trim() },
      ...(title.trim() ? { title: title.trim() } : {}),
      ...(text.trim() ? { text: text.trim() } : {}),
      ...(link ? { href: link } : {}),
      ...(link && linkLabel.trim() ? { linkLabel: linkLabel.trim() } : {}),
      ...(hidden ? { hidden: true } : {}),
    });
  }

  return (
    <form onSubmit={onSubmit} aria-label={initial ? "Изменить баннер" : "Новый баннер"} className="mt-4 space-y-4 rounded-xl border-2 border-brand-crimson/40 bg-brand-cream p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void upload(e.dataTransfer.files[0]);
          }}
          className="flex flex-col gap-2"
        >
          <div className="flex aspect-[16/7] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-brand-amber bg-brand-beige/60">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assetUrl(image.src)} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 p-3 text-center text-xs text-brand-green/65">
                <ImageIcon className="h-8 w-8 text-brand-gold" />
                Перетащите сюда JPEG или PNG
              </span>
            )}
          </div>
          <label className={cn(secondaryButton, "cursor-pointer py-2 text-sm", busy && "pointer-events-none opacity-60")}>
            <input
              type="file"
              accept={ACCEPT_ATTR}
              className="sr-only"
              aria-label="Картинка баннера"
              onChange={(e) => {
                void upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {busy ? "Обрабатываю…" : image ? "Заменить картинку" : "Выбрать картинку"}
          </label>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm text-brand-green/85">Что на картинке *</span>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} placeholder="Например: бальзамы на фоне Ласточкина гнезда" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-brand-green/85">Заголовок</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-brand-green/85">Текст</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={400} rows={2} className={inputClass} />
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-brand-green/85">Куда ведёт баннер</span>
          <select
            value={custom ? "__custom" : href}
            onChange={(e) => {
              if (e.target.value === "__custom") {
                setCustom(true);
              } else {
                setCustom(false);
                setHref(e.target.value);
              }
            }}
            className={inputClass}
          >
            {LINKS.map(([v, l]) => (
              <option key={v || "none"} value={v}>
                {l}
              </option>
            ))}
            <option value="__custom">Свой адрес…</option>
          </select>
        </label>
        {custom ? (
          <label className="block">
            <span className="mb-1 block text-sm text-brand-green/85">Адрес ссылки</span>
            <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="https://… или /catalog" className={inputClass} />
          </label>
        ) : (
          href && (
            <label className="block">
              <span className="mb-1 block text-sm text-brand-green/85">Текст ссылки</span>
              <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} maxLength={40} placeholder="Подробнее" className={inputClass} />
            </label>
          )
        )}
      </div>

      <label className="flex items-center gap-3 text-sm text-brand-green/85">
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="h-4 w-4 accent-brand-green" />
        Скрыть с сайта (баннер сохранится в кабинете)
      </label>

      {status && <Notice tone={status.tone}>{status.text}</Notice>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className={cn(primaryButton, "px-5 py-2.5 text-sm")}>
          {initial ? "Сохранить баннер" : "Добавить на главную"}
        </button>
        <button type="button" onClick={onCancel} className={cn(secondaryButton, "px-5 py-2.5 text-sm")}>
          Отмена
        </button>
      </div>
    </form>
  );
}
