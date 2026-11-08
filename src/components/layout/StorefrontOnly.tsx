"use client";

import { usePathname } from "next/navigation";

/** Шапка, подвал и нижнее меню витрины — не нужны в кабинете администратора. */
export function StorefrontOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
