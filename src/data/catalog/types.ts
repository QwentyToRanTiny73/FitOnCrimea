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
  /** Ключевые растения — подзаголовок карточки. */
  tagline: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  price: number;
  weight: string;
  badges?: ProductBadge[];
  shortDescription: string;
  effect: string;
  composition: string[];
  application: string;
  contraindications: string;
  /** Ссылка на карточку Ozon. Пока не задана — кнопка покупки неактивна. */
  ozonUrl?: string;
  /** Пути от корня public/ (`/products/<slug>.webp`) или полные URL. */
  images: string[];
  /** Слаги товаров для блока «Сочетается с». Без поля — товары той же зоны. */
  pairsWith?: string[];
}
