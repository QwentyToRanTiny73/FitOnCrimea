import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { site } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export const formatPrice = (price: number): string => priceFormatter.format(price);

/**
 * Путь к файлу из public/ с учётом basePath. next/image с `unoptimized`
 * префикс сам не добавляет, поэтому все локальные картинки идут через эту функцию.
 */
export function assetUrl(path: string): string {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (site.basePath && clean.startsWith(`${site.basePath}/`)) return clean;
  return `${site.basePath}${clean}`;
}

export const absoluteUrl = (path = ""): string => `${site.url}${path}`;
