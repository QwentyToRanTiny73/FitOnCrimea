import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Как сайт «${site.name}» обрабатывает персональные данные посетителей.`,
};

// Шаблон. Перед публичным запуском текст должен проверить юрист,
// а оператор персональных данных — быть указан с реквизитами.
const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "1. Общие положения",
    body: [
      `Политика описывает обработку персональных данных посетителей сайта «${site.name}» и подготовлена с учётом Федерального закона № 152-ФЗ «О персональных данных».`,
    ],
  },
  {
    title: "2. Какие данные обрабатываются",
    body: [
      "При регистрации — имя, адрес электронной почты и пароль. Пароль не хранится в открытом виде: сохраняется только его хэш SHA-256.",
      "Избранные товары и данные сессии сохраняются в хранилище браузера (localStorage) на устройстве посетителя.",
      "Хостинг-провайдер сайта может автоматически фиксировать технические данные запросов (IP-адрес, тип браузера, время обращения).",
    ],
  },
  {
    title: "3. Где хранятся данные",
    body: [
      "В текущей версии сайта регистрационные данные и избранное хранятся только в браузере посетителя и не передаются на сервер. Очистка данных браузера удаляет их полностью.",
    ],
  },
  {
    title: "4. Цели обработки",
    body: ["Работа личного кабинета и списка избранного."],
  },
  {
    title: "5. Передача третьим лицам",
    body: [
      `Покупка товаров происходит на маркетплейсе ${site.marketplace.name} по его правилам. Сайт не получает платёжные данные посетителей.`,
    ],
  },
  {
    title: "6. Права посетителя",
    body: [
      `Посетитель вправе запросить сведения о своих данных, их уточнение или удаление, отозвать согласие на обработку. Обращения принимаются по адресу ${site.contacts.email}.`,
    ],
  },
  {
    title: "7. Изменения",
    body: ["Актуальная редакция политики всегда опубликована на этой странице."],
  },
];

export default function PrivacyPage() {
  const revision = new Date(site.legal.privacyRevision).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading as="h1" eyebrow="Документ" title="Политика конфиденциальности" lead={`Редакция от ${revision}`} />
      <div className="space-y-8 rounded-2xl border border-brand-green/10 bg-white/75 p-6 sm:p-10">
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
