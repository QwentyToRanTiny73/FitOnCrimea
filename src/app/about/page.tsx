import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Emblem, Ribbon, StampImage } from "@/components/ui/Brochure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BROCHURE_CREDO, BROCHURE_INTRO, SLOGAN, STAMPS } from "@/config/brochure";
import { CATEGORIES } from "@/config/categories";
import { site } from "@/config/site";
import { visibleProducts } from "@/data/catalog";
import { assetUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "О бренде",
  description: `«${site.name}» — натуральная косметика на крымских травах с ${site.since} года: серия «Крымский бальзам», мыло ручной работы, бальзамы для губ.`,
};

const GALLERY = [STAMPS.road, STAMPS.karadag, STAMPS.window, STAMPS.swallowNest, STAMPS.lighthouse, STAMPS.car];

export default function AboutPage() {
  const balmCount = visibleProducts().filter((p) => p.category === "balm").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Emblem className="h-16 w-16" />
        <Ribbon text={SLOGAN} className="w-72 sm:w-80" />
      </div>
      <SectionHeading as="h1" eyebrow={`С ${site.since} года`} title="Целебные бальзамы Крыма" />

      <section className="paper-page mb-12 grid items-start gap-8 rounded-2xl p-6 sm:p-10 md:grid-cols-[1fr_auto]">
        <div className="space-y-4 leading-relaxed text-brand-green/90">
          {BROCHURE_INTRO.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <p>
            Сейчас на сайте {balmCount} бальзамов серии; мыло ручной работы и бальзамы для губ
            появятся в каталоге следующими.
          </p>
          <blockquote className="border-l-4 border-brand-amber pl-4 font-serif text-lg italic text-brand-crimson">
            {BROCHURE_CREDO}
          </blockquote>
        </div>
        <StampImage {...STAMPS.window} className="mx-auto hidden w-48 rotate-2 md:block" sizes="200px" />
      </section>

      <section className="mb-12">
        <SectionHeading eyebrow="Ассортимент" title="Линейки" />
        <ul className="grid gap-5 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.key} className="paper-page overflow-hidden rounded-xl">
              {c.image && (
                <div className="relative aspect-[4/3] border-b border-brand-amber/40 bg-brand-cream">
                  <Image src={assetUrl(c.image.src)} alt={c.image.alt} fill sizes="(max-width: 640px) 90vw, 320px" className="object-contain p-2" />
                </div>
              )}
              <div className="p-5">
                <h3 className="title-crimson font-serif text-lg font-bold uppercase">{c.label}</h3>
                <p className="mt-2 text-sm text-brand-green/85">{c.teaser}</p>
                {c.details?.map((d) => (
                  <p key={d} className="mt-1 text-sm text-brand-green/75">
                    — {d}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <SectionHeading eyebrow="Акварели брошюры" title="Крым на страницах" />
        <ul className="columns-2 gap-4 sm:columns-3">
          {GALLERY.map((img, i) => (
            <Reveal as="li" key={img.src} delay={(i % 3) * 80} className="mb-4 break-inside-avoid">
              <StampImage {...img} className={i % 2 ? "w-full rotate-1" : "w-full -rotate-1"} sizes="(max-width: 640px) 45vw, 300px" />
            </Reveal>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <Link
          href="/catalog"
          className="inline-flex rounded-full bg-brand-green px-8 py-3 text-brand-cream shadow-[0_2px_0_#1e3f25] transition-colors hover:bg-brand-forest"
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
