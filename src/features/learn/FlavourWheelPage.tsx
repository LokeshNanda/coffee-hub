import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { OriginChip, ProcessChip } from '../../components/Chips';
import { flavourWheel, flavourIndex, origins, processing, type FlavourNode } from '../../content';

interface Seg {
  id: string;
  name: string;
  family: string;
  depth: number;
  a0: number;
  a1: number;
  r0: number;
  r1: number;
  colour: string;
  leaf: boolean;
}

const R = [17, 50, 77, 100];

function layout(): Seg[] {
  const segs: Seg[] = [];
  const n = flavourWheel.length;
  const walk = (node: FlavourNode, a0: number, a1: number, depth: number, family: string, colour: string) => {
    const r0 = R[depth];
    const r1 = R[depth + 1] ?? R[R.length - 1];
    segs.push({ id: node.id, name: node.name, family, depth, a0, a1, r0, r1, colour, leaf: !node.children });
    if (node.children) {
      const span = (a1 - a0) / node.children.length;
      node.children.forEach((c, i) => walk(c, a0 + i * span, a0 + (i + 1) * span, depth + 1, family, shade(colour, depth + 1)));
    }
  };
  flavourWheel.forEach((f, i) => walk(f, (i / n) * Math.PI * 2, ((i + 1) / n) * Math.PI * 2, 0, f.id, f.colour ?? '#888'));
  return segs;
}

function shade(hex: string, depth: number): string {
  const p = parseInt(hex.slice(1), 16);
  const t = depth * 0.16;
  const ch = (s: number) => Math.round(((p >> s) & 255) + (255 - ((p >> s) & 255)) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/** Split "Nutty & cocoa" style names onto two lines; shorten long leaf names to fit their ring. */
function labelLines(s: Seg): string[] {
  if (s.name.includes(' & ')) return s.name.split(' & ');
  if (s.name.includes(' / ')) return [s.name.split(' / ')[0]];
  const max = s.depth === 0 ? 10 : s.depth === 1 ? 11 : 11;
  if (s.name.length > max) {
    const words = s.name.split(' ');
    if (words.length > 1) return words;
    return [s.name.slice(0, max - 1) + '…'];
  }
  return [s.name];
}

function arc(a0: number, a1: number, r0: number, r1: number): string {
  const p = (a: number, r: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(a0, r0)} L ${p(a0, r1)} A ${r1} ${r1} 0 ${large} 1 ${p(a1, r1)} L ${p(a1, r0)} A ${r0} ${r0} 0 ${large} 0 ${p(a0, r0)} Z`;
}

export function FlavourWheelPage() {
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag');
  const segs = useMemo(layout, []);
  const selected = tag ? flavourIndex.get(tag) : undefined;
  const family = selected ? selected.path[0] ?? selected.id : null;

  const choose = (id: string | null) => setParams(id ? { tag: id } : {});

  const related = useMemo(() => {
    if (!selected) return { origins: [], processes: [] };
    const match = (tags: string[]) => tags.some((t) => t === selected.id || flavourIndex.get(t)?.path.includes(selected.id));
    return {
      origins: origins.filter((o) => match(o.flavourTags)),
      processes: processing.filter((p) => match(p.flavourTags)),
    };
  }, [selected]);

  return (
    <>
      <PageHead title="Flavour wheel" intro="Tap a family to open it, then a flavour to see which origins and processes tend to taste that way." />

      <div className="wheel-wrap">
        <svg className="wheel" viewBox="-102 -102 204 204" role="group" aria-label="Flavour wheel">
          {segs.map((s) => {
            const dim = family !== null && s.family !== family;
            const hidden = family === null && s.depth > 1;
            if (hidden) return null;
            const mid = (s.a0 + s.a1) / 2;
            const rm = (s.r0 + s.r1) / 2;
            const deg = (mid * 180) / Math.PI;
            const flip = deg > 90 && deg < 270;
            const showLabel = s.depth === 0 ? family === null : !dim && (s.depth === 1 || family !== null);
            const isSel = selected?.id === s.id;
            return (
              <g key={s.id} onClick={() => choose(isSel ? null : s.id)}>
                <path
                  d={arc(s.a0, s.a1, s.r0, s.r1)}
                  fill={s.colour}
                  className={dim ? 'dim' : ''}
                  stroke={isSel ? 'var(--text)' : undefined}
                  strokeWidth={isSel ? 1.5 : undefined}
                >
                  <title>{s.name}</title>
                </path>
                {showLabel && (
                  <text
                    transform={`rotate(${deg}) translate(${rm} 0) rotate(${flip ? 180 : 0})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: s.depth === 0 ? 5.5 : s.depth === 1 ? 4.6 : 4, fill: s.depth >= 2 ? 'var(--ink)' : '#fff' }}
                  >
                    {labelLines(s).map((line, i, arr) => (
                      <tspan key={i} x="0" dy={i === 0 ? `${-(arr.length - 1) * 0.55}em` : '1.1em'}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                )}
              </g>
            );
          })}
          <g className="centre" onClick={() => choose(null)}>
            <circle r={R[0] - 1} fill="var(--surface)" stroke="var(--line)" />
            <text textAnchor="middle" dominantBaseline="middle">
              {family ? 'Back' : 'Taste'}
            </text>
          </g>
        </svg>

        {selected ? (
          <div className="card">
            <div className="spread">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: selected.colour, display: 'inline-block' }} />
                {selected.name}
              </h2>
              <button className="btn small ghost" onClick={() => choose(null)}>
                Clear
              </button>
            </div>
            {selected.path.length > 0 && (
              <p className="faint" style={{ fontSize: '0.85rem', margin: '4px 0 12px' }}>
                {selected.path.map((p) => flavourIndex.get(p)?.name).join(' › ')}
              </p>
            )}
            <h4>Origins that often taste like this</h4>
            {related.origins.length ? (
              <div className="chips">
                {related.origins.map((o) => (
                  <OriginChip key={o.id} id={o.id} />
                ))}
              </div>
            ) : (
              <p className="muted">No origin in the guide lists this one directly.</p>
            )}
            <h4 style={{ marginTop: 12 }}>Processes</h4>
            {related.processes.length ? (
              <div className="chips">
                {related.processes.map((p) => (
                  <ProcessChip key={p.id} id={p.id} />
                ))}
              </div>
            ) : (
              <p className="muted">Not tied to a process in particular.</p>
            )}
            <p style={{ marginTop: 14, marginBottom: 0 }}>
              <Link to={`/log/new?tag=${selected.id}`} className="btn small">
                Log a brew tasting of {selected.name.toLowerCase()}
              </Link>
            </p>
          </div>
        ) : (
          <p className="muted" style={{ textAlign: 'center' }}>
            The inner ring is the eight families. Open one to see its specific flavours.
          </p>
        )}
      </div>
    </>
  );
}
