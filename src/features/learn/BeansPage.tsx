import { useState } from 'react';
import { PageHead } from '../../components/PageHead';
import { Markdown } from '../../components/Markdown';
import { Bars } from '../../components/Bars';
import { OriginChip } from '../../components/Chips';
import { prose, varietals } from '../../content';

const species = [
  { id: 'arabica', name: 'Arabica', caffeine: 1.2, sweetness: 4, acidity: 4, body: 3, bitterness: 2, hardiness: 2 },
  { id: 'robusta', name: 'Robusta', caffeine: 2.2, sweetness: 2, acidity: 1, body: 5, bitterness: 5, hardiness: 5 },
] as const;

export function BeansPage() {
  const [filter, setFilter] = useState<'all' | 'arabica' | 'robusta' | 'liberica'>('all');
  const list = varietals.filter((v) => filter === 'all' || v.species === filter);
  return (
    <>
      <PageHead title="Beans & varietals" intro="Two species carry the coffee world, and a few dozen cultivars decide what a bag can taste like." />

      <section className="section">
        <h2>Arabica against robusta</h2>
        <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {species.map((s) => (
            <div className="card" key={s.id}>
              <h3>{s.name}</h3>
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                About {s.caffeine}% caffeine
              </p>
              <Bars
                bars={[
                  { label: 'Sweetness', value: s.sweetness },
                  { label: 'Acidity', value: s.acidity },
                  { label: 'Body', value: s.body },
                  { label: 'Bitterness', value: s.bitterness },
                  { label: 'Hardiness', value: s.hardiness, colour: 'var(--leaf)' },
                ]}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <Markdown text={prose.species.body} />
      </section>

      <section className="section">
        <h2>Varietals</h2>
        <div className="seg" role="group" aria-label="Filter by species" style={{ marginBottom: 12 }}>
          {(['all', 'arabica', 'robusta', 'liberica'] as const).map((s) => (
            <button key={s} aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <ul className="list">
          {list.map((v) => (
            <li key={v.id} className="card">
              <div className="spread">
                <h3>{v.name}</h3>
                <span className="faint" style={{ fontSize: '0.8rem' }}>
                  {v.species}
                </span>
              </div>
              <p className="muted" style={{ fontSize: '0.92rem', margin: '6px 0 10px' }}>
                {v.notes}
              </p>
              <div className="chips">
                {v.origins.map((o) => (
                  <OriginChip key={o} id={o} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
