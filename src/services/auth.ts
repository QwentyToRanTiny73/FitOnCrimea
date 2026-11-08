import { readJSON, removeKey, writeJSON } from "./storage";

/** Покупатель. Администратор входит отдельно (services/admin-vault.ts). */
export type UserRole = "user";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Контракт сервиса авторизации. Чтобы подключить Supabase / Auth.js /
 * Яндекс ID, достаточно написать новую реализацию и выбрать её в services/index.ts.
 */
export interface AuthService {
  readonly mode: "local-demo" | "remote";
  currentUser(): Promise<User | null>;
  register(input: { email: string; password: string; name: string }): Promise<User>;
  /** identifier — email или логин (имя). */
  login(input: { identifier: string; password: string }): Promise<User>;
  logout(): Promise<void>;
}

interface StoredUser extends User {
  passwordHash: string;
}

const SESSION_KEY = "session";
const USERS_KEY = "users";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers(): Record<string, StoredUser> {
  return readJSON<Record<string, StoredUser>>(USERS_KEY, {});
}

function toPublic({ passwordHash: _hash, ...user }: StoredUser): User {
  void _hash;
  // Прежние версии давали роль admin первому зарегистрированному — теперь все аккаунты покупательские.
  return { ...user, role: "user" };
}

function persistSession(user: User | null) {
  if (user) writeJSON(SESSION_KEY, user);
  else removeKey(SESSION_KEY);
}

/**
 * Демо-реализация: данные живут только в браузере посетителя.
 * Для настоящих аккаунтов нужен сервер (Supabase, Яндекс ID и т. п.).
 */
export const localAuthService: AuthService = {
  mode: "local-demo",

  async currentUser() {
    const session = readJSON<User | null>(SESSION_KEY, null);
    if (!session) return null;
    const stored = loadUsers()[session.email];
    return stored ? toPublic(stored) : null;
  },

  async register({ email, password, name }) {
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error("Укажите корректный email.");
    if (password.length < 8) throw new Error("Пароль должен быть не короче 8 символов.");
    const users = loadUsers();
    if (users[normalized]) throw new Error("Пользователь с таким email уже зарегистрирован.");
    const stored: StoredUser = {
      email: normalized,
      name: name.trim() || normalized.split("@")[0],
      role: "user",
      createdAt: new Date().toISOString(),
      passwordHash: await sha256(password),
    };
    users[normalized] = stored;
    const res = writeJSON(USERS_KEY, users);
    if (!res.ok) throw new Error("Браузер запрещает сохранять данные (приватный режим?).");
    const user = toPublic(stored);
    persistSession(user);
    return user;
  },

  async login({ identifier, password }) {
    const id = identifier.trim().toLowerCase();
    const users = loadUsers();
    const stored = users[id] ?? Object.values(users).find((u) => u.name.toLowerCase() === id);
    if (!stored) throw new Error("Пользователь не найден.");
    if ((await sha256(password)) !== stored.passwordHash) throw new Error("Неверный пароль.");
    const user = toPublic(stored);
    persistSession(user);
    return user;
  },

  async logout() {
    persistSession(null);
  },
};
