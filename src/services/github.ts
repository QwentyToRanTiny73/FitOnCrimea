/**
 * Клиент GitHub API для админки: проверка прав и публикация файлов в
 * репозиторий одним коммитом. Запросы идут из браузера администратора
 * напрямую в api.github.com, токен никуда больше не передаётся.
 */

export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export interface CommitFile {
  path: string;
  /** Содержимое в base64. */
  base64: string;
}

export class GitHubError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const API = "https://api.github.com";

function explain(status: number, fallback: string): string {
  if (status === 401) return "GitHub не принял ключ доступа: он неверный или истёк срок действия.";
  if (status === 403) return "Ключу не хватает прав. Нужен доступ к этому репозиторию с правом Contents: Read and write.";
  if (status === 404) return "Репозиторий не найден или ключ не даёт к нему доступа.";
  if (status === 409 || status === 422) return "Пока шла публикация, в репозитории появились другие изменения. Повторите публикацию.";
  return fallback;
}

async function gh<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch {
    throw new GitHubError("Нет связи с GitHub. Проверьте интернет.", 0);
  }
  if (!res.ok) throw new GitHubError(explain(res.status, `GitHub ответил ошибкой ${res.status}.`), res.status);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

/** Кто владелец ключа и может ли он записывать в репозиторий. */
export async function verifyAccess(token: string, repo: RepoRef): Promise<{ login: string }> {
  const user = await gh<{ login: string }>(token, "/user");
  const info = await gh<{ permissions?: { push?: boolean } }>(token, `/repos/${repo.owner}/${repo.repo}`);
  if (!info.permissions?.push) {
    throw new GitHubError(`У аккаунта ${user.login} нет права записи в ${repo.owner}/${repo.repo}.`, 403);
  }
  return { login: user.login };
}

export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function base64ToUtf8(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Текст файла из репозитория или null, если файла нет. */
export async function readTextFile(token: string, repo: RepoRef, path: string): Promise<string | null> {
  try {
    const file = await gh<{ content: string }>(
      token,
      `/repos/${repo.owner}/${repo.repo}/contents/${path}?ref=${encodeURIComponent(repo.branch)}`
    );
    return base64ToUtf8(file.content);
  } catch (err) {
    if (err instanceof GitHubError && err.status === 404) return null;
    throw err;
  }
}

/** Один коммит с несколькими файлами (Git Data API). */
export async function commitFiles(
  token: string,
  repo: RepoRef,
  files: CommitFile[],
  message: string
): Promise<{ sha: string; url: string }> {
  const base = `/repos/${repo.owner}/${repo.repo}/git`;
  const ref = await gh<{ object: { sha: string } }>(token, `${base}/ref/heads/${encodeURIComponent(repo.branch)}`);
  const parent = await gh<{ tree: { sha: string } }>(token, `${base}/commits/${ref.object.sha}`);

  const tree = [];
  for (const f of files) {
    const blob = await gh<{ sha: string }>(token, `${base}/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: f.base64, encoding: "base64" }),
    });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const newTree = await gh<{ sha: string }>(token, `${base}/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const commit = await gh<{ sha: string; html_url: string }>(token, `${base}/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  });
  await gh(token, `${base}/refs/heads/${encodeURIComponent(repo.branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  return { sha: commit.sha, url: commit.html_url };
}
