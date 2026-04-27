"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import {
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const items = favorites
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <header className="text-center mb-10">
        <BotanicalWreath className="mx-auto h-14 text-brand-gold mb-3" />
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-3">
          Избранное
        </p>
        <h1 className="font-serif text-4xl text-brand-green">
          Сохранённые бальзамы
        </h1>
        <BotanicalDivider className="my-5" />
      </header>

      {items.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-brand-green/70 mb-6">
            В избранном пусто. Нажмите на сердечко на карточке товара, чтобы
            добавить бальзам.
          </p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-2 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
