import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://phyton-crimea.ru";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

export function withBasePath(path: string): string {
  if (!path) return BASE_PATH || "/";
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("data:")) return path;
  if (BASE_PATH && path.startsWith(BASE_PATH)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
