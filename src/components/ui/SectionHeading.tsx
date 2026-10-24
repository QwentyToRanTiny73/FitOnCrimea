import { cn } from "@/lib/utils";
import { BotanicalDivider } from "./Botanical";

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
        <p className="uppercase tracking-[0.25em] text-[11px] sm:text-xs text-brand-gold mb-2">
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "font-serif text-brand-green leading-tight",
          Tag === "h1" ? "text-3xl sm:text-5xl" : "text-2xl sm:text-4xl"
        )}
      >
        {title}
      </Tag>
      <BotanicalDivider className={cn("my-5", !centered && "justify-start")} />
      {lead && (
        <div className={cn("text-brand-green/80 leading-relaxed", centered && "max-w-2xl mx-auto")}>
          {lead}
        </div>
      )}
    </header>
  );
}
