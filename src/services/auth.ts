import { readJSON, removeKey, writeJSON } from "./storage";

export type UserRole = "admin" | "user";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  /** Как выполнен вход: аккаунт сайта или ключ GitHub (администратор). */
  via?: "local" | "github";
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

const seed = {
  login: process.env.NEXT_PUBLIC_ADMIN_LOGIN?.trim(),
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase(),
  hash: process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH?.trim().toLowerCase(),
};
const seedConfigured = Boolean(seed.hash && (seed.login || seed.email));

function loadUsers(): Record<string, StoredUser> {
  const users = readJSON<Record<string, StoredUser>>(USERS_KEY, {});
  if (seedConfigured) {
    const email = seed.email || `${seed.login!.toLowerCase()}@admin.local`;
    // Seed-админ всегда соответствует текущим переменным сборки.
    users[email] = {
      email,
      name: seed.login || email.split("@")[0],
      role: "admin",
      createdAt: users[email]?.createdAt ?? new Date().toISOString(),
      passwordHash: seed.hash!,
    };
  }
  return users;
}

function toPublic({ passwordHash: _hash, ...user }: StoredUser): User {
  void _hash;
  return user;
}

function persistSession(user: User | null) {
  if (user) writeJSON(SESSION_KEY, user);
  else removeKey(SESSION_KEY);
}

/**
 * Демо-реализация: данные живут только в браузере посетителя.
 * Роль admin получает только seed-аккаунт из переменных сборки.
 * Без них (локальная разработка) админом становится первый зарегистрированный.
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
    if (seed.login && name.trim().toLowerCase() === seed.login.toLowerCase()) {
      throw new Error("Это имя зарезервировано. Выберите другое.");
    }
    const devFirstAdmin =
      !seedConfigured &&
      process.env.NODE_ENV !== "production" &&
      !Object.values(users).some((u) => u.role === "admin");
    const stored: StoredUser = {
      email: normalized,
      name: name.trim() || normalized.split("@")[0],
      role: devFirstAdmin ? "admin" : "user",
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
    const byName = Object.values(users)
      .filter((u) => u.name.toLowerCase() === id)
      .sort((a, b) => (a.role === "admin" ? -1 : 0) - (b.role === "admin" ? -1 : 0));
    const stored = users[id] ?? byName[0];
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
