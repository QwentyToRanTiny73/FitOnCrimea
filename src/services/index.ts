/**
 * Точка подключения внешних сервисов. Каждый сервис описан контрактом
 * (интерфейсом); здесь выбирается конкретная реализация.
 *
 *   auth        — аккаунты покупателей           (сейчас: localStorage, демо)
 *   catalog     — черновики правок товаров        (браузер администратора)
 *   design      — черновики оформления            (браузер администратора)
 *   favorites   — избранное посетителя            (localStorage — подходит и для продакшена)
 *
 * Вход администратора — services/admin-vault.ts, публикация — services/publisher.ts.
 * Пример замены: `export const auth = supabaseAuthService;`
 */
import { localAuthService } from "./auth";
import { localCatalogStore } from "./catalog-store";
import { localDesignStore } from "./design-store";
import { readJSON, writeJSON } from "./storage";

export const auth = localAuthService;
export const catalogStore = localCatalogStore;
export const designStore = localDesignStore;

export const favoritesStore = {
  load: () => readJSON<string[]>("favorites", []),
  save: (slugs: string[]) => writeJSON("favorites", slugs),
};
