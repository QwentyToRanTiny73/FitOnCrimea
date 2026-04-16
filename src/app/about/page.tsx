import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "История, философия и производственные принципы «Фитон Крым» — авторской марки натуральной косметики из Крыма с 2009 года.",
};

const VALUES = [
  {
    title: "Авторские рецептуры",
    text: "Каждый бальзам разработан по фармакопейным принципам и прошёл годы практического применения.",
  },
  {
    title: "Крымское сырьё",
    text: "Эфирные масла, экстракты и инфузии — из растений, собранных в предгорьях Крыма.",
  },
  {
    title: "Ручной труд",
    text: "Небольшие партии варятся вручную: без консервантов массового производства и без спешки.",
  },
  {
    title: "Узнаваемый стиль",
    text: "Акварельные иллюстрации на упаковке — визитная карточка бренда с первых выпусков.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      <header className="text-center mb-16">
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-4">
          О бренде
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-green">
          Косметика, которую делают в Крыму
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-brand-green/75">
          «Фитон Крым» — это разговор о природе полуострова на языке бальзамов:
          чабрец, лаванда, хвоя, роза, облепиха и десятки других растений,
          собранные в узнаваемые баночки с акварельной этикеткой.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1445264718234-a623be589d37?auto=format&fit=crop&w=900&q=80"
            alt="Крымские травы"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl text-brand-green">
            История с 2009 года
          </h2>
          <p className="mt-4 text-brand-green/80 leading-relaxed">
            Бренд «Фитон Крым» появился в 2009 году как лаборатория небольшого
            масштаба. За основу взяли классические фармакопейные принципы:
            выверенные концентрации активных веществ, воспроизводимость и
            чистота рецептур.
          </p>
          <p className="mt-4 text-brand-green/80 leading-relaxed">
            Постепенно линейка выросла до более чем двадцати бальзамов, мыла
            ручной работы и бальзамов для губ. Часть рецептур пришла из
            монастырской традиции, часть родилась в результате работы с
            крымским сырьём.
          </p>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-6 mb-20">
        {VALUES.map((item) => (
          <div
            key={item.title}
            className="p-6 bg-white/60 border border-brand-green/10 rounded-xl"
          >
            <h3 className="font-serif text-2xl text-brand-green">
              {item.title}
            </h3>
            <p className="mt-3 text-brand-green/75 leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </section>

      <section className="text-center">
        <h2 className="font-serif text-3xl text-brand-green">
          Где попробовать
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-brand-green/75">
          Основной канал продаж — магазин бренда на Ozon. Полный каталог
          продуктов доступен на сайте, с каждой карточки можно перейти на
          маркетплейс для оформления заказа.
        </p>
        <Link
          href="/catalog"
          className="inline-block mt-8 px-8 py-3 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
        >
          Перейти в каталог
        </Link>
      </section>
    </div>
  );
}
