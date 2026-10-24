"use client";

import { useFavorites } from "@/providers";
import { cn } from "@/lib/utils";
import { HeartIcon } from "@/components/ui/Icons";

export function FavoriteButton({ slug, className }: { slug: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-brand-green/15 bg-white/90 transition-colors",
        active ? "text-brand-poppy" : "text-brand-green/50 hover:text-brand-poppy",
        className
      )}
    >
      <HeartIcon className="h-5 w-5" filled={active} />
    </button>
  );
}
