/**
 * Настройки сайта. Всё, что меняется при переезде на свой домен или
 * подключении сервисов, — здесь и в переменных окружения сборки.
 */
export const site = {
  name: "Фитон Крым",
  title: "Магазин натуральной крымской косметики",
  description:
    "Бальзамы на крымских травах, мыло ручной работы и бальзамы для губ. Натуральные эфирные масла и растительные экстракты. С 2009 года.",
  since: 2009,
  /** Абсолютный адрес сайта: GitHub Pages подставляет его при сборке. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://phyton-crimea.ru").replace(/\/$/, ""),
  /** Префикс путей: "/FitOnCrimea" на github.io, "" на собственном домене. */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  /** Контакты из брошюры бренда. Удалите поле — блок пропадёт с сайта. */
  contacts: {
    email: "crimean.soap@gmail.com",
    emailNote: "Оптовые поставки",
    phone: "+7 (978) 107-73-09",
    phoneHref: "tel:+79781077309",
    region: "Республика Крым",
  },
  marketplace: {
    name: "Ozon",
    /** Ссылка на магазин бренда на Ozon — заполнить после публикации. */
    storeUrl: "",
  },
  legal: {
    /** Дата редакции политики конфиденциальности (ГГГГ-ММ-ДД). */
    privacyRevision: "2026-10-19",
  },
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/catalog", label: "Каталог" },
  { href: "/massage-points", label: "Точки массажа" },
  { href: "/about", label: "О бренде" },
  { href: "/faq", label: "Вопросы" },
  { href: "/contacts", label: "Контакты" },
];

export const FOOTER_NAV: NavItem[] = [
  ...MAIN_NAV,
  { href: "/favorites", label: "Избранное" },
  { href: "/account", label: "Личный кабинет" },
  { href: "/privacy", label: "Политика конфиденциальности" },
];
