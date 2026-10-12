import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { method: string };

/** Line illustrations of each brewer, drawn on a 64 x 64 grid. */
export function DeviceIcon({ method, ...rest }: Props) {
  const body = devices[method] ?? devices.cup;
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {body}
    </svg>
  );
}

const devices: Record<string, React.ReactNode> = {
  moka: (
    <>
      <path d="M22 10h20l-2 8H24z" />
      <path d="M20 18h24l3 18H17z" />
      <path d="M17 36h30v4l-4 14H21l-4-14z" />
      <path d="M47 24h6a3 3 0 0 1 0 6h-6" />
      <path d="M24 46h16" />
      <path d="M32 2v6" />
    </>
  ),
  v60: (
    <>
      <path d="M10 18h44l-18 24h-8z" />
      <path d="M16 18l-2-4h36l-2 4" />
      <path d="M24 42h16v6H24z" />
      <path d="M14 48h36v8a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" />
      <path d="M26 24l4 10M38 24l-4 10" strokeOpacity="0.5" />
    </>
  ),
  chemex: (
    <>
      <path d="M18 6h28l-10 22 12 22a4 4 0 0 1-4 6H20a4 4 0 0 1-4-6l12-22z" />
      <path d="M22 28h20" />
      <path d="M22 30c0 4 2 6 6 6h8c4 0 6-2 6-6" strokeOpacity="0.5" />
      <path d="M42 6v4M22 6v4" />
    </>
  ),
  kalita: (
    <>
      <path d="M12 16h40l-6 22H18z" />
      <path d="M18 38h28v4H18z" />
      <path d="M22 16c0 3 2 5 2 8M32 16c0 3 2 5 2 8M42 16c0 3 2 5 2 8" strokeOpacity="0.5" />
      <path d="M14 46h36v8a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" />
      <path d="M26 42h12v4H26z" />
    </>
  ),
  'french-press': (
    <>
      <path d="M18 14h28v40a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" />
      <path d="M32 4v18" />
      <path d="M26 4h12" />
      <path d="M20 22h24" />
      <path d="M20 40h24" strokeOpacity="0.5" />
      <path d="M46 24h6a4 4 0 0 1 0 8h-6" />
    </>
  ),
  aeropress: (
    <>
      <path d="M22 8h20v6H22z" />
      <path d="M26 14h12v18H26z" />
      <path d="M18 32h28v16a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" />
      <path d="M16 52h32" />
      <path d="M24 56h16v4H24z" />
      <path d="M22 40h20" strokeOpacity="0.5" />
    </>
  ),
  espresso: (
    <>
      <path d="M10 10h44v12H10z" />
      <path d="M22 22v6h20v-6" />
      <path d="M18 28h28l-2 6H20z" />
      <path d="M12 34h4v16h-4zM48 34h4v16h-4z" />
      <path d="M26 40h12v10a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3z" />
      <path d="M28 34v6M36 34v6" strokeOpacity="0.5" />
      <path d="M8 56h48" />
    </>
  ),
  cup: (
    <>
      <path d="M14 22h30v16a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z" />
      <path d="M44 26h4a6 6 0 0 1 0 12h-4" />
      <path d="M22 8c0 3 3 3 3 6M32 6c0 3 3 3 3 6" />
    </>
  ),
};
