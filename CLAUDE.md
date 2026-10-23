# Фитон Крым — памятка для Claude

## Деплой: GitHub Pages, только статика
- `next.config.mjs`: `output: "export"`, `images.unoptimized`, `basePath` из `NEXT_PUBLIC_BASE_PATH`.
- Нельзя: API routes, middleware, серверные actions, `cookies()/headers()`, динамические
  страницы без `generateStaticParams` (+ `dynamicParams = false`).
- Локальные картинки — только через `assetUrl()` (`src/lib/utils.ts`): next/image с
  `unoptimized` не добавляет basePath сам.
- Один workflow: `.github/workflows/nextjs.yml`. Второй не добавлять — будут двойные деплои.

## Перед коммитом
`NEXT_PUBLIC_BASE_PATH=/FitOnCrimea npm run check` — lint, типы, сборка, проверка out/.

## Оформление (по брошюре)
- Токены цветов в `tailwind.config.ts`, классы `.paper-page`, `.cover-paper`, `.stamp`, `.title-crimson`
  в `globals.css`, орнаменты в `components/ui/Brochure.tsx`. Новые цвета не хардкодить в компонентах.

## Админка
- Вход и публикация — ключ GitHub (`services/admin-session.ts`, `services/github.ts`, `services/publisher.ts`).
- Опубликованные правки — `src/data/catalog/overrides.json`; данные проходят `sanitize.ts`, поэтому
  кривой JSON не ломает сборку. Не коммитить туда тестовые данные.

## Код
- Категории, цвета, подписи — только в `src/config/categories.ts`; контакты и меню — `src/config/site.ts`.
- Внешние сервисы — через интерфейсы в `src/services/`, выбор реализации в `services/index.ts`.
- localStorage — только через `services/storage.ts` (там try/catch).

## Контент
- Язык сайта русский. Никаких имён владельцев/сотрудников.
- Не выдумывать факты (сроки годности, «без парабенов» и т. п.). Источник — брошюра бренда
  и данные владельца. Непроверенное помечать комментарием в данных.
- Пароли и хэши не коммитить: seed-админ задаётся секретами репозитория.
