"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { Field, Notice, inputClass, primaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAuth } from "@/providers";

/** Разрешаем возврат только на внутренние страницы. */
const safeNext = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/account");

function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
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
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-brand-green/10 bg-white/75 p-6">
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

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-14">
      <SectionHeading as="h1" eyebrow="Личный кабинет" title="Вход" />
      <div className="space-y-4">
        <DemoNotice />
        <Suspense fallback={<div className="h-72" />}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-brand-green/75">
        Нет аккаунта?{" "}
        <Link href="/account/register" className="text-brand-green underline decoration-brand-gold underline-offset-4">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
