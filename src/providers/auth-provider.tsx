"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/services";
import { endAdminSession, loadAdminSession, startAdminSession } from "@/services/admin-session";
import type { AuthService, User } from "@/services/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  mode: AuthService["mode"];
  /** Ключ GitHub администратора — нужен для публикации. */
  adminToken: string | null;
  register: AuthService["register"];
  login: AuthService["login"];
  loginAdmin: (token: string, remember: boolean) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const githubUser = (login: string): User => ({
  email: `${login.toLowerCase()}@users.github`,
  name: login,
  role: "admin",
  createdAt: new Date().toISOString(),
  via: "github",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = loadAdminSession();
    if (admin) {
      setUser(githubUser(admin.login));
      setAdminToken(admin.token);
      setLoading(false);
      return;
    }
    auth
      .currentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback<AuthService["register"]>(async (input) => {
    const u = await auth.register(input);
    setUser(u);
    return u;
  }, []);

  const login = useCallback<AuthService["login"]>(async (input) => {
    const u = await auth.login(input);
    setUser(u);
    return u;
  }, []);

  const loginAdmin = useCallback(async (token: string, remember: boolean) => {
    const session = await startAdminSession(token, remember);
    await auth.logout();
    const u = githubUser(session.login);
    setUser(u);
    setAdminToken(session.token);
    return u;
  }, []);

  const logout = useCallback(async () => {
    endAdminSession();
    await auth.logout();
    setAdminToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      mode: auth.mode,
      adminToken,
      register,
      login,
      loginAdmin,
      logout,
    }),
    [user, loading, adminToken, register, login, loginAdmin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
