"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";
import { products } from "@/data/products";
import {
  BotanicalDivider,
  BotanicalWreath,
} from "@/components/Botanical";
import { ProductCard } from "@/components/ProductCard";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    if (!loading && !user) router.replace("/account/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="max-w-3xl mx-auto px-4 py-20" />;
  }

  const favoriteProducts = favorites
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <header className="text-center mb-10">
        <BotanicalWreath className="mx-auto h-14 text-brand-gold mb-3" />
        <p className="uppercase tracking-[0.25em] text-xs text-brand-gold mb-3">
          Личный кабинет
        </p>
        <h1 className="font-serif text-4xl text-brand-green">{user.name}</h1>
        <BotanicalDivider className="my-5" />
        <p className="text-brand-green/75 text-sm">
          {user.email} · с{" "}
          {new Date(user.createdAt).toLocaleDateString("ru-RU")}
        </p>
      </header>

      <section className="mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h2 className="font-serif text-2xl text-brand-green">Избранное</h2>
          <Link
            href="/favorites"
            className="text-sm text-brand-green border-b border-brand-gold pb-0.5 hover:text-brand-gold"
          >
            Открыть избранное
          </Link>
        </div>

        {favoriteProducts.length === 0 ? (
          <p className="text-brand-green/70 py-10 text-center bg-white/50 border border-brand-green/10 rounded-2xl">
            Пока пусто. Добавляйте бальзамы из{" "}
            <Link
              href="/catalog"
              className="text-brand-green border-b border-brand-gold"
            >
              каталога
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white/60 border border-brand-green/10 rounded-2xl p-6">
        <h2 className="font-serif text-2xl text-brand-green">Настройки</h2>
        <BotanicalDivider className="my-4" />
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="px-6 py-2 rounded-full border border-brand-green/30 text-brand-green hover:border-brand-gold transition-colors"
        >
          Выйти
        </button>
      </section>
    </div>
  );
}
