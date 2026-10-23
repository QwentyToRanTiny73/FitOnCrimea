import Link from "next/link";
import type { ProductSubcategory } from "@/data/products";
import { cn } from "@/lib/utils";

type IconKey = ProductSubcategory | "all" | "massage" | "soap";

interface CategoryNode {
  key: IconKey;
  href: string;
  label: string;
  draw: React.ReactNode;
}

const Stroke = ({ children }: { children: React.ReactNode }) => (
  <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </g>
);

const Fill = ({ children, opacity = 0.5 }: { children: React.ReactNode; opacity?: number }) => (
  <g fill="currentColor" opacity={opacity}>{children}</g>
);

const ICONS: CategoryNode[] = [
  {
    key: "face",
    href: "/catalog?cat=face",
    label: "Для лица",
    draw: (
      <>
        <Stroke>
          <circle cx="32" cy="32" r="14" />
          <path d="M26 30 q1 -2 2 0" />
          <path d="M36 30 q1 -2 2 0" />
          <path d="M28 38 q4 3 8 0" />
        </Stroke>
        <Fill opacity={0.55}>
          <ellipse cx="20" cy="22" rx="6" ry="2.5" transform="rotate(-30 20 22)" />
          <ellipse cx="44" cy="22" rx="6" ry="2.5" transform="rotate(30 44 22)" />
          <ellipse cx="32" cy="14" rx="3" ry="6" />
        </Fill>
      </>
    ),
  },
  {
    key: "body",
    href: "/catalog?cat=body",
    label: "Для тела",
    draw: (
      <>
        <Stroke>
          <path d="M32 12 v40" />
          <path d="M32 22 c -8 0 -12 4 -16 0" />
          <path d="M32 30 c 8 0 12 4 16 0" />
          <path d="M32 38 c -8 0 -12 4 -16 0" />
        </Stroke>
        <Fill opacity={0.55}>
          <ellipse cx="14" cy="22" rx="5" ry="2" transform="rotate(-15 14 22)" />
          <ellipse cx="50" cy="30" rx="5" ry="2" transform="rotate(15 50 30)" />
          <ellipse cx="14" cy="38" rx="5" ry="2" transform="rotate(-15 14 38)" />
          <circle cx="32" cy="12" r="2.5" />
          <circle cx="32" cy="52" r="2" />
        </Fill>
      </>
    ),
  },
  {
    key: "hair",
    href: "/catalog?cat=hair",
    label: "Для волос",
    draw: (
      <>
        <Stroke>
          <path d="M16 18 c 4 -6 28 -6 32 0" />
          <path d="M16 22 c 0 16 4 24 4 30" />
          <path d="M22 24 c 0 12 -2 18 -2 26" />
          <path d="M30 26 c 0 12 0 18 0 26" />
          <path d="M40 24 c 0 12 2 18 2 26" />
          <path d="M48 22 c 0 16 -4 24 -4 30" />
        </Stroke>
        <Fill opacity={0.55}>
          <ellipse cx="32" cy="14" rx="14" ry="4" />
        </Fill>
      </>
    ),
  },
  {
    key: "joints",
    href: "/catalog?cat=joints",
    label: "Суставы",
    draw: (
      <>
        <Stroke>
          <path d="M14 14 l 14 14" />
          <path d="M36 36 l 14 14" />
          <circle cx="32" cy="32" r="6" />
        </Stroke>
        <Fill opacity={0.55}>
          <circle cx="14" cy="14" r="3" />
          <circle cx="50" cy="50" r="3" />
          <ellipse cx="48" cy="20" rx="6" ry="2.5" transform="rotate(45 48 20)" />
          <ellipse cx="16" cy="48" rx="6" ry="2.5" transform="rotate(45 16 48)" />
        </Fill>
      </>
    ),
  },
  {
    key: "respiratory",
    href: "/catalog?cat=respiratory",
    label: "Дыхание",
    draw: (
      <>
        <Stroke>
          <path d="M32 12 v 40" />
          <path d="M32 18 q -10 4 -14 16" />
          <path d="M32 18 q 10 4 14 16" />
          <path d="M32 28 q -8 4 -10 14" />
          <path d="M32 28 q 8 4 10 14" />
        </Stroke>
        <Fill opacity={0.5}>
          <ellipse cx="32" cy="12" rx="2" ry="3" />
          <circle cx="18" cy="34" r="1.5" />
          <circle cx="46" cy="34" r="1.5" />
        </Fill>
      </>
    ),
  },
  {
    key: "repellent",
    href: "/catalog?cat=repellent",
    label: "Репелленты",
    draw: (
      <>
        <Stroke>
          <path d="M32 14 v 36" />
          <path d="M32 22 l -10 -6" />
          <path d="M32 22 l 10 -6" />
          <path d="M32 34 l -10 -2" />
          <path d="M32 34 l 10 -2" />
          <path d="M32 46 l -8 4" />
          <path d="M32 46 l 8 4" />
        </Stroke>
        <Fill opacity={0.55}>
          <circle cx="32" cy="14" r="2.5" />
          <circle cx="20" cy="14" r="1.5" />
          <circle cx="44" cy="14" r="1.5" />
        </Fill>
      </>
    ),
  },
  {
    key: "soap",
    href: "/catalog?cat=other",
    label: "Прочее",
    draw: (
      <>
        <Stroke>
          <rect x="16" y="20" width="32" height="22" rx="4" />
          <path d="M22 28 q 4 -4 8 0" />
          <path d="M34 28 q 4 -4 8 0" />
          <path d="M28 36 q 4 4 8 0" />
        </Stroke>
        <Fill opacity={0.4}>
          <ellipse cx="22" cy="18" rx="3" ry="1.5" />
          <ellipse cx="34" cy="14" rx="3" ry="1.5" />
          <ellipse cx="44" cy="18" rx="3" ry="1.5" />
        </Fill>
      </>
    ),
  },
  {
    key: "massage",
    href: "/massage-points",
    label: "Точки массажа",
    draw: (
      <>
        <Stroke>
          <circle cx="32" cy="32" r="20" />
          <path d="M32 12 v 40" />
          <path d="M12 32 h 40" />
        </Stroke>
        <Fill opacity={0.7}>
          <circle cx="32" cy="20" r="2" />
          <circle cx="32" cy="44" r="2" />
          <circle cx="20" cy="32" r="2" />
          <circle cx="44" cy="32" r="2" />
          <circle cx="40" cy="22" r="1.5" />
          <circle cx="22" cy="42" r="1.5" />
          <circle cx="44" cy="42" r="1.5" />
          <circle cx="22" cy="22" r="1.5" />
        </Fill>
      </>
    ),
  },
];

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6",
        className
      )}
    >
      {ICONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="group flex flex-col items-center gap-2 text-center"
        >
          <span className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/70 border border-brand-green/15 flex items-center justify-center text-brand-green group-hover:bg-brand-gold/10 group-hover:border-brand-gold/60 transition-colors">
            <svg
              viewBox="0 0 64 64"
              className="w-12 h-12"
              aria-hidden="true"
            >
              {item.draw}
            </svg>
          </span>
          <span className="text-sm text-brand-green/80 group-hover:text-brand-green leading-tight max-w-[6rem]">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
