"use client";

import { SUBCATEGORY_LABELS, type ProductSubcategory } from "@/data/products";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  active: ProductSubcategory | "all";
  onChange: (value: ProductSubcategory | "all") => void;
  counts: Record<ProductSubcategory | "all", number>;
}

const ORDER: Array<ProductSubcategory | "all"> = [
  "all",
  "face",
  "body",
  "hair",
  "joints",
  "respiratory",
  "repellent",
  "other",
];

export function CategoryFilter({
  active,
  onChange,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDER.map((key) => {
        const label = key === "all" ? "Все товары" : SUBCATEGORY_LABELS[key];
        const count = counts[key] ?? 0;
        if (count === 0 && key !== "all") return null;
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "px-4 py-2 rounded-full text-sm border transition-colors",
              isActive
                ? "bg-brand-green text-brand-beige border-brand-green"
                : "bg-white/60 text-brand-green border-brand-green/20 hover:border-brand-gold"
            )}
          >
            {label}
            <span
              className={cn(
                "ml-2 text-xs",
                isActive ? "text-brand-beige/70" : "text-brand-green/50"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
