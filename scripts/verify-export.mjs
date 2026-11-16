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
  "products/krymskiy-spasatel-brochure.webp",
  "brochure/icons/respiratory.webp",
  "brochure/icons/massage.webp",
];
for (const f of must) if (!existsSync(join(OUT, f))) errors.push(`нет файла out/${f}`);

// Картинки оформления из кабинета (src/data/design/overrides.json) должны лежать в out/.
try {
  const design = JSON.parse(readFileSync("src/data/design/overrides.json", "utf8"));
  const paths = [
    ...Object.values(design.images ?? {}).map((i) => i?.src),
    ...(design.banners ?? []).map((b) => b?.image?.src),
  ].filter((p) => typeof p === "string" && p.startsWith("/"));
  for (const p of paths) if (!existsSync(join(OUT, p))) errors.push(`оформление ссылается на отсутствующий файл ${p}`);
} catch (e) {
  errors.push(`src/data/design/overrides.json не читается: ${e.message}`);
}

// Реквизиты оператора (site.legal.operator) — предупреждение, сборку не останавливает.
const warnings = [];
if (existsSync(join(OUT, "privacy/index.html")) && readFileSync(join(OUT, "privacy/index.html"), "utf8").includes('data-legal="missing"')) {
  warnings.push("не заполнены реквизиты продавца и оператора ПД (src/config/site.ts → legal.operator) — заполнить до запуска");
}

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

// Уменьшенные копии картинок (/_img/…), на которые ссылаются страницы, должны быть в out/.
const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? htmlFiles(join(dir, d.name)) : d.name.endsWith(".html") ? [join(dir, d.name)] : []
  );
const missingImg = new Set();
for (const f of existsSync(OUT) ? htmlFiles(OUT) : []) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/\/_img\/[^"'\s,)]+?\.(?:webp|jpg)/g)) {
    const rel = m[0];
    if (!existsSync(join(OUT, rel))) missingImg.add(rel);
  }
  // В CI адрес сайта обязан прийти из переменной окружения, а не быть локальным.
  if (process.env.CI && html.includes("http://localhost:3000")) errors.push(`${f}: адрес сайта не задан (NEXT_PUBLIC_SITE_URL)`);
}
if (missingImg.size) errors.push(`нет уменьшенных копий картинок: ${[...missingImg].slice(0, 5).join(", ")}`);

if (errors.length) {
  console.error("Проверка out/ не пройдена:\n- " + errors.join("\n- "));
  process.exit(1);
}
for (const w of warnings) console.warn(`Внимание: ${w}`);
console.log(`out/ в порядке: страниц товаров ${productPages}, basePath "${basePath}"`);
