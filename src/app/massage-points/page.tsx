import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";

export const metadata: Metadata = {
  title: "Точки массажа с крымским бальзамом",
  description:
    "Схема из 26 акупунктурных точек для массажа с бальзамами «Фитон Крым»: показания и локализация на теле.",
};

const POINTS: Array<{ n: number; text: string }> = [
  { n: 1, text: "ринит, насморк, головная боль, ОРВИ, гипертонический криз" },
  { n: 2, text: "гипертония, бессонница, атеросклероз" },
  { n: 3, text: "метеочувствительность, стресс, переутомление" },
  { n: 4, text: "зубная боль, боль в ухе" },
  { n: 5, text: "спазматический кашель, астма" },
  { n: 6, text: "ангина, боль в горле" },
  { n: 7, text: "слабость иммунной системы" },
  { n: 8, text: "глазная боль, перевозбуждение" },
  { n: 9, text: "меланхолия, бессонница" },
  { n: 10, text: "гипотония" },
  { n: 11, text: "боль в области сердца" },
  { n: 12, text: "тревожность, взволнованность" },
  { n: 13, text: "спазматическая головная боль" },
  { n: 14, text: "холецистит, жёлчная колика" },
  { n: 15, text: "пояснично-крестцовый радикулит, ишиас" },
  { n: 16, text: "половая слабость, поясничная боль" },
  { n: 17, text: "раздражительность, истерия, бессонница" },
  { n: 18, text: "стенокардия, боль в животе, расстройство месячных циклов" },
  { n: 19, text: "переутомление, слабое внимание" },
  { n: 20, text: "онемение рук, слабость" },
  { n: 21, text: "шейный остеохондроз" },
  { n: 22, text: "избыточный вес" },
  { n: 23, text: "межрёберная невралгия" },
  { n: 24, text: "радикулит" },
  { n: 25, text: "боль в локтевом суставе" },
  { n: 26, text: "атеросклероз" },
];

export default function MassagePointsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <header className="text-center mb-10">
        <BotanicalWreath className="mx-auto h-16 text-brand-gold mb-4" />
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-4">
          Схема применения
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-green">
          Точки массажа с крымским бальзамом
        </h1>
        <BotanicalDivider className="my-6" />
        <p className="max-w-2xl mx-auto text-brand-green/80 font-serif italic">
          26 акупунктурных точек с показаниями — карта, с которой можно
          использовать бальзамы линии «Фитон Крым».
        </p>
      </header>

      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-start">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/60 border border-brand-green/10 shadow-sm">
          <Image
            src="/massage-points.jpg"
            alt="Акупунктурные точки для массажа с крымским бальзамом — три грации"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
            priority
          />
        </div>

        <div>
          <h2 className="font-serif text-2xl text-brand-green mb-4">
            Показания по точкам
          </h2>
          <BotanicalDivider className="mb-6" />
          <ol className="space-y-3">
            {POINTS.map((p) => (
              <li
                key={p.n}
                className="flex gap-4 text-brand-green/85 text-sm leading-relaxed"
              >
                <span className="font-serif text-brand-gold text-lg leading-none pt-0.5 min-w-[2ch] text-right">
                  {p.n}.
                </span>
                <span>{p.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="mt-16 bg-white/60 border border-brand-green/10 rounded-2xl p-6 sm:p-10">
        <h2 className="font-serif text-2xl text-brand-green">
          Как пользоваться
        </h2>
        <BotanicalDivider className="my-4" />
        <ul className="space-y-3 text-brand-green/80 leading-relaxed">
          <li>
            Нанесите небольшое количество бальзама на нужную точку, следуя
            рекомендациям производителя и показаниям на этикетке.
          </li>
          <li>
            Массируйте точку круговыми движениями 1–2 минуты до ощущения тепла.
          </li>
          <li>
            При первом применении сделайте тест на переносимость на сгибе локтя.
          </li>
          <li>
            Схема носит ознакомительный характер и не заменяет консультацию
            врача.
          </li>
        </ul>
      </section>

      <div className="mt-12 text-center">
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors"
        >
          Выбрать бальзам в каталоге
        </Link>
      </div>
    </div>
  );
}
