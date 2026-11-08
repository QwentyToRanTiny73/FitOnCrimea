import { COVER, STAMPS } from "@/config/brochure";
import type { DesignImage, DesignSlotKey } from "./types";

/** Описание места на сайте, где картинку можно заменить из кабинета. */
export interface DesignSlot {
  key: DesignSlotKey;
  group: "home" | "icons" | "lines";
  label: string;
  /** Где видно на сайте — подсказка администратору. */
  where: string;
  /** Как картинка показывается: кругом (обрезается по кругу) или целиком. */
  shape: "circle" | "contain";
  /** Рекомендуемый размер, px. */
  recommended: { w: number; h: number };
  /** До какой длинной стороны уменьшать при загрузке. */
  maxSide: number;
  fallback: DesignImage;
}

export const SLOT_GROUPS: Record<DesignSlot["group"], string> = {
  home: "Главная страница",
  icons: "Иконки разделов («Что вас беспокоит?»)",
  lines: "Линейки товаров",
};

const icon = (key: string, label: string): DesignSlot => ({
  key: `icon-${key}` as DesignSlotKey,
  group: "icons",
  label,
  where: `Главная → «Что вас беспокоит?» → «${label}»`,
  shape: "circle",
  recommended: { w: 480, h: 480 },
  maxSide: 480,
  fallback: { src: `/brochure/icons/${key}.webp`, width: 240, height: 240, alt: "" },
});

export const DESIGN_SLOTS: DesignSlot[] = [
  {
    key: "cover",
    group: "home",
    label: "Обложка",
    where: "Главная, первый экран справа (на телефоне — сверху)",
    shape: "contain",
    recommended: { w: 1200, h: 1200 },
    maxSide: 1400,
    fallback: COVER,
  },
  {
    key: "stamp-swallow-nest",
    group: "home",
    label: "Марка 1 (верхняя)",
    where: "Главная → «О серии», рамка-марка",
    shape: "contain",
    recommended: { w: 900, h: 600 },
    maxSide: 1000,
    fallback: STAMPS.swallowNest,
  },
  {
    key: "stamp-lighthouse",
    group: "home",
    label: "Марка 2 (нижняя)",
    where: "Главная → «О серии», рамка-марка",
    shape: "contain",
    recommended: { w: 900, h: 600 },
    maxSide: 1000,
    fallback: STAMPS.lighthouse,
  },
  icon("respiratory", "Дыхание"),
  icon("joints", "Суставы и мышцы"),
  icon("body", "Для тела"),
  icon("face", "Для лица"),
  icon("hair", "Для волос"),
  icon("repellent", "От насекомых"),
  icon("other", "Успокоение"),
  icon("massage", "Точки массажа"),
  {
    key: "line-balm",
    group: "lines",
    label: "Бальзамы",
    where: "Главная → «Три линейки»",
    shape: "contain",
    recommended: { w: 1000, h: 750 },
    maxSide: 1200,
    fallback: {
      src: "/products/limonnik-i-roza-brochure.webp",
      width: 1000,
      height: 1000,
      alt: "Баночка «Крымский бальзам» с розой и лимонником",
    },
  },
  {
    key: "line-soap",
    group: "lines",
    label: "Мыло ручной работы",
    where: "Главная → «Три линейки»",
    shape: "contain",
    recommended: { w: 1000, h: 750 },
    maxSide: 1200,
    fallback: { src: "/brochure/line-soap.webp", width: 713, height: 455, alt: "Кусочки крымского мыла ручной работы" },
  },
  {
    key: "line-lip-balm",
    group: "lines",
    label: "Бальзамы для губ",
    where: "Главная → «Три линейки»",
    shape: "contain",
    recommended: { w: 1000, h: 750 },
    maxSide: 1200,
    fallback: {
      src: "/brochure/line-lip-balms.webp",
      width: 603,
      height: 640,
      alt: "Бальзамы для губ «Фитон Крым» в баночках и коробочках",
    },
  },
];

export const slotByKey = (key: DesignSlotKey): DesignSlot => DESIGN_SLOTS.find((s) => s.key === key)!;

/** Баннеры на главной: рекомендуемые размеры. */
export const BANNER_SPEC = { recommended: { w: 1600, h: 700 }, maxSide: 1920, max: 8 };
