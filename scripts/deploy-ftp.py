#!/usr/bin/env python3
"""Выкладка собранного сайта (out/) на хостинг по FTP — для REG.RU и подобных.

Запускает workflow после сборки. Нужны только стандартные модули Python.

Переменные окружения:
  FTP_HOST, FTP_USER, FTP_PASSWORD — доступ к хостингу (секреты репозитория);
  FTP_DIR  — папка сайта на хостинге, например www/phyton-crimea.ru. Должна существовать;
  FTP_PORT — порт, по умолчанию 21;
  FTP_TLS  — "off" отключает шифрование (только если хостинг не умеет FTPS; пароль пойдёт открыто).

Как работает:
  * на хостинге лежит список выложенных файлов с их хэшами (.deploy-manifest.json);
  * загружаются только новые и изменившиеся файлы: сначала картинки и скрипты, страницы — последними;
  * удаляются только файлы, которые скрипт сам выложил раньше и которых больше нет в сборке.
    Чужие файлы в папке (например, .well-known для сертификата) не трогаются.
"""
import ftplib
import hashlib
import io
import json
import os
import ssl
import sys
from pathlib import Path

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "out")
MANIFEST = ".deploy-manifest.json"


def env(name: str, default: str | None = None) -> str:
    value = os.environ.get(name, default)
    if not value:
        sys.exit(f"Не задана переменная {name}. См. docs/DEPLOY-REGRU.md")
    return value


def connect() -> ftplib.FTP:
    host, port = env("FTP_HOST"), int(os.environ.get("FTP_PORT") or 21)
    if os.environ.get("FTP_TLS", "").lower() == "off":
        print("ВНИМАНИЕ: шифрование отключено (FTP_TLS=off), пароль передаётся открыто.")
        ftp: ftplib.FTP = ftplib.FTP(timeout=60)
        ftp.connect(host, port)
        ftp.login(env("FTP_USER"), env("FTP_PASSWORD"))
    else:
        tls = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=60)
        tls.connect(host, port)
        tls.login(env("FTP_USER"), env("FTP_PASSWORD"))
        tls.prot_p()
        ftp = tls
    ftp.encoding = "utf-8"
    return ftp


def local_files() -> dict[str, str]:
    files = {}
    for path in sorted(OUT.rglob("*")):
        if path.is_file():
            files[path.relative_to(OUT).as_posix()] = hashlib.sha1(path.read_bytes()).hexdigest()
    return files


def read_manifest(ftp: ftplib.FTP) -> dict[str, str]:
    buf = io.BytesIO()
    try:
        ftp.retrbinary(f"RETR {MANIFEST}", buf.write)
        data = json.loads(buf.getvalue().decode("utf-8"))
        return data if isinstance(data, dict) else {}
    except (ftplib.error_perm, ValueError):
        return {}


def ensure_dirs(ftp: ftplib.FTP, rel: str, made: set[str]) -> None:
    parts = rel.split("/")[:-1]
    for i in range(1, len(parts) + 1):
        d = "/".join(parts[:i])
        if d in made:
            continue
        try:
            ftp.mkd(d)
        except ftplib.error_perm:
            pass  # уже есть
        made.add(d)


def upload(ftp: ftplib.FTP, rel: str) -> None:
    last: Exception | None = None
    for _ in range(3):
        try:
            with open(OUT / rel, "rb") as f:
                ftp.storbinary(f"STOR {rel}", f)
            return
        except (ftplib.error_temp, OSError) as err:  # временный сбой — повторить
            last = err
    raise SystemExit(f"Не удалось загрузить {rel}: {last}")


def main() -> None:
    if not (OUT / "index.html").is_file():
        sys.exit(f"В {OUT}/ нет index.html — сначала соберите сайт (npm run build).")
    target = env("FTP_DIR").strip("/")
    if not target:
        sys.exit("FTP_DIR не может быть корнем хостинга: укажите папку сайта.")

    try:
        ftp = connect()
    except ftplib.error_perm as err:
        sys.exit(f"Хостинг отклонил вход или команду: {err}. Проверьте FTP_USER и FTP_PASSWORD; "
                 "если хостинг не поддерживает FTPS — см. FTP_TLS в docs/DEPLOY-REGRU.md.")
    except (OSError, ssl.SSLError) as err:
        sys.exit(f"Не удалось соединиться с {os.environ.get('FTP_HOST')}: {err}")
    try:
        ftp.cwd(target)
    except ftplib.error_perm:
        sys.exit(f"На хостинге нет папки {target}. Проверьте FTP_DIR — скрипт её не создаёт.")

    new = local_files()
    old = read_manifest(ftp)
    changed = [f for f, h in new.items() if old.get(f) != h]
    # Страницы — последними, чтобы они не ссылались на ещё не загруженные скрипты и картинки.
    changed.sort(key=lambda f: (f.endswith(".html"), f))
    stale = [f for f in old if f not in new]

    made: set[str] = set()
    for i, rel in enumerate(changed, 1):
        ensure_dirs(ftp, rel, made)
        upload(ftp, rel)
        if i % 100 == 0:
            print(f"  загружено {i} из {len(changed)}")

    for rel in stale:
        try:
            ftp.delete(rel)
        except ftplib.error_perm:
            pass  # файла уже нет

    ftp.storbinary(f"STOR {MANIFEST}", io.BytesIO(json.dumps(new, ensure_ascii=False).encode("utf-8")))
    ftp.quit()
    print(f"Готово: файлов в сборке {len(new)}, загружено {len(changed)}, удалено устаревших {len(stale)}.")


if __name__ == "__main__":
    main()
