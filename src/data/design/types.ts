/**
 * Оформление сайта, которое администратор меняет без программиста:
 * картинки в постоянных местах страниц («слоты») и баннеры на главной.
 */

export const SLOT_KEYS = [
  "cover",
  "stamp-swallow-nest",
  "stamp-lighthouse",
  "icon-respiratory",
  "icon-joints",
  "icon-body",
  "icon-face",
  "icon-hair",
  "icon-repellent",
  "icon-other",
  "icon-massage",
  "line-balm",
  "line-soap",
  "line-lip-balm",
] as const;

export type DesignSlotKey = (typeof SLOT_KEYS)[number];

export interface DesignImage {
  /** /design/<файл> после публикации, data:image/… в черновике, /brochure/… для исходных. */
  src: string;
  width: number;
  height: number;
  /** Описание для незрячих и поисковиков. Пусто — у декоративных картинок. */
  alt?: string;
}

export interface Banner {
  id: string;
  image: DesignImage;
  title?: string;
  text?: string;
  /** Внутренний адрес сайта (/catalog?cat=face) или https://… */
  href?: string;
  linkLabel?: string;
  hidden?: boolean;
}

/** Опубликованное оформление (src/data/design/overrides.json). */
export interface DesignOverrides {
  images?: Partial<Record<DesignSlotKey, DesignImage>>;
  banners?: Banner[];
}

/** Черновик: null у картинки — «вернуть исходную»; banners — полный новый список. */
export interface DesignDraft {
  images?: Partial<Record<DesignSlotKey, DesignImage | null>>;
  banners?: Banner[];
}
