import type { OverrideMap, Product, ProductBadge, ProductCategory, ProductOverride, ProductSubcategory } from "./types";

/**
 * Проверка правок из overrides.json, импорта и админки. Неверные поля
 * отбрасываются, а не ломают сборку сайта.
 */

const CATEGORIES: ProductCategory[] = ["balm", "soap", "lip-balm"];
const SUBCATEGORIES: ProductSubcategory[] = ["face", "body", "hair", "joints", "respiratory", "repellent", "other"];
const BADGES: ProductBadge[] = ["hit", "new"];

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const strList = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : undefined;

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Ссылка на товар или магазин Ozon: только https и домен ozon.ru. */
export const OZON_RE = /^https:\/\/(?:www\.)?ozon\.ru\/[^\s"'<>\\]*$/i;
/** Фото товара: файл сайта или (только в черновике админки) data:-картинка. */
const IMAGE_PATH_RE = /^\/(?:products|design|brochure)\/[A-Za-z0-9._-]+\.(?:webp|jpe?g|png)$/;
const IMAGE_DATA_RE = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

export interface SanitizeOptions {
  /** data:-картинки допустимы только в черновиках браузера, не в опубликованном JSON. */
  allowData?: boolean;
}

export function sanitizeOverride(raw: unknown, { allowData = true }: SanitizeOptions = {}): ProductOverride {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const r = raw as Record<string, unknown>;
  const o: ProductOverride = {};
  for (const k of ["name", "tagline", "subtitle", "weight", "shortDescription", "effect", "description", "application", "contraindications"] as const) {
    const v = str(r[k]);
    if (v !== undefined) o[k] = v;
  }
  if (typeof r.ozonUrl === "string") {
    const url = r.ozonUrl.trim();
    if (!url) o.ozonUrl = undefined;
    else if (OZON_RE.test(url)) o.ozonUrl = url;
  }
  const price = typeof r.price === "string" ? Number(r.price.replace(",", ".")) : r.price;
  if (typeof price === "number" && Number.isFinite(price) && price >= 0) o.price = Math.round(price);
  if (CATEGORIES.includes(r.category as ProductCategory)) o.category = r.category as ProductCategory;
  if (SUBCATEGORIES.includes(r.subcategory as ProductSubcategory)) o.subcategory = r.subcategory as ProductSubcategory;
  const badges = strList(r.badges)?.filter((b): b is ProductBadge => BADGES.includes(b as ProductBadge));
  if (badges) o.badges = badges;
  for (const k of ["composition", "pairsWith"] as const) {
    const v = strList(r[k]);
    if (v) o[k] = v;
  }
  const images = strList(r.images)?.filter((src) => IMAGE_PATH_RE.test(src) || (allowData && IMAGE_DATA_RE.test(src)));
  if (images) o.images = images;
  if (typeof r.hidden === "boolean") o.hidden = r.hidden;
  return o;
}

export function sanitizeOverrideMap(raw: unknown, opts: SanitizeOptions = {}): OverrideMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: OverrideMap = {};
  for (const [slug, v] of Object.entries(raw as Record<string, unknown>)) {
    if (SLUG_RE.test(slug)) out[slug] = sanitizeOverride(v, opts);
  }
  return out;
}

/** Новый товар из правки: нужны название, раздел и цена. Остальное — по умолчанию. */
export function productFromOverride(slug: string, o: ProductOverride): Product | null {
  if (!o.name?.trim() || !o.subcategory || o.price === undefined) return null;
  return {
    id: slug,
    slug,
    name: o.name.trim(),
    tagline: o.tagline ?? "",
    subtitle: o.subtitle,
    category: o.category ?? "balm",
    subcategory: o.subcategory,
    price: o.price,
    weight: o.weight ?? "15 г",
    badges: o.badges,
    shortDescription: o.shortDescription ?? "",
    effect: o.effect ?? "",
    description: o.description,
    composition: o.composition ?? [],
    application: o.application ?? "",
    contraindications: o.contraindications ?? "",
    ozonUrl: o.ozonUrl,
    images: o.images ?? [],
    pairsWith: o.pairsWith,
    hidden: o.hidden,
  };
}

/** Каталог = базовые товары с правками + новые товары из правок. */
export function applyOverrides(base: Product[], map: OverrideMap): Product[] {
  const known = new Set(base.map((p) => p.slug));
  const merged = base.map((p) => (map[p.slug] ? { ...p, ...map[p.slug] } : p));
  const added = Object.entries(map)
    .filter(([slug]) => !known.has(slug))
    .map(([slug, o]) => productFromOverride(slug, o))
    .filter((p): p is Product => p !== null);
  return [...merged, ...added];
}

/** Транслитерация названия в адрес страницы: «Гладкие пятки» → gladkie-pyatki. */
export function slugify(text: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
