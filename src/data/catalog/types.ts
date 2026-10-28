/** Тип продукта — верхний уровень каталога. */
export type ProductCategory = "balm" | "soap" | "lip-balm";

/** Зона применения / показание — второй уровень (фильтры, иконки на главной). */
export type ProductSubcategory =
  | "face"
  | "body"
  | "hair"
  | "joints"
  | "respiratory"
  | "repellent"
  | "other";

export type ProductBadge = "hit" | "new";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Ключевые растения — как красный заголовок в брошюре («ЛИМОН И МЯТА»). */
  tagline: string;
  /** Подзаголовок, например «Крымский омолаживающий бальзам». По умолчанию — «Крымский бальзам «Имя»». */
  subtitle?: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  price: number;
  weight: string;
  badges?: ProductBadge[];
  shortDescription: string;
  /** Показания — коротко, для карточки и поиска. */
  effect: string;
  /** Полное описание (текст брошюры). */
  description?: string;
  composition: string[];
  application: string;
  contraindications: string;
  /** Ссылка на карточку Ozon. Пока не задана — кнопка покупки неактивна. */
  ozonUrl?: string;
  /** Пути от корня public/ (`/products/<slug>.webp`), полные URL или data: (черновик админки). */
  images: string[];
  /** Слаги товаров для блока «Сочетается с». Без поля — товары той же зоны. */
  pairsWith?: string[];
  /** Снят с витрины: не показывается в каталоге и на главной. */
  hidden?: boolean;
}

/** Правка карточки из админки. Для нового товара содержит все обязательные поля. */
export type ProductOverride = Partial<Omit<Product, "id" | "slug">>;

export type OverrideMap = Record<string, ProductOverride>;
