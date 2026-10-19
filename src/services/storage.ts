/**
 * Безопасная обёртка над localStorage. В приватном режиме, при запрете
 * cookies или переполнении хранилище бросает исключения — здесь они гасятся,
 * а запись возвращает признак успеха.
 */

const PREFIX = "phyton-crimea:";

function store(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = store()?.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export type WriteResult = { ok: true } | { ok: false; reason: "unavailable" | "quota" };

export function writeJSON(key: string, value: unknown): WriteResult {
  const s = store();
  if (!s) return { ok: false, reason: "unavailable" };
  try {
    s.setItem(PREFIX + key, JSON.stringify(value));
    return { ok: true };
  } catch (err) {
    const quota =
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return { ok: false, reason: quota ? "quota" : "unavailable" };
  }
}

export function removeKey(key: string): void {
  try {
    store()?.removeItem(PREFIX + key);
  } catch {
    // нечего делать
  }
}
