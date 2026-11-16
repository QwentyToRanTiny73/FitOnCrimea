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
  /**
   * Абсолютный адрес сайта (с префиксом пути): сборка на хостинге подставляет его
   * из NEXT_PUBLIC_SITE_URL. Без переменной — локальный адрес; проверка out/ в CI
   * не пропустит такую сборку.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  /** Префикс путей: "/FitOnCrimea" на github.io, "" на собственном домене. */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
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
  /**
   * Репозиторий сайта: сюда админка публикует правки и фото.
   * В сборке на GitHub подставляется автоматически.
   */
  repo: {
    owner: (process.env.NEXT_PUBLIC_GITHUB_REPO ?? "QwentyToRanTiny73/FitOnCrimea").split("/")[0],
    repo: (process.env.NEXT_PUBLIC_GITHUB_REPO ?? "QwentyToRanTiny73/FitOnCrimea").split("/")[1],
    branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
  },
  legal: {
    /** Дата редакции политики конфиденциальности (ГГГГ-ММ-ДД). */
    privacyRevision: "2026-11-15",
    /**
     * Продавец и оператор персональных данных — заполняет владелец.
     * Пустые поля на сайте не показываются; пока не заполнено название,
     * сборка печатает предупреждение. У ИП закон требует ФИО полностью —
     * это исключение из правила «без имён владельцев».
     */
    operator: {
      /** «ООО „…“» или «ИП Фамилия Имя Отчество». */
      name: "",
      inn: "",
      /** ОГРН или ОГРНИП. */
      ogrn: "",
      address: "",
      /** Почта для обращений по персональным данным; пусто — контактная почта. */
      email: "",
    },
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
];
