import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-brand-green/20 bg-white px-4 py-2.5 text-base text-brand-green focus:border-brand-gold focus:outline-none sm:text-sm";

export const primaryButton =
  "inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3 text-brand-beige transition-colors hover:bg-brand-green/90 disabled:opacity-60";

export const secondaryButton =
  "inline-flex items-center justify-center rounded-full border border-brand-green/30 px-6 py-3 text-brand-green transition-colors hover:border-brand-gold disabled:opacity-50";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Подсказка вне <label>, чтобы не попадать в доступное имя поля.
  return (
    <div className={className}>
      <label className="block">
        <span className="mb-1 block text-sm text-brand-green/85">{label}</span>
        {children}
      </label>
      {hint && <p className="mt-1 text-xs text-brand-green/55">{hint}</p>}
    </div>
  );
}

export function Notice({ tone, children }: { tone: "error" | "ok" | "info"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-3 py-2 text-sm",
        tone === "error" && "border-brand-poppy/30 bg-brand-poppy/5 text-brand-poppy",
        tone === "ok" && "border-brand-forest/30 bg-brand-forest/5 text-brand-forest",
        tone === "info" && "border-brand-gold/40 bg-brand-cream text-brand-green/80"
      )}
    >
      {children}
    </p>
  );
}
