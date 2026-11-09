import type { SVGProps } from "react";

const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
type P = SVGProps<SVGSVGElement>;

export const SearchIcon = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>);
export const BagIcon = (p: P) => (<svg {...base} {...p}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 016 0V8" /></svg>);
export const MenuIcon = (p: P) => (<svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const CloseIcon = (p: P) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const PlusIcon = (p: P) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>);
export const MinusIcon = (p: P) => (<svg {...base} {...p}><path d="M5 12h14" /></svg>);
export const TrashIcon = (p: P) => (<svg {...base} {...p}><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const TruckIcon = (p: P) => (<svg {...base} {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" /><circle cx="7.5" cy="17" r="1.8" /><circle cx="17" cy="17" r="1.8" /></svg>);
export const ShieldIcon = (p: P) => (<svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2.2 2.2L15.5 10" /></svg>);
export const LeafIcon = (p: P) => (<svg {...base} {...p}><path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14z" /><path d="M5 19l8-8" /></svg>);
export const GridIcon = (p: P) => (<svg {...base} {...p}><rect x="4" y="4" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" /></svg>);
export const ArrowIcon = (p: P) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const FilterIcon = (p: P) => (<svg {...base} {...p}><path d="M4 7h16M7 12h10M10 17h4" /></svg>);

export function Logo({ name, url, className = "" }: { name: string; url?: string; className?: string }) {
  if (url) return <img src={url} alt={name} className={`h-8 w-auto ${className}`} />;
  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight ${className}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#55653A" />
        <path d="M20 44c0-14 8-22 24-24-1 16-9 24-24 24zm0 0l14-14" fill="none" stroke="#FAF8F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xl">{name}</span>
    </span>
  );
}
