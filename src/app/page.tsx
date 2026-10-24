import Image from "next/image";
import Link from "next/link";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductCard } from "@/components/catalog/ProductCard";
import { HeroEmblem } from "@/components/ui/HeroEmblem";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/config/categories";
import { site } from "@/config/site";
import { getProductBySlug, products, type Product } from "@/data/catalog";
import { assetUrl, cn } from "@/lib/utils";

const pick = (slugs: string[]): Product[] =>
  slugs.map(getProductBySlug).filter((p): p is Product => Boolean(p));

const HITS = pick([
  "chabretsovaya-zvezdochka",
  "krymskiy-spasatel",
  "zvezda-kryma",
  "progrevayushchiy",
  "ot-ozhogov",
  "limonnik-i-roza",
]);

const TRUST = [
  { title: `С ${site.since} года`, text: "Своя линия натуральной косметики" },
  { title: "Крымские травы", text: "Эфирные масла и экстракты растений" },
  { title: "Фармакопейные рецептуры", text: "Основа — пчелиный воск и масла" },
  { title: "Акварельная упаковка", text: "Узнаваемый авторский стиль" },
];

const COLLECTIONS = [
  {
    title: "Сезон простуд",
    text: "Чабрец, мирт, анис и лавр — при насморке, кашле и первых признаках простуды.",
    href: "/catalog?cat=respiratory",
    slugs: ["chabretsovaya-zvezdochka", "ot-kashlya", "ot-nasmorka"],
    tone: "border-brand-green/40 bg-brand-green/5",
  },
  {
    title: "Суставы и спина",
    text: "Прогревающие и обезболивающие бальзамы при ревматизме, радикулите, остеохондрозе.",
    href: "/catalog?cat=joints",
    slugs: ["progrevayushchiy", "obezbolivayushchiy", "zdorovye-sustavy"],
    tone: "border-brand-sea/40 bg-brand-sea/5",
  },
  {
    title: "Уход за лицом",
    text: "Против акне, для упругости кожи и выравнивания тона.",
    href: "/catalog?cat=face",
    slugs: ["chistoe-lico", "limonnik-i-roza", "belosnezhka"],
    tone: "border-brand-poppy/40 bg-brand-poppy/5",
  },
];

export default function HomePage() {
  const years = new Date().getFullYear() - site.since;
  const numbers = [
    { value: `${years}+`, label: "лет бренду" },
    { value: String(products.length), label: "бальзамов в каталоге" },
    { value: "30", label: "сортов мыла" },
    { value: "26", label: "точек массажа на схеме" },
  ];

  return (
    <>
      {/* 1. Баннер */}
      <section className="relative overflow-hidden watercolor-texture">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-8 sm:px-6 sm:pt-14 md:grid-cols-[1.1fr_1fr] md:gap-10 md:pb-16">
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-brand-gold sm:text-xs">
              Целебные бальзамы Крыма
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] text-brand-green sm:text-6xl">
              Магазин натуральной крымской косметики
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-brand-green/80 sm:text-lg md:mx-0">
              Бальзамы на эфирных маслах и травах полуострова, мыло ручной работы и бальзамы для губ.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-8 py-3.5 text-brand-beige transition-colors hover:bg-brand-green/90"
              >
                Смотреть каталог <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/massage-points"
                className="inline-flex items-center justify-center rounded-full border border-brand-green/30 px-8 py-3.5 text-brand-green transition-colors hover:border-brand-terracotta"
              >
                Точки массажа
              </Link>
            </div>
          </div>
          <HeroEmblem className="order-1 mx-auto w-56 drop-shadow-sm sm:w-72 md:order-2 md:w-full md:max-w-md" />
        </div>
      </section>

      {/* 2. Полоса доверия */}
      <section aria-label="Почему нам доверяют" className="border-y border-brand-green/10 bg-white/50">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
          {TRUST.map((t, i) => (
            <li key={t.title} className="flex items-start gap-3 py-4 sm:py-5">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  ["bg-brand-gold", "bg-brand-forest", "bg-brand-sea", "bg-brand-poppy"][i]
                )}
              />
              <span>
                <span className="block font-serif text-base leading-tight text-brand-green sm:text-lg">{t.title}</span>
                <span className="block text-xs text-brand-green/65 sm:text-sm">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Категории */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Подбор по задаче" title="Что вас беспокоит?" />
        <CategoryGrid />
      </section>

      {/* 4. Хиты */}
      <section className="bg-brand-cream/70 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Хиты линейки" title="С чего начать знакомство" />
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {HITS.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-brand-green underline decoration-brand-gold underline-offset-4 hover:text-brand-gold">
              Весь каталог <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Подборки по показаниям */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Подборки" title="По показаниям" />
        <div className="grid gap-4 md:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <Link href={c.href} className={cn("group block h-full rounded-2xl border-t-4 p-6 transition-shadow hover:shadow-md", c.tone)}>
                <h3 className="font-serif text-2xl text-brand-green">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-green/80">{c.text}</p>
                <ul className="mt-4 space-y-1 text-sm text-brand-green/75">
                  {pick(c.slugs).map((p) => (
                    <li key={p.slug}>· {p.name}</li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand-green group-hover:text-brand-gold">
                  Смотреть <ArrowIcon className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Бренд в цифрах */}
      <section className="bg-brand-green text-brand-beige">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <ul className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {numbers.map((n) => (
              <li key={n.label}>
                <span className="block font-serif text-4xl text-brand-gold sm:text-5xl">{n.value}</span>
                <span className="mt-1 block text-sm text-brand-beige/80">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Линейки */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Ассортимент" title="Три линейки" />
        <ul className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <Link
                href={c.key === "balm" ? "/catalog" : `/catalog?type=${c.key}`}
                className="vintage-frame flex h-full flex-col rounded-2xl border border-brand-green/10 p-6 transition-colors hover:border-brand-gold/60"
              >
                <h3 className="font-serif text-2xl text-brand-green">{c.label}</h3>
                <p className="mt-2 flex-1 text-sm text-brand-green/80">{c.teaser}</p>
                <span className="mt-4 text-xs uppercase tracking-widest text-brand-gold">
                  {c.available ? "В каталоге" : "Скоро на сайте"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Точки массажа */}
      <section className="bg-brand-terracotta/10 py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <Link href="/massage-points" className="relative mx-auto block aspect-[1400/2048] w-48 overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-sm sm:w-60">
            <Image
              src={assetUrl("/massage-points.jpg")}
              alt="Схема акупунктурных точек для массажа с бальзамом"
              fill
              sizes="240px"
              className="object-cover"
            />
          </Link>
          <div className="text-center md:text-left">
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-brand-terracotta">Схема применения</p>
            <h2 className="font-serif text-3xl text-brand-green sm:text-4xl">26 точек для массажа с бальзамом</h2>
            <p className="mt-4 text-brand-green/80">
              Карта акупунктурных точек из брошюры бренда: при насморке и головной боли, бессоннице,
              радикулите, межрёберной невралгии и других состояниях.
            </p>
            <Link
              href="/massage-points"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-terracotta px-7 py-3 text-white transition-opacity hover:opacity-90"
            >
              Открыть схему <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Связь */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 rounded-3xl border border-brand-green/10 bg-white/70 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-brand-green">Покупка и опт</h2>
            <p className="mt-3 text-brand-green/80">
              Розничные покупки — на {site.marketplace.name}. По оптовым поставкам пишите или звоните.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-brand-green">
            <a href={`mailto:${site.contacts.email}`} className="font-serif text-xl hover:underline">
              {site.contacts.email}
            </a>
            <a href={site.contacts.phoneHref} className="font-serif text-xl hover:underline">
              {site.contacts.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
