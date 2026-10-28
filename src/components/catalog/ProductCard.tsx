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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-amber/60 bg-brand-cream shadow-[0_1px_2px_rgba(90,60,20,0.08)] transition-shadow hover:shadow-[0_6px_18px_rgba(90,60,20,0.16)]">
      <Link href={`/catalog/${product.slug}`} className="flex flex-1 flex-col focus-visible:outline-none">
        <ProductImage
          product={product}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          priority={priority}
          className="aspect-square transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="flex flex-1 flex-col border-t border-brand-amber/40 p-3 sm:p-4">
          <p className="title-crimson mb-1 font-serif text-[11px] font-bold uppercase leading-tight tracking-wide sm:text-xs">
            {product.tagline}
          </p>
          <h3 className="font-serif text-lg leading-tight text-brand-green sm:text-xl">{product.name}</h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-brand-green/75 sm:text-sm">{product.shortDescription}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-base font-semibold text-brand-green sm:text-lg">{formatPrice(product.price)}</span>
            <span className={cn("flex items-center gap-1 text-[11px] text-brand-green/65 sm:text-xs")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
              {product.weight}
            </span>
          </div>
        </div>
      </Link>

      {product.badges?.length ? (
        <div className="pointer-events-none absolute left-2 top-2 flex gap-1">
          {product.badges.map((b) => (
            <span key={b} className="rounded-sm bg-brand-crimson px-2 py-0.5 font-serif text-[11px] font-bold uppercase tracking-wide text-white shadow">
              {BADGE_LABELS[b]}
            </span>
          ))}
        </div>
      ) : null}
      <FavoriteButton slug={product.slug} className="absolute right-2 top-2 h-9 w-9" />
    </article>
  );
}
