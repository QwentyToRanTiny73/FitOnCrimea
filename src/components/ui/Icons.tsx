type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const HeartIcon = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
  </svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

export const HomeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />
  </svg>
);

export const CatalogIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const PointsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <circle cx="12" cy="5.5" r="2.5" />
    <path d="M12 8v6m-5-4 5 2 5-2m-7 10 2-6 2 6" />
    <circle cx="7" cy="10" r="0.9" fill="currentColor" />
    <circle cx="17" cy="10" r="0.9" fill="currentColor" />
  </svg>
);

export const MenuIcon = ({ className, open }: IconProps & { open?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);
