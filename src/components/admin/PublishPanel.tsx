"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { site } from "@/config/site";
import { products as publishedProducts } from "@/data/catalog";
import { sanitizeOverrideMap } from "@/data/catalog/sanitize";
import { useAuth, useCatalog } from "@/providers";
import { lastPublish, plural, publishDrafts, type PublishResult } from "@/services/publisher";
import { usedKilobytes } from "@/services/storage";
import { cn } from "@/lib/utils";
import { Notice, primaryButton, secondaryButton } from "@/components/ui/Form";
import { GitHubLogin } from "./GitHubLogin";

const FIELD_LABELS: Record<string, string> = {
  name: "название",
  tagline: "растения",
  subtitle: "подзаголовок",
  category: "линейка",
  subcategory: "раздел",
  price: "цена",
  weight: "вес",
  badges: "отметки",
  hidden: "видимость",
  ozonUrl: "ссылка Ozon",
  shortDescription: "кратко",
  effect: "показания",
  description: "описание",
  composition: "состав",
  application: "применение",
  contraindications: "противопоказания",
  images: "фото",
  pairsWith: "подборка",
};

export function PublishPanel() {
  const { overrides, allProducts, replaceAll } = useCatalog();
  const { adminToken, user } = useAuth();
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [usedKb, setUsedKb] = useState(0);

  useEffect(() => {
    setResult(lastPublish());
    setUsedKb(usedKilobytes());
  }, [overrides]);

  const drafts = Object.entries(overrides);
  const repoUrl = `https://github.com/${site.repo.owner}/${site.repo.repo}`;

  async function publish() {
    if (!adminToken) return;
    setBusy(true);
    setError(null);
    setLog([]);
    try {
      const r = await publishDrafts(adminToken, site.repo, overrides, (step) => setLog((l) => [...l, step]));
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось опубликовать.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "overrides-drafts.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importJson(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const map = sanitizeOverrideMap(JSON.parse(await file.text()));
      replaceAll({ ...overrides, ...map });
      setError(null);
      setLog([`Загружено черновиков из файла: ${Object.keys(map).length}.`]);
    } catch {
      setError("Файл не похож на выгрузку админки (JSON).");
    }
  }

  return (
    <div className="space-y-6">
      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <h2 className="title-crimson font-serif text-xl font-bold uppercase">Черновики</h2>
        {drafts.length === 0 ? (
          <p className="mt-2 text-brand-green/80">Неопубликованных изменений нет.</p>
        ) : (
          <ul className="mt-3 divide-y divide-brand-amber/40">
            {drafts.map(([slug, patch]) => {
              const p = allProducts.find((x) => x.slug === slug);
              const isNew = !publishedProducts.some((x) => x.slug === slug);
              const photos = (patch.images ?? []).filter((s) => s.startsWith("data:")).length;
              return (
                <li key={slug} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
                  <span className="font-serif font-bold text-brand-green">{p?.name ?? slug}</span>
                  <span className="text-sm text-brand-green/75">
                    {isNew ? "новый товар" : Object.keys(patch).map((k) => FIELD_LABELS[k] ?? k).join(", ")}
                    {photos ? ` · новых фото: ${photos}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-xs text-brand-green/60">
          Занято в браузере: {usedKb} КБ из ~5000. Если места мало — опубликуйте изменения и очистите черновики.
        </p>
      </section>

      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <h2 className="title-crimson font-serif text-xl font-bold uppercase">Опубликовать на сайт</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-green/85">
          Фото и правки сохранятся в репозиторий одним коммитом, затем сайт автоматически пересоберётся
          за 2–3 минуты. Предыдущая версия остаётся в истории GitHub — её всегда можно вернуть.
        </p>

        {!adminToken ? (
          <div className="mt-4 space-y-3">
            <Notice tone="info">
              {user ? `Вы вошли как ${user.name}, но без ключа GitHub. ` : ""}Для публикации войдите ключом GitHub.
            </Notice>
            <GitHubLogin />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <button type="button" onClick={publish} disabled={busy || drafts.length === 0} className={cn(primaryButton, "w-full sm:w-auto")}>
              {busy
                ? "Публикую…"
                : `Опубликовать ${drafts.length} ${plural(drafts.length, "изменение", "изменения", "изменений")}`}
            </button>
            {log.length > 0 && (
              <ol className="space-y-1 text-sm text-brand-green/85" aria-live="polite">
                {log.map((l, i) => (
                  <li key={i}>✓ {l}</li>
                ))}
              </ol>
            )}
          </div>
        )}
        {error && (
          <div className="mt-3">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
        {result && (
          <div className="mt-4 rounded-xl border-2 border-dashed border-brand-forest/40 bg-brand-forest/5 p-4 text-sm text-brand-green">
            <p>
              Последняя публикация: {new Date(result.at).toLocaleString("ru-RU")} — товаров {result.products}, фото {result.photos}.
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <a href={result.commitUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-amber underline-offset-2">
                Коммит
              </a>
              <a href={`${repoUrl}/actions`} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-amber underline-offset-2">
                Ход сборки сайта
              </a>
            </p>
            <p className="mt-2 text-brand-green/75">Когда сборка станет зелёной, обновите сайт и очистите черновики.</p>
          </div>
        )}
        <button
          type="button"
          disabled={drafts.length === 0}
          onClick={() => window.confirm("Удалить все черновики в этом браузере? Опубликованное на сайте не изменится.") && replaceAll({})}
          className={cn(secondaryButton, "mt-4 py-2 text-sm text-brand-poppy")}
        >
          Очистить черновики
        </button>
      </section>

      <details className="paper-page rounded-2xl p-5 sm:p-6">
        <summary className="cursor-pointer font-serif font-bold text-brand-green">Без GitHub-ключа: файл черновиков</summary>
        <p className="mt-3 text-sm text-brand-green/80">
          Можно перенести черновики на другой компьютер или отдать разработчику: скачать файл и загрузить его там.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" onClick={download} disabled={!drafts.length} className={cn(secondaryButton, "py-2 text-sm")}>
            Скачать черновики (JSON)
          </button>
          <label className={cn(secondaryButton, "cursor-pointer py-2 text-sm")}>
            <input type="file" accept="application/json,.json" className="sr-only" onChange={importJson} />
            Загрузить черновики
          </label>
        </div>
      </details>
    </div>
  );
}
