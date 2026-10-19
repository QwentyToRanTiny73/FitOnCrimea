import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { assetUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Точки массажа с крымским бальзамом",
  description:
    "Схема 26 акупунктурных точек для массажа с бальзамами «Фитон Крым» и показания к каждой точке.",
};

const IMAGE = "/massage-points.jpg";

// Показания перенесены из брошюры бренда без изменений.
const POINTS: string[] = [
  "ринит, насморк, головная боль, ОРВИ, гипертонический криз",
  "гипертония, бессонница, атеросклероз",
  "метеочувствительность, стресс, переутомление",
  "зубная боль, боль в ухе",
  "спазматический кашель, астма",
  "ангина, боль в горле",
  "слабость иммунной системы",
  "глазная боль, перевозбуждение",
  "меланхолия, бессонница",
  "гипотония",
  "боль в области сердца",
  "тревожность, взволнованность",
  "спазматическая головная боль",
  "холецистит, желчная колика",
  "пояснично-крестцовый радикулит, ишиас",
  "половая слабость, поясничная боль",
  "раздражительность, истерия, бессонница",
  "стенокардия, боль в животе, расстройство месячных циклов",
  "переутомление, слабое внимание",
  "онемение рук, слабость",
  "шейный остеохондроз",
  "избыточный вес",
  "межрёберная невралгия",
  "радикулит",
  "боль в локтевом суставе",
  "атеросклероз",
];

export default function MassagePointsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow="Схема применения"
        title="Точки массажа с крымским бальзамом"
        lead="26 акупунктурных точек и показания к ним. Нажмите на схему, чтобы открыть её в полном размере."
      />

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <a
          href={assetUrl(IMAGE)}
          target="_blank"
          rel="noopener"
          className="relative block aspect-[1400/2048] overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-sm lg:sticky lg:top-24"
        >
          <Image
            src={assetUrl(IMAGE)}
            alt="Схема акупунктурных точек для массажа с крымским бальзамом, точки пронумерованы от 1 до 26"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-contain"
          />
        </a>

        <div>
          <h2 className="mb-4 font-serif text-2xl text-brand-green">Показания по точкам</h2>
          <ol className="divide-y divide-brand-green/10 rounded-2xl border border-brand-green/10 bg-white/70">
            {POINTS.map((text, i) => (
              <li key={i} className="flex gap-4 px-4 py-3 text-sm leading-relaxed text-brand-green/85 sm:text-base">
                <span className="w-7 shrink-0 text-right font-serif text-lg leading-none text-brand-terracotta">
                  {i + 1}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ol>

          <section className="mt-8 rounded-2xl border border-brand-gold/40 bg-brand-cream p-5 text-sm leading-relaxed text-brand-green/85">
            <h2 className="mb-2 font-serif text-xl text-brand-green">Важно</h2>
            <p>
              Схема носит ознакомительный характер и не заменяет консультацию врача. Перед первым
              применением бальзама проверьте переносимость на небольшом участке кожи.
            </p>
          </section>

          <Link
            href="/catalog"
            className="mt-8 inline-flex rounded-full bg-brand-green px-8 py-3 text-brand-beige transition-colors hover:bg-brand-green/90"
          >
            Выбрать бальзам
          </Link>
        </div>
      </div>
    </div>
  );
}
