/**
 * Безопасная обёртка над localStorage и sessionStorage. В приватном режиме,
 * при запрете cookies или переполнении хранилище бросает исключения — здесь
 * они гасятся, а запись возвращает признак успеха.
 *
 * kind: "local" — хранится, пока не очистят браузер;
 *       "session" — до закрытия вкладки (для ключа администратора).
 */

const PREFIX = "phyton-crimea:";

export type StorageKind = "local" | "session";

function store(kind: StorageKind = "local"): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T, kind: StorageKind = "local"): T {
  try {
    const raw = store(kind)?.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export type WriteResult = { ok: true } | { ok: false; reason: "unavailable" | "quota" };

export function writeJSON(key: string, value: unknown, kind: StorageKind = "local"): WriteResult {
  const s = store(kind);
  if (!s) return { ok: false, reason: "unavailable" };
  try {
    s.setItem(PREFIX + key, JSON.stringify(value));
    return { ok: true };
  } catch (err) {
    const quota =
      err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return { ok: false, reason: quota ? "quota" : "unavailable" };
  }
}

export function removeKey(key: string, kind: StorageKind = "local"): void {
  try {
    store(kind)?.removeItem(PREFIX + key);
  } catch {
    // нечего делать
  }
}

/** Примерный объём, занятый данными сайта в localStorage, в килобайтах. */
export function usedKilobytes(): number {
  const s = store("local");
  if (!s) return 0;
  let bytes = 0;
  try {
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k?.startsWith(PREFIX)) bytes += (k.length + (s.getItem(k)?.length ?? 0)) * 2;
    }
  } catch {
    return 0;
  }
  return Math.round(bytes / 1024);
}
