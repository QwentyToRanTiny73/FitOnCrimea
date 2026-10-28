"use client";

import Link from "next/link";
import { useState } from "react";
import { BADGE_LABELS, subcategoryMeta } from "@/config/categories";
import { site } from "@/config/site";
import { hasOzonLink, productSubtitle, type Product } from "@/data/catalog";
import { useProduct } from "@/providers";
import { cn, formatPrice } from "@/lib/utils";
import { Accordion } from "@/components/ui/Accordion";
import { FavoriteButton } from "./FavoriteButton";
import { ProductImage } from "./ProductImage";

function BuyButton({ product, className }: { product: Product; className?: string }) {
  const base = "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-center font-semibold transition-colors";
  if (!hasOzonLink(product)) {
    return (
      <span aria-disabled="true" className={cn(base, "cursor-not-allowed border-2 border-dashed border-brand-green/30 text-brand-green/60", className)}>
        Скоро на {site.marketplace.name}
      </span>
    );
  }
  return (
    <a
      href={product.ozonUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, "bg-brand-green text-brand-cream shadow-[0_2px_0_#1e3f25] hover:bg-brand-forest", className)}
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
      {product.hidden && (
        <p role="status" className="mb-6 rounded-xl border border-brand-poppy/40 bg-brand-poppy/5 px-4 py-3 text-sm text-brand-poppy">
          Товар временно снят с витрины.
        </p>
      )}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative">
            <ProductImage
              product={product}
              index={imageIndex}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="aspect-square rounded-2xl border-2 border-brand-amber/70"
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
                    i === imageIndex ? "border-brand-crimson" : "border-brand-amber/50 opacity-75"
                  )}
                >
                  <ProductImage product={product} index={i} sizes="64px" className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/catalog?cat=${product.subcategory}`}
              className="flex items-center gap-1.5 rounded-full border border-brand-amber/70 bg-brand-cream px-3 py-1 text-xs uppercase tracking-widest text-brand-green hover:border-brand-crimson"
            >
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              {meta.label}
            </Link>
            {product.badges?.map((b) => (
              <span key={b} className="rounded-sm bg-brand-crimson px-2 py-0.5 font-serif text-xs font-bold uppercase text-white">
                {BADGE_LABELS[b]}
              </span>
            ))}
          </div>
          {product.tagline && (
            <p className="title-crimson font-serif text-lg font-bold uppercase tracking-wide sm:text-xl">{product.tagline}</p>
          )}
          <h1 className="mt-1 font-serif text-3xl font-bold leading-tight text-brand-green sm:text-5xl">{product.name}</h1>
          <p className="mt-2 font-serif text-lg italic text-brand-green/80">{productSubtitle(product)}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-brand-green">{formatPrice(product.price)}</span>
            <span className="text-sm text-brand-green/65">{product.weight}</span>
          </div>
          <p className="mt-1 text-xs text-brand-green/60">Ориентировочная цена. Актуальная — на {site.marketplace.name}.</p>

          <p className="mt-5 leading-relaxed text-brand-green/90">{product.shortDescription}</p>

          <BuyButton product={product} className="mt-6 hidden w-full sm:inline-flex sm:w-auto" />

          <div className="paper-page mt-8 rounded-xl px-5">
            {product.description && (
              <Accordion title="Описание" defaultOpen>
                {product.description}
              </Accordion>
            )}
            <Accordion title="Показания" defaultOpen={!product.description}>
              {product.effect}
            </Accordion>
            <Accordion title="Способ применения">{product.application}</Accordion>
            <Accordion title="Состав">
              <ul className="flex flex-wrap gap-2">
                {product.composition.map((item) => (
                  <li key={item} className="rounded-full border border-brand-amber/60 bg-brand-cream px-3 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Противопоказания">{product.contraindications}</Accordion>
            <Accordion title="Хранение" className="border-b-0">
              Срок годности и условия хранения указаны на упаковке.
            </Accordion>
          </div>

          <Link
            href="/massage-points"
            className="mt-6 flex items-center gap-3 rounded-xl border-2 border-dashed border-brand-terracotta/50 bg-brand-cream p-4 text-sm text-brand-green hover:border-brand-terracotta"
          >
            <span className="font-display text-3xl text-brand-crimson">26</span>
            <span>Схема акупунктурных точек для массажа с бальзамом</span>
          </Link>
        </div>
      </div>

      {/* Мобильная панель покупки — над нижним меню */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t-2 border-double border-brand-amber/70 bg-brand-cream/95 px-4 py-2.5 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm font-bold text-brand-green">{product.name}</p>
            <p className="font-semibold text-brand-green">{formatPrice(product.price)}</p>
          </div>
          <BuyButton product={product} className="px-5 py-2.5 text-sm" />
        </div>
      </div>
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </>
  );
}
