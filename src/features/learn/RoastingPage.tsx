import { useState } from 'react';
import { PageHead } from '../../components/PageHead';
import { Bars } from '../../components/Bars';
import { Markdown } from '../../components/Markdown';
import { MethodChip } from '../../components/Chips';
import { roasts, roastForPosition, prose } from '../../content';

/** Interpolate between the two nearest named roasts for a smooth slider. */
export function roastAt(position: number) {
  const sorted = roasts;
  let lo = sorted[0];
  let hi = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (position >= sorted[i].position && position <= sorted[i + 1].position) {
      lo = sorted[i];
      hi = sorted[i + 1];
      break;
    }
  }
  const span = hi.position - lo.position || 1;
  const t = Math.min(1, Math.max(0, (position - lo.position) / span));
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    colour: mixHex(lo.colour, hi.colour, t),
    acidity: mix(lo.acidity, hi.acidity),
    body: mix(lo.body, hi.body),
    sweetness: mix(lo.sweetness, hi.sweetness),
    bitterness: mix(lo.bitterness, hi.bitterness),
  };
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const x = (pa >> shift) & 255;
    const y = (pb >> shift) & 255;
    return Math.round(x + (y - x) * t);
  };
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

export function RoastingPage() {
  const [pos, setPos] = useState(40);
  const named = roastForPosition(pos);
  const live = roastAt(pos);

  return (
    <>
      <PageHead title="Roasting" intro="Drag the slider. The bean, the colour and the taste profile follow it." />

      <div className="roast-panel" style={{ backgroundColor: live.colour }}>
        <div className="bean" style={{ ['--bean' as string]: live.colour, filter: 'brightness(1.25)' }} aria-hidden="true" />
        <div>
          <h2>{named.name} roast</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.92rem' }}>{named.surface}</p>
        </div>
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Roast level" />
        <div className="slider-labels">
          <span>Light</span>
          <span>Medium</span>
          <span>Dark</span>
        </div>
        <Bars
          bars={[
            { label: 'Acidity', value: live.acidity },
            { label: 'Sweetness', value: live.sweetness },
            { label: 'Body', value: live.body },
            { label: 'Bitterness', value: live.bitterness },
          ]}
        />
        <p style={{ margin: 0 }}>{named.description}</p>
        <div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 6 }}>Suits</div>
          <div className="chips">
            {named.suits.map((m) => (
              <MethodChip key={m} id={m} />
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <h2>The named levels</h2>
        <ul className="list">
          {roasts.map((r) => (
            <li key={r.id}>
              <button className="rowcard" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setPos(r.position)}>
                <span className="title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: r.colour, display: 'inline-block' }} />
                  {r.name}
                </span>
                <span className="faint" style={{ fontSize: '0.8rem' }}>
                  {r.position}
                </span>
                <span className="meta">{r.surface}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <Markdown text={prose.roastingScience.body} />
      </section>
    </>
  );
}
