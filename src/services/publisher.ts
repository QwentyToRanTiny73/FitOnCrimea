import { sanitizeOverrideMap } from "@/data/catalog/sanitize";
import type { OverrideMap, ProductOverride } from "@/data/catalog/types";
import { commitFiles, readTextFile, utf8ToBase64, type CommitFile, type RepoRef } from "./github";
import { readJSON, writeJSON } from "./storage";

/**
 * Публикация черновиков админки на сайт: фото из браузера сохраняются
 * в public/products/, правки — в src/data/catalog/overrides.json.
 * Всё уходит одним коммитом; GitHub Actions пересобирает сайт за 2–3 минуты.
 */

export const OVERRIDES_PATH = "src/data/catalog/overrides.json";
const PHOTO_DIR = "public/products";

export interface PublishResult {
  commitUrl: string;
  products: number;
  photos: number;
  at: string;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

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

export async function publishDrafts(
  token: string,
  repo: RepoRef,
  drafts: OverrideMap,
  onStep: (text: string) => void = () => {}
): Promise<PublishResult> {
  const slugs = Object.keys(drafts);
  if (!slugs.length) throw new Error("Нет изменений для публикации.");

  onStep("Читаю опубликованный каталог…");
  const remoteText = await readTextFile(token, repo, OVERRIDES_PATH);
  let remote: OverrideMap = {};
  try {
    remote = sanitizeOverrideMap(remoteText ? JSON.parse(remoteText) : {});
  } catch {
    throw new Error(`Файл ${OVERRIDES_PATH} в репозитории повреждён — исправьте его вручную.`);
  }

  const files: CommitFile[] = [];
  const merged: OverrideMap = { ...remote };

  for (const slug of slugs) {
    const patch = { ...drafts[slug] };
    if (patch.images) {
      const out: string[] = [];
      for (const src of patch.images) {
        const m = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(src);
        if (!m) {
          out.push(src);
          continue;
        }
        const name = `${slug}-${await shortHash(m[2])}.${EXT[m[1]] ?? "jpg"}`;
        if (!files.some((f) => f.path.endsWith(`/${name}`))) files.push({ path: `${PHOTO_DIR}/${name}`, base64: m[2] });
        out.push(`/products/${name}`);
      }
      patch.images = out;
    }
    merged[slug] = compact({ ...remote[slug], ...patch });
  }

  const photos = files.length;
  files.push({ path: OVERRIDES_PATH, base64: utf8ToBase64(JSON.stringify(merged, null, 2) + "\n") });

  onStep(photos ? `Загружаю фото (${photos}) и данные…` : "Сохраняю данные…");
  const commit = await commitFiles(
    token,
    repo,
    files,
    `Каталог: правки из админки (${slugs.length} ${plural(slugs.length, "товар", "товара", "товаров")}${photos ? `, фото: ${photos}` : ""})`
  );

  const result: PublishResult = { commitUrl: commit.url, products: slugs.length, photos, at: new Date().toISOString() };
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
