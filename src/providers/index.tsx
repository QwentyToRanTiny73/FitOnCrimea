"use client";

import { AdminProvider } from "./admin-provider";
import { AuthProvider } from "./auth-provider";
import { CatalogProvider } from "./catalog-provider";
import { DesignProvider } from "./design-provider";
import { FavoritesProvider } from "./favorites-provider";

export { useAdmin } from "./admin-provider";
export { useAuth } from "./auth-provider";
export { useCatalog, useProduct } from "./catalog-provider";
export { useDesign, useSlotImage } from "./design-provider";
export { useFavorites } from "./favorites-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AuthProvider>
        <CatalogProvider>
          <DesignProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </DesignProvider>
        </CatalogProvider>
      </AuthProvider>
    </AdminProvider>
  );
}
