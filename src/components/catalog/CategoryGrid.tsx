import Link from "next/link";
import { SUBCATEGORIES } from "@/config/categories";
import type { ProductSubcategory } from "@/data/catalog";
import { cn } from "@/lib/utils";

const S = { stroke: "currentColor", strokeWidth: 1.6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Ботанические пиктограммы 64×64 для каждой зоны применения. */
const DRAW: Record<ProductSubcategory | "massage", React.ReactNode> = {
  face: (
    <>
      <g {...S}>
        <circle cx="32" cy="34" r="13" />
        <path d="M27 32q1-2 2 0M35 32q1-2 2 0M28 39q4 3 8 0" />
      </g>
      <g fill="currentColor" opacity=".55">
        <ellipse cx="21" cy="21" rx="6" ry="2.5" transform="rotate(-30 21 21)" />
        <ellipse cx="43" cy="21" rx="6" ry="2.5" transform="rotate(30 43 21)" />
        <ellipse cx="32" cy="14" rx="3" ry="6" />
      </g>
    </>
  ),
  body: (
    <>
      <g {...S}>
        <path d="M32 12v40M32 22c-8 0-12 4-16 0M32 30c8 0 12 4 16 0M32 38c-8 0-12 4-16 0" />
      </g>
      <g fill="currentColor" opacity=".55">
        <ellipse cx="14" cy="22" rx="5" ry="2" transform="rotate(-15 14 22)" />
        <ellipse cx="50" cy="30" rx="5" ry="2" transform="rotate(15 50 30)" />
        <ellipse cx="14" cy="38" rx="5" ry="2" transform="rotate(-15 14 38)" />
        <circle cx="32" cy="12" r="2.5" />
      </g>
    </>
  ),
  hair: (
    <>
      <g {...S}>
        <path d="M16 18c4-6 28-6 32 0M16 22c0 16 4 24 4 30M23 24c0 12-2 18-2 26M32 26v26M41 24c0 12 2 18 2 26M48 22c0 16-4 24-4 30" />
      </g>
      <ellipse cx="32" cy="14" rx="14" ry="4" fill="currentColor" opacity=".55" />
    </>
  ),
  joints: (
    <>
      <g {...S}>
        <path d="M14 14l13 13M37 37l13 13" />
        <circle cx="32" cy="32" r="6" />
      </g>
      <g fill="currentColor" opacity=".55">
        <circle cx="14" cy="14" r="3" />
        <circle cx="50" cy="50" r="3" />
        <ellipse cx="47" cy="19" rx="6" ry="2.5" transform="rotate(45 47 19)" />
        <ellipse cx="17" cy="45" rx="6" ry="2.5" transform="rotate(45 17 45)" />
      </g>
    </>
  ),
  respiratory: (
    <>
      <g {...S}>
        <path d="M32 12v40M32 18q-10 4-14 16M32 18q10 4 14 16M32 28q-8 4-10 14M32 28q8 4 10 14" />
      </g>
      <g fill="currentColor" opacity=".55">
        <ellipse cx="32" cy="12" rx="2" ry="3" />
        <circle cx="18" cy="34" r="1.6" />
        <circle cx="46" cy="34" r="1.6" />
      </g>
    </>
  ),
  repellent: (
    <>
      <g {...S}>
        <path d="M32 14v36M32 22l-10-6M32 22l10-6M32 34l-10-2M32 34l10-2M32 46l-8 4M32 46l8 4" />
      </g>
      <g fill="currentColor" opacity=".6">
        <circle cx="32" cy="14" r="2.5" />
        <circle cx="21" cy="15" r="1.5" />
        <circle cx="43" cy="15" r="1.5" />
      </g>
    </>
  ),
  other: (
    <>
      <g {...S}>
        <path d="M40 16a16 16 0 1 0 8 26 13 13 0 0 1-8-26Z" />
      </g>
      <g fill="currentColor" opacity=".55">
        <circle cx="18" cy="18" r="1.6" />
        <circle cx="24" cy="12" r="1.2" />
        <circle cx="48" cy="22" r="1.2" />
      </g>
    </>
  ),
  massage: (
    <>
      <g {...S}>
        <circle cx="32" cy="14" r="5" />
        <path d="M32 19v16M22 26l10 4 10-4M26 52l6-17 6 17" />
      </g>
      <g fill="currentColor" opacity=".75">
        <circle cx="22" cy="26" r="2" />
        <circle cx="42" cy="26" r="2" />
        <circle cx="32" cy="33" r="2" />
        <circle cx="29" cy="45" r="1.6" />
      </g>
    </>
  ),
};

interface Tile {
  key: ProductSubcategory | "massage";
  href: string;
  label: string;
  text: string;
  tint: string;
  ring: string;
}

const TILES: Tile[] = [
  ...SUBCATEGORIES.map((s) => ({
    key: s.key,
    href: `/catalog?cat=${s.key}`,
    label: s.label,
    text: s.text,
    tint: s.tint,
    ring: s.ring,
  })),
  {
    key: "massage",
    href: "/massage-points",
    label: "Точки массажа",
    text: "text-brand-terracotta",
    tint: "bg-brand-cream",
    ring: "group-hover:border-brand-terracotta/60",
  },
];

export function CategoryGrid({ className }: { className?: string }) {
  return (
    <nav aria-label="Категории" className={cn("grid grid-cols-4 gap-x-2 gap-y-5 sm:gap-6", className)}>
      {TILES.map((t) => (
        <Link key={t.key} href={t.href} className="group flex flex-col items-center gap-2 text-center">
          <span
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full border border-brand-green/15 shadow-sm transition-colors sm:h-24 sm:w-24",
              t.tint,
              t.ring,
              t.text
            )}
          >
            <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-14 sm:w-14" aria-hidden="true">
              {DRAW[t.key]}
            </svg>
          </span>
          <span className="max-w-[6.5rem] text-[11px] leading-tight text-brand-green/85 group-hover:text-brand-green sm:text-sm">
            {t.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
