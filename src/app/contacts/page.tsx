import type { Metadata } from "next";
import { StampImage } from "@/components/ui/Brochure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STAMPS } from "@/config/brochure";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Как связаться с «${site.name}» и где купить продукцию бренда.`,
};

export default function ContactsPage() {
  const { contacts, marketplace } = site;
  const cards = [
    {
      label: "Телефон",
      value: contacts.phone,
      href: contacts.phoneHref,
      note: "Звонки и мессенджеры",
      tone: "border-brand-sea/40",
    },
    {
      label: contacts.emailNote,
      value: contacts.email,
      href: `mailto:${contacts.email}`,
      note: "Опт, сотрудничество с магазинами",
      tone: "border-brand-terracotta/40",
    },
    {
      label: "Где купить",
      value: marketplace.name,
      href: marketplace.storeUrl || undefined,
      note: marketplace.storeUrl
        ? "Магазин бренда на маркетплейсе"
        : "Ссылка на магазин бренда появится после публикации карточек",
      tone: "border-brand-poppy/40",
    },
    {
      label: "Регион",
      value: contacts.region,
      note: "Производство в Крыму",
      tone: "border-brand-forest/40",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading as="h1" eyebrow="Контакты" title="Связаться с нами" />
      <div className="grid items-start gap-8 md:grid-cols-[1fr_auto]">
      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.label} className={`paper-page rounded-xl border-l-4 ${c.tone} p-5`}>
            <p className="mb-1 text-xs uppercase tracking-widest text-brand-gold">{c.label}</p>
            {c.href ? (
              <a href={c.href} className="break-words font-serif text-xl font-bold text-brand-green hover:underline">
                {c.value}
              </a>
            ) : (
              <p className="font-serif text-xl font-bold text-brand-green">{c.value}</p>
            )}
            <p className="mt-1 text-sm text-brand-green/70">{c.note}</p>
          </li>
        ))}
      </ul>
      <StampImage {...STAMPS.car} className="mx-auto w-44 rotate-2 sm:w-52" sizes="220px" />
      </div>
    </div>
  );
}
