"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { site } from "@/config/site";
import { useAdmin } from "@/providers";
import { MIN_PASSWORD, REMEMBER_DAYS, checkLogin, checkPassword, formatWait, lockedForSeconds, passwordStrength } from "@/services/admin-vault";
import { Emblem } from "@/components/ui/Brochure";
import { Notice, inputClass, primaryButton, secondaryButton } from "@/components/ui/Form";
import { cn } from "@/lib/utils";
import { EyeIcon, LockIcon } from "./AdminIcons";

const TOKEN_URL = "https://github.com/settings/personal-access-tokens/new";

/** Экран входа в кабинет: вход, первая настройка, перенос с другого устройства. */
export function AdminAuth() {
  const { ready, vault, notice } = useAdmin();
  const [mode, setMode] = useState<"auto" | "setup" | "import">("auto");

  if (!ready) return <div className="min-h-screen bg-brand-beige" />;
  const view = mode === "auto" ? (vault ? "login" : "start") : mode;

  return (
    <div className="flex min-h-screen items-start justify-center bg-brand-beige px-4 py-10 sm:items-center sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Emblem className="h-14 w-14" />
          <p className="mt-3 font-display text-2xl uppercase tracking-wide text-brand-poppy">{site.name}</p>
          <h1 className="mt-1 font-serif text-xl font-bold text-brand-green">Кабинет администратора</h1>
        </div>

        {notice && view === "login" && (
          <div className="mb-4">
            <Notice tone="info">{notice}</Notice>
          </div>
        )}

        {view === "login" && <LoginForm onImport={() => setMode("import")} />}
        {view === "start" && (
          <div className="paper-page space-y-4 rounded-2xl p-6">
            <p className="text-sm leading-relaxed text-brand-green/85">
              На этом устройстве вход ещё не настроен. Придумайте логин и пароль — дальше входить будете только по ним.
            </p>
            <button type="button" onClick={() => setMode("setup")} className={cn(primaryButton, "w-full")}>
              Настроить вход
            </button>
            <button type="button" onClick={() => setMode("import")} className={cn(secondaryButton, "w-full py-2.5 text-sm")}>
              У меня есть файл входа с другого устройства
            </button>
          </div>
        )}
        {view === "setup" && <SetupForm onBack={() => setMode("auto")} />}
        {view === "import" && <ImportForm onBack={() => setMode("auto")} onDone={() => setMode("auto")} />}

        <p className="mt-6 text-center text-xs text-brand-green/60">
          <Link href="/" className="underline decoration-brand-amber underline-offset-2">
            ← на сайт
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onImport }: { onImport: () => void }) {
  const { signIn, forget, vault } = useAdmin();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  // Обратный отсчёт блокировки после неудачных попыток.
  useEffect(() => {
    setWait(lockedForSeconds());
    const t = window.setInterval(() => setWait(lockedForSeconds()), 1000);
    return () => window.clearInterval(t);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn({ login, password, remember });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти.");
      setPassword("");
      setWait(lockedForSeconds());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="paper-page space-y-4 rounded-2xl p-6" aria-label="Вход администратора">
        <TextInput label="Логин" value={login} onChange={setLogin} autoComplete="username" required />
        <PasswordInput label="Пароль" value={password} onChange={setPassword} autoComplete="current-password" />
        <label className="flex items-start gap-3 text-sm text-brand-green/85">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-green" />
          <span>
            Оставаться в системе {REMEMBER_DAYS} дней. Без галочки кабинет закроется после 30 минут бездействия.
            Не отмечайте на чужом устройстве.
          </span>
        </label>
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy || wait > 0} className={cn(primaryButton, "w-full gap-2")}>
          <LockIcon className="h-5 w-5" />
          {busy ? "Проверяю…" : wait > 0 ? `Подождите ${formatWait(wait)}` : "Войти"}
        </button>
      </form>

      <details className="rounded-xl border border-brand-amber/60 bg-brand-cream px-4 py-3 text-sm text-brand-green/90">
        <summary className="cursor-pointer font-semibold">Забыли логин или пароль?</summary>
        <p className="mt-2 leading-relaxed">
          Восстановить пароль нельзя: им зашифрован ключ GitHub на этом устройстве, и никто, кроме вас, его не знает.
          Можно настроить вход заново — понадобится ключ GitHub (новый или прежний).
        </p>
        {vault && <p className="mt-2 text-brand-green/70">Вход настроен {new Date(vault.createdAt).toLocaleDateString("ru-RU")}.</p>}
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Удалить сохранённый вход на этом устройстве и настроить его заново? Опубликованное на сайте не изменится.")) forget();
          }}
          className={cn(secondaryButton, "mt-3 py-2 text-sm text-brand-poppy")}
        >
          Настроить вход заново
        </button>
      </details>
      <button type="button" onClick={onImport} className="w-full text-center text-sm text-brand-green/75 underline decoration-brand-amber underline-offset-2">
        Загрузить файл входа с другого устройства
      </button>
    </div>
  );
}

function SetupForm({ onBack }: { onBack: () => void }) {
  const { setup } = useAdmin();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const problem = checkLogin(login) ?? checkPassword(password, login) ?? (password !== repeat ? "Пароли не совпадают." : null);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    try {
      await setup({ login, password, token, remember });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось настроить вход.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="paper-page space-y-4 rounded-2xl p-6" aria-label="Настройка входа">
      <h2 className="title-crimson font-serif text-lg font-bold uppercase">Настройка входа</h2>
      <TextInput label="Придумайте логин" value={login} onChange={setLogin} autoComplete="username" required hint="От 3 до 40 символов, без пробелов." />
      <PasswordInput label="Придумайте пароль" value={password} onChange={setPassword} autoComplete="new-password" />
      <StrengthMeter password={password} />
      <PasswordInput label="Повторите пароль" value={repeat} onChange={setRepeat} autoComplete="new-password" />
      <TextInput
        label="Ключ доступа GitHub"
        value={token}
        onChange={setToken}
        type="password"
        placeholder="github_pat_…"
        autoComplete="off"
        required
        hint="Нужен один раз. Хранится зашифрованным вашим паролем только на этом устройстве."
      />
      <TokenHelp />
      <label className="flex items-start gap-3 text-sm text-brand-green/85">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-green" />
        <span>Оставаться в системе {REMEMBER_DAYS} дней на этом устройстве.</span>
      </label>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="submit" disabled={busy} className={cn(primaryButton, "w-full")}>
        {busy ? "Проверяю ключ…" : "Сохранить и войти"}
      </button>
      <button type="button" onClick={onBack} className="w-full text-center text-sm text-brand-green/75 underline decoration-brand-amber underline-offset-2">
        Назад
      </button>
    </form>
  );
}

function ImportForm({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { importFile } = useAdmin();
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      importFile(await file.text());
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось прочитать файл.");
    }
  }

  return (
    <div className="paper-page space-y-4 rounded-2xl p-6">
      <h2 className="title-crimson font-serif text-lg font-bold uppercase">Вход с другого устройства</h2>
      <p className="text-sm leading-relaxed text-brand-green/85">
        На устройстве, где вход уже настроен: «Учётная запись» → «Скачать файл входа». Загрузите этот файл здесь и войдите
        прежними логином и паролем.
      </p>
      <label className={cn(primaryButton, "w-full cursor-pointer")}>
        <input type="file" accept="application/json,.json" className="sr-only" onChange={onFile} />
        Выбрать файл входа
      </label>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="button" onClick={onBack} className="w-full text-center text-sm text-brand-green/75 underline decoration-brand-amber underline-offset-2">
        Назад
      </button>
    </div>
  );
}

/* ── Поля ───────────────────────────────────────────────────── */

export function TextInput({
  label,
  value,
  onChange,
  hint,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-1 block text-sm text-brand-green/85">{label}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          className={inputClass}
          {...rest}
        />
      </label>
      {hint && <p className="mt-1 text-xs text-brand-green/60">{hint}</p>}
    </div>
  );
}

export function PasswordInput({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  // Кнопка «показать» — вне <label>, чтобы не попадать в имя поля для экранного диктора.
  return (
    <div className="relative">
      <label className="block">
        <span className="mb-1 block text-sm text-brand-green/85">{label}</span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="off"
          className={cn(inputClass, "pr-12")}
        />
      </label>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? `Скрыть: ${label.toLowerCase()}` : `Показать: ${label.toLowerCase()}`}
        aria-pressed={show}
        className="absolute bottom-1 right-1.5 flex h-9 w-9 items-center justify-center rounded-full text-brand-green/70 hover:text-brand-green"
      >
        <EyeIcon className="h-5 w-5" off={show} />
      </button>
    </div>
  );
}

export function StrengthMeter({ password }: { password: string }) {
  const level = passwordStrength(password);
  const labels = [`короче ${MIN_PASSWORD} символов`, "слабый", "нормальный", "надёжный"];
  const tones = ["bg-brand-poppy", "bg-brand-terracotta", "bg-brand-gold", "bg-brand-forest"];
  return (
    <div aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", password && level > i ? tones[level] : "bg-brand-green/15")} />
        ))}
      </div>
      <p className="mt-1 text-xs text-brand-green/70">
        Надёжность пароля: {password ? labels[level] : "—"}. Лучше 12+ символов: буквы разного регистра, цифры, знаки.
      </p>
    </div>
  );
}

export function TokenHelp() {
  return (
    <details className="rounded-xl border border-brand-amber/60 bg-brand-cream px-4 py-3 text-sm text-brand-green/90">
      <summary className="cursor-pointer font-semibold">Где взять ключ GitHub — 2 минуты</summary>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5">
        <li>
          Откройте{" "}
          <a href={TOKEN_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-amber underline-offset-2">
            GitHub → Fine-grained token
          </a>{" "}
          (войдите в свой аккаунт GitHub).
        </li>
        <li>Token name — «Кабинет сайта», Expiration — 90 дней.</li>
        <li>
          Repository access → <b>Only select repositories</b> → {site.repo.owner}/{site.repo.repo}.
        </li>
        <li>
          Permissions → Repository permissions → <b>Contents: Read and write</b>.
        </li>
        <li>Generate token → скопируйте ключ и вставьте в поле выше.</li>
      </ol>
      <p className="mt-2 text-brand-green/70">Ключ уходит только на api.github.com. Не пересылайте его в чатах и почте.</p>
    </details>
  );
}
