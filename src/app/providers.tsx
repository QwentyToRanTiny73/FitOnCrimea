"use client";

import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { ProductOverridesProvider } from "@/lib/products-overrides";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductOverridesProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </ProductOverridesProvider>
    </AuthProvider>
  );
}
