"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-beige/90 backdrop-blur border-b border-brand-green/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl sm:text-3xl text-brand-green tracking-wide"
          onClick={() => setOpen(false)}
        >
          Фитон <span className="text-brand-gold">Крым</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
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

        <button
          type="button"
          aria-label="Меню"
          aria-expanded={open}
          className="md:hidden w-10 h-10 flex items-center justify-center text-brand-green"
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

      {open && (
        <nav className="md:hidden border-t border-brand-green/10 bg-brand-beige">
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
          </div>
        </nav>
      )}
    </header>
  );
}
