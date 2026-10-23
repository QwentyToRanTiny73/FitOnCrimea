import type { Metadata } from "next";
import Link from "next/link";
import {
  BotanicalBranch,
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "«Фитон Крым» — линия натуральной косметики из Крыма с 2009 года. Фармакопейные принципы, крымское растительное сырьё, акварельная упаковка.",
};

const SECTIONS = [
  {
    title: "Сырьё",
    text: "Эфирные масла, экстракты и инфузии — из растений, собранных и переработанных в Крыму: лаванда, чабрец, роза, хвоя, облепиха, шиповник, софора, гинкго.",
  },
  {
    title: "Рецептуры",
    text: "Составы выверены по фармакопейным принципам: концентрации активных веществ, совместимость, воспроизводимость от партии к партии.",
  },
  {
    title: "Производство",
    text: "Бальзамы варятся малыми партиями, без консервантов массового производства. Упаковка — в стеклянные баночки 15 г с акварельной этикеткой.",
  },
  {
    title: "Ассортимент",
    text: "Более 20 бальзамов для лица, тела, суставов и дыхательной системы, мыло ручной работы, монастырская коллекция и бальзамы для губ.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <header className="text-center mb-12">
        <BotanicalWreath className="mx-auto h-16 text-brand-gold mb-4" />
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-4">
          О бренде
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-green">
          Herbarium Tauricum
        </h1>
        <BotanicalDivider className="my-6" />
        <p className="max-w-2xl mx-auto text-brand-green/80 font-serif italic text-lg">
          Травяная аптека Крыма на языке бальзамов — чабрец, лаванда, хвоя,
          роза, облепиха и десятки других растений в узнаваемых баночках с
          акварельной этикеткой.
        </p>
      </header>

      <section className="grid md:grid-cols-[auto_1fr] gap-8 items-start mb-20">
        <BotanicalBranch className="h-[320px] mx-auto text-brand-green/50" />
        <div>
          <h2 className="font-serif text-3xl text-brand-green">
            Линия с 2009 года
          </h2>
          <BotanicalDivider className="my-5" />
          <p className="text-brand-green/80 leading-relaxed">
            «Фитон Крым» — линия натуральной косметики, которая развивается с
            2009 года. За основу взяты классические фармакопейные принципы:
            выверенные концентрации активных веществ, воспроизводимость и
            чистота рецептур.
          </p>
          <p className="mt-4 text-brand-green/80 leading-relaxed">
            Часть рецептур опирается на монастырскую традицию, часть создана
            при работе с крымским сырьём. За годы линия выросла до более чем
            двадцати бальзамов, мыла ручной работы и бальзамов для губ.
          </p>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-6 mb-20">
        {SECTIONS.map((item) => (
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
          Где купить
        </h2>
        <BotanicalDivider className="my-5" />
        <p className="mt-4 max-w-xl mx-auto text-brand-green/75">
          Основной канал продаж — магазин бренда на Ozon. Полный каталог
          доступен на сайте, с каждой карточки можно перейти на маркетплейс
          для оформления заказа.
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
