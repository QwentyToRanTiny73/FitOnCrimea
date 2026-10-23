#!/usr/bin/env node
// Проверка результата сборки: в out/ должен лежать настоящий сайт,
// а не README. Ловит ошибку, из-за которой GitHub Pages показывал инструкции.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const errors = [];

const must = [
  "index.html",
  "catalog/index.html",
  "massage-points/index.html",
  "privacy/index.html",
  "404.html",
  "sitemap.xml",
  "robots.txt",
  "massage-points.jpg",
  "logo.svg",
  ".nojekyll",
  "admin/index.html",
  "brochure/cover-wreath.webp",
  "brochure/stamp-swallow-nest.webp",
  "products/limonnik-i-roza-brochure.webp",
];
for (const f of must) if (!existsSync(join(OUT, f))) errors.push(`нет файла out/${f}`);

const productPages = existsSync(join(OUT, "catalog"))
  ? readdirSync(join(OUT, "catalog"), { withFileTypes: true }).filter((d) => d.isDirectory()).length
  : 0;
if (productPages < 1) errors.push("не сгенерированы страницы товаров");

if (existsSync(join(OUT, "index.html"))) {
  const html = readFileSync(join(OUT, "index.html"), "utf8");
  if (!html.includes("<html")) errors.push("index.html не является HTML-страницей");
  if (!html.includes("Магазин натуральной крымской косметики")) errors.push("в index.html нет заголовка главной");
  const expected = `${basePath}/_next/`;
  if (!html.includes(expected)) errors.push(`скрипты подключены не с префиксом ${expected}`);
  // Локальные картинки без basePath сломаются на github.io
  if (basePath) {
    const bad = [...html.matchAll(/src="(\/[^/"][^"]*\.(?:jpg|jpeg|png|webp|svg))"/g)]
      .map((m) => m[1])
      .filter((src) => !src.startsWith(`${basePath}/`));
    if (bad.length) errors.push(`картинки без basePath: ${[...new Set(bad)].join(", ")}`);
  }
}

if (errors.length) {
  console.error("Проверка out/ не пройдена:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`out/ в порядке: страниц товаров ${productPages}, basePath "${basePath}"`);
