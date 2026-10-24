import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Бальзамы «Фитон Крым» на крымских травах: дыхание, суставы, кожа лица и тела, волосы. Поиск по растению и показанию.",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
      <SectionHeading
        as="h1"
        align="left"
        eyebrow="Каталог"
        title="Бальзамы, мыло и уход для губ"
        lead="Ищите по названию, растению или показанию — например, «кашель» или «лаванда»."
      />
      <Suspense fallback={<div className="h-96" />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
