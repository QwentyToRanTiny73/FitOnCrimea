import type { Metadata } from "next";
import Link from "next/link";
import { MassageExplorer } from "@/components/massage/MassageExplorer";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Точки массажа с крымским бальзамом",
  description:
    "Интерактивная схема 26 акупунктурных точек для массажа с бальзамами «Фитон Крым»: показания, место на теле, методика и подходящие бальзамы.",
};

export default function MassagePointsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow="Схема применения"
        title="Точки массажа с крымским бальзамом"
        lead="Нажмите на номер на схеме или выберите точку в списке: откроются показания, место на теле, методика массажа и бальзамы с такими же показаниями."
      />

      <MassageExplorer />

      <section className="paper-page mt-10 rounded-2xl p-5 text-sm leading-relaxed text-brand-green/85 sm:p-6">
        <h2 className="mb-2 font-serif text-xl font-bold text-brand-green">Важно</h2>
        <p>
          Схема и показания — из брошюры бренда; методика — общие правила точечного массажа. Это не
          замена консультации врача. Перед первым применением бальзама проверьте переносимость на
          небольшом участке кожи.
        </p>
        <Link
          href="/catalog"
          className="mt-4 inline-flex rounded-full bg-brand-green px-7 py-3 font-semibold text-brand-cream shadow-[0_2px_0_#1e3f25] transition-colors hover:bg-brand-forest"
        >
          Выбрать бальзам
        </Link>
      </section>
    </div>
  );
}
