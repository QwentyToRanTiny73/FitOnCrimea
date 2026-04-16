import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=80";

const TOP_SLUGS = [
  "chabretsovaya-zvezdochka",
  "krymskiy-spasatel",
  "zvezda-kryma",
  "limonnik-i-roza",
  "progrevayushchiy",
  "ot-ozhogov",
];

const BENEFITS = [
  {
    title: "С 2009 года",
    text: "Бренд живёт и развивается более 15 лет, сохраняя авторские рецептуры.",
  },
  {
    title: "Фармакопейные рецептуры",
    text: "Создатель — биохимик и фармацевт с 30+ летним опытом.",
  },
  {
    title: "Крымское сырьё",
    text: "Эфирные масла, экстракты и травы собраны и переработаны в Крыму.",
  },
  {
    title: "Акварельная упаковка",
    text: "Каждый бальзам оформлен авторской иллюстрацией и узнаётся с полки.",
  },
];

export default function HomePage() {
  const topProducts = TOP_SLUGS.map((slug) =>
    products.find((p) => p.slug === slug)
  ).filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={HERO_IMAGE}
            alt="Крымские травы и природа"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-beige/70 via-brand-beige/50 to-brand-beige" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-4">
            Натуральная косметика Крыма с 2009 года
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-green leading-tight">
            Сила крымских трав
            <br />в авторских бальзамах
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-brand-green/80 text-lg">
            Фармакопейные рецептуры, натуральные эфирные масла и акварельный
            стиль — для тех, кто выбирает осознанный уход.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-8 py-3 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold transition-colors"
            >
              О бренде
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-widest text-xs text-brand-gold mb-3">
              О бренде
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green">
              Традиция, собранная вручную
            </h2>
            <p className="mt-6 text-brand-green/80 leading-relaxed">
              «Фитон Крым» — это авторская марка натуральной косметики,
              созданная в Крыму в 2009 году. В основе — фармакопейные рецептуры
              и сырьё, собранное в крымских предгорьях: лаванда, роза, чабрец,
              хвоя, облепиха и десятки других растений.
            </p>
            <p className="mt-4 text-brand-green/80 leading-relaxed">
              Каждый бальзам рождается в лаборатории и оформляется в авторской
              акварельной технике — так, чтобы полка в аптечке выглядела как
              маленькая картинная галерея.
            </p>
            <Link
              href="/about"
              className="inline-block mt-8 text-brand-green border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors"
            >
              Узнать больше о бренде
            </Link>
          </div>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=900&q=80"
              alt="Крымская лаванда"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white/40 watercolor-texture border-y border-brand-green/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
                Хиты линейки
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-green">
                Топ-6 бальзамов
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-brand-green hover:text-brand-gold transition-colors"
            >
              Весь каталог →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-green text-center">
          Почему «Фитон Крым»
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white/60 border border-brand-green/10 rounded-xl"
            >
              <h3 className="font-serif text-xl text-brand-green">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-brand-green/75 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-3xl bg-brand-green text-brand-beige p-8 sm:p-14 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Готовы попробовать?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-brand-beige/80">
            Выбирайте бальзамы в нашем каталоге — покупка совершается на
            маркетплейсе Ozon, где открыт официальный магазин бренда.
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
