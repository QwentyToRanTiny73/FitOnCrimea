"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/config/site";
import { GitHubError, verifyAccess } from "@/services/github";
import {
  IDLE_MINUTES,
  changeCredentials,
  endSession,
  forgetDevice,
  importVault,
  loadSession,
  persistSession,
  replaceToken,
  setupVault,
  signIn as vaultSignIn,
  touchSession,
  vaultInfo,
  type AdminSession,
  type VaultInfo,
} from "@/services/admin-vault";

/** Состояние ключа GitHub: можно ли сейчас публиковать. */
export type KeyStatus = "checking" | "ok" | "invalid" | "offline";

interface AdminContextValue {
  /** false до первого рендера в браузере — тогда ещё неизвестно, есть ли вход. */
  ready: boolean;
  /** Настроен ли вход на этом устройстве. */
  vault: VaultInfo | null;
  isAdmin: boolean;
  login: string | null;
  ghLogin: string | null;
  remember: boolean;
  /** Ключ GitHub для публикации — только в памяти и в сессии вкладки. */
  token: string | null;
  keyStatus: KeyStatus;
  keyProblem: string | null;
  /** Сообщение для экрана входа, например о выходе по бездействию. */
  notice: string | null;
  setup: (input: { login: string; password: string; token: string; remember: boolean }) => Promise<void>;
  signIn: (input: { login: string; password: string; remember: boolean }) => Promise<void>;
  signOut: (notice?: string) => void;
  updateCredentials: (input: { currentPassword: string; login: string; password: string }) => Promise<void>;
  replaceKey: (input: { password: string; token: string }) => Promise<void>;
  importFile: (text: string) => void;
  forget: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [vault, setVault] = useState<VaultInfo | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [keyStatus, setKeyStatus] = useState<KeyStatus>("checking");
  const [keyProblem, setKeyProblem] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const lastTouch = useRef(0);

  const checkKey = useCallback(async (token: string) => {
    setKeyStatus("checking");
    setKeyProblem(null);
    try {
      await verifyAccess(token, site.repo);
      setKeyStatus("ok");
    } catch (err) {
      const offline = err instanceof GitHubError && err.status === 0;
      setKeyStatus(offline ? "offline" : "invalid");
      setKeyProblem(err instanceof Error ? err.message : "Ключ GitHub не работает.");
    }
  }, []);

  useEffect(() => {
    setVault(vaultInfo());
    const { session: s, expired } = loadSession();
    setSession(s);
    if (expired) setNotice(`Сессия завершена: ${IDLE_MINUTES} минут без действий. Войдите снова.`);
    if (s) void checkKey(s.token);
    setReady(true);
  }, [checkKey]);

  const signOut = useCallback((message?: string) => {
    endSession();
    setSession(null);
    setNotice(message ?? null);
  }, []);

  // Активность продлевает сессию; долгое бездействие завершает её.
  useEffect(() => {
    if (!session) return;
    const onActivity = () => {
      if (Date.now() - lastTouch.current > 20_000) {
        lastTouch.current = Date.now();
        touchSession();
      }
    };
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    const timer = window.setInterval(() => {
      const { session: s, expired } = loadSession();
      if (!s) signOut(expired ? `Сессия завершена: ${IDLE_MINUTES} минут без действий. Войдите снова.` : undefined);
    }, 30_000);
    // Выход в одной вкладке — выход и в остальных.
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.endsWith("admin-session")) {
        const { session: s } = loadSession();
        if (!s) signOut();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, [session, signOut]);

  const setup = useCallback<AdminContextValue["setup"]>(
    async (input) => {
      const s = await setupVault(input);
      setVault(vaultInfo());
      setSession(s);
      setNotice(null);
      setKeyStatus("ok");
      setKeyProblem(null);
    },
    []
  );

  const signIn = useCallback<AdminContextValue["signIn"]>(
    async (input) => {
      const s = await vaultSignIn(input);
      setSession(s);
      setNotice(null);
      void checkKey(s.token);
    },
    [checkKey]
  );

  const updateCredentials = useCallback<AdminContextValue["updateCredentials"]>(
    async (input) => {
      const info = await changeCredentials(input);
      setVault(info);
      if (session) {
        const next = { ...session, login: info.login };
        persistSession(next);
        setSession(next);
      }
    },
    [session]
  );

  const replaceKey = useCallback<AdminContextValue["replaceKey"]>(
    async (input) => {
      const { token, ghLogin } = await replaceToken(input);
      setVault(vaultInfo());
      if (session) {
        // Сохранённая сессия тоже получает новый ключ, иначе перезагрузка вернёт старый.
        const next = { ...session, token, ghLogin };
        persistSession(next);
        setSession(next);
      }
      setKeyStatus("ok");
      setKeyProblem(null);
    },
    [session]
  );

  const importFile = useCallback((text: string) => {
    setVault(importVault(text));
  }, []);

  const forget = useCallback(() => {
    forgetDevice();
    setVault(null);
    setSession(null);
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      ready,
      vault,
      isAdmin: Boolean(session),
      login: session?.login ?? null,
      ghLogin: session?.ghLogin ?? null,
      remember: session?.remember ?? false,
      token: session?.token ?? null,
      keyStatus,
      keyProblem,
      notice,
      setup,
      signIn,
      signOut,
      updateCredentials,
      replaceKey,
      importFile,
      forget,
    }),
    [ready, vault, session, keyStatus, keyProblem, notice, setup, signIn, signOut, updateCredentials, replaceKey, importFile, forget]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
