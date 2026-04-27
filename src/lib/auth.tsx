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

export interface User {
  email: string;
  name: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  register: (input: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      // ignore corrupted state
    }
    setLoading(false);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (typeof window === "undefined") return;
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
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
      const stored: StoredUser = {
        email: normalized,
        name: name.trim() || normalized.split("@")[0],
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
      if (!stored) {
        throw new Error("Пользователь не найден. Зарегистрируйтесь.");
      }
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

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, register, login, logout }),
    [user, loading, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
