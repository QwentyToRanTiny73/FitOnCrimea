"use client";

import Image from "next/image";
import Link from "next/link";
import { visibleBanners, type Banner } from "@/data/design";
import { useDesign } from "@/providers";
import { ArrowIcon } from "@/components/ui/Icons";
import { assetUrl, cn } from "@/lib/utils";

/**
 * Баннеры на главной — добавляются и меняются в кабинете («Оформление» →
 * «Баннеры»). Нет баннеров — блок не выводится.
 */
export function HomeBanners() {
  const { design } = useDesign();
  const list = visibleBanners(design);
  if (!list.length) return null;
  const single = list.length === 1;

  return (
    <section aria-label="Новости и предложения" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <ul
        className={cn(
          single
            ? "block"
            : "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3"
        )}
      >
        {list.map((b, i) => (
          <li key={b.id} className={cn(!single && "w-[85%] shrink-0 snap-start sm:w-auto")}>
            <BannerCard banner={b} wide={single} priority={i === 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BannerCard({ banner, wide, priority }: { banner: Banner; wide: boolean; priority: boolean }) {
  const { image, title, text, href, linkLabel } = banner;
  const body = (
    <>
      <div className={cn("relative overflow-hidden bg-brand-beige", wide ? "aspect-[4/3] sm:aspect-[16/7]" : "aspect-[4/3]")}>
        <Image
          src={assetUrl(image.src)}
          alt={image.alt ?? ""}
          fill
          priority={priority}
          sizes={wide ? "(max-width: 1152px) 100vw, 1152px" : "(max-width: 640px) 85vw, 380px"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      {(title || text || href) && (
        <div className="flex flex-1 flex-col gap-1.5 border-t border-brand-amber/50 p-4 sm:p-5">
          {title && <h2 className="title-crimson font-serif text-lg font-bold uppercase leading-snug sm:text-xl">{title}</h2>}
          {text && <p className="text-sm leading-relaxed text-brand-green/85">{text}</p>}
          {href && (
            <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand-green group-hover:text-brand-crimson">
              {linkLabel || "Подробнее"} <ArrowIcon className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </>
  );
  const cls = "paper-page group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-brand-amber/60 shadow-[0_2px_0_rgba(90,36,32,0.12)]";
  if (!href) return <div className={cls}>{body}</div>;
  if (/^https:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}
