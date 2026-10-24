import Link from "next/link";
import { FOOTER_NAV, site } from "@/config/site";

export function Footer() {
  const { contacts, marketplace } = site;
  return (
    <footer className="mt-16 bg-brand-green text-brand-beige">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">
            Фитон <span className="text-brand-gold">Крым</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-brand-beige/80">
            {site.title}. С {site.since} года.
          </p>
        </div>

        <nav aria-label="Разделы сайта">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand-gold">Разделы</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-brand-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand-gold">Связь</p>
          <ul className="space-y-2 text-brand-beige/85">
            <li>
              <a href={contacts.phoneHref} className="hover:text-brand-gold">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contacts.email}`} className="hover:text-brand-gold">
                {contacts.email}
              </a>
              <span className="block text-xs text-brand-beige/60">{contacts.emailNote}</span>
            </li>
            <li className="pt-2 text-brand-beige/70">
              Покупка — на маркетплейсе {marketplace.name}
              {marketplace.storeUrl && (
                <>
                  :{" "}
                  <a href={marketplace.storeUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    магазин бренда
                  </a>
                </>
              )}
              .
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-beige/10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-4 text-xs text-brand-beige/60 sm:flex-row sm:px-6">
          <span>
            © {site.since}–{new Date().getFullYear()} ТМ «{site.name}»
          </span>
          <Link href="/privacy" className="hover:text-brand-gold">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
