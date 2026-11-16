#!/usr/bin/env node
// Уменьшенные копии картинок для телефонов и превью: запускается перед сборкой
// (npm run build / npm run dev). Для каждой картинки из public/products,
// public/design, public/brochure и схемы точек создаются WebP нужной ширины
// в public/_img/. Какую копию взять, решает src/lib/image-loader.ts по ширине
// экрана. Новые фото из кабинета обрабатываются при следующей сборке сами.
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import sharp from "sharp";
import { IMAGE_WIDTHS } from "../src/lib/image-widths.mjs";

const PUBLIC = "public";
const OUT = join(PUBLIC, "_img");
const SOURCES = ["products", "design", "brochure"];
const SINGLE = ["massage-points.jpg"];
const EXT = /\.(webp|jpe?g|png)$/i;

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    return d.isDirectory() ? walk(p) : EXT.test(d.name) ? [p] : [];
  });
}

const files = [...SOURCES.flatMap((d) => walk(join(PUBLIC, d))), ...SINGLE.map((f) => join(PUBLIC, f)).filter(existsSync)];
let made = 0;
let kept = 0;

for (const file of files) {
  const rel = relative(PUBLIC, file).replace(EXT, "");
  const srcTime = statSync(file).mtimeMs;
  let width;
  for (const w of IMAGE_WIDTHS) {
    const out = join(OUT, `${rel}-${w}.webp`);
    if (existsSync(out) && statSync(out).mtimeMs >= srcTime) {
      kept++;
      continue;
    }
    width ??= (await sharp(file).metadata()).width ?? w;
    mkdirSync(dirname(out), { recursive: true });
    // Шире оригинала не растягиваем: копия «1280» маленькой картинки — сама картинка в WebP.
    await sharp(file).resize({ width: Math.min(w, width), withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    made++;
  }
}

// Превью для ссылок в мессенджерах (og:image): JPEG 800 px для фото товаров.
for (const file of files.filter((f) => relative(PUBLIC, f).startsWith("products"))) {
  const out = join(OUT, `${relative(PUBLIC, file).replace(EXT, "")}-og.jpg`);
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) continue;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(file).resize({ width: 800, height: 800, fit: "contain", background: "#FCF7EC" }).flatten({ background: "#FCF7EC" }).jpeg({ quality: 82 }).toFile(out);
  made++;
}

console.log(`Картинки: ${files.length} исходных, новых копий ${made}, без изменений ${kept}.`);
