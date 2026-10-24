"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useFavorites } from "@/providers";
import { cn } from "@/lib/utils";
import { CatalogIcon, HeartIcon, HomeIcon, PointsIcon, UserIcon } from "@/components/ui/Icons";

/** Нижнее меню на телефонах — основные разделы под большим пальцем. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { user } = useAuth();

  const tabs = [
    { href: "/", label: "Главная", Icon: HomeIcon, exact: true },
    { href: "/catalog", label: "Каталог", Icon: CatalogIcon },
    { href: "/massage-points", label: "Точки", Icon: PointsIcon },
    { href: "/favorites", label: "Избранное", Icon: HeartIcon, badge: count },
    { href: "/account", label: user ? "Кабинет" : "Войти", Icon: UserIcon },
  ];

  return (
    <nav
      aria-label="Быстрая навигация"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-green/10 bg-brand-beige/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        {tabs.map(({ href, label, Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px]",
                  active ? "text-brand-green" : "text-brand-green/55"
                )}
              >
                <Icon className="h-6 w-6" />
                {label}
                {badge ? (
                  <span className="absolute left-1/2 top-2 ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-poppy px-1 text-[10px] text-white">
                    {badge}
                  </span>
                ) : null}
                {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand-gold" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
