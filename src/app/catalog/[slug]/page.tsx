import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  products,
  getProductBySlug,
  SUBCATEGORY_LABELS,
} from "@/data/products";
import { formatPrice, SITE_URL } from "@/lib/utils";

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

  const image =
    product.images[0] ??
    `https://source.unsplash.com/featured/900x900/?crimea-nature-herbs,${encodeURIComponent(
      product.tagline
    )}`;

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

      <nav className="text-sm text-brand-green/60 mb-8">
        <Link href="/" className="hover:text-brand-green">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-brand-green">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-green">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/70 border border-brand-green/10">
          <Image
            src={image}
            alt={`${product.name} — ${product.tagline}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
          />
        </div>

        <div>
          <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
            {SUBCATEGORY_LABELS[product.subcategory]}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green leading-tight">
            {product.name}
          </h1>
          <p className="mt-2 text-xl text-brand-green/70 italic">
            {product.tagline}
          </p>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-serif text-3xl text-brand-green">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-brand-green/60">
              {product.weight}
            </span>
          </div>

          <p className="mt-6 text-brand-green/80 leading-relaxed">
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
              <dd className="text-brand-green/80 leading-relaxed">
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
              <dd className="text-brand-green/80 leading-relaxed">
                {product.application}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest text-xs text-brand-gold mb-2">
                Противопоказания
              </dt>
              <dd className="text-brand-green/80 leading-relaxed">
                {product.contraindications}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
