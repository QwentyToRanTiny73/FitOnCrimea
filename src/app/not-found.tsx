import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="uppercase tracking-widest text-xs text-brand-gold mb-3">
        404
      </p>
      <h1 className="font-serif text-4xl text-brand-green">
        Страница не найдена
      </h1>
      <p className="mt-4 text-brand-green/75">
        Возможно, она была перемещена или её ещё не существует.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 px-6 py-2 rounded-full bg-brand-green text-brand-beige"
      >
        На главную
      </Link>
    </div>
  );
}
