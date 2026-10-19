"use client";

import Link from "next/link";
import { useState } from "react";
import { BADGE_LABELS, subcategoryMeta } from "@/config/categories";
import { site } from "@/config/site";
import { hasOzonLink, type Product } from "@/data/catalog";
import { useProduct } from "@/providers";
import { cn, formatPrice } from "@/lib/utils";
import { Accordion } from "@/components/ui/Accordion";
import { FavoriteButton } from "./FavoriteButton";
import { ProductImage } from "./ProductImage";

function BuyButton({ product, className }: { product: Product; className?: string }) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-center transition-colors";
  if (!hasOzonLink(product)) {
    return (
      <span aria-disabled="true" className={cn(base, "cursor-not-allowed bg-brand-green/15 text-brand-green/60", className)}>
        Скоро на {site.marketplace.name}
      </span>
    );
  }
  return (
    <a
      href={product.ozonUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, "bg-brand-green text-brand-beige hover:bg-brand-green/90", className)}
    >
      Купить на {site.marketplace.name}
    </a>
  );
}

export function ProductDetail({ base }: { base: Product }) {
  const product = useProduct(base);
  const meta = subcategoryMeta(product.subcategory);
  const [active, setActive] = useState(0);
  const imageIndex = active < product.images.length ? active : 0;

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative">
            <ProductImage
              product={product}
              index={imageIndex}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="aspect-square rounded-2xl border border-brand-green/10 shadow-sm"
            />
            <FavoriteButton slug={product.slug} className="absolute right-3 top-3" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Фото ${i + 1}`}
                  aria-current={i === imageIndex}
                  className={cn(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                    i === imageIndex ? "border-brand-gold" : "border-transparent opacity-70"
                  )}
                >
                  <ProductImage product={product} index={i} sizes="64px" className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Link
              href={`/catalog?cat=${product.subcategory}`}
              className={cn("flex items-center gap-1.5 text-xs uppercase tracking-widest hover:underline", meta.text)}
            >
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              {meta.label}
            </Link>
            {product.badges?.map((b) => (
              <span key={b} className="rounded-full bg-brand-poppy px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                {BADGE_LABELS[b]}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-3xl leading-tight text-brand-green sm:text-5xl">{product.name}</h1>
          <p className="mt-1 font-serif text-xl italic text-brand-green/70">{product.tagline}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-brand-green">{formatPrice(product.price)}</span>
            <span className="text-sm text-brand-green/60">{product.weight}</span>
          </div>
          <p className="mt-1 text-xs text-brand-green/55">
            Ориентировочная цена. Актуальная — на {site.marketplace.name}.
          </p>

          <p className="mt-5 leading-relaxed text-brand-green/85">{product.shortDescription}</p>

          <BuyButton product={product} className="mt-6 hidden w-full sm:inline-flex sm:w-auto" />

          <div className="mt-8 border-t border-brand-green/15">
            <Accordion title="Показания" defaultOpen>
              {product.effect}
            </Accordion>
            <Accordion title="Способ применения">{product.application}</Accordion>
            <Accordion title="Состав">
              <ul className="flex flex-wrap gap-2">
                {product.composition.map((item) => (
                  <li key={item} className="rounded-full border border-brand-green/10 bg-white/70 px-3 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Противопоказания">{product.contraindications}</Accordion>
            <Accordion title="Хранение">Срок годности и условия хранения указаны на упаковке.</Accordion>
          </div>

          <Link
            href="/massage-points"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-brand-terracotta/30 bg-brand-terracotta/5 p-4 text-sm text-brand-green hover:border-brand-terracotta/60"
          >
            <span className="font-serif text-2xl text-brand-terracotta">26</span>
            <span>Схема акупунктурных точек для массажа с бальзамом</span>
          </Link>
        </div>
      </div>

      {/* Мобильная панель покупки — над нижним меню */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-brand-green/10 bg-brand-beige/95 px-4 py-2.5 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-brand-green">{product.name}</p>
            <p className="font-medium text-brand-green">{formatPrice(product.price)}</p>
          </div>
          <BuyButton product={product} className="px-5 py-2.5 text-sm" />
        </div>
      </div>
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </>
  );
}
