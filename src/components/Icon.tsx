import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { name: string };

const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Small line icons. Stage icons share this set so journeys and nav look alike. */
export function Icon({ name, ...rest }: Props) {
  const paths = icons[name] ?? icons.dot;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...rest}>
      {paths}
    </svg>
  );
}

const icons: Record<string, React.ReactNode> = {
  dot: <circle cx="12" cy="12" r="3" />,
  // nav
  learn: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5V5.5" />
      <path d="M8 7h8M8 11h6" />
    </>
  ),
  brew: (
    <>
      <path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 4c0 1 1 1 1 2M11 3c0 1 1 1 1 2" />
    </>
  ),
  log: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  // stage icons
  cherry: (
    <>
      <circle cx="9" cy="15" r="4" />
      <circle cx="16" cy="16" r="3.5" />
      <path d="M9 11c0-4 3-7 8-8M16 12.5c0-3 1-6 1-6" />
    </>
  ),
  water: (
    <>
      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />
      <path d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  tank: (
    <>
      <path d="M6 4h12v13a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
      <path d="M6 9h12" />
      <circle cx="10" cy="14" r="1" />
      <circle cx="14" cy="16" r="1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 13H7z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  hand: (
    <>
      <path d="M8 12V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7" />
      <path d="M17 13v1a6 6 0 0 1-6 6h-1a5 5 0 0 1-5-5v-3a1.5 1.5 0 0 1 3 0v1" />
    </>
  ),
  raisin: (
    <>
      <ellipse cx="12" cy="13" rx="6" ry="7" />
      <path d="M9 9c1 2 1 6 0 8M12 7c1 3 1 9 0 12M15 9c-1 2-1 6 0 8" />
    </>
  ),
  honey: (
    <>
      <path d="M8 3h8l3 7-3 11H8L5 10z" />
      <path d="M9 12c1 2 1 4 0 6M14 11c1 2 0 5 0 7" />
    </>
  ),
  wind: (
    <>
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 13h15a3 3 0 1 1-3 3" />
      <path d="M3 18h7" />
    </>
  ),
  ship: (
    <>
      <path d="M3 16l1.5 3h15L21 16" />
      <path d="M4 16l8-3 8 3" />
      <path d="M8 13V7h8v6M12 7V4" />
    </>
  ),
  fire: (
    <>
      <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-6 1-9z" />
    </>
  ),
  cup: (
    <>
      <path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M4 21h14" />
    </>
  ),
  bean: (
    <>
      <ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(-25 12 12)" />
      <path d="M9 6c3 3 3 9 6 12" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-6 1-9z" />
    </>
  ),
  grind: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16" />
    </>
  ),
  wheel: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h5a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7" />
    </>
  ),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  check: <path d="M5 12l5 5 9-10" />,
  play: <path d="M7 5v14l11-7z" fill="currentColor" />,
  pause: <path d="M8 5v14M16 5v14" strokeWidth={3} />,
  next: <path d="M6 5v14l9-7zM18 5v14" />,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  upload: <path d="M12 15V4M7 8l5-5 5 5M5 20h14" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  edit: <path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4" />,
  repeat: <path d="M17 2l4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4M21 13v3a2 2 0 0 1-2 2H3" />,
  calc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 2h6" />
    </>
  ),
};
