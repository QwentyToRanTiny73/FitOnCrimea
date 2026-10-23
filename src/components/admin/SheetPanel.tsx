"use client";

import { ChangeEvent, useState } from "react";
import { useCatalog } from "@/providers";
import { productsToCsv, sheetToPatches, type SheetImport } from "@/services/sheet";
import { cn } from "@/lib/utils";
import { Notice, primaryButton, secondaryButton } from "@/components/ui/Form";

/** Массовая правка каталога в Excel: скачать таблицу → изменить → загрузить. */
export function SheetPanel() {
  const { allProducts, overrides, replaceAll } = useCatalog();
  const [report, setReport] = useState<SheetImport | null>(null);
  const [error, setError] = useState<string | null>(null);

  function download() {
    const blob = new Blob([productsToCsv(allProducts)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fiton-krym-katalog.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    try {
      const res = sheetToPatches(await file.text(), allProducts);
      const next = { ...overrides };
      for (const [slug, patch] of Object.entries(res.patches)) next[slug] = { ...next[slug], ...patch };
      replaceAll(next);
      setReport(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось прочитать таблицу.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <h2 className="title-crimson font-serif text-xl font-bold uppercase">Таблица Excel</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-brand-green/90">
          <li>Скачайте таблицу — в ней все товары с текущими данными.</li>
          <li>Откройте в Excel, поменяйте цены, ссылки Ozon, тексты. Новый товар — новая строка с названием, разделом и ценой.</li>
          <li>
            Сохраните: <b>Файл → Сохранить как → «CSV UTF-8 (разделители — запятые)»</b> или обычный CSV с точкой с запятой.
          </li>
          <li>Загрузите файл сюда — изменённые поля попадут в черновики. Проверьте их и опубликуйте.</li>
        </ol>
        <p className="mt-3 text-xs text-brand-green/65">
          Фото через таблицу не меняются — их загружают в карточке товара. Состав разделяйте знаком «|».
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={download} className={primaryButton}>
            Скачать таблицу
          </button>
          <label className={cn(secondaryButton, "cursor-pointer")}>
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={upload} />
            Загрузить таблицу
          </label>
        </div>
      </section>

      {error && <Notice tone="error">{error}</Notice>}
      {report && (
        <section className="paper-page space-y-2 rounded-2xl p-5 text-sm text-brand-green sm:p-6" aria-live="polite">
          <p>
            Изменено товаров: <b>{report.updated.length}</b>, новых: <b>{report.created.length}</b>.
            {report.updated.length + report.created.length === 0 && " Отличий от каталога не найдено."}
          </p>
          {report.errors.length > 0 && (
            <ul className="space-y-1 text-brand-poppy">
              {report.errors.map((e) => (
                <li key={e}>— {e}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
