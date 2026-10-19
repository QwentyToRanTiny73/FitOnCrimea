"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/services";
import type { AuthService, User } from "@/services/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  mode: AuthService["mode"];
  register: AuthService["register"];
  login: AuthService["login"];
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      mode: auth.mode,
      register,
      login,
      logout,
    }),
    [user, loading, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
