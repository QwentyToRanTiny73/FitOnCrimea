import { SUBCATEGORIES } from "@/config/categories";
import { SLUG_RE, sanitizeOverride, slugify } from "@/data/catalog/sanitize";
import type { OverrideMap, Product, ProductBadge, ProductOverride } from "@/data/catalog/types";

/**
 * Таблица для Excel: выгрузка каталога в CSV и обратная загрузка.
 * Разделитель «;» и метка UTF-8 — так русский Excel открывает файл без «кракозябр».
 */

type Col = { header: string; get: (p: Product) => string; set?: (o: ProductOverride, v: string) => void };

const yes = (v: string) => /^(да|yes|1|true|\+)$/i.test(v.trim());
const LIST = " | ";

const subLabel = (key: string) => SUBCATEGORIES.find((s) => s.key === key)?.label ?? key;
const subKey = (v: string) => {
  const t = v.trim().toLowerCase();
  return SUBCATEGORIES.find((s) => s.key === t || s.label.toLowerCase() === t)?.key;
};

const COLUMNS: Col[] = [
  { header: "Адрес (slug)", get: (p) => p.slug },
  { header: "Название", get: (p) => p.name, set: (o, v) => (o.name = v) },
  { header: "Растения", get: (p) => p.tagline, set: (o, v) => (o.tagline = v) },
  { header: "Раздел", get: (p) => subLabel(p.subcategory), set: (o, v) => { const k = subKey(v); if (k) o.subcategory = k; } },
  { header: "Цена", get: (p) => String(p.price), set: (o, v) => { const n = Number(v.replace(/\s/g, "").replace(",", ".")); if (Number.isFinite(n)) o.price = Math.round(n); } },
  { header: "Вес", get: (p) => p.weight, set: (o, v) => (o.weight = v) },
  { header: "Ссылка Ozon", get: (p) => p.ozonUrl ?? "", set: (o, v) => (o.ozonUrl = v.trim()) },
  { header: "Кратко", get: (p) => p.shortDescription, set: (o, v) => (o.shortDescription = v) },
  { header: "Показания", get: (p) => p.effect, set: (o, v) => (o.effect = v) },
  { header: "Описание", get: (p) => p.description ?? "", set: (o, v) => (o.description = v) },
  { header: "Состав (через |)", get: (p) => p.composition.join(LIST), set: (o, v) => (o.composition = v.split("|").map((s) => s.trim()).filter(Boolean)) },
  { header: "Применение", get: (p) => p.application, set: (o, v) => (o.application = v) },
  { header: "Противопоказания", get: (p) => p.contraindications, set: (o, v) => (o.contraindications = v) },
  {
    header: "Метки (хит, новинка)",
    get: (p) => (p.badges ?? []).map((b) => (b === "hit" ? "хит" : "новинка")).join(", "),
    set: (o, v) => (o.badges = v.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).map((s) => (s.startsWith("хит") ? "hit" : "new")) as ProductBadge[]),
  },
  { header: "Скрыт (да/нет)", get: (p) => (p.hidden ? "да" : "нет"), set: (o, v) => (o.hidden = yes(v)) },
];

/** Пустая строка, пустой список, «нет» и отсутствие поля — одно и то же. */
const isEmpty = (v: unknown) => v === undefined || v === "" || v === false || (Array.isArray(v) && v.length === 0);

const quote = (v: string) => (/[;"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function productsToCsv(list: Product[]): string {
  const lines = [COLUMNS.map((c) => quote(c.header)).join(";")];
  for (const p of list) lines.push(COLUMNS.map((c) => quote(c.get(p))).join(";"));
  return "﻿" + lines.join("\r\n") + "\r\n";
}

/** Разбор CSV с кавычками; разделитель определяется по первой строке. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const first = src.split(/\r?\n/, 1)[0] ?? "";
  const delim = [";", "\t", ","].sort((a, b) => first.split(b).length - first.split(a).length)[0];
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export interface SheetImport {
  patches: OverrideMap;
  updated: string[];
  created: string[];
  errors: string[];
}

/** Сравнивает таблицу с текущим каталогом: в черновики попадают только изменённые поля. */
export function sheetToPatches(text: string, current: Product[]): SheetImport {
  const rows = parseCsv(text);
  const result: SheetImport = { patches: {}, updated: [], created: [], errors: [] };
  if (rows.length < 2) {
    result.errors.push("В файле нет строк с товарами.");
    return result;
  }
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const index = COLUMNS.map((c) => header.findIndex((h) => h === c.header.toLowerCase() || h === c.header.split(" (")[0].toLowerCase()));
  if (index[0] < 0 && index[1] < 0) {
    result.errors.push("Не найдены столбцы «Адрес (slug)» и «Название». Скачайте таблицу из админки и правьте её.");
    return result;
  }
  const bySlug = new Map(current.map((p) => [p.slug, p]));

  rows.slice(1).forEach((cells, i) => {
    const line = i + 2;
    const cellOf = (c: number) => (index[c] >= 0 ? (cells[index[c]] ?? "").trim() : undefined);
    const name = cellOf(1);
    let slug = cellOf(0) || (name ? slugify(name) : "");
    if (!slug) return;
    slug = slug.toLowerCase();
    if (!SLUG_RE.test(slug)) {
      result.errors.push(`Строка ${line}: адрес «${slug}» — только латиница, цифры и дефис.`);
      return;
    }
    const next: ProductOverride = {};
    COLUMNS.forEach((col, c) => {
      const v = cellOf(c);
      if (v !== undefined && col.set) col.set(next, v);
    });
    const clean = sanitizeOverride(next);
    const existing = bySlug.get(slug);
    if (!existing) {
      if (!clean.name || !clean.subcategory || clean.price === undefined) {
        result.errors.push(`Строка ${line}: для нового товара нужны название, раздел и цена.`);
        return;
      }
      result.patches[slug] = { category: "balm", ...clean };
      result.created.push(slug);
      return;
    }
    const diff: ProductOverride = {};
    for (const [k, v] of Object.entries(clean) as [keyof ProductOverride, unknown][]) {
      const cur = existing[k];
      const same = (isEmpty(v) && isEmpty(cur)) || JSON.stringify(v) === JSON.stringify(cur);
      if (!same) (diff as Record<string, unknown>)[k] = v;
    }
    if (Object.keys(diff).length) {
      result.patches[slug] = diff;
      result.updated.push(slug);
    }
  });
  return result;
}
