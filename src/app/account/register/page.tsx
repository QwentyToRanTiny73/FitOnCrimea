"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { Field, Notice, inputClass, primaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAuth } from "@/providers";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", agree: false });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) return setError("Пароли не совпадают.");
    if (!form.agree) return setError("Нужно согласие на обработку персональных данных.");
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось зарегистрироваться.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-14">
      <SectionHeading as="h1" eyebrow="Личный кабинет" title="Регистрация" lead="Аккаунт нужен, чтобы сохранять избранные бальзамы." />
      <div className="space-y-4">
        <DemoNotice />
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-brand-green/10 bg-white/75 p-6">
          <Field label="Имя">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required autoComplete="email" className={inputClass} />
          </Field>
          <Field label="Пароль" hint="Не короче 8 символов. Не используйте пароль от почты или банка.">
            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
          <Field label="Повторите пароль">
            <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
          <label className="flex items-start gap-3 text-sm text-brand-green/80">
            <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-1 h-4 w-4 accent-brand-green" />
            <span>
              Согласен(на) на обработку персональных данных согласно{" "}
              <Link href="/privacy" className="underline decoration-brand-gold underline-offset-2">
                политике конфиденциальности
              </Link>
              .
            </span>
          </label>
          {error && <Notice tone="error">{error}</Notice>}
          <button type="submit" disabled={busy} className={`${primaryButton} w-full`}>
            {busy ? "Создаём…" : "Создать аккаунт"}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-brand-green/75">
        Уже есть аккаунт?{" "}
        <Link href="/account/login" className="text-brand-green underline decoration-brand-gold underline-offset-4">
          Войти
        </Link>
      </p>
    </div>
  );
}
