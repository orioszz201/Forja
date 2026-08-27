import type { CatalogItem, ItemType } from "../lib/types";
import { hashStr } from "../lib/types";
import { Icon, type IconName } from "./Icons";

const TYPE_ICON: Record<ItemType, IconName> = {
  product: "box",
  digital: "chip",
  service: "briefcase",
  booking: "calendar",
  quote: "draft",
};

function Pattern({ type, hue }: { type: ItemType; hue: number }) {
  const c = `hsl(${hue} 45% 30% / 0.16)`;
  switch (type) {
    case "product":
      return (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`p-${hue}-a`} width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.6" fill={c} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${hue}-a)`} />
        </svg>
      );
    case "digital":
      return (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`p-${hue}-b`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="16" stroke={c} strokeWidth="1.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${hue}-b)`} />
        </svg>
      );
    case "service":
      return (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`p-${hue}-c`} width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M0 13h10M16 13h10" stroke={c} strokeWidth="1.4" />
              <circle cx="13" cy="13" r="1.4" fill={c} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${hue}-c)`} />
        </svg>
      );
    case "booking":
      return (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`p-${hue}-d`} width="30" height="30" patternUnits="userSpaceOnUse">
              <rect x="4" y="4" width="9" height="9" fill="none" stroke={c} strokeWidth="1.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${hue}-d)`} />
        </svg>
      );
    case "quote":
      return (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`p-${hue}-e`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="14" stroke={c} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${hue}-e)`} />
        </svg>
      );
  }
}

export function ItemVisual({
  item,
  index,
  className = "",
  compact = false,
}: {
  item: CatalogItem;
  index?: number;
  className?: string;
  compact?: boolean;
}) {
  const h = hashStr(item.id);
  const rot = (h % 3) - 1; // -1 | 0 | 1
  const letter = item.name.replace(/^(La|El|Los|Las|De)\s+/i, "").charAt(0).toUpperCase();
  const base = `hsl(${item.hue} 42% 86%)`;
  const deep = `hsl(${item.hue} 48% 74%)`;
  const ink = `hsl(${item.hue} 55% 16%)`;

  return (
    <div
      className={`relative overflow-hidden border-2 border-ink ${className}`}
      style={{ background: `linear-gradient(135deg, ${base} 0%, ${deep} 100%)` }}
    >
      <Pattern type={item.type} hue={item.hue} />
      {/* big letter */}
      <span
        className="absolute -right-2 -bottom-4 font-display font-extrabold leading-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
        style={{ fontSize: compact ? "5.5rem" : "8.5rem", color: ink, opacity: 0.18, transform: `rotate(${rot * 6}deg)` }}
      >
        {letter}
      </span>
      {/* orbit ring */}
      <svg
        className="absolute -top-6 -right-6 opacity-25 anim-spin-slow"
        width="90"
        height="90"
        viewBox="0 0 90 90"
        aria-hidden
      >
        <circle cx="45" cy="45" r="34" fill="none" stroke={ink} strokeWidth="1.4" strokeDasharray="6 8" />
      </svg>
      {/* index + icon */}
      <span
        className="absolute top-2 left-2.5 font-mono text-[10px] font-semibold tracking-widest"
        style={{ color: ink, opacity: 0.75 }}
      >
        {index !== undefined ? `Nº ${String(index + 1).padStart(2, "0")}` : TYPE_ICON[item.type].toUpperCase()}
      </span>
      <span
        className="absolute bottom-2 right-2.5 flex h-7 w-7 items-center justify-center border"
        style={{ color: ink, borderColor: `${ink}55`, background: "rgba(255,255,255,0.35)" }}
      >
        <Icon name={TYPE_ICON[item.type]} size={15} />
      </span>
      {item.featured && !compact && (
        <span
          className="absolute top-2 right-2.5 font-mono text-[9px] font-semibold tracking-widest px-1.5 py-0.5"
          style={{ color: "#f7f8f2", background: ink }}
        >
          TOP
        </span>
      )}
    </div>
  );
}
