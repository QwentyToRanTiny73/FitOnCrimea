/**
 * Эмблема главного экрана по мотивам брошюры: крымское море и солнце
 * в венке из мака, колокольчиков и ромашек. Чистый SVG — без загрузки фото.
 */
const Poppy = ({ x, y, r = 9 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy={-r * 0.55} rx={r * 0.62} ry={r * 0.7} fill="#D04A3A" opacity=".9" transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.28} fill="#3a2a2a" />
  </g>
);

const Chamomile = ({ x, y, r = 7 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => (
      <ellipse key={a} cx="0" cy={-r * 0.7} rx={r * 0.22} ry={r * 0.55} fill="#fff" stroke="#e7e1d4" strokeWidth=".4" transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.32} fill="#E2B33C" />
  </g>
);

const Bell = ({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M0 0c-6 2-8 10-7 16l3-2 2 3 2-3 2 3 2-3 3 2c1-6-1-14-7-16Z" fill="#A89AC8" />
    <path d="M0 0v-6" stroke="#3F6B4E" strokeWidth="1.2" />
  </g>
);

const Leaf = ({ x, y, rot }: { x: number; y: number; rot: number }) => (
  <ellipse cx={x} cy={y} rx="9" ry="3.2" fill="#3F6B4E" opacity=".75" transform={`rotate(${rot} ${x} ${y})`} />
);

export function HeroEmblem({ className }: { className?: string }) {
  // Листья по окружности венка
  const leaves = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    return { x: 160 + Math.cos(a) * 128, y: 160 + Math.sin(a) * 128, rot: (a * 180) / Math.PI + 90 + (i % 2 ? 25 : -25) };
  });

  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="Крымское море и солнце в венке из полевых цветов">
      <defs>
        <linearGradient id="he-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7EBDD" />
          <stop offset=".55" stopColor="#E9DCEB" />
          <stop offset="1" stopColor="#C9D6E6" />
        </linearGradient>
        <linearGradient id="he-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7E8FC4" />
          <stop offset="1" stopColor="#3E7F86" />
        </linearGradient>
        <clipPath id="he-clip">
          <circle cx="160" cy="160" r="118" />
        </clipPath>
      </defs>

      <g clipPath="url(#he-clip)">
        <rect width="320" height="320" fill="url(#he-sky)" />
        <circle cx="200" cy="150" r="30" fill="#E9B872" opacity=".85" />
        <path d="M30 175c40-40 80-55 120-48s70 25 140 20v40H30Z" fill="#8E86B5" opacity=".7" />
        <path d="M60 185c20-18 50-30 80-24 18 4 30 14 30 24Z" fill="#B59B6E" opacity=".9" />
        <path d="M214 190l8-46 10-6 6 14 4 38Z" fill="#C8A96E" />
        <rect y="186" width="320" height="140" fill="url(#he-sea)" />
        <path d="M30 228c30-10 50 6 80-2s50-10 80 0 50 6 100-4" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" />
        <path d="M30 252c40-10 60 4 100-2s60-8 90 0 40 4 80-4" stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" fill="none" />
      </g>
      <circle cx="160" cy="160" r="118" fill="none" stroke="#C8A96E" strokeWidth="1.5" />

      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      <Bell x={56} y={110} rot={-30} />
      <Bell x={44} y={150} rot={-10} />
      <Bell x={70} y={250} rot={30} />
      <Poppy x={272} y={196} r={14} />
      <Poppy x={250} y={244} r={9} />
      <Chamomile x={120} y={286} r={10} />
      <Chamomile x={160} y={292} r={12} />
      <Chamomile x={200} y={286} r={10} />
      <Chamomile x={262} y={92} r={7} />
      <circle cx="226" cy="38" r="4" fill="#D04A3A" />
      <circle cx="226" cy="38" r="1.2" fill="#2b2b2b" />
    </svg>
  );
}
