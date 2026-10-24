"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN_NAV, site } from "@/config/site";
import { useAuth, useFavorites } from "@/providers";
import { cn } from "@/lib/utils";
import { HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { count } = useFavorites();

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-green/10 bg-brand-beige/90 backdrop-blur supports-[backdrop-filter]:bg-brand-beige/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="font-serif text-2xl tracking-wide text-brand-green sm:text-3xl" aria-label={`${site.name} — на главную`}>
          Фитон <span className="text-brand-gold">Крым</span>
        </Link>

        <nav aria-label="Основное меню" className="hidden items-center gap-7 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-sm transition-colors hover:text-brand-green",
                isActive(item.href) ? "text-brand-green underline decoration-brand-gold underline-offset-8" : "text-brand-green/75"
              )}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-sm text-brand-poppy hover:text-brand-poppy/80">
              Админка
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/catalog#search" aria-label="Поиск" className="flex h-10 w-10 items-center justify-center text-brand-green hover:text-brand-gold">
            <SearchIcon className="h-5 w-5" />
          </Link>
          <Link href="/favorites" aria-label={`Избранное: ${count}`} className="relative hidden h-10 w-10 items-center justify-center text-brand-green hover:text-brand-gold lg:flex">
            <HeartIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-poppy px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label={user ? `Кабинет: ${user.name}` : "Войти"}
            className="hidden h-10 w-10 items-center justify-center text-brand-green hover:text-brand-gold lg:flex"
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            aria-label="Меню"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-brand-green lg:hidden"
          >
            <MenuIcon className="h-6 w-6" open={open} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Меню" className="border-t border-brand-green/10 bg-brand-beige lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {[...MAIN_NAV, { href: "/privacy", label: "Политика конфиденциальности" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-3 text-base text-brand-green/90 hover:text-brand-green">
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li>
                <Link href="/admin" className="block py-3 text-base text-brand-poppy">
                  Админка
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
