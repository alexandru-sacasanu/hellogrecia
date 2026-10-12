// P10 Icon. 24×24 line icons, colour from currentColor.
const PATHS = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.6 3.4-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  heart: <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.6a4.3 4.3 0 017.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  back: <path d="M15 5l-7 7 7 7" />,
  bed: <><path d="M3 18V7M3 14h18v4M21 14v-2.5A2.5 2.5 0 0018.5 9H11v5" /><circle cx="7" cy="11" r="1.8" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  boat: <><path d="M3 16l1.5 3.5h15L21 16H3z" /><path d="M12 3v13M12 4l6 10h-6M12 6l-5 8h5" /></>,
  ship: <><path d="M3 15l2 5h14l2-5H3z" /><path d="M6 15V10h12v5M9 10V6h6v4M11 6V3.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`icon ${className}`}>
      {PATHS[name]}
    </svg>
  );
}
