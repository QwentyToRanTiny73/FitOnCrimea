import { SLOT_KEYS, type Banner, type DesignDraft, type DesignImage, type DesignOverrides, type DesignSlotKey } from "./types";

/**
 * Проверка оформления из overrides.json и черновиков админки. Неверное
 * отбрасывается, а не ломает сборку: опечатка в JSON не должна уронить сайт.
 */

const PATH_RE = /^\/(design|brochure|products)\/[A-Za-z0-9._-]+\.(webp|jpe?g|png)$/;
const DATA_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const ID_RE = /^[a-z0-9-]{1,40}$/;

const text = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

export function safeHref(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (/^\/(?!\/)[^\s"'<>\\]*$/.test(s)) return s;
  if (/^https:\/\/[^\s"'<>\\]+$/.test(s)) return s;
  return undefined;
}

export function sanitizeImage(raw: unknown, allowData: boolean): DesignImage | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const src = typeof r.src === "string" ? r.src : "";
  if (!PATH_RE.test(src) && !(allowData && DATA_RE.test(src))) return undefined;
  const dim = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v > 0 && v <= 10000 ? v : undefined);
  const width = dim(r.width);
  const height = dim(r.height);
  if (!width || !height) return undefined;
  const alt = typeof r.alt === "string" ? r.alt.trim().slice(0, 200) : undefined;
  return { src, width, height, ...(alt !== undefined ? { alt } : {}) };
}

export function sanitizeBanner(raw: unknown, allowData: boolean): Banner | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" && ID_RE.test(r.id) ? r.id : undefined;
  const image = sanitizeImage(r.image, allowData);
  if (!id || !image) return undefined;
  const b: Banner = { id, image };
  const title = text(r.title, 120);
  const body = text(r.text, 400);
  const href = safeHref(r.href);
  const linkLabel = text(r.linkLabel, 40);
  if (title) b.title = title;
  if (body) b.text = body;
  if (href) b.href = href;
  if (linkLabel) b.linkLabel = linkLabel;
  if (r.hidden === true) b.hidden = true;
  return b;
}

function banners(raw: unknown, allowData: boolean): Banner[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const seen = new Set<string>();
  return raw
    .map((x) => sanitizeBanner(x, allowData))
    .filter((b): b is Banner => Boolean(b) && !seen.has(b!.id) && Boolean(seen.add(b!.id)))
    .slice(0, 12);
}

const isSlot = (k: string): k is DesignSlotKey => (SLOT_KEYS as readonly string[]).includes(k);

/** Опубликованное оформление: только пути к файлам, без data:. */
export function sanitizeDesign(raw: unknown): DesignOverrides {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const r = raw as Record<string, unknown>;
  const out: DesignOverrides = {};
  if (r.images && typeof r.images === "object" && !Array.isArray(r.images)) {
    const images: DesignOverrides["images"] = {};
    for (const [k, v] of Object.entries(r.images as Record<string, unknown>)) {
      const img = isSlot(k) ? sanitizeImage(v, false) : undefined;
      if (img) images[k as DesignSlotKey] = img;
    }
    if (Object.keys(images).length) out.images = images;
  }
  const list = banners(r.banners, false);
  if (list) out.banners = list;
  return out;
}

/** Черновик админки: картинки могут быть data:, null у слота — «вернуть исходную». */
export function sanitizeDraft(raw: unknown): DesignDraft {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const r = raw as Record<string, unknown>;
  const out: DesignDraft = {};
  if (r.images && typeof r.images === "object" && !Array.isArray(r.images)) {
    const images: DesignDraft["images"] = {};
    for (const [k, v] of Object.entries(r.images as Record<string, unknown>)) {
      if (!isSlot(k)) continue;
      if (v === null) images[k] = null;
      else {
        const img = sanitizeImage(v, true);
        if (img) images[k] = img;
      }
    }
    if (Object.keys(images).length) out.images = images;
  }
  const list = banners(r.banners, true);
  if (list) out.banners = list;
  return out;
}

/** Опубликованное + черновик = то, что видит администратор. */
export function mergeDesign(published: DesignOverrides, draft: DesignDraft): DesignOverrides {
  const images: DesignOverrides["images"] = { ...published.images };
  for (const [k, v] of Object.entries(draft.images ?? {}) as Array<[DesignSlotKey, DesignImage | null]>) {
    if (v === null) delete images[k];
    else images[k] = v;
  }
  return { images, banners: draft.banners ?? published.banners ?? [] };
}

export const isDraftEmpty = (d: DesignDraft): boolean => !Object.keys(d.images ?? {}).length && d.banners === undefined;
