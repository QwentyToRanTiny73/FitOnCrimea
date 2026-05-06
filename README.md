# Фитон Крым — сайт-витрина

Магазин натуральной крымской косметики (Ялта, с 2009 года). Каталог
бальзамов и мыла ручной работы, переход на Ozon для покупки, точки
акупунктурного массажа, личный кабинет, избранное и кабинет администратора.

## Стек

- Next.js 14 (App Router, статический экспорт)
- TypeScript
- Tailwind CSS
- next/image, next/font (Cormorant Garamond + Inter)
- Размещение: GitHub Pages (или Vercel)

## Локальная разработка

Требуется Node.js 18.17+ (рекомендуется 20 или 22).

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production-сборка в out/
npm run start        # запуск собранного сервера
npm run lint
npm run typecheck
```

## Структура

```
src/
  app/
    page.tsx               главная: иконки категорий, хиты, подборки, CTA
    catalog/               каталог + страницы товаров (SSG)
    massage-points/        схема 26 акупунктурных точек
    favorites/             избранное (localStorage)
    account/               вход, регистрация, кабинет
    admin/                 кабинет администратора (только для роли admin)
    about, faq, contacts/  статические страницы
    privacy/               политика конфиденциальности (152-ФЗ)
    sitemap.ts, robots.ts  SEO
  components/
    Header, Footer, ProductCard, CategoryGrid,
    Botanical              SVG-орнаменты (ветвь, венок, разделитель)
    AdminProductForm       форма редактирования карточки + загрузка фото
    ProductDetailView      просмотр карточки с применением overrides
  data/products.ts         базовый каталог из 24 бальзамов
  lib/
    auth.tsx               AuthProvider (демо на localStorage + SHA-256)
    favorites.tsx          FavoritesProvider
    products-overrides.tsx ProductOverridesProvider — правки админа
    image-upload.ts        ресайз и сжатие фото в data URL
    utils.ts               cn, formatPrice, SITE_URL, withBasePath
public/
  massage-points.jpg       иллюстрация точек массажа
  .nojekyll                отключает Jekyll на GitHub Pages
scripts/
  hash-password.mjs        утилита для seed-админа
```

## Кабинет администратора

`/admin` доступен только пользователю с ролью `admin`. В демо-режиме первый
зарегистрированный пользователь автоматически получает роль admin. Также
можно «зерном» завести аккаунт через переменные окружения сборки —
см. ниже.

В админке:

- Поиск и фильтр по категории / по изменённым.
- Inline-редактор карточки: название, подзаголовок, цена, описание,
  состав, применение, противопоказания, ссылка на Ozon, изображения.
- Загрузка фото: файлы сжимаются в браузере (max 1000 px,
  JPEG q=0.82) и сохраняются как data URL в localStorage.
- Сброс одной карточки или всех правок.
- Импорт / экспорт правок одним JSON-объектом.

**Важно про хранение.** Изменения админа живут в `localStorage` браузера.
Это удобно для черновика и предпросмотра, но не подходит для постоянного
каталога: правки видны только на устройстве админа. Для долгосрочного
хранения скопируйте JSON через «Экспорт» и примените к
`src/data/products.ts`, либо подключите серверный CMS (Decap CMS, Tina,
Strapi, Supabase).

## Seed-админ через переменные окружения

Чтобы пред-создать админа на любом устройстве при первом открытии сайта,
без хранения пароля в репозитории:

```bash
# 1) Получите хэш своего пароля локально:
node scripts/hash-password.mjs "ваш-пароль"
# выведет 64-символьный hex SHA-256

# 2) Добавьте в Settings → Secrets and variables → Actions:
#    Secrets:
#      ADMIN_EMAIL=admin@phyton-crimea.ru
#      ADMIN_PASSWORD_HASH=<хэш из шага 1>
#    Variables:
#      ADMIN_NAME=admin (необязательно)
#      SITE_URL=https://qwentytorantiny73.github.io/FitOnCrimea

# 3) Запустите workflow «Deploy to GitHub Pages» (push в main или вручную).
```

Пароль в виде plain-text **никогда** не попадёт в репозиторий: в исходниках
живёт только хэш. Это всё ещё демо-уровень безопасности (хэш виден в
JS-бандле и поддаётся подбору при слабом пароле), но строго лучше, чем
литеральный пароль в коде.

## Деплой на GitHub Pages

1. Settings → Pages → Source = **GitHub Actions**.
2. Запушьте в `main`. Workflow `.github/workflows/deploy.yml`:
   - устанавливает зависимости, собирает `next build` с
     `output: "export"` и `basePath: /FitOnCrimea`,
   - публикует `out/` через `actions/deploy-pages@v4`.
3. (Опционально) Привязка собственного домена `phyton-crimea.ru`:
   Settings → Pages → Custom domain. Затем у регистратора (RU-CENTER):
   создать `CNAME` → `qwentytorantiny73.github.io` или `A`-записи на
   IP-адреса GitHub Pages. После проверки домена убрать `basePath`
   из next.config.mjs (домен корневой).

## Деплой на Vercel

В качестве альтернативы:

1. Импортировать репозиторий в Vercel.
2. Удалить или закомментировать `output: "export"` и `basePath` в
   `next.config.mjs` — Vercel сам деплоит динамическую сборку.

## SEO

- `src/app/sitemap.ts` → `/sitemap.xml`
- `src/app/robots.ts` → `/robots.txt`
- Open Graph и уникальные `title`/`description` на каждой странице
- Schema.org: `Organization`, `Product` + `BreadcrumbList`, `FAQPage`

## Что сделать дальше

- Заменить плейсхолдеры реальными фото товаров. Через админку (быстро,
  локально) или вручную в `src/data/products.ts` (постоянно). Формат —
  WebP/JPEG, 1000×1000, ≤200 КБ.
- Проставить реальные `ozonUrl`.
- Подключить серверную аутентификацию (Supabase / Auth.js / Yandex ID)
  и удалить демо-провайдер из `src/lib/auth.tsx`.
- Добавить страницы для мыла (30 сортов) и бальзамов для губ.
- Подключить email-рассылку (Unisender, Sendsay) для подписки в подвале.
- Заменить локальное хранилище правок на CMS (Decap CMS работает с
  GitHub-репозиторием через OAuth и не требует своего сервера).
