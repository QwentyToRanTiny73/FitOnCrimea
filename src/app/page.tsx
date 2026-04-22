import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
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

export default function HomePage() {
  const topProducts = TOP_SLUGS.map((slug) =>
    products.find((p) => p.slug === slug)
  ).filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <>
      <section className="relative overflow-hidden bg-brand-beige">
        <BotanicalBranch
          className="absolute -left-10 top-10 h-[320px] text-brand-green/30 hidden md:block"
        />
        <BotanicalBranch
          className="absolute -right-10 bottom-10 h-[320px] text-brand-green/30 hidden md:block rotate-180"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <BotanicalWreath className="mx-auto h-20 text-brand-gold mb-6" />
          <p className="uppercase tracking-[0.35em] text-xs text-brand-gold mb-4">
            Крымская травяная аптека · с 2009 года
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-green leading-tight">
            Herbarium <span className="italic">Tauricum</span>
            <span className="block text-2xl sm:text-3xl mt-3 text-brand-green/80">
              бальзамы на крымских травах
            </span>
          </h1>
          <BotanicalDivider className="my-8" />
          <p className="max-w-2xl mx-auto text-brand-green/80 text-lg font-serif italic">
            Травы, смолы и эфирные масла полуострова — собраны в узнаваемые
            баночки с акварельной этикеткой.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-8 py-3 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/massage-points"
              className="px-8 py-3 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold transition-colors"
            >
              Точки массажа
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="uppercase tracking-widest text-xs text-brand-gold mb-3">
          О линии
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-green">
          Travarium Crimea
        </h2>
        <BotanicalDivider className="my-6" />
        <p className="text-brand-green/80 leading-relaxed font-serif text-lg">
          «Фитон Крым» — линия натуральной косметики, созданная в Крыму.
          В основе — фармакопейные принципы, крымское растительное сырьё и
          традиционные методы приготовления мазей и бальзамов. Ассортимент
          объединяет уход за кожей лица и тела, поддержку суставов, дыхательной
          системы и сезонные сборы для прогулок и бани.
        </p>
      </section>

      <section className="relative bg-white/40 watercolor-texture border-y border-brand-green/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
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
          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="text-brand-green border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors"
            >
              Весь каталог →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
              Схема применения
            </p>
            <h2 className="font-serif text-3xl text-brand-green">
              26 точек для массажа с бальзамом
            </h2>
            <BotanicalDivider className="my-6" />
            <p className="text-brand-green/80 leading-relaxed">
              Карта акупунктурных точек, с которыми можно использовать крымские
              бальзамы: от насморка и головной боли до радикулита и
              эмоциональной разгрузки. Точки пронумерованы и сопоставлены с
              показаниями.
            </p>
            <Link
              href="/massage-points"
              className="inline-block mt-6 px-6 py-2 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold transition-colors"
            >
              Посмотреть схему
            </Link>
          </div>
          <BotanicalBranch className="order-1 md:order-2 h-48 mx-auto text-brand-green/60" />
          <ul className="order-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-green/80">
            <li>· ринит, насморк</li>
            <li>· головная боль</li>
            <li>· ангина, горло</li>
            <li>· бессонница</li>
            <li>· радикулит, ишиас</li>
            <li>· межрёберная невралгия</li>
            <li>· метеочувствительность</li>
            <li>· тревожность</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative rounded-3xl bg-brand-green text-brand-beige p-8 sm:p-14 text-center overflow-hidden">
          <BotanicalWreath className="mx-auto h-16 text-brand-gold mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl">
            Каталог открыт
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-brand-beige/80 font-serif italic">
            Покупка товаров — на маркетплейсе Ozon, где открыт магазин бренда.
          </p>
          <Link
            href="/catalog"
            className="inline-block mt-8 px-8 py-3 rounded-full bg-brand-gold text-brand-green hover:bg-brand-gold/90 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </section>
    </>
  );
}
