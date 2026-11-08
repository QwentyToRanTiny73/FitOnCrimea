import published from "./overrides.json";
import { sanitizeDesign } from "./sanitize";
import { DESIGN_SLOTS, slotByKey } from "./slots";
import type { Banner, DesignImage, DesignOverrides, DesignSlotKey } from "./types";

export * from "./types";
export { DESIGN_SLOTS, SLOT_GROUPS, BANNER_SPEC, slotByKey, type DesignSlot } from "./slots";

/**
 * overrides.json — оформление, опубликованное из кабинета («Оформление» →
 * «Опубликовать»). Попадает в сборку для всех посетителей.
 */
export const publishedDesign: DesignOverrides = sanitizeDesign(published as unknown);

/** Картинка слота: заменённая или исходная из брошюры. */
export function resolveSlot(design: DesignOverrides, key: DesignSlotKey): DesignImage {
  const slot = slotByKey(key);
  const custom = design.images?.[key];
  if (!custom) return slot.fallback;
  return { ...custom, alt: custom.alt ?? slot.fallback.alt };
}

export const visibleBanners = (design: DesignOverrides): Banner[] => (design.banners ?? []).filter((b) => !b.hidden);

export const isSlotChanged = (design: DesignOverrides, key: DesignSlotKey): boolean => Boolean(design.images?.[key]);

export const SLOT_COUNT = DESIGN_SLOTS.length;
