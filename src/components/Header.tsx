"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/massage-points", label: "Точки массажа" },
  { href: "/about", label: "О бренде" },
  { href: "/faq", label: "Вопросы" },
  { href: "/contacts", label: "Контакты" },
];

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { count } = useFavorites();

  return (
    <header className="sticky top-0 z-40 bg-brand-beige/90 backdrop-blur border-b border-brand-green/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-2xl sm:text-3xl text-brand-green tracking-wide"
          onClick={() => setOpen(false)}
        >
          Фитон <span className="text-brand-gold">Крым</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-brand-green/80 hover:text-brand-green transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            className="relative w-10 h-10 flex items-center justify-center text-brand-green hover:text-brand-gold transition-colors"
            aria-label="Избранное"
          >
            <HeartIcon className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-brand-green text-[10px] leading-none w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
          <Link
            href={user ? "/account" : "/account/login"}
            className="hidden sm:flex w-10 h-10 items-center justify-center text-brand-green hover:text-brand-gold transition-colors"
            aria-label={user ? "Личный кабинет" : "Войти"}
            title={user ? user.name : "Войти"}
          >
            <UserIcon className="w-5 h-5" />
          </Link>
          <button
            type="button"
            aria-label="Меню"
            aria-expanded={open}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-brand-green"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block w-6 h-0.5 bg-current">
              <span
                className={cn(
                  "absolute left-0 w-6 h-0.5 bg-current transition-transform",
                  open ? "rotate-45 top-0" : "-top-2"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 w-6 h-0.5 bg-current transition-transform",
                  open ? "-rotate-45 top-0" : "top-2"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-brand-green/10 bg-brand-beige">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-brand-green/90 hover:text-brand-green"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/account/login"}
              onClick={() => setOpen(false)}
              className="text-base text-brand-green/90 hover:text-brand-green"
            >
              {user ? `Кабинет (${user.name})` : "Войти"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
