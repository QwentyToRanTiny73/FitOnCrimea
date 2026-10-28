import { cn } from "@/lib/utils";
import { BotanicalDivider } from "./Botanical";

/** Заголовок раздела в духе брошюры: красная антиква и травяной разделитель. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <header className={cn(centered && "text-center", "mb-8 sm:mb-10", className)}>
      {eyebrow && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-gold sm:text-xs">{eyebrow}</p>
      )}
      <Tag
        className={cn(
          "title-crimson font-serif font-bold uppercase leading-tight tracking-wide",
          Tag === "h1" ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"
        )}
      >
        {title}
      </Tag>
      <BotanicalDivider className={cn("my-4 text-brand-gold", !centered && "justify-start")} />
      {lead && <div className={cn("leading-relaxed text-brand-green/85", centered && "mx-auto max-w-2xl")}>{lead}</div>}
    </header>
  );
}
