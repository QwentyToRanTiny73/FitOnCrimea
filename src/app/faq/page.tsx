import type { Metadata } from "next";
import Link from "next/link";
import {
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description:
    "Часто задаваемые вопросы о бальзамах «Фитон Крым»: состав, применение, доставка, противопоказания, хранение.",
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Где можно купить продукцию?",
    a: "Основной канал продаж — официальный магазин бренда на маркетплейсе Ozon. Каждая карточка товара на сайте содержит ссылку на Ozon.",
  },
  {
    q: "Натуральны ли бальзамы?",
    a: "Да. В составах используются эфирные масла, экстракты и инфузии растений, пчелиный воск, растительные масла (ши, кокос, жожоба, авокадо, какао и др.). Без парабенов, без минеральных масел и без отдушек.",
  },
  {
    q: "Какой срок и условия хранения?",
    a: "Срок годности — 24 месяца с даты производства, указанной на упаковке. Хранить при комнатной температуре, в сухом месте, вдали от прямых солнечных лучей. После вскрытия использовать в течение 6–12 месяцев.",
  },
  {
    q: "Можно ли применять при беременности и детям?",
    a: "Большинство бальзамов содержат эфирные масла, поэтому беременным и детям до 3 лет — только после консультации с врачом. Для бережного ухода созданы специализированные позиции, например «Для матери и ребёнка» (персик и ваниль).",
  },
  {
    q: "Как сделать тест на переносимость?",
    a: "Нанесите небольшое количество бальзама на сгиб локтя и оцените состояние кожи через 24 часа. При отсутствии покраснения, зуда и отёчности — средство переносимо.",
  },
  {
    q: "Можно ли наносить бальзам на лицо?",
    a: "Только те, что предназначены для лица: «Чистое лицо», «Лимонник и роза», «Белоснежка». Прогревающие, обезболивающие и репеллентные бальзамы — только на тело и точечно, избегая слизистых.",
  },
  {
    q: "Чем отличается «Чабрецовая звёздочка» от «Звезды Крыма»?",
    a: "«Чабрецовая звёздочка» — мягкий бестселлер на чабреце, мяте и мирте для первых симптомов простуды. «Звезда Крыма» — более интенсивный согревающий бальзам с лавром, корицей и гвоздикой, подходит и для головной боли, и для суставов.",
  },
  {
    q: "Есть ли упаковка для подарка?",
    a: "Подарочные наборы оформляются на маркетплейсе Ozon в карточках конкретных товаров. Уточните наличие в момент заказа.",
  },
];

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="text-center mb-10">
        <BotanicalWreath className="mx-auto h-14 text-brand-gold mb-3" />
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-3">
          Q&amp;A
        </p>
        <h1 className="font-serif text-4xl text-brand-green">
          Вопросы и ответы
        </h1>
        <BotanicalDivider className="my-5" />
      </header>

      <div className="space-y-3">
        {FAQ.map(({ q, a }) => (
          <details
            key={q}
            className="group bg-white/70 border border-brand-green/10 rounded-2xl px-5 py-4 open:border-brand-gold/40 transition-colors"
          >
            <summary className="cursor-pointer flex justify-between items-start gap-4 list-none">
              <span className="font-serif text-lg text-brand-green">{q}</span>
              <span className="text-brand-gold text-2xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-brand-green/80 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-brand-green/75">
        Остались вопросы?{" "}
        <Link
          href="/contacts"
          className="text-brand-green border-b border-brand-gold pb-0.5 hover:text-brand-gold"
        >
          Напишите нам
        </Link>
      </p>
    </div>
  );
}
