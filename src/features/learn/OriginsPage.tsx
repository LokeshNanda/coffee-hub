import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { FlavourChips, ProcessChip } from '../../components/Chips';
import { origins, getOrigin, getVarietal, type Region } from '../../content';

// Rough continent outlines as [lon, lat] pairs, projected to a 100 x 50 equirectangular box.
const land: number[][][] = [
  [[-168, 66], [-140, 70], [-95, 75], [-70, 62], [-55, 47], [-75, 35], [-82, 25], [-97, 20], [-88, 16], [-83, 9], [-78, 7], [-85, 12], [-92, 15], [-105, 22], [-118, 32], [-125, 48], [-150, 60]],
  [[-78, 7], [-60, 10], [-50, 0], [-35, -8], [-40, -22], [-50, -30], [-58, -38], [-66, -50], [-72, -54], [-75, -45], [-71, -30], [-78, -10], [-80, 0]],
  [[-17, 15], [-10, 32], [10, 37], [30, 31], [43, 12], [51, 11], [40, -5], [35, -20], [32, -30], [20, -35], [15, -22], [10, -5], [8, 5], [-8, 5]],
  [[44, -13], [50, -15], [47, -25], [43, -23]],
  [[-10, 43], [-8, 36], [0, 38], [15, 38], [25, 40], [40, 45], [45, 40], [50, 28], [60, 25], [72, 20], [80, 8], [90, 22], [97, 15], [100, 5], [105, 10], [110, 20], [122, 30], [140, 40], [160, 55], [180, 60], [180, 70], [100, 78], [60, 70], [30, 70], [10, 62], [-5, 58]],
  [[95, 5], [100, 6], [110, 2], [120, 0], [130, 2], [135, 0], [140, -5], [150, -6], [146, -10], [132, -8], [120, -8], [106, -5]],
  [[114, -22], [130, -12], [142, -11], [153, -25], [148, -38], [140, -37], [130, -32], [116, -35]],
];
const px = (lon: number) => ((lon + 180) / 360) * 100;
const py = (lat: number) => ((90 - lat) / 180) * 100 * 0.5;

function inside(lon: number, lat: number, poly: number[][]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** A dot-matrix world: one dot per 2.4 degrees wherever a continent outline covers it. */
const dots: { x: number; y: number }[] = [];
for (let lat = 72; lat >= -56; lat -= 2.4) {
  for (let lon = -170; lon <= 180; lon += 2.4) {
    if (land.some((p) => inside(lon, lat, p))) dots.push({ x: px(lon), y: py(lat) });
  }
}

const regions: { id: Region | 'all'; name: string }[] = [
  { id: 'all', name: 'All' },
  { id: 'africa', name: 'Africa & Arabia' },
  { id: 'americas', name: 'Americas' },
  { id: 'asia-pacific', name: 'Asia Pacific' },
];

export function OriginsPage() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('o');
  const [region, setRegion] = useState<Region | 'all'>('all');
  const selected = selectedId ? getOrigin(selectedId) : undefined;
  const shown = origins.filter((o) => region === 'all' || o.region === region);

  const select = (id: string | null) => {
    if (id) setParams({ o: id });
    else setParams({});
  };

  return (
    <>
      <PageHead title="Origins" intro="Coffee grows in a belt around the equator. Tap a dot to see what that place tastes like." />

      <div className="seg scroll region-tabs" role="group" aria-label="Region">
        {regions.map((r) => (
          <button key={r.id} aria-pressed={region === r.id} onClick={() => setRegion(r.id)}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="map">
        <svg viewBox="0 14 100 30" role="img" aria-label="World map with coffee origins">
          <rect x="0" y="0" width="100" height="50" fill="var(--surface)" />
          <rect x="0" y={py(23.4)} width="100" height={py(-23.4) - py(23.4)} fill="var(--accent-soft)" opacity="0.5" />
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="0.42" fill="var(--text-3)" opacity="0.55" />
          ))}
          {shown.map((o) => {
            const on = o.id === selectedId;
            return (
              <g
                key={o.id}
                className="map-pin"
                transform={`translate(${o.map.x} ${o.map.y * 0.5})`}
                onClick={() => select(on ? null : o.id)}
                role="button"
                aria-label={o.name}
                aria-pressed={on}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && select(on ? null : o.id)}
              >
                <circle r={on ? 2.2 : 1.4} fill={on ? 'var(--cherry)' : 'var(--accent)'} stroke="var(--surface)" strokeWidth="0.4" />
                {on && (
                  <text y="-3" textAnchor="middle">
                    {o.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {selected ? (
        <section className="section card" style={{ marginTop: 16 }}>
          <div className="spread">
            <h2>{selected.name}</h2>
            <button className="btn small ghost" onClick={() => select(null)}>
              Close
            </button>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {selected.summary}
          </p>
          <div className="stat-row" style={{ margin: '12px 0', maxWidth: 220 }}>
            <div className="stat">
              <div className="v">
                {selected.altitudeM[0]}–{selected.altitudeM[1]}
              </div>
              <div className="k">metres</div>
            </div>
          </div>
          <h4>Tastes like</h4>
          <FlavourChips tags={selected.flavourTags} />
          <h4 style={{ marginTop: 12 }}>Typical processing</h4>
          <div className="chips">
            {selected.processes.map((p) => (
              <ProcessChip key={p} id={p} />
            ))}
          </div>
          <h4 style={{ marginTop: 12 }}>Varietals</h4>
          <div className="chips">
            {selected.varietals.map((v) => (
              <Link key={v} to="/learn/beans" className="chip">
                {getVarietal(v)?.name ?? v}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <ul className="list" style={{ marginTop: 16 }}>
          {shown.map((o) => (
            <li key={o.id}>
              <button className="rowcard" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => select(o.id)}>
                <span className="title">{o.name}</span>
                <span className="faint" style={{ fontSize: '0.8rem' }}>
                  {o.altitudeM[0]}–{o.altitudeM[1]} m
                </span>
                <span className="meta">{o.flavourTags.slice(0, 3).map((t) => t.replace(/-/g, ' ')).join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
