import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  products,
  getProductBySlug,
  SUBCATEGORY_LABELS,
} from "@/data/products";
import { SITE_URL } from "@/lib/utils";
import { ProductDetailView } from "@/components/ProductDetailView";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.shortDescription,
    alternates: { canonical: `${SITE_URL}/catalog/${product.slug}` },
    openGraph: {
      title: `${product.name} — Фитон Крым`,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.tagline}`,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "Фитон Крым" },
    category: SUBCATEGORY_LABELS[product.subcategory],
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/catalog/${product.slug}`,
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Каталог",
        item: `${SITE_URL}/catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/catalog/${product.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsSchema),
        }}
      />

      <nav className="text-sm text-brand-green/60 mb-8 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-brand-green">
          Главная
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-brand-green">
          Каталог
        </Link>
        <span>/</span>
        <span className="text-brand-green">{product.name}</span>
      </nav>

      <ProductDetailView base={product} />
    </div>
  );
}
