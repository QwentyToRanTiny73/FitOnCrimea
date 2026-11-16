import type { Metadata } from "next";
import { site } from "@/config/site";
import { absoluteUrl } from "./utils";

/** Картинка для превью ссылки в мессенджерах и соцсетях, если у страницы нет своей. */
export const OG_DEFAULT = {
  url: absoluteUrl("/og-image.jpg"),
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.title}`,
};

/**
 * Метаданные страницы: заголовок, описание, канонический адрес и превью
 * для ссылок (Open Graph). path — путь без префикса, со слэшем на конце.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  noindex,
}: {
  /** Без названия сайта: «Каталог». Пусто — заголовок главной. */
  title?: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt?: string };
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.title.toLowerCase()}`;
  const og = image ?? OG_DEFAULT;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: site.name, locale: "ru_RU", url, title: fullTitle, description, images: [og] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [og.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
