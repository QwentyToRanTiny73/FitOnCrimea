import { sanitizeOverrideMap } from "@/data/catalog/sanitize";
import type { OverrideMap, ProductOverride } from "@/data/catalog/types";
import { isDraftEmpty, sanitizeDesign } from "@/data/design/sanitize";
import type { DesignDraft, DesignImage, DesignOverrides } from "@/data/design/types";
import { commitFiles, readTextFile, utf8ToBase64, type CommitFile, type RepoRef } from "./github";
import { readJSON, writeJSON } from "./storage";

/**
 * Публикация черновиков кабинета на сайт одним коммитом:
 *   товары     — фото в public/products/, правки в src/data/catalog/overrides.json;
 *   оформление — картинки в public/design/, описание в src/data/design/overrides.json.
 * GitHub Actions пересобирает сайт за 2–3 минуты. Каждая публикация — коммит,
 * любую прежнюю версию можно вернуть в истории репозитория.
 */

export const OVERRIDES_PATH = "src/data/catalog/overrides.json";
export const DESIGN_PATH = "src/data/design/overrides.json";
const PHOTO_DIR = "public/products";
const DESIGN_DIR = "public/design";

export interface PublishResult {
  commitUrl: string;
  products: number;
  design: number;
  /** Сколько новых файлов картинок ушло в репозиторий. */
  photos: number;
  at: string;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const DATA_URL = /^data:(image\/[a-z+]+);base64,(.+)$/;

async function shortHash(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf).slice(0, 4))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Убираем ключи со значением undefined — так «стёртое» поле исчезает из JSON. */
function compact(o: ProductOverride): ProductOverride {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as ProductOverride;
}

async function readJsonFile(token: string, repo: RepoRef, path: string): Promise<unknown> {
  const text = await readTextFile(token, repo, path);
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Файл ${path} в репозитории повреждён — исправьте его вручную.`);
  }
}

/** data: → файл в репозитории; путь на сайте возвращается. */
async function storeDataUrl(src: string, dir: string, publicDir: string, prefix: string, files: CommitFile[]): Promise<string> {
  const m = DATA_URL.exec(src);
  if (!m) return src;
  const name = `${prefix}-${await shortHash(m[2])}.${EXT[m[1]] ?? "jpg"}`;
  if (!files.some((f) => f.path === `${dir}/${name}`)) files.push({ path: `${dir}/${name}`, base64: m[2] });
  return `/${publicDir}/${name}`;
}

export async function publishChanges(
  token: string,
  repo: RepoRef,
  changes: { catalog: OverrideMap; design: DesignDraft },
  onStep: (text: string) => void = () => {}
): Promise<PublishResult> {
  const slugs = Object.keys(changes.catalog);
  const designItems = Object.keys(changes.design.images ?? {}).length + (changes.design.banners ? 1 : 0);
  if (!slugs.length && isDraftEmpty(changes.design)) throw new Error("Нет изменений для публикации.");

  const files: CommitFile[] = [];

  if (slugs.length) {
    onStep("Читаю опубликованный каталог…");
    const remote: OverrideMap = sanitizeOverrideMap(await readJsonFile(token, repo, OVERRIDES_PATH));
    const merged: OverrideMap = { ...remote };
    for (const slug of slugs) {
      const patch = { ...changes.catalog[slug] };
      if (patch.images) {
        const out: string[] = [];
        for (const src of patch.images) out.push(await storeDataUrl(src, PHOTO_DIR, "products", slug, files));
        patch.images = out;
      }
      merged[slug] = compact({ ...remote[slug], ...patch });
    }
    files.push({ path: OVERRIDES_PATH, base64: utf8ToBase64(JSON.stringify(merged, null, 2) + "\n") });
  }

  if (!isDraftEmpty(changes.design)) {
    onStep("Читаю опубликованное оформление…");
    const remote: DesignOverrides = sanitizeDesign(await readJsonFile(token, repo, DESIGN_PATH));
    const images: NonNullable<DesignOverrides["images"]> = { ...remote.images };
    for (const [key, img] of Object.entries(changes.design.images ?? {}) as Array<[keyof typeof images, DesignImage | null]>) {
      if (img === null) delete images[key];
      else images[key] = { ...img, src: await storeDataUrl(img.src, DESIGN_DIR, "design", key, files) };
    }
    let banners = remote.banners;
    if (changes.design.banners) {
      banners = [];
      for (const b of changes.design.banners) {
        banners.push({ ...b, image: { ...b.image, src: await storeDataUrl(b.image.src, DESIGN_DIR, "design", `banner-${b.id}`, files) } });
      }
    }
    const next: DesignOverrides = {};
    if (Object.keys(images).length) next.images = images;
    if (banners?.length) next.banners = banners;
    files.push({ path: DESIGN_PATH, base64: utf8ToBase64(JSON.stringify(next, null, 2) + "\n") });
  }

  const photos = files.filter((f) => f.path.startsWith("public/")).length;
  onStep(photos ? `Загружаю картинки (${photos}) и данные…` : "Сохраняю данные…");
  const parts = [
    slugs.length ? `товары: ${slugs.length}` : "",
    designItems ? `оформление: ${designItems}` : "",
    photos ? `картинки: ${photos}` : "",
  ].filter(Boolean);
  const commit = await commitFiles(token, repo, files, `Сайт: правки из кабинета (${parts.join(", ")})`);

  const result: PublishResult = { commitUrl: commit.url, products: slugs.length, design: designItems, photos, at: new Date().toISOString() };
  writeJSON("last-publish", result);
  onStep("Готово. Сайт обновится через 2–3 минуты.");
  return result;
}

export const lastPublish = (): PublishResult | null => readJSON<PublishResult | null>("last-publish", null);

export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
