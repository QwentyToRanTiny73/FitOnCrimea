import Link from "next/link";
import { SLOGAN } from "@/config/brochure";
import { FOOTER_NAV, site } from "@/config/site";
import { Emblem, Meadow } from "@/components/ui/Brochure";

export function Footer() {
  const { contacts, marketplace } = site;
  return (
    <footer className="relative mt-20 bg-brand-green text-brand-beige">
      {/* золотые травы над подвалом, как внизу страниц брошюры */}
      <Meadow className="absolute inset-x-0 -top-16 h-16 w-full sm:-top-24 sm:h-24" tone="text-brand-amber/70" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Emblem className="h-12 w-12" />
            <p className="font-display text-2xl uppercase text-brand-amber">Фитон Крым</p>
          </div>
          <p className="mt-3 font-serif text-lg italic text-brand-beige/85">{SLOGAN}</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-beige/70">
            {site.title}. С {site.since} года.
          </p>
        </div>

        <nav aria-label="Разделы сайта">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand-amber">Разделы</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-brand-amber">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand-amber">Связь</p>
          <ul className="space-y-2 text-brand-beige/85">
            <li>
              <a href={contacts.phoneHref} className="hover:text-brand-amber">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contacts.email}`} className="hover:text-brand-amber">
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
      <div className="border-t border-brand-amber/20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-4 text-xs text-brand-beige/60 sm:flex-row sm:px-6">
          <span>
            © {site.since}–{new Date().getFullYear()} ТМ «{site.name}»
          </span>
          <span className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-amber">
              Политика конфиденциальности
            </Link>
            <Link href="/admin" className="hover:text-brand-amber">
              Администратору
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
