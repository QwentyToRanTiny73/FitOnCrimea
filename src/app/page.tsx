import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import {
  BotanicalBranch,
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";
import { products } from "@/data/products";

const TOP_SLUGS = [
  "chabretsovaya-zvezdochka",
  "krymskiy-spasatel",
  "zvezda-kryma",
  "limonnik-i-roza",
  "progrevayushchiy",
  "ot-ozhogov",
];

const COLLECTIONS = [
  {
    title: "Сезон простуд",
    text: "Чабрец, мирт, анис и пихта — для прогулок, прогревания и облегчения дыхания.",
    href: "/catalog?cat=respiratory",
    slugs: ["chabretsovaya-zvezdochka", "ot-kashlya", "ot-nasmorka"],
  },
  {
    title: "Суставы и спина",
    text: "Прогревающие и обезболивающие бальзамы при ревматизме, радикулите и остеохондрозе.",
    href: "/catalog?cat=joints",
    slugs: ["progrevayushchiy", "obezbolivayushchiy", "zdorovye-sustavy"],
  },
  {
    title: "Уход за лицом",
    text: "Бальзамы против акне, для anti-age и осветления пигментации.",
    href: "/catalog?cat=face",
    slugs: ["chistoe-lico", "limonnik-i-roza", "belosnezhka"],
  },
];

export default function HomePage() {
  const topProducts = TOP_SLUGS.map((slug) =>
    products.find((p) => p.slug === slug)
  ).filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <>
      <section className="relative overflow-hidden bg-brand-beige">
        <BotanicalBranch className="absolute -left-10 top-10 h-[280px] text-brand-green/25 hidden md:block" />
        <BotanicalBranch className="absolute -right-10 bottom-10 h-[280px] text-brand-green/25 hidden md:block rotate-180" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-20 text-center">
          <BotanicalWreath className="mx-auto h-16 text-brand-gold mb-4" />
          <p className="uppercase tracking-[0.3em] text-xs text-brand-gold mb-3">
            С 2009 года
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-brand-green leading-tight">
            Магазин натуральной<br className="hidden sm:block" />
            {" "}крымской косметики
          </h1>
          <BotanicalDivider className="my-6" />
          <p className="max-w-2xl mx-auto text-brand-green/80 font-serif italic">
            Бальзамы, мыло ручной работы и бальзамы для губ на крымских травах.
            Фармакопейные рецептуры, натуральные эфирные масла, акварельные
            этикетки.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <CategoryGrid />
        </div>
      </section>

      <section className="bg-white/40 watercolor-texture border-y border-brand-green/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10">
            <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Хиты линейки
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green">
              Шесть бальзамов для начала
            </h2>
            <BotanicalDivider className="my-6" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/catalog"
              className="text-brand-green border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors"
            >
              Весь каталог →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
            Подборки
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-green">
            По показаниям
          </h2>
          <BotanicalDivider className="my-6" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group block p-6 bg-white/60 border border-brand-green/10 rounded-2xl hover:border-brand-gold/50 transition-colors"
            >
              <h3 className="font-serif text-2xl text-brand-green">
                {c.title}
              </h3>
              <p className="mt-3 text-brand-green/75 leading-relaxed">
                {c.text}
              </p>
              <ul className="mt-4 text-sm text-brand-green/70 space-y-1">
                {c.slugs
                  .map((slug) => products.find((p) => p.slug === slug))
                  .filter((p): p is (typeof products)[number] => Boolean(p))
                  .map((p) => (
                    <li key={p.slug}>· {p.name}</li>
                  ))}
              </ul>
              <span className="inline-block mt-5 text-brand-green border-b border-brand-gold pb-0.5 group-hover:text-brand-gold">
                Перейти →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Схема применения
            </p>
            <h2 className="font-serif text-3xl text-brand-green">
              26 точек массажа с бальзамом
            </h2>
            <BotanicalDivider className="my-6" />
            <p className="text-brand-green/80 leading-relaxed">
              Карта акупунктурных точек с показаниями: от насморка и головной
              боли до радикулита и эмоциональной разгрузки.
            </p>
            <Link
              href="/massage-points"
              className="inline-block mt-6 px-6 py-2 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold transition-colors"
            >
              Посмотреть схему
            </Link>
          </div>
          <BotanicalBranch className="order-1 md:order-2 h-44 mx-auto text-brand-green/55" />
          <ul className="order-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-green/80">
            <li>· ринит, насморк</li>
            <li>· головная боль</li>
            <li>· ангина, горло</li>
            <li>· бессонница</li>
            <li>· радикулит</li>
            <li>· межрёберная невралгия</li>
            <li>· метеочувствительность</li>
            <li>· тревожность</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-3xl bg-brand-green text-brand-beige p-8 sm:p-14 text-center overflow-hidden">
          <BotanicalWreath className="mx-auto h-14 text-brand-gold mb-3" />
          <h2 className="font-serif text-3xl sm:text-4xl">Заведите аккаунт</h2>
          <p className="mt-4 max-w-xl mx-auto text-brand-beige/80 font-serif italic">
            Сохраняйте бальзамы в избранное, чтобы вернуться к ним и оформить
            заказ на Ozon в один клик.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account/register"
              className="px-8 py-3 rounded-full bg-brand-gold text-brand-green hover:bg-brand-gold/90 transition-colors"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/catalog"
              className="px-8 py-3 rounded-full border border-brand-beige/30 text-brand-beige hover:border-brand-gold transition-colors"
            >
              В каталог
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
