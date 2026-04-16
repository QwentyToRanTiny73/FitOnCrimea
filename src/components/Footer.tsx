import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brand-green/10 bg-brand-green text-brand-beige mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">
            Фитон <span className="text-brand-gold">Крым</span>
          </p>
          <p className="mt-3 text-sm text-brand-beige/80 leading-relaxed">
            Авторская натуральная косметика на крымских травах. С 2009 года.
          </p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-gold mb-3">
            Навигация
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-brand-gold transition-colors">
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className="hover:text-brand-gold transition-colors"
              >
                Каталог
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-brand-gold transition-colors"
              >
                О бренде
              </Link>
            </li>
            <li>
              <Link
                href="/contacts"
                className="hover:text-brand-gold transition-colors"
              >
                Контакты
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-gold mb-3">
            Где купить
          </p>
          <p className="text-sm text-brand-beige/80 leading-relaxed">
            Товары бренда продаются на маркетплейсе Ozon.
            <br />
            Ссылки на товары появятся после публикации карточек.
          </p>
        </div>
      </div>
      <div className="border-t border-brand-beige/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-brand-beige/60 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Фитон Крым (ТМ)</span>
          <span>Сделано с заботой в Крыму</span>
        </div>
      </div>
    </footer>
  );
}
