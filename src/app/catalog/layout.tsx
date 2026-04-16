import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог бальзамов и косметики",
  description:
    "Каталог натуральных бальзамов «Фитон Крым»: уход за лицом, телом, волосами, суставами, дыхательной системой. Авторские фармакопейные рецептуры.",
  openGraph: {
    title: "Каталог «Фитон Крым»",
    description:
      "Натуральные бальзамы на крымских травах — весь ассортимент.",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
