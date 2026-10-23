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
  /** Цвет кольца этикетки на баночке-плейсхолдере. */
  jar: string;
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
    jar: "#1f8a70",
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
    jar: "#3f63a8",
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
    jar: "#2f7a3a",
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
    jar: "#c8467f",
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
    jar: "#b5622e",
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
    jar: "#a88416",
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
    jar: "#6b58a8",
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
  /** Тексты — из брошюры бренда. */
  teaser: string;
  details?: string[];
  image?: { src: string; width: number; height: number; alt: string };
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "balm",
    label: "Бальзамы",
    available: true,
    teaser:
      "Серия жировых кремов «Крымский бальзам» на основе растительных масел и восков с высоким содержанием биологически активных экстрактов и эфирных масел.",
    image: { src: "/products/limonnik-i-roza-brochure.webp", width: 1000, height: 1000, alt: "Баночка «Крымский бальзам» с розой и лимонником" },
  },
  {
    key: "soap",
    label: "Мыло ручной работы",
    available: false,
    teaser: "Натуральное «Крымское мыло» с ароматами эфирных масел из трав, выращенных на склонах Крымских гор.",
    details: [
      "30 сортов с уникальными ароматами натуральных эфирных масел.",
      "9 сортов целебного мыла монастырской коллекции, сваренных по традиционным рецептам.",
    ],
    image: { src: "/brochure/line-soap.webp", width: 713, height: 455, alt: "Кусочки крымского мыла ручной работы" },
  },
  {
    key: "lip-balm",
    label: "Бальзамы для губ",
    available: false,
    teaser: "Гигиенические бальзамы с мягкой текстурой, тонким ароматом и приятным вкусом.",
    details: [
      "Детская линейка: «Мороженое», «Шоколад», «Малина», «Земляника».",
      "Травяные «Мелисса» и «Ромашка» способствуют заживлению трещинок и избавлению от шелушения.",
      "«Крымская Роза» — на настоящем эфирном масле розы.",
    ],
    image: { src: "/brochure/line-lip-balms.webp", width: 603, height: 640, alt: "Бальзамы для губ «Фитон Крым» в баночках и коробочках" },
  },
];

export const categoryMeta = (key: ProductCategory): CategoryMeta =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];

export const BADGE_LABELS = { hit: "Хит", new: "Новинка" } as const;
