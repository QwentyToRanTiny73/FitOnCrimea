import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { JsonLd } from "@/components/ui/JsonLd";
import { subcategoryMeta } from "@/config/categories";
import { site } from "@/config/site";
import { getProductBySlug, getRelated, hasOzonLink, products } from "@/data/catalog";
import { absoluteUrl } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Товар не найден" };
  const title = `${product.name} — ${product.tagline}`;
  const cover = product.images[0];
  // Превью — JPEG-копия обложки товара (scripts/optimize-images.mjs), иначе общее.
  const image = cover && /^\/products\/.+\.(?:webp|jpe?g|png)$/.test(cover)
    ? { url: absoluteUrl(`/_img${cover.replace(/\.(?:webp|jpe?g|png)$/, "")}-og.jpg`), width: 800, height: 800, alt: title }
    : undefined;
  return pageMeta({ title, description: product.shortDescription, path: `/catalog/${product.slug}/`, image });
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const url = absoluteUrl(`/catalog/${product.slug}/`);
  const meta = subcategoryMeta(product.subcategory);
  const related = getRelated(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${product.name} — ${product.tagline}`,
          description: product.shortDescription,
          brand: { "@type": "Brand", name: site.name },
          category: meta.label,
          ...(product.images[0] && { image: absoluteUrl(product.images[0]) }),
          // Предложение о продаже — только когда есть ссылка на Ozon, где товар реально купить.
          ...(hasOzonLink(product) && {
            offers: { "@type": "Offer", priceCurrency: "RUB", price: product.price, url: product.ozonUrl },
          }),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Каталог", item: absoluteUrl("/catalog/") },
            { "@type": "ListItem", position: 3, name: product.name, item: url },
          ],
        }}
      />

      <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-brand-green/70">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand-green">Главная</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/catalog" className="hover:text-brand-green">Каталог</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/catalog?cat=${product.subcategory}`} className="hover:text-brand-green">
              {meta.label}
            </Link>
          </li>
        </ol>
      </nav>

      <ProductDetail base={product} />

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related">
          <h2 id="related" className="title-crimson mb-6 font-serif text-xl font-bold uppercase sm:text-2xl">
            Ещё в разделе «{meta.label}»
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
