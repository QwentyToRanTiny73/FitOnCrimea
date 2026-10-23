"use client";

import { FormEvent, useState } from "react";
import { site } from "@/config/site";
import { useAuth } from "@/providers";
import { Field, Notice, inputClass, primaryButton } from "@/components/ui/Form";

const TOKEN_URL = "https://github.com/settings/personal-access-tokens/new";

/** Вход администратора ключом GitHub. */
export function GitHubLogin({ onDone }: { onDone?: () => void }) {
  const { loginAdmin } = useAuth();
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await loginAdmin(token, remember);
      setToken("");
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="paper-page space-y-4 rounded-2xl p-6">
      <Field label="Ключ доступа GitHub" hint="Ключ проверяет сам GitHub. Пускает только владельца или соавтора репозитория.">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          autoComplete="off"
          spellCheck={false}
          placeholder="github_pat_…"
          className={inputClass}
        />
      </Field>
      <label className="flex items-start gap-3 text-sm text-brand-green/85">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-green" />
        <span>Запомнить на этом устройстве (иначе — до закрытия вкладки). Не отмечайте на чужом компьютере.</span>
      </label>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="submit" disabled={busy} className={`${primaryButton} w-full`}>
        {busy ? "Проверяю ключ…" : "Войти как администратор"}
      </button>

      <details className="rounded-xl border border-brand-amber/60 bg-brand-cream px-4 py-3 text-sm text-brand-green/90">
        <summary className="cursor-pointer font-semibold">Где взять ключ — 2 минуты</summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          <li>
            Откройте{" "}
            <a href={TOKEN_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-amber underline-offset-2">
              GitHub → Fine-grained token
            </a>{" "}
            (войдите в свой аккаунт GitHub).
          </li>
          <li>Token name — «Админка сайта», Expiration — 90 дней.</li>
          <li>
            Repository access → <b>Only select repositories</b> → {site.repo.owner}/{site.repo.repo}.
          </li>
          <li>
            Permissions → Repository permissions → <b>Contents: Read and write</b>.
          </li>
          <li>Generate token → скопируйте ключ и вставьте сюда.</li>
        </ol>
        <p className="mt-2 text-brand-green/70">Ключ не отправляется никуда, кроме api.github.com. Не пересылайте его в чатах и почте.</p>
      </details>
    </form>
  );
}
