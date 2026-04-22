import { cn } from "@/lib/utils";

interface OrnamentProps {
  className?: string;
  title?: string;
}

export function BotanicalDivider({ className }: OrnamentProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-brand-green/70",
        className
      )}
      aria-hidden="true"
    >
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-brand-green/30 to-brand-green/30" />
      <svg
        width="48"
        height="16"
        viewBox="0 0 48 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 8 Q 12 2, 24 8 T 46 8"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
        <circle cx="24" cy="8" r="1.5" fill="currentColor" />
        <path
          d="M18 8 Q 16 4, 14 8 Q 16 12, 18 8 Z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M30 8 Q 32 4, 34 8 Q 32 12, 30 8 Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-brand-green/30 to-brand-green/30" />
    </div>
  );
}

export function BotanicalBranch({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <path d="M110 10 C 108 80, 112 160, 108 310" />
        <path d="M108 60 C 80 55, 55 70, 35 55" />
        <path d="M110 100 C 140 95, 170 110, 190 95" />
        <path d="M108 150 C 78 148, 52 160, 28 148" />
        <path d="M110 200 C 142 200, 168 212, 188 200" />
        <path d="M108 250 C 82 252, 58 265, 38 255" />
      </g>
      <g fill="currentColor" opacity="0.7">
        <ellipse cx="35" cy="55" rx="14" ry="6" transform="rotate(-20 35 55)" />
        <ellipse cx="190" cy="95" rx="14" ry="6" transform="rotate(15 190 95)" />
        <ellipse cx="28" cy="148" rx="15" ry="6" transform="rotate(-10 28 148)" />
        <ellipse cx="188" cy="200" rx="15" ry="6" transform="rotate(20 188 200)" />
        <ellipse cx="38" cy="255" rx="14" ry="6" transform="rotate(-25 38 255)" />
      </g>
      <g fill="currentColor" opacity="0.45">
        <circle cx="110" cy="10" r="3" />
        <circle cx="60" cy="62" r="2" />
        <circle cx="160" cy="102" r="2" />
        <circle cx="55" cy="152" r="2" />
        <circle cx="162" cy="205" r="2" />
        <circle cx="60" cy="258" r="2" />
      </g>
    </svg>
  );
}

export function BotanicalWreath({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M40 80 C 60 20, 160 10, 280 80" />
        <path d="M40 80 C 60 140, 160 150, 280 80" />
      </g>
      <g fill="currentColor" opacity="0.55">
        <ellipse cx="70" cy="45" rx="10" ry="4" transform="rotate(-45 70 45)" />
        <ellipse cx="110" cy="25" rx="10" ry="4" transform="rotate(-20 110 25)" />
        <ellipse cx="160" cy="18" rx="10" ry="4" />
        <ellipse cx="210" cy="25" rx="10" ry="4" transform="rotate(20 210 25)" />
        <ellipse cx="250" cy="45" rx="10" ry="4" transform="rotate(45 250 45)" />
        <ellipse cx="70" cy="115" rx="10" ry="4" transform="rotate(45 70 115)" />
        <ellipse cx="110" cy="135" rx="10" ry="4" transform="rotate(20 110 135)" />
        <ellipse cx="160" cy="142" rx="10" ry="4" />
        <ellipse cx="210" cy="135" rx="10" ry="4" transform="rotate(-20 210 135)" />
        <ellipse cx="250" cy="115" rx="10" ry="4" transform="rotate(-45 250 115)" />
      </g>
    </svg>
  );
}
