"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { DESIGN_SLOTS, isSlotChanged, visibleBanners } from "@/data/design";
import { useAdmin, useCatalog, useDesign } from "@/providers";
import { lastPublish, plural, type PublishResult } from "@/services/publisher";
import { cn } from "@/lib/utils";
import type { AdminSection } from "./AdminShell";

/** Обзор: главные цифры магазина и что требует внимания. */
export function AdminDashboard({ go }: { go: (s: AdminSection, filter?: string) => void }) {
  const { allProducts, overrides } = useCatalog();
  const { design, draft, hasDraft } = useDesign();
  const { keyStatus, keyProblem } = useAdmin();
  const [last, setLast] = useState<PublishResult | null>(null);
  useEffect(() => setLast(lastPublish()), []);

  const visible = allProducts.filter((p) => !p.hidden);
  const hidden = allProducts.length - visible.length;
  const noPhoto = visible.filter((p) => !p.images.length).length;
  const noOzon = visible.filter((p) => !p.ozonUrl).length;
  const drafts = Object.keys(overrides).length + Object.keys(draft.images ?? {}).length + (draft.banners ? 1 : 0);
  const customImages = DESIGN_SLOTS.filter((s) => isSlotChanged(design, s.key)).length;
  const banners = visibleBanners(design).length;

  const tiles: Array<{ label: string; value: number; note: string; to: AdminSection; filter?: string; alert?: boolean }> = [
    { label: "Товаров на витрине", value: visible.length, note: hidden ? `ещё ${hidden} скрыто` : "скрытых нет", to: "products" },
    { label: "Без ссылки Ozon", value: noOzon, note: "кнопка «Купить» неактивна", to: "products", filter: "no-ozon", alert: noOzon > 0 },
    { label: "Без фото", value: noPhoto, note: "показана баночка-заглушка", to: "products", filter: "no-photo", alert: noPhoto > 0 },
    { label: "Не опубликовано", value: drafts, note: drafts ? "видно только вам" : "всё на сайте", to: "publish", alert: drafts > 0 },
    { label: "Своих картинок", value: customImages, note: `из ${DESIGN_SLOTS.length} мест на сайте`, to: "design" },
    { label: "Баннеров на главной", value: banners, note: banners ? "показываются" : "блок скрыт", to: "design" },
  ];

  return (
    <div className="space-y-6">
      {keyStatus === "invalid" && (
        <Alert tone="error" action={{ label: "Заменить ключ", onClick: () => go("account") }}>
          Публикация недоступна: {keyProblem ?? "ключ GitHub не работает."} Черновики при этом сохраняются.
        </Alert>
      )}
      {keyStatus === "offline" && <Alert tone="info">Нет связи с GitHub — публиковать сейчас нельзя, но черновики сохраняются.</Alert>}

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {tiles.map((t) => (
          <li key={t.label}>
            <button
              type="button"
              onClick={() => go(t.to, t.filter)}
              className={cn(
                "flex h-full w-full flex-col items-start rounded-xl border-2 bg-brand-cream p-4 text-left transition-colors hover:border-brand-crimson",
                t.alert ? "border-brand-crimson/50" : "border-brand-amber/60"
              )}
            >
              <span className="text-sm text-brand-green/80">{t.label}</span>
              <span className="mt-1 font-sans text-3xl font-semibold tabular-nums text-brand-green sm:text-4xl">{t.value}</span>
              <span className={cn("mt-1 text-xs", t.alert ? "font-semibold text-brand-crimson" : "text-brand-green/65")}>{t.note}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="paper-page rounded-2xl p-5">
          <h2 className="title-crimson font-serif text-lg font-bold uppercase">Быстрые действия</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["Добавить товар", "new"],
                ["Заменить картинки сайта", "design"],
                ["Добавить баннер", "design"],
                ["Цены таблицей Excel", "sheet"],
              ] as Array<[string, AdminSection]>
            ).map(([label, to]) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => go(to)}
                  className="w-full rounded-lg border border-brand-amber/70 bg-brand-cream px-3 py-2.5 text-left text-sm font-semibold text-brand-green hover:border-brand-crimson"
                >
                  {label} →
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="paper-page rounded-2xl p-5">
          <h2 className="title-crimson font-serif text-lg font-bold uppercase">Публикация</h2>
          {drafts > 0 ? (
            <p className="mt-2 text-sm text-brand-green/85">
              {drafts} {plural(drafts, "изменение ждёт", "изменения ждут", "изменений ждут")} публикации
              {hasDraft ? " (в том числе оформление)" : ""}.
            </p>
          ) : (
            <p className="mt-2 text-sm text-brand-green/85">Неопубликованных изменений нет.</p>
          )}
          {last ? (
            <p className="mt-2 text-sm text-brand-green/75">
              Последняя публикация из этого браузера: {new Date(last.at).toLocaleString("ru-RU")}.{" "}
              <a href={`https://github.com/${site.repo.owner}/${site.repo.repo}/actions`} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-amber underline-offset-2">
                Ход сборки
              </a>
            </p>
          ) : (
            <p className="mt-2 text-sm text-brand-green/75">Из этого браузера ещё не публиковали.</p>
          )}
          <button
            type="button"
            onClick={() => go("publish")}
            className="mt-3 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-cream shadow-[0_2px_0_#1e3f25] hover:bg-brand-forest"
          >
            Перейти к публикации
          </button>
        </section>
      </div>
    </div>
  );
}

function Alert({ tone, children, action }: { tone: "error" | "info"; children: React.ReactNode; action?: { label: string; onClick: () => void } }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm",
        tone === "error" ? "border-brand-poppy/40 bg-brand-poppy/5 text-brand-poppy" : "border-brand-gold/40 bg-brand-cream text-brand-green/85"
      )}
    >
      <span>{children}</span>
      {action && (
        <button type="button" onClick={action.onClick} className="rounded-full border border-current px-3 py-1 text-xs font-semibold">
          {action.label}
        </button>
      )}
    </div>
  );
}
