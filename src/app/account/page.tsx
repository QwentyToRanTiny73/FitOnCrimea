"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { secondaryButton } from "@/components/ui/Form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAuth, useCatalog, useFavorites } from "@/providers";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAuth();
  const { favorites } = useFavorites();
  const { products } = useCatalog();

  useEffect(() => {
    if (!loading && !user) router.replace("/account/login?next=/account");
  }, [loading, user, router]);

  if (loading || !user) return <div className="min-h-[50vh]" />;

  const saved = products.filter((p) => favorites.includes(p.slug)).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow="Личный кабинет"
        title={user.name}
        lead={`${user.email} · с ${new Date(user.createdAt).toLocaleDateString("ru-RU")}`}
      />
      <div className="mb-8">
        <DemoNotice />
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-brand-green">Избранное</h2>
          <Link href="/favorites" className="text-sm text-brand-green underline decoration-brand-gold underline-offset-4">
            Все ({favorites.length})
          </Link>
        </div>
        {saved.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {saved.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-brand-green/10 bg-white/60 py-10 text-center text-brand-green/70">
            Пока пусто — отмечайте бальзамы сердечком в{" "}
            <Link href="/catalog" className="underline decoration-brand-gold underline-offset-4">
              каталоге
            </Link>
            .
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        {isAdmin && (
          <Link href="/admin" className={secondaryButton}>
            Кабинет администратора
          </Link>
        )}
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className={secondaryButton}
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
