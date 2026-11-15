/**
 * Точка подключения внешних сервисов. Каждый сервис описан контрактом
 * (интерфейсом); здесь выбирается конкретная реализация.
 *
 *   catalog     — черновики правок товаров        (браузер администратора)
 *   design      — черновики оформления            (браузер администратора)
 *   favorites   — избранное посетителя            (localStorage — подходит и для продакшена)
 *
 * Вход администратора — services/admin-vault.ts, публикация — services/publisher.ts.
 * Аккаунтов покупателей нет: для них нужен сервер (данные покупателей по 152-ФЗ
 * хранятся в России). Пример подключения: новый сервис с интерфейсом и строка здесь.
 */
import { localCatalogStore } from "./catalog-store";
import { localDesignStore } from "./design-store";
import { readJSON, writeJSON } from "./storage";

export const catalogStore = localCatalogStore;
export const designStore = localDesignStore;

export const favoritesStore = {
  load: () => readJSON<string[]>("favorites", []),
  save: (slugs: string[]) => writeJSON("favorites", slugs),
};
