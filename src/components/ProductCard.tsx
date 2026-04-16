import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  placeholderQuery?: string;
}

export function ProductCard({
  product,
  placeholderQuery = "crimea-nature-herbs",
}: ProductCardProps) {
  const image =
    product.images[0] ??
    `https://source.unsplash.com/featured/600x600/?${placeholderQuery},${encodeURIComponent(
      product.tagline
    )}`;

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group flex flex-col bg-white/70 rounded-xl overflow-hidden border border-brand-green/10 hover:border-brand-gold/50 hover:shadow-md transition-all"
    >
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
  );
}
