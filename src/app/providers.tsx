"use client";

import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </AuthProvider>
  );
}
