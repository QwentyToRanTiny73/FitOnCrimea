import type { Metadata } from "next";
import Link from "next/link";
import { BotanicalBranch } from "@/components/ui/Botanical";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/config/categories";
import { site } from "@/config/site";
import { products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "О бренде",
  description: `«${site.name}» — натуральная косметика на крымских травах с ${site.since} года: бальзамы, мыло ручной работы, бальзамы для губ.`,
};

const PRINCIPLES = [
  {
    title: "Крымское сырьё",
    text: "Эфирные масла и экстракты растений: чабрец, лаванда, роза, пихта, облепиха, шиповник, софора и другие.",
    tone: "border-brand-forest/30",
  },
  {
    title: "Фармакопейные рецептуры",
    text: "Составы построены на классических фармакопейных принципах: активные растительные компоненты на основе пчелиного воска и масел.",
    tone: "border-brand-sea/30",
  },
  {
    title: "Акварельная упаковка",
    text: "Узнаваемый стиль бренда — авторские акварельные этикетки с крымскими пейзажами и травами.",
    tone: "border-brand-poppy/30",
  },
];

export default function AboutPage() {
  const balmCount = products.filter((p) => p.category === "balm").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow={`С ${site.since} года`}
        title="Целебные бальзамы Крыма"
        lead={<p className="font-serif text-lg italic">Шедевры натуральной косметики — травы, смолы и эфирные масла полуострова.</p>}
      />

      <section className="mb-14 grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <BotanicalBranch className="mx-auto hidden h-64 text-brand-green/40 md:block" />
        <div className="space-y-4 leading-relaxed text-brand-green/85">
          <p>
            «{site.name}» выпускает натуральную косметику с {site.since} года. В основе линии —
            бальзамы для ухода за кожей, суставами и дыхательной системой: каждый собран вокруг
            одного-двух ключевых растений, которые вынесены в его подзаголовок.
          </p>
          <p>
            Сегодня в каталоге {balmCount} бальзамов, а также мыло ручной работы и
            гигиенические бальзамы для губ.
          </p>
        </div>
      </section>

      <section className="mb-14 grid gap-4 sm:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 100} className={`rounded-2xl border-t-4 ${p.tone} bg-white/70 p-6`}>
            <h2 className="font-serif text-2xl text-brand-green">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-green/80">{p.text}</p>
          </Reveal>
        ))}
      </section>

      <section className="mb-14">
        <h2 className="mb-5 font-serif text-2xl text-brand-green sm:text-3xl">Линейки</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.key} className="rounded-2xl border border-brand-green/10 bg-white/60 p-5">
              <h3 className="font-serif text-xl text-brand-green">{c.label}</h3>
              <p className="mt-2 text-sm text-brand-green/80">{c.teaser}</p>
              {c.details?.map((d) => (
                <p key={d} className="mt-1 text-sm text-brand-green/70">
                  {d}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <Link
          href="/catalog"
          className="inline-flex rounded-full bg-brand-green px-8 py-3 text-brand-beige transition-colors hover:bg-brand-green/90"
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
