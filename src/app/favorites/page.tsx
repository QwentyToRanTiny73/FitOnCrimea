"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { primaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCatalog, useFavorites } from "@/providers";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { products } = useCatalog();
  const items = products.filter((p) => favorites.includes(p.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow="Избранное"
        title="Сохранённые бальзамы"
        lead="Список хранится в этом браузере — регистрация не нужна."
      />
      {items.length === 0 ? (
        <div className="mx-auto max-w-md py-8 text-center">
          <p className="mb-6 text-brand-green/75">Нажмите на сердечко на карточке товара, чтобы сохранить его здесь.</p>
          <Link href="/catalog" className={primaryButton}>
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
