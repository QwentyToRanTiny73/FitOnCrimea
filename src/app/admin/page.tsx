"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminProductForm, emptyProduct } from "@/components/admin/AdminProductForm";
import { GitHubLogin } from "@/components/admin/GitHubLogin";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { SheetPanel } from "@/components/admin/SheetPanel";
import { OctagonJar } from "@/components/ui/Brochure";
import { Notice, inputClass, secondaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SUBCATEGORIES, subcategoryMeta } from "@/config/categories";
import { products as publishedProducts, type ProductSubcategory } from "@/data/catalog";
import { useAuth, useCatalog } from "@/providers";
import { assetUrl, cn, formatPrice } from "@/lib/utils";

type Tab = "products" | "new" | "publish" | "sheet" | "help";
type Filter = ProductSubcategory | "all" | "drafts" | "hidden";

export default function AdminPage() {
  const { user, loading, isAdmin, adminToken, logout } = useAuth();
  const { overrides } = useCatalog();
  const [tab, setTab] = useState<Tab>("products");
  const [open, setOpen] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (loading) return <div className="min-h-[50vh]" />;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
        <SectionHeading as="h1" eyebrow="Кабинет администратора" title="Вход для администратора" />
        {user && (
          <div className="mb-4">
            <Notice tone="info">Вы вошли как покупатель ({user.name}). Для управления сайтом войдите ключом GitHub.</Notice>
          </div>
        )}
        <GitHubLogin />
      </div>
    );
  }

  const draftCount = Object.keys(overrides).length;
  const TABS: Array<[Tab, string]> = [
    ["products", "Товары"],
    ["new", "+ Новый товар"],
    ["publish", draftCount ? `Публикация · ${draftCount}` : "Публикация"],
    ["sheet", "Таблица Excel"],
    ["help", "Справка"],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">Кабинет администратора</p>
          <h1 className="title-crimson font-serif text-2xl font-bold uppercase sm:text-3xl">Управление каталогом</h1>
          <p className="mt-1 text-sm text-brand-green/75">
            {user?.name} · {adminToken ? "вход через GitHub — публикация доступна" : "без ключа GitHub — только черновики"}
          </p>
        </div>
        <button type="button" onClick={() => void logout()} className={cn(secondaryButton, "py-2 text-sm")}>
          Выйти
        </button>
      </div>

      <div role="tablist" aria-label="Разделы админки" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key);
              setNotice(null);
            }}
            className={cn(
              "shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
              tab === key
                ? "border-brand-green bg-brand-green text-brand-cream"
                : key === "publish" && draftCount
                  ? "border-brand-crimson bg-brand-cream text-brand-crimson"
                  : "border-brand-amber bg-brand-cream text-brand-green"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="mb-4">
          <Notice tone="ok">{notice}</Notice>
        </div>
      )}

      {tab === "products" && <ProductsTab open={open} setOpen={setOpen} />}
      {tab === "new" && (
        <section className="paper-page rounded-2xl p-5 sm:p-6">
          <h2 className="title-crimson mb-4 font-serif text-xl font-bold uppercase">Новый товар</h2>
          <AdminProductForm
            base={emptyProduct()}
            mode="create"
            onCreated={(slug) => {
              setTab("products");
              setOpen(slug);
              setNotice("Товар создан в черновиках. Проверьте его и опубликуйте во вкладке «Публикация».");
            }}
          />
        </section>
      )}
      {tab === "publish" && <PublishPanel />}
      {tab === "sheet" && <SheetPanel />}
      {tab === "help" && <HelpTab />}
    </div>
  );
}

function ProductsTab({ open, setOpen }: { open: string | null; setOpen: (slug: string | null) => void }) {
  const { allProducts, overrides, setOverride } = useCatalog();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (filter === "drafts" && !overrides[p.slug]) return false;
      if (filter === "hidden" && !p.hidden) return false;
      if (!["all", "drafts", "hidden"].includes(filter) && p.subcategory !== filter) return false;
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

function HelpTab() {
  const steps = [
    ["Изменить карточку", "«Товары» → нажмите на товар → правьте поля → «Сохранить». Изменения сразу видны вам, но не покупателям."],
    ["Добавить фото", "В карточке: «Выбрать фото с компьютера» или перетащите файлы мышкой. ★ — сделать обложкой, ← → — порядок, × — удалить."],
    ["Новый товар", "«+ Новый товар» → название, раздел, цена → «Создать товар». Адрес страницы заполнится сам."],
    ["Снять с продажи", "Кнопка «Скрыть» в списке или галочка «Снять с витрины» в карточке. Товар пропадёт из каталога, но не удалится."],
    ["Много правок сразу", "«Таблица Excel»: скачать → поправить цены или ссылки → загрузить обратно."],
    ["Показать всем", "«Публикация» → «Опубликовать». Через 2–3 минуты сайт обновится. История всех версий хранится в GitHub."],
  ];
  return (
    <section className="paper-page rounded-2xl p-5 sm:p-6">
      <h2 className="title-crimson mb-4 font-serif text-xl font-bold uppercase">Как пользоваться</h2>
      <ol className="space-y-4">
        {steps.map(([title, text], i) => (
          <li key={title} className="flex gap-4">
            <span className="font-display text-3xl leading-none text-brand-crimson">{i + 1}</span>
            <span>
              <span className="block font-serif text-lg font-bold text-brand-green">{title}</span>
              <span className="text-sm leading-relaxed text-brand-green/85">{text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-brand-green/75">
        Черновики живут только в этом браузере. Если работаете с двух компьютеров — публикуйте перед переходом на другой.
      </p>
    </section>
  );
}
