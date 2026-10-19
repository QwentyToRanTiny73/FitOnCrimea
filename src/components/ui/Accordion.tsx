import { cn } from "@/lib/utils";

/** Нативный <details>: работает без JavaScript и доступен с клавиатуры. */
export function Accordion({
  title,
  children,
  defaultOpen,
  className,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn("group border-b border-brand-green/15 py-4 [&_summary::-webkit-details-marker]:hidden", className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="font-serif text-lg sm:text-xl text-brand-green">{title}</span>
        <span
          aria-hidden="true"
          className="text-2xl leading-none text-brand-gold transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pt-3 text-brand-green/85 leading-relaxed">{children}</div>
    </details>
  );
}
