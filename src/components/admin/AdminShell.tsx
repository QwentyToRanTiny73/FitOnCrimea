"use client";

import Link from "next/link";
import { useAdmin, useCatalog, useDesign } from "@/providers";
import { Emblem } from "@/components/ui/Brochure";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  ExternalIcon,
  HelpIcon,
  ImageIcon,
  JarIcon,
  KeyIcon,
  LogoutIcon,
  PlusIcon,
  TableIcon,
  UploadIcon,
} from "./AdminIcons";

export type AdminSection = "overview" | "products" | "new" | "design" | "publish" | "sheet" | "account" | "help";

export const SECTIONS: Array<{ key: AdminSection; label: string; title: string; Icon: (p: { className?: string }) => JSX.Element }> = [
  { key: "overview", label: "Обзор", title: "Обзор магазина", Icon: DashboardIcon },
  { key: "products", label: "Товары", title: "Товары", Icon: JarIcon },
  { key: "new", label: "Новый товар", title: "Новый товар", Icon: PlusIcon },
  { key: "design", label: "Оформление", title: "Оформление сайта", Icon: ImageIcon },
  { key: "publish", label: "Публикация", title: "Публикация на сайт", Icon: UploadIcon },
  { key: "sheet", label: "Таблица Excel", title: "Таблица Excel", Icon: TableIcon },
  { key: "account", label: "Учётная запись", title: "Учётная запись", Icon: KeyIcon },
  { key: "help", label: "Справка", title: "Как пользоваться кабинетом", Icon: HelpIcon },
];

export const isSection = (v: string): v is AdminSection => SECTIONS.some((s) => s.key === v);

/** Оболочка кабинета: верхняя панель, меню слева на ПК и лентой сверху на телефоне. */
export function AdminShell({
  section,
  onSection,
  children,
}: {
  section: AdminSection;
  onSection: (s: AdminSection) => void;
  children: React.ReactNode;
}) {
  const { login, signOut } = useAdmin();
  const { overrides } = useCatalog();
  const { draft } = useDesign();
  const pending = Object.keys(overrides).length + Object.keys(draft.images ?? {}).length + (draft.banners ? 1 : 0);
  const current = SECTIONS.find((s) => s.key === section)!;

  const item = (s: (typeof SECTIONS)[number], compact: boolean) => (
    <button
      key={s.key}
      type="button"
      onClick={() => onSection(s.key)}
      aria-current={section === s.key ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-semibold transition-colors",
        compact ? "shrink-0 px-3 py-2" : "w-full px-3 py-2.5 text-left",
        section === s.key
          ? compact
            ? "bg-brand-cream text-brand-green"
            : "bg-brand-green text-brand-cream"
          : compact
            ? "text-brand-cream/85 hover:bg-brand-cream/10"
            : "text-brand-green hover:bg-brand-amber/20"
      )}
    >
      <s.Icon className="h-5 w-5 shrink-0" />
      <span>{s.label}</span>
      {s.key === "publish" && pending > 0 && (
        <span className="ml-auto rounded-full bg-brand-crimson px-1.5 py-px text-[11px] font-bold text-white" aria-label={`не опубликовано: ${pending}`}>
          {pending}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-beige">
      <header className="sticky top-0 z-30 bg-brand-green text-brand-cream shadow-[0_2px_0_rgba(30,63,37,0.4)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Emblem className="h-8 w-8 shrink-0" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-lg uppercase tracking-wide text-brand-amber">Фитон Крым</span>
            <span className="block truncate text-[11px] uppercase tracking-[0.2em] text-brand-cream/75">Кабинет администратора</span>
          </span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-brand-cream/90 hover:bg-brand-cream/10"
              aria-label="Открыть сайт в новой вкладке"
            >
              <ExternalIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Сайт</span>
            </Link>
            <span className="hidden max-w-[10rem] truncate px-2 text-sm text-brand-cream/80 md:inline" title="Вы вошли как">
              {login}
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex h-10 items-center gap-1.5 rounded-full border border-brand-cream/40 px-3 text-sm hover:bg-brand-cream/10"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
        <nav aria-label="Разделы кабинета" className="border-t border-brand-cream/15 lg:hidden">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2">{SECTIONS.map((s) => item(s, true))}</div>
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6">
        <nav aria-label="Разделы кабинета" className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-6 lg:block">
          <div className="space-y-1">{SECTIONS.map((s) => item(s, false))}</div>
          <p className="mt-6 px-3 text-xs leading-relaxed text-brand-green/60">
            Вы вошли как <b className="text-brand-green/80">{login}</b>
          </p>
        </nav>
        <div className="min-w-0 flex-1 py-6 sm:py-8">
          <h1 className="title-crimson mb-5 font-serif text-2xl font-bold uppercase sm:text-3xl">{current.title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
