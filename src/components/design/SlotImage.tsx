"use client";

import Image from "next/image";
import type { DesignSlotKey } from "@/data/design";
import { useSlotImage } from "@/providers";
import { StampImage } from "@/components/ui/Brochure";
import { assetUrl } from "@/lib/utils";

/**
 * Картинка из «слота» оформления: исходная из брошюры или заменённая в
 * кабинете. В статической сборке — опубликованная версия; у администратора
 * в браузере сразу видна и неопубликованная (черновик).
 */
export function SlotImage({
  slot,
  sizes,
  className,
  priority,
  fill,
  decorative,
}: {
  slot: DesignSlotKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Растянуть на родителя (родитель — relative с размерами). */
  fill?: boolean;
  /** Декоративная — alt пустой, подпись рядом уже есть. */
  decorative?: boolean;
}) {
  const img = useSlotImage(slot);
  const alt = decorative ? "" : img.alt ?? "";
  const src = assetUrl(img.src);
  if (fill) return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
  return <Image src={src} alt={alt} width={img.width} height={img.height} sizes={sizes} priority={priority} className={className} />;
}

/** Акварель-марка из слота оформления. */
export function SlotStamp({ slot, className, sizes }: { slot: DesignSlotKey; className?: string; sizes?: string }) {
  const img = useSlotImage(slot);
  return <StampImage src={img.src} alt={img.alt ?? ""} width={img.width} height={img.height} className={className} sizes={sizes} />;
}
