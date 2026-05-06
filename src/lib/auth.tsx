"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "phyton-crimea:user";
const DB_KEY = "phyton-crimea:users";

export type UserRole = "admin" | "user";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  register: (input: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  promoteSelfToAdmin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function hash(password: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return password;
  }
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readDb(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {};
  } catch {
    return {};
  }
}

function writeDb(db: Record<string, StoredUser>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function hasAdmin(db: Record<string, StoredUser>): boolean {
  return Object.values(db).some((u) => u.role === "admin");
}

function seedAdminFromEnv(db: Record<string, StoredUser>): {
  changed: boolean;
  db: Record<string, StoredUser>;
} {
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH?.trim();
  const name = process.env.NEXT_PUBLIC_ADMIN_NAME?.trim() || "admin";
  if (!email || !passwordHash) return { changed: false, db };
  if (db[email]) return { changed: false, db };
  return {
    changed: true,
    db: {
      ...db,
      [email]: {
        email,
        name,
        role: "admin",
        createdAt: new Date().toISOString(),
        passwordHash,
      },
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const db = readDb();
      const { changed, db: nextDb } = seedAdminFromEnv(db);
      if (changed) writeDb(nextDb);
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const register = useCallback<AuthContextValue["register"]>(
    async ({ email, password, name }) => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password || password.length < 6) {
        throw new Error("Введите email и пароль не короче 6 символов.");
      }
      const db = readDb();
      if (db[normalized]) {
        throw new Error("Пользователь с таким email уже зарегистрирован.");
      }
      const passwordHash = await hash(password);
      const role: UserRole = hasAdmin(db) ? "user" : "admin";
      const stored: StoredUser = {
        email: normalized,
        name: name.trim() || normalized.split("@")[0],
        role,
        createdAt: new Date().toISOString(),
        passwordHash,
      };
      db[normalized] = stored;
      writeDb(db);
      const { passwordHash: _omit, ...publicUser } = stored;
      void _omit;
      persist(publicUser);
    },
    [persist]
  );

  const login = useCallback<AuthContextValue["login"]>(
    async ({ email, password }) => {
      const normalized = email.trim().toLowerCase();
      const db = readDb();
      const stored = db[normalized];
      if (!stored) throw new Error("Пользователь не найден. Зарегистрируйтесь.");
      const passwordHash = await hash(password);
      if (passwordHash !== stored.passwordHash) {
        throw new Error("Неверный пароль.");
      }
      const { passwordHash: _omit, ...publicUser } = stored;
      void _omit;
      persist(publicUser);
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const promoteSelfToAdmin = useCallback(() => {
    if (!user) return;
    const db = readDb();
    if (hasAdmin(db) && db[user.email]?.role !== "admin") {
      throw new Error(
        "Администратор уже назначен. Промоут возможен только если в системе нет ни одного админа."
      );
    }
    const stored = db[user.email];
    if (!stored) throw new Error("Запись пользователя не найдена.");
    stored.role = "admin";
    db[user.email] = stored;
    writeDb(db);
    persist({ ...user, role: "admin" });
  }, [user, persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      register,
      login,
      logout,
      promoteSelfToAdmin,
    }),
    [user, loading, register, login, logout, promoteSelfToAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
