import type { CategoryMeta } from "@/config/categories";
import { BotanicalWreath } from "@/components/ui/Botanical";

/** Анонс категории, для которой ещё не заведены карточки. */
export function ComingSoon({ category }: { category: CategoryMeta }) {
  return (
    <div className="vintage-frame rounded-2xl border border-brand-green/10 px-6 py-12 text-center">
      <BotanicalWreath className="mx-auto mb-4 h-12 text-brand-terracotta" />
      <h2 className="font-serif text-2xl text-brand-green sm:text-3xl">{category.label}</h2>
      <p className="mx-auto mt-3 max-w-lg text-brand-green/80">{category.teaser}</p>
      {category.details && (
        <ul className="mx-auto mt-3 max-w-lg space-y-1 text-sm text-brand-green/75">
          {category.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      <p className="mt-6 inline-block rounded-full border border-brand-gold/50 px-4 py-1.5 text-xs uppercase tracking-widest text-brand-gold">
        Карточки готовятся к публикации
      </p>
    </div>
  );
}
