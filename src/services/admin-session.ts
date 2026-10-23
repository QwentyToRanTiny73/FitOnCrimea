import { site } from "@/config/site";
import { verifyAccess } from "./github";
import { readJSON, removeKey, writeJSON } from "./storage";

/**
 * Вход администратора через ключ доступа GitHub (fine-grained token).
 * Права проверяет сам GitHub: пускает только владельца или соавтора репозитория.
 * Ключ хранится в этом браузере — до закрытия вкладки или, по выбору, постоянно.
 */

interface AdminSession {
  token: string;
  login: string;
}

const KEY = "admin";

export function loadAdminSession(): AdminSession | null {
  return readJSON<AdminSession | null>(KEY, null, "session") ?? readJSON<AdminSession | null>(KEY, null, "local");
}

export async function startAdminSession(token: string, remember: boolean): Promise<AdminSession> {
  const clean = token.trim();
  if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(clean)) {
    throw new Error("Это не похоже на ключ GitHub: он начинается с github_pat_ или ghp_.");
  }
  const { login } = await verifyAccess(clean, site.repo);
  const session = { token: clean, login };
  endAdminSession();
  writeJSON(KEY, session, remember ? "local" : "session");
  return session;
}

export function endAdminSession(): void {
  removeKey(KEY, "session");
  removeKey(KEY, "local");
}
