"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";
import { mergeProduct, useOverrides } from "@/lib/products-overrides";

interface ProductCardProps {
  product: Product;
  placeholderQuery?: string;
}

const PLACEHOLDER_BG_BY_CATEGORY: Record<string, string> = {
  face: "from-brand-poppy/15 to-brand-beige",
  body: "from-brand-forest/15 to-brand-beige",
  hair: "from-brand-terracotta/15 to-brand-beige",
  joints: "from-brand-sea/15 to-brand-beige",
  respiratory: "from-brand-green/15 to-brand-beige",
  repellent: "from-brand-gold/15 to-brand-beige",
  other: "from-brand-lavender/15 to-brand-beige",
};

export function ProductCard({ product: base }: ProductCardProps) {
  const { overrides } = useOverrides();
  const product = mergeProduct(base, overrides[base.slug]);

  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.slug);

  const image = product.images[0];
  const bg = PLACEHOLDER_BG_BY_CATEGORY[product.subcategory] ?? PLACEHOLDER_BG_BY_CATEGORY.other;

  return (
    <div className="group flex flex-col bg-white/75 rounded-2xl overflow-hidden border border-brand-green/10 hover:border-brand-gold/50 hover:shadow-md transition-all relative">
      <button
        type="button"
        aria-pressed={fav}
        aria-label={fav ? "Убрать из избранного" : "В избранное"}
        onClick={(e) => {
          e.preventDefault();
          toggle(product.slug);
        }}
        className={cn(
          "absolute top-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/85 border border-brand-green/15 transition-colors",
          fav
            ? "text-brand-poppy"
            : "text-brand-green/40 hover:text-brand-poppy"
        )}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
        </svg>
      </button>

      <Link href={`/catalog/${product.slug}`} className="flex flex-col flex-1">
        <div
          className={cn(
            "relative aspect-square overflow-hidden bg-gradient-to-br",
            bg
          )}
        >
          {image ? (
            <Image
              src={image}
              alt={`${product.name} — ${product.tagline}`}
              fill
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
              unoptimized={image.startsWith("data:")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 120 120"
                className="w-20 h-20 text-brand-green/40"
                aria-hidden="true"
                fill="none"
              >
                <path
                  d="M60 18 q -18 22 -18 44 a 18 18 0 0 0 36 0 q 0 -22 -18 -44z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M60 30 v 60" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-brand-gold mb-1">
            {product.tagline}
          </p>
          <h3 className="font-serif text-lg sm:text-xl text-brand-green leading-tight">
            {product.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-brand-green/70 line-clamp-2 flex-1">
            {product.shortDescription}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-base sm:text-lg font-medium text-brand-green">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] sm:text-xs text-brand-green/60">
              {product.weight}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
