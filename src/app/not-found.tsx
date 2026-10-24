import Link from "next/link";
import { primaryButton } from "@/components/ui/Form";
import { BotanicalWreath } from "@/components/ui/Botanical";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <BotanicalWreath className="mx-auto mb-4 h-14 text-brand-gold" />
      <p className="mb-2 text-xs uppercase tracking-widest text-brand-gold">404</p>
      <h1 className="font-serif text-4xl text-brand-green">Страница не найдена</h1>
      <p className="mt-4 text-brand-green/75">Возможно, адрес изменился. Загляните в каталог.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/catalog" className={primaryButton}>
          В каталог
        </Link>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 text-brand-green underline decoration-brand-gold underline-offset-4">
          На главную
        </Link>
      </div>
    </div>
  );
}
