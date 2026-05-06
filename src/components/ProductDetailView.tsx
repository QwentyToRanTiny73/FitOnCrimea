"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { SUBCATEGORY_LABELS } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";
import { mergeProduct, useOverrides } from "@/lib/products-overrides";

interface ProductDetailViewProps {
  base: Product;
}

const ACCENT_BY_SUB: Record<string, { dot: string; tag: string; gradient: string }> = {
  face: {
    dot: "bg-brand-poppy",
    tag: "text-brand-poppy",
    gradient: "from-brand-poppy/10 to-brand-beige",
  },
  body: {
    dot: "bg-brand-forest",
    tag: "text-brand-forest",
    gradient: "from-brand-forest/10 to-brand-beige",
  },
  hair: {
    dot: "bg-brand-terracotta",
    tag: "text-brand-terracotta",
    gradient: "from-brand-terracotta/10 to-brand-beige",
  },
  joints: {
    dot: "bg-brand-sea",
    tag: "text-brand-sea",
    gradient: "from-brand-sea/10 to-brand-beige",
  },
  respiratory: {
    dot: "bg-brand-green",
    tag: "text-brand-green",
    gradient: "from-brand-green/10 to-brand-beige",
  },
  repellent: {
    dot: "bg-brand-gold",
    tag: "text-brand-gold",
    gradient: "from-brand-gold/15 to-brand-beige",
  },
  other: {
    dot: "bg-brand-lavender",
    tag: "text-brand-plum",
    gradient: "from-brand-lavender/10 to-brand-beige",
  },
};

export function ProductDetailView({ base }: ProductDetailViewProps) {
  const { overrides } = useOverrides();
  const product = mergeProduct(base, overrides[base.slug]);

  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.slug);
  const accent = ACCENT_BY_SUB[product.subcategory] ?? ACCENT_BY_SUB.other;

  const image = product.images[0];

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      <div
        className={cn(
          "relative aspect-square rounded-2xl overflow-hidden border border-brand-green/10 bg-gradient-to-br shadow-sm",
          accent.gradient
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={`${product.name} — ${product.tagline}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
            unoptimized={image.startsWith("data:")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-32 h-32 text-brand-green/40" fill="none" aria-hidden="true">
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" />
              <path d="M100 40 q -28 30 -28 60 a 28 28 0 0 0 56 0 q 0 -30 -28 -60z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M100 60 v 80" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        )}

        <button
          type="button"
          aria-pressed={fav}
          aria-label={fav ? "Убрать из избранного" : "В избранное"}
          onClick={() => toggle(product.slug)}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-brand-green/15 transition-colors",
            fav
              ? "text-brand-poppy"
              : "text-brand-green/40 hover:text-brand-poppy"
          )}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
          </svg>
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("inline-block w-2 h-2 rounded-full", accent.dot)} />
          <p className={cn("uppercase tracking-widest text-xs", accent.tag)}>
            {SUBCATEGORY_LABELS[product.subcategory]}
          </p>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-brand-green leading-tight">
          {product.name}
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-brand-green/70 italic">
          {product.tagline}
        </p>

        <div className="mt-6 flex items-baseline gap-4">
          <span className="font-serif text-3xl text-brand-green">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-brand-green/60">{product.weight}</span>
        </div>

        <p className="mt-6 text-brand-green/85 leading-relaxed">
          {product.shortDescription}
        </p>

        <a
          href={product.ozonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
        >
          Купить на Ozon
        </a>
        {product.ozonUrl === "#" && (
          <p className="mt-3 text-xs text-brand-green/60">
            Карточка на Ozon скоро будет опубликована.
          </p>
        )}

        <dl className="mt-10 space-y-6">
          <div>
            <dt className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Действие
            </dt>
            <dd className="text-brand-green/85 leading-relaxed">
              {product.effect}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Состав
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {product.composition.map((item) => (
                  <li
                    key={item}
                    className="text-sm px-3 py-1 rounded-full bg-white/60 border border-brand-green/10 text-brand-green/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Применение
            </dt>
            <dd className="text-brand-green/85 leading-relaxed">
              {product.application}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Противопоказания
            </dt>
            <dd className="text-brand-green/85 leading-relaxed">
              {product.contraindications}
            </dd>
          </div>
        </dl>

        <div className="mt-10 pt-6 border-t border-brand-green/10 flex flex-wrap gap-3 text-sm">
          <Link
            href="/catalog"
            className="text-brand-green border-b border-brand-gold pb-0.5 hover:text-brand-gold"
          >
            ← В каталог
          </Link>
          <Link
            href="/massage-points"
            className="text-brand-green border-b border-brand-gold pb-0.5 hover:text-brand-gold"
          >
            Точки массажа
          </Link>
        </div>
      </div>
    </div>
  );
}
