import Image from "next/image";
import { assetUrl, cn } from "@/lib/utils";

/**
 * Элементы оформления по мотивам брошюры «Целебные бальзамы Крыма».
 * Всё рисуется в SVG/CSS, поэтому чётко на любом экране и почти ничего не весит.
 */

/** Эмблема бренда: солнце над морем и зелёные листья в золотом круге. */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="em-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="1" stopColor="#f6c35a" />
        </linearGradient>
        <clipPath id="em-clip">
          <circle cx="32" cy="32" r="26" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#2f7a3a" />
      <circle cx="32" cy="32" r="28" fill="#d9a93c" />
      <g clipPath="url(#em-clip)">
        <rect width="64" height="64" fill="url(#em-sky)" />
        <circle cx="25" cy="36" r="10" fill="#ef8a22" />
        <rect y="36" width="64" height="30" fill="#2c6fb0" />
        {[40, 45, 50, 55].map((y) => (
          <path key={y} d={`M2 ${y}h34`} stroke="#bfe0f5" strokeWidth="1.6" strokeLinecap="round" />
        ))}
        <path d="M38 60c-4-16 2-30 16-40-6 12-7 24-5 38Z" fill="#2e8b3e" />
        <path d="M44 60c-1-13 4-24 14-31-4 10-5 20-4 31Z" fill="#6dbf4b" />
        <path d="M33 60c-5-12-4-24 4-34-2 11-1 22 3 32Z" fill="#1f6b33" />
      </g>
    </svg>
  );
}

/** Зелёная лента со слоганом — как над логотипом на обложке. */
export function Ribbon({ text, className }: { text: string; className?: string }) {
  return (
    <svg viewBox="0 0 360 86" className={className} role="img" aria-label={text}>
      <defs>
        <linearGradient id="rb-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f8f45" />
          <stop offset=".55" stopColor="#2a6a31" />
          <stop offset="1" stopColor="#1e5226" />
        </linearGradient>
        <path id="rb-arc" d="M40 62 Q180 6 320 62" />
      </defs>
      {/* загнутые концы */}
      <path d="M8 58 30 44 40 76 18 74 26 66Z" fill="#1e5226" />
      <path d="M352 58 330 44 320 76 342 74 334 66Z" fill="#1e5226" />
      {/* полоса */}
      <path d="M28 44 Q180 -12 332 44 L322 76 Q180 22 38 76Z" fill="url(#rb-band)" stroke="#8cc46c" strokeWidth="1.2" />
      <text fontSize="17" fill="#f5e6b8" fontFamily="var(--font-serif), Georgia, serif" letterSpacing="1.5">
        <textPath href="#rb-arc" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/** Золотые силуэты полевых трав, как внизу страниц брошюры. */
export function Meadow({ className, tone = "text-brand-amber" }: { className?: string; tone?: string }) {
  // Детерминированный «случайный» ряд: одинаков на сервере и в браузере.
  const stems = Array.from({ length: 34 }, (_, i) => {
    const x = 8 + i * 29 + ((i * 37) % 13);
    const h = 40 + ((i * 53) % 46);
    const bend = ((i * 29) % 17) - 8;
    return { x, h, bend, kind: i % 5 };
  });
  return (
    <svg viewBox="0 0 1000 110" preserveAspectRatio="xMidYMax slice" className={cn("pointer-events-none", tone, className)} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        {stems.map(({ x, h, bend }, i) => (
          <path key={`s${i}`} d={`M${x} 110 Q${x + bend} ${110 - h / 2} ${x + bend * 1.6} ${110 - h}`} />
        ))}
      </g>
      <g fill="currentColor">
        {stems.map(({ x, h, bend, kind }, i) => {
          const cx = x + bend * 1.6;
          const cy = 110 - h;
          if (kind === 0)
            return (
              <g key={`f${i}`} transform={`translate(${cx} ${cy})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <ellipse key={a} cx="0" cy="-5" rx="2" ry="4.5" transform={`rotate(${a})`} />
                ))}
              </g>
            );
          if (kind === 2)
            return (
              <g key={`f${i}`} transform={`translate(${cx} ${cy})`}>
                {[-8, -4, 0, 4, 8].map((dx) => (
                  <circle key={dx} cx={dx} cy={-Math.abs(dx) / 2 - 2} r="1.8" />
                ))}
              </g>
            );
          if (kind === 4) return <ellipse key={`f${i}`} cx={cx} cy={cy} rx="2.6" ry="7" transform={`rotate(${bend * 3} ${cx} ${cy})`} />;
          return <ellipse key={`f${i}`} cx={cx + 4} cy={cy + 14} rx="5" ry="2" transform={`rotate(-35 ${cx + 4} ${cy + 14})`} />;
        })}
      </g>
    </svg>
  );
}

/** Акварель в рамке почтовой марки. */
export function StampImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "(max-width: 640px) 80vw, 360px",
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("stamp inline-block", className)}>
      <Image src={assetUrl(src)} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
    </figure>
  );
}

const ARC_TOP = "M47 100 A53 53 0 0 1 153 100";
const ARC_BOTTOM = "M45 100 A55 55 0 0 0 155 100";

/**
 * Восьмигранная деревянная баночка «Крымский бальзам» с круглой этикеткой —
 * плейсхолдер, пока у товара нет фото.
 */
export function OctagonJar({ name, label = "#1f8a70", className }: { name: string; label?: string; className?: string }) {
  // Одинаковые определения у всех баночек, поэтому общие id безопасны.
  const id = "jar";
  const title = name.toUpperCase();
  const fs = Math.min(10, 150 / Math.max(title.length, 8));
  const oct = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => {
      const a = (Math.PI / 4) * i + Math.PI / 8;
      return `${100 + 92 * Math.cos(a)},${100 + 92 * Math.sin(a)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`Баночка бальзама «${name}»`}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d58448" />
          <stop offset=".5" stopColor="#b25e2b" />
          <stop offset="1" stopColor="#c8743b" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <polygon points={oct} />
        </clipPath>
        <path id={`${id}t`} d={ARC_TOP} />
        <path id={`${id}b`} d={ARC_BOTTOM} />
      </defs>
      <polygon points={oct} fill={`url(#${id}w)`} stroke="#7d3e18" strokeWidth="2" />
      {/* волокна дерева и мелкий цветочный орнамент */}
      <g stroke="#7d3e18" strokeOpacity=".28" fill="none" strokeWidth="1.1" clipPath={`url(#${id}c)`}>
        {[26, 44, 62, 138, 156, 174].map((y) => (
          <path key={y} d={`M12 ${y} q40 -7 88 0 t88 0`} />
        ))}
      </g>
      <g fill="#7d3e18" opacity=".3">
        {[
          [36, 40],
          [164, 46],
          [30, 158],
          [168, 160],
        ].map(([x, y]) => (
          <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-3.5" rx="1.8" ry="3.2" transform={`rotate(${a})`} />
            ))}
          </g>
        ))}
      </g>
      {/* этикетка */}
      <circle cx="100" cy="100" r="66" fill="#f3e9c9" stroke="#8a6118" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="63" fill={label} />
      <circle cx="100" cy="100" r="42" fill="#fffdf5" stroke="#d9a93c" strokeWidth="2" />
      <text fontSize="10" fill="#fff" fontWeight="700" letterSpacing="1.2" fontFamily="var(--font-inter), Arial, sans-serif" dominantBaseline="middle">
        <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">
          КРЫМСКИЙ БАЛЬЗАМ
        </textPath>
      </text>
      <text fontSize={fs} fill="#fff" fontWeight="700" letterSpacing=".8" fontFamily="var(--font-inter), Arial, sans-serif" dominantBaseline="middle">
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">
          {title}
        </textPath>
      </text>
      <g transform="translate(70 70) scale(.94)">
        <Emblem />
      </g>
      <ellipse cx="78" cy="62" rx="26" ry="10" fill="#fff" opacity=".18" transform="rotate(-30 78 62)" />
    </svg>
  );
}
