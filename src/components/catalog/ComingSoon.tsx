import Image from "next/image";
import type { CategoryMeta } from "@/config/categories";
import { site } from "@/config/site";
import { assetUrl } from "@/lib/utils";

/** Анонс категории, для которой ещё не заведены карточки. Тексты — из брошюры. */
export function ComingSoon({ category }: { category: CategoryMeta }) {
  return (
    <div className="paper-page grid items-center gap-6 rounded-2xl p-6 sm:p-10 md:grid-cols-[1fr_1.2fr]">
      {category.image && (
        <figure className="stamp mx-auto w-full max-w-sm">
          <Image
            src={assetUrl(category.image.src)}
            alt={category.image.alt}
            width={category.image.width}
            height={category.image.height}
            sizes="(max-width: 768px) 90vw, 380px"
            className="block h-auto w-full"
          />
        </figure>
      )}
      <div className="text-center md:text-left">
        <h2 className="title-crimson font-serif text-2xl font-bold uppercase sm:text-3xl">{category.label}</h2>
        <p className="mt-3 leading-relaxed text-brand-green/85">{category.teaser}</p>
        {category.details && (
          <ul className="mt-3 space-y-1.5 text-sm text-brand-green/80">
            {category.details.map((d) => (
              <li key={d}>— {d}</li>
            ))}
          </ul>
        )}
        <p className="mt-6 inline-block rounded-sm border border-brand-gold/50 bg-brand-cream px-4 py-1.5 text-xs uppercase tracking-widest text-brand-gold">
          Карточки готовятся · пока ищите на {site.marketplace.name}
        </p>
      </div>
    </div>
  );
}
