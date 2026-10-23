import Image from "next/image";
import Link from "next/link";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Meadow, Ribbon, StampImage } from "@/components/ui/Brochure";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BROCHURE_INTRO, COVER, SLOGAN, STAMPS } from "@/config/brochure";
import { CATEGORIES } from "@/config/categories";
import { site } from "@/config/site";
import { getProductBySlug, visibleProducts, type Product } from "@/data/catalog";
import { assetUrl, cn } from "@/lib/utils";

const pick = (slugs: string[]): Product[] =>
  slugs.map((slug) => getProductBySlug(slug)).filter((p): p is Product => Boolean(p) && !p?.hidden);

const HITS = pick([
  "chabretsovaya-zvezdochka",
  "krymskiy-spasatel",
  "zvezda-kryma",
  "progrevayushchiy",
  "ot-ozhogov",
  "limonnik-i-roza",
]);

const TRUST = [
  { title: `С ${site.since} года`, text: "Своя линия натуральной косметики", dot: "bg-brand-gold" },
  { title: "Крымские травы", text: "Эфирные масла и экстракты растений", dot: "bg-brand-forest" },
  { title: "Фармакопейные прописи", text: "Основа — растительные масла и воски", dot: "bg-brand-sea" },
  { title: "Экономичны", text: "Нужно минимальное количество", dot: "bg-brand-poppy" },
];

const COLLECTIONS = [
  {
    title: "Сезон простуд",
    text: "Чабрец, мирт, анис и лавр — при насморке, кашле и первых признаках простуды.",
    href: "/catalog?cat=respiratory",
    slugs: ["chabretsovaya-zvezdochka", "ot-kashlya", "ot-nasmorka"],
    tone: "border-brand-green",
  },
  {
    title: "Суставы и спина",
    text: "Прогревающие и обезболивающие бальзамы при ревматизме, радикулите, остеохондрозе.",
    href: "/catalog?cat=joints",
    slugs: ["progrevayushchiy", "obezbolivayushchiy", "zdorovye-sustavy"],
    tone: "border-brand-sea",
  },
  {
    title: "Уход за лицом",
    text: "Против акне, для тонуса кожи и осветления пигментных пятен.",
    href: "/catalog?cat=face",
    slugs: ["chistoe-lico", "limonnik-i-roza", "belosnezhka"],
    tone: "border-brand-poppy",
  },
];

const STEPS = [
  { n: "1", title: "Выберите бальзам", text: "По задаче, растению или симптому — в каталоге есть поиск." },
  { n: "2", title: "Изучите карточку", text: "Показания, состав, способ применения и противопоказания." },
  { n: "3", title: `Купите на ${site.marketplace.name}`, text: "Кнопка в карточке ведёт прямо к товару на маркетплейсе." },
];

export default function HomePage() {
  const years = new Date().getFullYear() - site.since;
  const numbers = [
    { value: `${years}+`, label: "лет бренду" },
    { value: String(visibleProducts().length), label: "бальзамов в каталоге" },
    { value: "30", label: "сортов мыла" },
    { value: "26", label: "точек массажа на схеме" },
  ];

  return (
    <>
      {/* 1. Обложка */}
      <section className="cover-paper relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-4 px-4 pb-20 pt-6 sm:px-6 sm:pt-10 md:grid-cols-[1.05fr_1fr] md:gap-8 md:pb-28">
          <div className="order-2 text-center md:order-1 md:text-left">
            <Ribbon text={SLOGAN} className="mx-auto mb-2 w-72 sm:w-80 md:mx-0" />
            <h1 className="font-display text-[2.1rem] uppercase leading-[1.05] text-brand-maroon [text-shadow:0_1px_0_rgba(255,255,255,0.6)] sm:text-6xl">
              Магазин натуральной крымской косметики
            </h1>
            <p className="title-crimson mt-3 font-serif text-xl font-bold uppercase tracking-wide sm:text-2xl">
              Целебные бальзамы Крыма
            </p>
            <p className="mx-auto mt-4 max-w-xl text-brand-green/90 sm:text-lg md:mx-0">
              Бальзамы на эфирных маслах и травах полуострова, мыло ручной работы и бальзамы для губ.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-8 py-3.5 text-brand-cream shadow-[0_2px_0_#1e3f25] transition-colors hover:bg-brand-forest"
              >
                Смотреть каталог <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link
                href="#podbor"
                className="inline-flex items-center justify-center rounded-full border-2 border-brand-crimson/60 bg-brand-cream/70 px-8 py-3.5 font-semibold text-brand-crimson transition-colors hover:bg-brand-cream"
              >
                Подобрать по задаче
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src={assetUrl(COVER.src)}
              alt={COVER.alt}
              width={COVER.width}
              height={COVER.height}
              priority
              sizes="(max-width: 768px) 80vw, 520px"
              className="mx-auto h-auto w-64 sm:w-80 md:w-full md:max-w-[520px]"
            />
          </div>
        </div>
        <Meadow className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-24" tone="text-brand-amber/80" />
      </section>

      {/* 2. Полоса доверия */}
      <section aria-label="О бренде коротко" className="border-y-2 border-double border-brand-amber/70 bg-brand-cream">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 px-4 sm:px-6 lg:grid-cols-4">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-start gap-3 py-4 sm:py-5">
              <span className={cn("mt-2 h-2 w-2 shrink-0 rotate-45", t.dot)} aria-hidden="true" />
              <span>
                <span className="block font-serif text-base font-bold leading-tight text-brand-green sm:text-lg">{t.title}</span>
                <span className="block text-xs text-brand-green/70 sm:text-sm">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Подбор по задаче */}
      <section id="podbor" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Подбор по задаче" title="Что вас беспокоит?" />
        <CategoryGrid />
      </section>

      {/* 4. Хиты */}
      <section className="paper-page py-12 sm:py-16">
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
            <Link href="/catalog" className="inline-flex items-center gap-2 font-semibold text-brand-crimson underline decoration-brand-amber decoration-2 underline-offset-4">
              Весь каталог <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. О серии — слова из брошюры */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading align="left" eyebrow="О серии" title="«Крымский бальзам» — целебные бальзамы Крыма" />
            <div className="space-y-4 leading-relaxed text-brand-green/90">
              {BROCHURE_INTRO.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <Link href="/about" className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-crimson underline decoration-brand-amber decoration-2 underline-offset-4">
              О бренде <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative mx-auto flex max-w-md flex-col items-center gap-0">
            <StampImage {...STAMPS.swallowNest} className="w-64 -rotate-3 sm:w-72" />
            <StampImage {...STAMPS.lighthouse} className="-mt-6 ml-24 w-56 rotate-2 sm:w-64" />
          </div>
        </div>
      </section>

      {/* 6. Подборки по показаниям */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <SectionHeading eyebrow="Подборки" title="По показаниям" />
        <div className="grid gap-4 md:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <Link href={c.href} className={cn("paper-page group block h-full rounded-xl border-t-4 p-6 transition-shadow hover:shadow-md", c.tone)}>
                <h3 className="title-crimson font-serif text-xl font-bold uppercase">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-green/85">{c.text}</p>
                <ul className="mt-4 space-y-1 text-sm text-brand-green">
                  {pick(c.slugs).map((p) => (
                    <li key={p.slug}>· {p.name}</li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-green group-hover:text-brand-crimson">
                  Смотреть <ArrowIcon className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 7. Бренд в цифрах */}
      <section className="relative bg-brand-green text-brand-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <ul className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {numbers.map((n) => (
              <li key={n.label}>
                <span className="block font-display text-4xl text-brand-amber sm:text-5xl">{n.value}</span>
                <span className="mt-1 block text-sm text-brand-cream/80">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Линейки */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Ассортимент" title="Три линейки" />
        <ul className="grid gap-5 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <Link
                href={c.key === "balm" ? "/catalog" : `/catalog?type=${c.key}`}
                className="paper-page group flex h-full flex-col overflow-hidden rounded-xl transition-shadow hover:shadow-md"
              >
                {c.image && (
                  <div className="relative aspect-[4/3] border-b border-brand-amber/40 bg-brand-cream">
                    <Image src={assetUrl(c.image.src)} alt={c.image.alt} fill sizes="(max-width: 640px) 90vw, 360px" className="object-contain p-2" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="title-crimson font-serif text-xl font-bold uppercase">{c.label}</h3>
                  <p className="mt-2 flex-1 text-sm text-brand-green/85">{c.teaser}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-gold">
                    {c.available ? "В каталоге →" : "Скоро на сайте"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 9. Точки массажа */}
      <section className="paper-page py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <Link href="/massage-points" className="stamp mx-auto block w-48 rotate-[-2deg] sm:w-60">
            <Image
              src={assetUrl("/massage-points.jpg")}
              alt="Схема акупунктурных точек для массажа с бальзамом"
              width={1400}
              height={2048}
              sizes="240px"
              className="block h-auto w-full"
            />
          </Link>
          <div className="text-center md:text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">Схема применения</p>
            <h2 className="title-crimson font-serif text-2xl font-bold uppercase sm:text-3xl">26 точек для массажа с бальзамом</h2>
            <p className="mt-4 text-brand-green/85">
              Карта акупунктурных точек из брошюры бренда: при насморке и головной боли, бессоннице,
              радикулите, межрёберной невралгии и других состояниях.
            </p>
            <Link
              href="/massage-points"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-crimson px-7 py-3 text-white shadow-[0_2px_0_#5a2420] transition-opacity hover:opacity-90"
            >
              Открыть схему <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Как купить + опт */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Покупателям" title="Как купить" />
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="paper-page flex gap-4 rounded-xl p-5">
              <span className="font-display text-4xl leading-none text-brand-crimson">{s.n}</span>
              <span>
                <span className="block font-serif text-lg font-bold text-brand-green">{s.title}</span>
                <span className="mt-1 block text-sm text-brand-green/80">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border-2 border-dashed border-brand-amber px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-brand-green/85">
            <span className="font-serif font-bold text-brand-green">Оптовые поставки:</span>{" "}
            <a href={`mailto:${site.contacts.email}`} className="underline decoration-brand-amber underline-offset-4">
              {site.contacts.email}
            </a>
          </p>
          <a href={site.contacts.phoneHref} className="font-serif text-lg font-bold text-brand-green">
            {site.contacts.phone}
          </a>
        </div>
      </section>
    </>
  );
}
