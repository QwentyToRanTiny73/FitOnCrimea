#!/usr/bin/env node
// Утилита: вычисляет SHA-256 хэш пароля для seed-админа.
// Использование:
//   node scripts/hash-password.mjs "ваш-пароль"
//
// Полученный хэш можно положить в env-переменную NEXT_PUBLIC_ADMIN_PASSWORD_HASH
// в GitHub Actions Secrets / Vercel Environment Variables.
// Сам пароль НИКОГДА не попадает в репозиторий.

import { webcrypto } from "node:crypto";

async function sha256(text) {
  const buf = await webcrypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const password = process.argv[2];
if (!password) {
  console.error('Использование: node scripts/hash-password.mjs "ваш-пароль"');
  process.exit(1);
}

sha256(password).then((hash) => {
  console.log(hash);
});
