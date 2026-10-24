"use client";

import Link from "next/link";
import { BADGE_LABELS, subcategoryMeta } from "@/config/categories";
import type { Product } from "@/data/catalog";
import { useProduct } from "@/providers";
import { cn, formatPrice } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product: base, priority }: { product: Product; priority?: boolean }) {
  const product = useProduct(base);
  const meta = subcategoryMeta(product.subcategory);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-green/10 bg-white/80 transition-shadow hover:border-brand-gold/50 hover:shadow-md">
      <Link href={`/catalog/${product.slug}`} className="flex flex-1 flex-col focus-visible:outline-none">
        <ProductImage
          product={product}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          priority={priority}
          className="aspect-square transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className={cn("mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider sm:text-xs", meta.text)}>
            <span className={cn("inline-block h-1.5 w-1.5 rounded-full", meta.dot)} />
            {product.tagline}
          </p>
          <h3 className="font-serif text-lg leading-tight text-brand-green sm:text-xl">{product.name}</h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-brand-green/70 sm:text-sm">
            {product.shortDescription}
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-base font-medium text-brand-green sm:text-lg">
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] text-brand-green/60 sm:text-xs">{product.weight}</span>
          </div>
        </div>
      </Link>

      {product.badges?.length ? (
        <div className="pointer-events-none absolute left-2 top-2 flex gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-brand-poppy px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
            >
              {BADGE_LABELS[b]}
            </span>
          ))}
        </div>
      ) : null}
      <FavoriteButton slug={product.slug} className="absolute right-2 top-2 h-9 w-9" />
    </article>
  );
}
