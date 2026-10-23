"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitHubLogin } from "@/components/admin/GitHubLogin";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { Field, Notice, inputClass, primaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAuth } from "@/providers";
import { cn } from "@/lib/utils";

/** Разрешаем возврат только на внутренние страницы. */
const safeNext = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : null);

function CustomerForm({ next }: { next: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login({ identifier, password });
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="paper-page space-y-4 rounded-2xl p-6">
      <Field label="Email или логин">
        <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required autoComplete="username" className={inputClass} />
      </Field>
      <Field label="Пароль">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputClass} />
      </Field>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="submit" disabled={busy} className={`${primaryButton} w-full`}>
        {busy ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}

function LoginTabs() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [tab, setTab] = useState<"customer" | "admin">(next?.startsWith("/admin") || params.get("as") === "admin" ? "admin" : "customer");

  return (
    <>
      <div role="tablist" aria-label="Кто входит" className="mb-4 grid grid-cols-2 gap-2">
        {(
          [
            ["customer", "Покупатель"],
            ["admin", "Администратор"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-full border-2 px-4 py-2 font-semibold transition-colors",
              tab === key ? "border-brand-green bg-brand-green text-brand-cream" : "border-brand-amber bg-brand-cream text-brand-green"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "customer" ? (
        <div className="space-y-4">
          <DemoNotice />
          <CustomerForm next={next ?? "/account"} />
          <p className="text-center text-sm text-brand-green/80">
            Нет аккаунта?{" "}
            <Link href="/account/register" className="text-brand-green underline decoration-brand-amber underline-offset-4">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      ) : (
        <GitHubLogin onDone={() => router.push(next ?? "/admin")} />
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-14">
      <SectionHeading as="h1" eyebrow="Личный кабинет" title="Вход" />
      <Suspense fallback={<div className="h-72" />}>
        <LoginTabs />
      </Suspense>
    </div>
  );
}
