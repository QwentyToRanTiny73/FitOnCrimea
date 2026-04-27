"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";

interface ProductCardProps {
  product: Product;
  placeholderQuery?: string;
}

export function ProductCard({
  product,
  placeholderQuery = "crimea-nature-herbs",
}: ProductCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.slug);

  const image =
    product.images[0] ??
    `https://source.unsplash.com/featured/600x600/?${placeholderQuery},${encodeURIComponent(
      product.tagline
    )}`;

  return (
    <div className="group flex flex-col bg-white/70 rounded-xl overflow-hidden border border-brand-green/10 hover:border-brand-gold/50 hover:shadow-md transition-all relative">
      <button
        type="button"
        aria-pressed={fav}
        aria-label={fav ? "Убрать из избранного" : "В избранное"}
        onClick={(e) => {
          e.preventDefault();
          toggle(product.slug);
        }}
        className={cn(
          "absolute top-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/80 border border-brand-green/15 transition-colors",
          fav ? "text-brand-gold" : "text-brand-green/40 hover:text-brand-gold"
        )}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
        </svg>
      </button>

      <Link href={`/catalog/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-brand-beige overflow-hidden">
          <Image
            src={image}
            alt={`${product.name} — ${product.tagline}`}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs uppercase tracking-wider text-brand-gold mb-1">
            {product.tagline}
          </p>
          <h3 className="font-serif text-xl text-brand-green leading-tight">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-brand-green/70 line-clamp-2 flex-1">
            {product.shortDescription}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-medium text-brand-green">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-brand-green/60">{product.weight}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
