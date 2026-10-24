"use client";

import { AuthProvider } from "./auth-provider";
import { CatalogProvider } from "./catalog-provider";
import { FavoritesProvider } from "./favorites-provider";

export { useAuth } from "./auth-provider";
export { useCatalog, useProduct } from "./catalog-provider";
export { useFavorites } from "./favorites-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CatalogProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
