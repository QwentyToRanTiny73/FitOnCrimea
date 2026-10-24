import type { ProductCategory, ProductSubcategory } from "@/data/catalog/types";

/**
 * Единственный источник правды по категориям: подписи, порядок, цвета.
 * Классы Tailwind записаны целиком, чтобы попасть в сборку CSS.
 */

export interface SubcategoryMeta {
  key: ProductSubcategory;
  label: string;
  hint: string;
  /** Цвет иконки и акцентов. */
  text: string;
  /** Фон круга-иконки и плейсхолдера карточки. */
  tint: string;
  /** Градиент плейсхолдера фото. */
  gradient: string;
  /** Рамка при наведении. */
  ring: string;
  dot: string;
}

export const SUBCATEGORIES: SubcategoryMeta[] = [
  {
    key: "respiratory",
    label: "Дыхание",
    hint: "Простуда, кашель, насморк",
    text: "text-brand-green",
    tint: "bg-brand-green/5",
    gradient: "from-brand-green/15 to-brand-beige",
    ring: "group-hover:border-brand-green/60",
    dot: "bg-brand-green",
  },
  {
    key: "joints",
    label: "Суставы и мышцы",
    hint: "Прогревание, обезболивание",
    text: "text-brand-sea",
    tint: "bg-brand-sea/5",
    gradient: "from-brand-sea/15 to-brand-beige",
    ring: "group-hover:border-brand-sea/60",
    dot: "bg-brand-sea",
  },
  {
    key: "body",
    label: "Для тела",
    hint: "Кожа, стопы, сосуды",
    text: "text-brand-forest",
    tint: "bg-brand-forest/5",
    gradient: "from-brand-forest/15 to-brand-beige",
    ring: "group-hover:border-brand-forest/60",
    dot: "bg-brand-forest",
  },
  {
    key: "face",
    label: "Для лица",
    hint: "Акне, пигментация, anti-age",
    text: "text-brand-poppy",
    tint: "bg-brand-poppy/5",
    gradient: "from-brand-poppy/15 to-brand-beige",
    ring: "group-hover:border-brand-poppy/60",
    dot: "bg-brand-poppy",
  },
  {
    key: "hair",
    label: "Для волос",
    hint: "Рост и укрепление",
    text: "text-brand-terracotta",
    tint: "bg-brand-terracotta/5",
    gradient: "from-brand-terracotta/15 to-brand-beige",
    ring: "group-hover:border-brand-terracotta/60",
    dot: "bg-brand-terracotta",
  },
  {
    key: "repellent",
    label: "От насекомых",
    hint: "Репелленты на эфирных маслах",
    text: "text-brand-gold",
    tint: "bg-brand-gold/5",
    gradient: "from-brand-gold/20 to-brand-beige",
    ring: "group-hover:border-brand-gold/60",
    dot: "bg-brand-gold",
  },
  {
    key: "other",
    label: "Успокоение",
    hint: "Сон, стресс",
    text: "text-brand-plum",
    tint: "bg-brand-lavender/10",
    gradient: "from-brand-lavender/20 to-brand-beige",
    ring: "group-hover:border-brand-lavender/70",
    dot: "bg-brand-lavender",
  },
];

const SUB_BY_KEY = Object.fromEntries(SUBCATEGORIES.map((s) => [s.key, s])) as Record<
  ProductSubcategory,
  SubcategoryMeta
>;

export const subcategoryMeta = (key: ProductSubcategory): SubcategoryMeta => SUB_BY_KEY[key];

export interface CategoryMeta {
  key: ProductCategory;
  label: string;
  /** false — карточки ещё не заведены, показываем анонс. */
  available: boolean;
  /** Факты из брошюры бренда. */
  teaser: string;
  details?: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "balm",
    label: "Бальзамы",
    available: true,
    teaser: "Бальзамы 15 г на эфирных маслах, экстрактах крымских растений и пчелином воске.",
  },
  {
    key: "soap",
    label: "Мыло ручной работы",
    available: false,
    teaser: "30 сортов с ароматами натуральных эфирных масел.",
    details: ["Монастырская коллекция — 9 сортов, сваренных по традиционным рецептам."],
  },
  {
    key: "lip-balm",
    label: "Бальзамы для губ",
    available: false,
    teaser: "Гигиенические бальзамы для губ.",
    details: [
      "Детская линейка: Мороженое, Шоколад, Малина, Земляника.",
      "Травяные: Мелисса, Ромашка.",
      "Премиум: Крымская Роза — на эфирном масле розы.",
    ],
  },
];

export const categoryMeta = (key: ProductCategory): CategoryMeta =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];

export const BADGE_LABELS = { hit: "Хит", new: "Новинка" } as const;
