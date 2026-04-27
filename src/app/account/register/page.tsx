"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (password !== confirm) throw new Error("Пароли не совпадают.");
      if (!agree)
        throw new Error("Необходимо согласие на обработку персональных данных.");
      await register({ email, password, name });
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-8">
        <BotanicalWreath className="mx-auto h-14 text-brand-gold mb-3" />
        <h1 className="font-serif text-4xl text-brand-green">Регистрация</h1>
        <BotanicalDivider className="my-5" />
        <p className="text-brand-green/75 text-sm">
          Создайте аккаунт, чтобы сохранять бальзамы в избранное.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/70 border border-brand-green/10 rounded-2xl p-6 space-y-4"
      >
        <label className="block">
          <span className="text-sm text-brand-green/80">Имя</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-brand-green/20 bg-white focus:border-brand-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-brand-green/80">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-brand-green/20 bg-white focus:border-brand-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-brand-green/80">
            Пароль (от 6 символов)
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-brand-green/20 bg-white focus:border-brand-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-brand-green/80">Повторите пароль</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-brand-green/20 bg-white focus:border-brand-gold focus:outline-none"
          />
        </label>

        <label className="flex items-start gap-3 text-xs text-brand-green/75">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1"
          />
          <span>
            Соглашаюсь на обработку персональных данных в соответствии с
            политикой конфиденциальности (ФЗ-152).
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full px-6 py-3 rounded-full bg-brand-green text-brand-beige hover:bg-brand-green/90 transition-colors disabled:opacity-60"
        >
          {busy ? "Создаём..." : "Создать аккаунт"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-brand-green/75">
        Уже есть аккаунт?{" "}
        <Link
          href="/account/login"
          className="text-brand-green border-b border-brand-gold pb-0.5 hover:text-brand-gold"
        >
          Войти
        </Link>
      </p>

      <p className="text-center mt-6 text-xs text-brand-green/55 leading-relaxed">
        Внимание: сейчас данные хранятся локально в браузере (демо-режим).
        Перед публичным запуском необходимо подключить серверный бэкенд
        авторизации — см. README.
      </p>
    </div>
  );
}
