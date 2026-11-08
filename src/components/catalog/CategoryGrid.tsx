import Link from "next/link";
import { SUBCATEGORIES } from "@/config/categories";
import type { ProductSubcategory } from "@/data/catalog";
import { SlotImage } from "@/components/design/SlotImage";
import { cn } from "@/lib/utils";

/**
 * Иконки разделов — круглые медальоны с акварельными растениями из брошюры
 * (public/brochure/icons/<key>.webp, 240×240). Заменяются в кабинете: «Оформление». Растение подобрано по бальзаму раздела:
 * дыхание — лавр и розмарин («Звезда Крыма»), суставы — пихта и красный перец,
 * тело — лаванда, лицо — календула, волосы — иланг-иланг, от насекомых — гвоздика,
 * успокоение — герань и валериана, точки массажа — фрагмент схемы точек.
 */
interface Tile {
  key: ProductSubcategory | "massage";
  href: string;
  label: string;
  ring: string;
}

const TILES: Tile[] = [
  ...SUBCATEGORIES.map((s) => ({ key: s.key, href: `/catalog?cat=${s.key}`, label: s.label, ring: s.ring })),
  { key: "massage", href: "/massage-points", label: "Точки массажа", ring: "group-hover:border-brand-terracotta" },
];

export function CategoryGrid({ className }: { className?: string }) {
  return (
    <nav aria-label="Категории" className={cn("grid grid-cols-4 gap-x-2 gap-y-5 sm:gap-6", className)}>
      {TILES.map((t) => (
        <Link key={t.key} href={t.href} className="group flex flex-col items-center gap-2 text-center">
          <span
            className={cn(
              "relative block h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full border-2 border-brand-amber bg-brand-cream shadow-[0_2px_0_rgba(90,36,32,0.18)] transition-transform group-hover:-translate-y-0.5 sm:h-28 sm:w-28",
              t.ring
            )}
          >
            <SlotImage
              slot={`icon-${t.key}`}
              fill
              decorative
              sizes="(min-width: 640px) 112px, 72px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Внутренний золотой ободок, как у медальонов брошюры */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_3px_#fcf7ec,inset_0_0_0_4px_rgba(138,97,24,0.4)]"
            />
          </span>
          <span className="max-w-[6.5rem] font-serif text-xs font-bold leading-tight text-brand-green group-hover:text-brand-crimson sm:text-sm">
            {t.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
