import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Политика конфиденциальности",
  description: `Какие данные обрабатывает сайт «${site.name}» и как с ними обращаются.`,
  path: "/privacy/",
});

// Перед запуском текст проверяет юрист. Реквизиты оператора — site.legal.operator.
const op = site.legal.operator;
const contactEmail = op.email || site.contacts.email;
const operatorLine = [
  op.name,
  op.inn && `ИНН ${op.inn}`,
  op.ogrn && `ОГРН ${op.ogrn}`,
  op.address,
]
  .filter(Boolean)
  .join(", ");

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "1. Общие положения",
    body: [
      `Политика описывает, какие данные посетителей обрабатываются на сайте «${site.name}», и подготовлена с учётом Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».`,
      operatorLine ? `Оператор: ${operatorLine}.` : "",
    ].filter(Boolean),
  },
  {
    title: "2. Какие данные обрабатываются",
    body: [
      "На сайте нет регистрации, форм заказа и других форм, в которые нужно вводить имя, телефон или адрес электронной почты.",
      "Список избранных товаров хранится только в браузере на устройстве посетителя (localStorage) и не передаётся на сервер.",
      "Хостинг-провайдер сайта может автоматически фиксировать технические данные запросов: IP-адрес, тип браузера, время обращения. Они нужны для работы и защиты сайта.",
      "Счётчики посещаемости и рекламные cookie на сайте сейчас не используются. Если они появятся, политика будет обновлена.",
    ],
  },
  {
    title: "3. Обращения",
    body: [
      `Если вы пишете на ${site.contacts.email} или звоните по телефону ${site.contacts.phone}, ваши контактные данные и текст обращения используются только для ответа и выполнения вашей просьбы, например оптового заказа.`,
    ],
  },
  {
    title: "4. Покупки",
    body: [
      `Товары продаются на маркетплейсе ${site.marketplace.name}. Заказ, оплату и доставку обрабатывает маркетплейс по своим правилам; сайт не получает платёжных данных и данных о заказах.`,
    ],
  },
  {
    title: "5. Права посетителя",
    body: [
      `Вы вправе узнать, какие ваши данные обрабатываются, потребовать их уточнения, блокирования или удаления. Обращения направляйте на ${contactEmail}.`,
    ],
  },
  {
    title: "6. Изменения",
    body: ["Действующая редакция политики всегда опубликована на этой странице."],
  },
];

export default function PrivacyPage() {
  const revision = new Date(site.legal.privacyRevision).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14" data-legal={op.name ? "ok" : "missing"}>
      <SectionHeading as="h1" eyebrow="Документ" title="Политика конфиденциальности" lead={`Редакция от ${revision}`} />
      <div className="space-y-8 rounded-2xl border border-brand-amber/50 bg-brand-cream p-6 sm:p-10">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-serif text-xl text-brand-green">{s.title}</h2>
            <div className="mt-2 space-y-2 leading-relaxed text-brand-green/85">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
