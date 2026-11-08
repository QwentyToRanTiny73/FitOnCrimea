"use client";

import { FormEvent, useState } from "react";
import { useAdmin } from "@/providers";
import { IDLE_MINUTES, REMEMBER_DAYS, checkLogin, checkPassword, exportVault } from "@/services/admin-vault";
import { Notice, primaryButton, secondaryButton } from "@/components/ui/Form";
import { cn } from "@/lib/utils";
import { PasswordInput, StrengthMeter, TextInput, TokenHelp } from "./AdminAuth";

type Msg = { tone: "ok" | "error"; text: string } | null;

/** Учётная запись: логин и пароль, ключ GitHub, перенос входа, выход. */
export function AccountPanel() {
  const { vault, login, ghLogin, remember, keyStatus, keyProblem, signOut, forget } = useAdmin();

  function download() {
    const blob = new Blob([exportVault()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fiton-krym-vhod.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-6">
      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <h2 className="title-crimson font-serif text-lg font-bold uppercase">Вход</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-brand-green/70">Логин</dt>
          <dd className="font-semibold text-brand-green">{login}</dd>
          <dt className="text-brand-green/70">Аккаунт GitHub</dt>
          <dd className="text-brand-green">{ghLogin}</dd>
          <dt className="text-brand-green/70">Ключ GitHub</dt>
          <dd className={cn(keyStatus === "invalid" ? "font-semibold text-brand-poppy" : "text-brand-green")}>
            {keyStatus === "ok" && "работает — публикация доступна"}
            {keyStatus === "checking" && "проверяю…"}
            {keyStatus === "offline" && "нет связи с GitHub"}
            {keyStatus === "invalid" && (keyProblem ?? "не работает")}
          </dd>
          <dt className="text-brand-green/70">Сеанс</dt>
          <dd className="text-brand-green">
            {remember ? `запомнен на ${REMEMBER_DAYS} дней на этом устройстве` : `закроется после ${IDLE_MINUTES} минут бездействия`}
          </dd>
          {vault && (
            <>
              <dt className="text-brand-green/70">Вход изменён</dt>
              <dd className="text-brand-green">{new Date(vault.updatedAt).toLocaleString("ru-RU")}</dd>
            </>
          )}
        </dl>
        <button type="button" onClick={() => signOut()} className={cn(secondaryButton, "mt-4 py-2 text-sm")}>
          Выйти
        </button>
      </section>

      <ChangeCredentials />
      <ReplaceKey />

      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <h2 className="title-crimson font-serif text-lg font-bold uppercase">Вход на другом устройстве</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-green/85">
          Скачайте файл входа и загрузите его на другом устройстве (экран входа → «Загрузить файл входа»). В файле ключ GitHub
          зашифрован вашим паролем. Храните файл как ключи от дома и не пересылайте в общие чаты.
        </p>
        <button type="button" onClick={download} className={cn(secondaryButton, "mt-3 py-2 text-sm")}>
          Скачать файл входа
        </button>
      </section>

      <section className="paper-page rounded-2xl p-5 sm:p-6">
        <h2 className="title-crimson font-serif text-lg font-bold uppercase">Удалить вход с этого устройства</h2>
        <p className="mt-2 text-sm text-brand-green/85">
          Например, перед продажей телефона. Черновики и опубликованное на сайте не пострадают. Если ключ GitHub мог попасть к
          чужим людям — отзовите его на GitHub: Settings → Developer settings → Fine-grained tokens → Delete.
        </p>
        <button
          type="button"
          onClick={() => window.confirm("Удалить сохранённый вход с этого устройства?") && forget()}
          className={cn(secondaryButton, "mt-3 py-2 text-sm text-brand-poppy")}
        >
          Удалить вход
        </button>
      </section>
    </div>
  );
}

function ChangeCredentials() {
  const { login: current, updateCredentials } = useAdmin();
  const [currentPassword, setCurrentPassword] = useState("");
  const [login, setLogin] = useState(current ?? "");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = checkLogin(login) ?? checkPassword(password, login) ?? (password !== repeat ? "Новые пароли не совпадают." : null);
    if (problem) return setMsg({ tone: "error", text: problem });
    setBusy(true);
    setMsg(null);
    try {
      await updateCredentials({ currentPassword, login, password });
      setMsg({ tone: "ok", text: "Логин и пароль изменены. Файлы входа, скачанные раньше, открываются старым паролем — скачайте новый." });
      setCurrentPassword("");
      setPassword("");
      setRepeat("");
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof Error ? err.message : "Не удалось изменить." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label="Сменить логин или пароль" className="paper-page space-y-4 rounded-2xl p-5 sm:p-6">
      <h2 className="title-crimson font-serif text-lg font-bold uppercase">Сменить логин или пароль</h2>
      <PasswordInput label="Текущий пароль" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
      <TextInput label="Логин" value={login} onChange={setLogin} autoComplete="username" required />
      <PasswordInput label="Новый пароль" value={password} onChange={setPassword} autoComplete="new-password" />
      <StrengthMeter password={password} />
      <PasswordInput label="Повторите новый пароль" value={repeat} onChange={setRepeat} autoComplete="new-password" />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <button type="submit" disabled={busy} className={cn(primaryButton, "py-2.5 text-sm")}>
        {busy ? "Сохраняю…" : "Сохранить"}
      </button>
    </form>
  );
}

function ReplaceKey() {
  const { replaceKey } = useAdmin();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await replaceKey({ password, token });
      setMsg({ tone: "ok", text: "Новый ключ сохранён и работает." });
      setPassword("");
      setToken("");
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof Error ? err.message : "Не удалось заменить ключ." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label="Заменить ключ GitHub" className="paper-page space-y-4 rounded-2xl p-5 sm:p-6">
      <h2 className="title-crimson font-serif text-lg font-bold uppercase">Заменить ключ GitHub</h2>
      <p className="text-sm text-brand-green/85">Когда истёк срок ключа (обычно 90 дней) или вы его отозвали. Логин и пароль остаются прежними.</p>
      <PasswordInput label="Пароль" value={password} onChange={setPassword} autoComplete="current-password" />
      <TextInput label="Новый ключ GitHub" value={token} onChange={setToken} type="password" placeholder="github_pat_…" autoComplete="off" required />
      <TokenHelp />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <button type="submit" disabled={busy} className={cn(primaryButton, "py-2.5 text-sm")}>
        {busy ? "Проверяю ключ…" : "Заменить ключ"}
      </button>
    </form>
  );
}
