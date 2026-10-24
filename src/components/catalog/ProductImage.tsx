import Image from "next/image";
import { subcategoryMeta } from "@/config/categories";
import type { Product } from "@/data/catalog";
import { assetUrl, cn } from "@/lib/utils";

/**
 * Фото товара или ботанический плейсхолдер в цвете его категории.
 * Все локальные пути проходят через assetUrl (basePath на GitHub Pages).
 */
export function ProductImage({
  product,
  index = 0,
  sizes,
  priority,
  className,
}: {
  product: Pick<Product, "name" | "tagline" | "images" | "subcategory">;
  index?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const src = product.images[index];
  const meta = subcategoryMeta(product.subcategory);

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", meta.gradient, className)}>
      {src ? (
        <Image
          src={assetUrl(src)}
          alt={`${product.name} — ${product.tagline}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className={cn("absolute inset-0 flex flex-col items-center justify-center gap-2", meta.text)}>
          <svg viewBox="0 0 80 100" className="w-1/3 max-w-[96px] opacity-50" fill="none" aria-hidden="true">
            <rect x="14" y="30" width="52" height="56" rx="10" stroke="currentColor" strokeWidth="2" />
            <rect x="10" y="20" width="60" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M40 44c-8 8-8 18 0 26 8-8 8-18 0-26Z" fill="currentColor" opacity=".35" />
            <path d="M40 46v26" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="px-3 text-center font-serif text-sm italic opacity-70">{product.tagline}</span>
        </div>
      )}
    </div>
  );
}
