import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Избранное",
  description: "Бальзамы, которые вы отметили сердечком.",
  path: "/favorites/",
  noindex: true,
});

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
