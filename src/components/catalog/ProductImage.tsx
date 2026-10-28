import Image from "next/image";
import { subcategoryMeta } from "@/config/categories";
import type { Product } from "@/data/catalog";
import { assetUrl, cn } from "@/lib/utils";
import { OctagonJar } from "@/components/ui/Brochure";

/**
 * Фото товара на «странице брошюры» или деревянная баночка с этикеткой,
 * пока фото нет. Локальные пути идут через assetUrl (basePath на GitHub Pages).
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
    <div className={cn("paper-page relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={assetUrl(src)}
          alt={`${product.name} — ${product.tagline}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-2"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[12%]">
          <OctagonJar name={product.name} label={meta.jar} className="h-full w-full drop-shadow-[0_6px_8px_rgba(90,50,20,0.3)]" />
        </div>
      )}
    </div>
  );
}
