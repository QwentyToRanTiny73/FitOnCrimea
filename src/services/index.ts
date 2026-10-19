/**
 * Точка подключения внешних сервисов. Каждый сервис описан контрактом
 * (интерфейсом); здесь выбирается конкретная реализация.
 *
 *   auth      — регистрация и вход           (сейчас: localStorage, демо)
 *   catalog   — правки карточек из админки   (сейчас: localStorage, демо)
 *   favorites — избранное посетителя         (localStorage — подходит и для продакшена)
 *
 * Пример замены: `export const auth = supabaseAuthService;`
 */
import { localAuthService } from "./auth";
import { localCatalogStore } from "./catalog-store";
import { readJSON, writeJSON } from "./storage";

export const auth = localAuthService;
export const catalogStore = localCatalogStore;

export const favoritesStore = {
  load: () => readJSON<string[]>("favorites", []),
  save: (slugs: string[]) => writeJSON("favorites", slugs),
};
