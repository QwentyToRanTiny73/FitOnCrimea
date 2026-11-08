import { site } from "@/config/site";
import { verifyAccess } from "./github";
import { readJSON, removeKey, writeJSON } from "./storage";

/**
 * Вход администратора по логину и паролю.
 *
 * Сайт статический: сервера, который сверил бы пароль, нет. Поэтому пароль
 * здесь не сравнивается с хэшем в коде страницы (такой хэш виден всем и
 * подбирается), а открывает «сейф» — зашифрованный ключ GitHub. Именно ключ
 * даёт право публиковать изменения; без него вход в кабинет ничего не меняет
 * на сайте.
 *
 * Шифрование: PBKDF2-SHA-256 (600 000 итераций) → AES-GCM 256. Логин входит
 * в шифр как дополнительные данные, поэтому неверный логин или пароль
 * одинаково не открывают сейф. Сейф лежит только в этом браузере, в
 * репозиторий и на сайт не попадает. На другое устройство его переносят
 * файлом (exportVault / importVault) или настраивают вход заново.
 */

export interface AdminVault {
  v: 1;
  login: string;
  /** Аккаунт GitHub, которому принадлежит ключ. */
  ghLogin: string;
  salt: string;
  iter: number;
  iv: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  login: string;
  ghLogin: string;
  token: string;
  /** Абсолютный срок для «оставаться в системе». */
  expiresAt: number;
  remember: boolean;
}

export type VaultInfo = Pick<AdminVault, "login" | "ghLogin" | "createdAt" | "updatedAt">;

const VAULT_KEY = "admin-vault";
const SESSION_KEY = "admin-session";
const ATTEMPTS_KEY = "admin-attempts";
const ACTIVITY_KEY = "admin-activity";

const ITERATIONS = 600_000;
/** Без «оставаться в системе» сессия заканчивается после бездействия. */
export const IDLE_MINUTES = 30;
export const REMEMBER_DAYS = 7;
export const MIN_PASSWORD = 10;
const FREE_ATTEMPTS = 5;

export const LOGIN_RE = /^[\p{L}\p{N}._@-]{3,40}$/u;

const enc = (s: string) => new TextEncoder().encode(s);
const toB64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const normLogin = (login: string) => login.trim().normalize("NFC").toLowerCase();

async function deriveKey(password: string, salt: BufferSource, iter: number): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", enc(password.normalize("NFC")), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function seal(token: string, login: string, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ITERATIONS);
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: enc(normLogin(login)) },
    key,
    enc(JSON.stringify({ token }))
  );
  return { salt: toB64(salt), iter: ITERATIONS, iv: toB64(iv), data: toB64(data) };
}

async function open(vault: AdminVault, login: string, password: string): Promise<string | null> {
  try {
    const key = await deriveKey(password, fromB64(vault.salt), vault.iter);
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64(vault.iv), additionalData: enc(normLogin(login)) },
      key,
      fromB64(vault.data)
    );
    const { token } = JSON.parse(new TextDecoder().decode(plain)) as { token?: unknown };
    return typeof token === "string" ? token : null;
  } catch {
    return null;
  }
}

function isVault(v: unknown): v is AdminVault {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    o.v === 1 &&
    ["login", "ghLogin", "salt", "iv", "data", "createdAt", "updatedAt"].every((k) => typeof o[k] === "string") &&
    typeof o.iter === "number" &&
    o.iter >= 100_000 &&
    o.iter <= 10_000_000
  );
}

function loadVault(): AdminVault | null {
  const v = readJSON<unknown>(VAULT_KEY, null);
  return isVault(v) ? v : null;
}

function saveVault(v: AdminVault) {
  const res = writeJSON(VAULT_KEY, v);
  if (!res.ok) throw new Error("Браузер запрещает сохранять данные (приватный режим?). Вход на этом устройстве не настроить.");
}

export const vaultInfo = (): VaultInfo | null => {
  const v = loadVault();
  return v && { login: v.login, ghLogin: v.ghLogin, createdAt: v.createdAt, updatedAt: v.updatedAt };
};

/* ── Проверки ввода ─────────────────────────────────────────── */

export function checkLogin(login: string): string | null {
  return LOGIN_RE.test(login.trim()) ? null : "Логин: от 3 до 40 букв или цифр, можно точку, дефис, @ и _. Без пробелов.";
}

export function checkPassword(password: string, login: string): string | null {
  if (password.length < MIN_PASSWORD) return `Пароль должен быть не короче ${MIN_PASSWORD} символов.`;
  if (password.trim().toLowerCase() === login.trim().toLowerCase()) return "Пароль не должен совпадать с логином.";
  if (/^(.)\1+$/.test(password) || /^(0123456789|1234567890|qwertyuiop|йцукенгшщз)/i.test(password)) {
    return "Пароль слишком простой.";
  }
  return null;
}

/** Грубая оценка для подсказки под полем: 0 — слабый … 3 — надёжный. */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length < MIN_PASSWORD) return 0;
  const kinds = [/[a-zа-яё]/, /[A-ZА-ЯЁ]/, /\d/, /[^\p{L}\p{N}]/u].filter((re) => re.test(password)).length;
  if (password.length >= 16 && kinds >= 3) return 3;
  if (password.length >= 12 && kinds >= 2) return 2;
  return 1;
}

function checkToken(token: string): string {
  const clean = token.trim();
  if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(clean)) {
    throw new Error("Это не похоже на ключ GitHub: он начинается с github_pat_ или ghp_.");
  }
  return clean;
}

/* ── Ограничение попыток ─────────────────────────────────────── */

interface Attempts {
  count: number;
  until: number;
}

export function lockedForSeconds(): number {
  const a = readJSON<Attempts>(ATTEMPTS_KEY, { count: 0, until: 0 });
  return Math.max(0, Math.ceil((a.until - Date.now()) / 1000));
}

function registerFailure() {
  const a = readJSON<Attempts>(ATTEMPTS_KEY, { count: 0, until: 0 });
  const count = a.count + 1;
  const extra = count - FREE_ATTEMPTS;
  // После 5 неудач: 30 с, 1 мин, 2 мин… но не больше 15 минут.
  const wait = extra >= 0 ? Math.min(15 * 60, 30 * 2 ** extra) * 1000 : 0;
  writeJSON(ATTEMPTS_KEY, { count, until: Date.now() + wait });
}

/* ── Сессия ──────────────────────────────────────────────────── */

function startSession(s: Omit<AdminSession, "expiresAt">): AdminSession {
  const session: AdminSession = {
    ...s,
    expiresAt: s.remember ? Date.now() + REMEMBER_DAYS * 86_400_000 : Number.MAX_SAFE_INTEGER,
  };
  endSession();
  writeJSON(SESSION_KEY, session, s.remember ? "local" : "session");
  touchSession();
  return session;
}

/** Перезапись сессии после смены логина или ключа — срок и вид хранения сохраняются. */
export function persistSession(s: AdminSession) {
  writeJSON(SESSION_KEY, s, s.remember ? "local" : "session");
  touchSession();
}

/** Текущая сессия или null, если её нет, истёк срок или было долгое бездействие. */
export function loadSession(): { session: AdminSession | null; expired: boolean } {
  const s =
    readJSON<AdminSession | null>(SESSION_KEY, null, "session") ?? readJSON<AdminSession | null>(SESSION_KEY, null, "local");
  if (!s || typeof s.token !== "string") return { session: null, expired: false };
  const last = readJSON<number>(ACTIVITY_KEY, 0, s.remember ? "local" : "session");
  const idle = !s.remember && Date.now() - last > IDLE_MINUTES * 60_000;
  if (Date.now() > s.expiresAt || idle) {
    endSession();
    return { session: null, expired: true };
  }
  return { session: s, expired: false };
}

/** Отметка активности — продлевает сессию без «оставаться в системе». */
export function touchSession() {
  const s =
    readJSON<AdminSession | null>(SESSION_KEY, null, "session") ?? readJSON<AdminSession | null>(SESSION_KEY, null, "local");
  if (s) writeJSON(ACTIVITY_KEY, Date.now(), s.remember ? "local" : "session");
}

export function endSession() {
  for (const kind of ["session", "local"] as const) {
    removeKey(SESSION_KEY, kind);
    removeKey(ACTIVITY_KEY, kind);
  }
}

/* ── Действия ────────────────────────────────────────────────── */

/** Первая настройка входа на этом устройстве: логин, пароль и ключ GitHub. */
export async function setupVault(input: {
  login: string;
  password: string;
  token: string;
  remember: boolean;
}): Promise<AdminSession> {
  const login = input.login.trim();
  const problem = checkLogin(login) ?? checkPassword(input.password, login);
  if (problem) throw new Error(problem);
  const token = checkToken(input.token);
  const { login: ghLogin } = await verifyAccess(token, site.repo);
  const now = new Date().toISOString();
  saveVault({ v: 1, login, ghLogin, ...(await seal(token, login, input.password)), createdAt: now, updatedAt: now });
  removeKey(ATTEMPTS_KEY);
  return startSession({ login, ghLogin, token, remember: input.remember });
}

export async function signIn(input: { login: string; password: string; remember: boolean }): Promise<AdminSession> {
  const vault = loadVault();
  if (!vault) throw new Error("На этом устройстве вход ещё не настроен.");
  const wait = lockedForSeconds();
  if (wait > 0) throw new Error(`Слишком много неудачных попыток. Повторите через ${formatWait(wait)}.`);
  const token = await open(vault, input.login, input.password);
  if (!token) {
    registerFailure();
    const next = lockedForSeconds();
    throw new Error(next > 0 ? `Неверный логин или пароль. Вход заблокирован на ${formatWait(next)}.` : "Неверный логин или пароль.");
  }
  removeKey(ATTEMPTS_KEY);
  return startSession({ login: vault.login, ghLogin: vault.ghLogin, token, remember: input.remember });
}

/** Смена логина и (или) пароля. Нужен текущий пароль. */
export async function changeCredentials(input: {
  currentPassword: string;
  login: string;
  password: string;
}): Promise<VaultInfo> {
  const vault = loadVault();
  if (!vault) throw new Error("Вход на этом устройстве не настроен.");
  const token = await open(vault, vault.login, input.currentPassword);
  if (!token) throw new Error("Текущий пароль неверный.");
  const login = input.login.trim();
  const problem = checkLogin(login) ?? checkPassword(input.password, login);
  if (problem) throw new Error(problem);
  const next: AdminVault = { ...vault, login, ...(await seal(token, login, input.password)), updatedAt: new Date().toISOString() };
  saveVault(next);
  return vaultInfo()!;
}

/** Замена ключа GitHub (например, когда истёк срок). Нужен пароль. */
export async function replaceToken(input: { password: string; token: string }): Promise<{ token: string; ghLogin: string }> {
  const vault = loadVault();
  if (!vault) throw new Error("Вход на этом устройстве не настроен.");
  if (!(await open(vault, vault.login, input.password))) throw new Error("Пароль неверный.");
  const token = checkToken(input.token);
  const { login: ghLogin } = await verifyAccess(token, site.repo);
  saveVault({ ...vault, ghLogin, ...(await seal(token, vault.login, input.password)), updatedAt: new Date().toISOString() });
  return { token, ghLogin };
}

/** Файл для переноса входа на другое устройство. Внутри только зашифрованный ключ. */
export function exportVault(): string {
  const vault = loadVault();
  if (!vault) throw new Error("Вход на этом устройстве не настроен.");
  return JSON.stringify(vault, null, 2);
}

export function importVault(text: string): VaultInfo {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Это не файл входа администратора.");
  }
  if (!isVault(parsed)) throw new Error("Это не файл входа администратора.");
  saveVault(parsed);
  removeKey(ATTEMPTS_KEY);
  return vaultInfo()!;
}

/** «Забыли пароль»: удалить вход на этом устройстве. Ключ GitHub при этом не отзывается. */
export function forgetDevice() {
  endSession();
  removeKey(VAULT_KEY);
  removeKey(ATTEMPTS_KEY);
}

export function formatWait(seconds: number): string {
  if (seconds < 60) return `${seconds} с`;
  const m = Math.ceil(seconds / 60);
  return `${m} мин`;
}
