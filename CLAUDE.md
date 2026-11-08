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

## Админка (`/admin`)
- Вход — логин и пароль, которые владелец задаёт сам при первом входе. Пароль шифрует ключ GitHub
  в браузере (`services/admin-vault.ts`, PBKDF2 + AES-GCM). Хэш пароля в код не класть — он виден всем.
- Публикация — `services/github.ts`, `services/publisher.ts`, один коммит: товары → `src/data/catalog/overrides.json`
  и `public/products/`, оформление → `src/data/design/overrides.json` и `public/design/`.
- Оформление: места для картинок — `src/data/design/slots.ts`. На страницах такие картинки выводить только
  через `SlotImage` / `SlotStamp` / `HomeBanners` (`components/design/`), иначе замена из кабинета не сработает.
- Данные проходят `sanitize.ts`, кривой JSON не ломает сборку. Не коммитить туда тестовые данные.
- Ссылок на кабинет на витрине нет (видна только вошедшему администратору).

## Код
- Категории, цвета, подписи — только в `src/config/categories.ts`; контакты и меню — `src/config/site.ts`.
- Внешние сервисы — через интерфейсы в `src/services/`, выбор реализации в `services/index.ts`.
- localStorage — только через `services/storage.ts` (там try/catch).

## Контент
- Язык сайта русский. Никаких имён владельцев/сотрудников.
- Не выдумывать факты (сроки годности, «без парабенов» и т. п.). Источник — брошюра бренда
  и данные владельца. Непроверенное помечать комментарием в данных.
- Пароли, хэши и ключи не коммитить. Вход администратора настраивается в `/admin`, не в секретах.
