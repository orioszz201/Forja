import type { JSX } from "react";

export type IconName =
  | "bag" | "chip" | "network" | "grid" | "briefcase" | "wrench" | "calendar"
  | "cloche" | "draft" | "layers" | "search" | "heart" | "cart" | "star"
  | "plus" | "minus" | "x" | "arrowRight" | "arrowLeft" | "check" | "clock"
  | "tag" | "sliders" | "pencil" | "spark" | "card" | "phone" | "mail"
  | "chevronDown" | "user" | "refresh" | "bolt" | "box" | "hammer" | "pin";

const PATHS: Record<IconName, JSX.Element> = {
  bag: (<><path d="M5.5 8.5h13l-1 11.5a1.8 1.8 0 0 1-1.8 1.5H8.3a1.8 1.8 0 0 1-1.8-1.5Z" /><path d="M8.8 8.2V7a3.2 3.2 0 0 1 6.4 0v1.2" /></>),
  chip: (<><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" /></>),
  network: (<><circle cx="6" cy="6.5" r="2.6" /><circle cx="18" cy="6.5" r="2.6" /><circle cx="12" cy="17.5" r="2.6" /><path d="M7.8 8.4l2.8 6.6M16.2 8.4l-2.8 6.6M8.6 6.5h6.8" /></>),
  grid: (<><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>),
  briefcase: (<><rect x="3.5" y="7.5" width="17" height="12.5" rx="1.6" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17M12 11v3" /></>),
  wrench: (<><path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7A1.9 1.9 0 0 0 6.7 19.4l5.2-5.2a4 4 0 0 0 5-5.3L14 11.8 11.6 9.4Z" /><path d="M5.4 18l-.7.7" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15.5" rx="1.6" /><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" /></>),
  cloche: (<><path d="M4 16.5a8 8 0 0 1 16 0Z" /><path d="M2.8 16.5h18.4M12 8.5V7M3.8 19.5h16.4" /></>),
  draft: (<><path d="M6 3.5h9l3.5 3.5v13.5H6Z" /><path d="M15 3.5V7h3.5M9 12h6M9 15.5h6M9 8.5h2.5" /></>),
  layers: (<><path d="M12 3.5 21 8l-9 4.5L3 8Z" /><path d="m4.5 11.5-1.5.8 9 4.4 9-4.4-1.5-.8M4.5 15.7 3 16.5l9 4.4 9-4.4-1.5-.8" /></>),
  search: (<><circle cx="10.5" cy="10.5" r="6" /><path d="m15.2 15.2 4.8 4.8" /></>),
  heart: (<><path d="M12 20s-7.5-4.6-9.3-9.3C1.5 7.5 3.6 4.5 6.8 4.5c2 0 3.6 1.1 4.4 2.7l.8 1.5.8-1.5c.8-1.6 2.4-2.7 4.4-2.7 3.2 0 5.3 3 4.1 6.2C19.5 15.4 12 20 12 20Z" /></>),
  cart: (<><path d="M3.5 4.5h2.2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h7.9a1.6 1.6 0 0 0 1.6-1.3l1.5-7.2H6.4" /><circle cx="10" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></>),
  star: (<><path d="m12 3.6 2.5 5.2 5.7.7-4.2 4 1.1 5.6L12 16.4l-5.1 2.7 1.1-5.6-4.2-4 5.7-.7Z" /></>),
  plus: (<><path d="M12 5v14M5 12h14" /></>),
  minus: (<><path d="M5 12h14" /></>),
  x: (<><path d="m6 6 12 12M18 6 6 18" /></>),
  arrowRight: (<><path d="M4 12h15M13.5 6l6 6-6 6" /></>),
  arrowLeft: (<><path d="M20 12H5M10.5 6l-6 6 6 6" /></>),
  check: (<><path d="m4.5 12.5 5 5L19.5 6.5" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.4 2" /></>),
  tag: (<><path d="M4 4h7l9 9-7 7-9-9Z" /><circle cx="8.5" cy="8.5" r="1.3" /></>),
  sliders: (<><path d="M4 7h9M17 7h3M4 17h3M11 17h9M4 12h16" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>),
  pencil: (<><path d="m14.5 5 4.5 4.5L8.5 20H4v-4.5Z" /><path d="m12.5 7 4.5 4.5" /></>),
  spark: (<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.4 2.4M15.6 15.6 18 18M18 6l-2.4 2.4M8.4 15.6 6 18" /></>),
  card: (<><rect x="3" y="5.5" width="18" height="13" rx="1.8" /><path d="M3 10h18M6.5 14.5h4" /></>),
  phone: (<><path d="M7.5 3.5h3l1.3 4-2 1.5a12 12 0 0 0 5.2 5.2l1.5-2 4 1.3v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 5.5 5.6a2 2 0 0 1 2-2.1Z" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="1.6" /><path d="m4.5 7.5 7.5 6 7.5-6" /></>),
  chevronDown: (<><path d="m6 9.5 6 6 6-6" /></>),
  user: (<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>),
  refresh: (<><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L20 9.5" /><path d="M20 4.5v5h-5" /></>),
  bolt: (<><path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5Z" /></>),
  box: (<><path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4Z" /><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9" /></>),
  hammer: (<><path d="m13.5 7.5 6 6-2.5 2.5-6-6Z" /><path d="M4.5 20.5 11 14M8 4.5 5.5 7a3 3 0 0 0 0 4.2l2.3 2.3 5-5-2.3-2.3A3 3 0 0 0 8 4.5Z" /></>),
  pin: (<><path d="M12 21s-6.5-5.7-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.3 12 21 12 21Z" /><circle cx="12" cy="10.3" r="2.3" /></>),
};

export function Icon({
  name,
  size = 18,
  className = "",
  filled = false,
  strokeWidth = 1.7,
}: {
  name: IconName;
  size?: number;
  className?: string;
  filled?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
