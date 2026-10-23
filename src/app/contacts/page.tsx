import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Как связаться с командой «Фитон Крым» и где купить бальзамы и мыло бренда.",
};

export default function ContactsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      <header className="mb-12 text-center">
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-3">
          Контакты
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-green">
          Связаться с нами
        </h1>
        <p className="mt-5 text-brand-green/75">
          Мы отвечаем на запросы о продукции, оптовых заказах и сотрудничестве.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white/60 border border-brand-green/10">
          <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
            Где купить
          </p>
          <p className="text-brand-green font-serif text-xl">Ozon</p>
          <p className="mt-2 text-brand-green/75 text-sm leading-relaxed">
            Официальный магазин бренда на маркетплейсе Ozon. Ссылки на товары
            появятся после публикации карточек.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/60 border border-brand-green/10">
          <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
            Регион
          </p>
          <p className="text-brand-green font-serif text-xl">
            Республика Крым, Ялта
          </p>
          <p className="mt-2 text-brand-green/75 text-sm leading-relaxed">
            Производство и лаборатория расположены на южном берегу Крыма.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white/60 border border-brand-green/10 sm:col-span-2">
          <p className="uppercase tracking-widest text-xs text-brand-gold mb-2">
            Email
          </p>
          <p className="text-brand-green font-serif text-xl">
            info@phyton-crimea.ru
          </p>
          <p className="mt-2 text-brand-green/75 text-sm leading-relaxed">
            Пишите по вопросам ассортимента, оптовых заказов и сотрудничества с
            магазинами.
          </p>
        </div>
      </div>
    </div>
  );
}
