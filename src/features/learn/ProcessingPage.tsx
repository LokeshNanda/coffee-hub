import { useSearchParams } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { Journey } from '../../components/Journey';
import { Bars } from '../../components/Bars';
import { FlavourChips, OriginChip } from '../../components/Chips';
import { processing, getProcess } from '../../content';

export function ProcessingPage() {
  const [params, setParams] = useSearchParams();
  const id = params.get('p') ?? processing[0].id;
  const current = getProcess(id) ?? processing[0];

  return (
    <>
      <PageHead title="Processing" intro="What happens between picking the cherry and bagging the green bean shapes the cup more than most people expect." />

      <div className="seg scroll" role="group" aria-label="Processing method" style={{ marginBottom: 16, display: 'flex' }}>
        {processing.map((p) => (
          <button key={p.id} aria-pressed={p.id === current.id} onClick={() => setParams({ p: p.id })} style={{ whiteSpace: 'nowrap' }}>
            {shortName[p.id] ?? p.name}
          </button>
        ))}
      </div>

      <h2 style={{ marginBottom: 6 }}>{current.name}</h2>
      <p className="muted">{current.summary}</p>

      <Journey stages={current.stages} resetKey={current.id} />

      <section className="section">
        <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="card">
            <h4>Cup character</h4>
            <Bars
              bars={[
                { label: 'Clarity', value: current.cupCharacter.clarity },
                { label: 'Body', value: current.cupCharacter.body },
                { label: 'Fruitiness', value: current.cupCharacter.fruitiness, colour: 'var(--cherry)' },
                { label: 'Sweetness', value: current.cupCharacter.sweetness },
              ]}
            />
          </div>
          <div className="card">
            <h4>Typical flavours</h4>
            <FlavourChips tags={current.flavourTags} />
            <h4 style={{ marginTop: 14 }}>Common in</h4>
            <div className="chips">
              {current.commonIn.map((o) => (
                <OriginChip key={o} id={o} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Side by side</h2>
        <div className="table-scroll">
          <table className="compare">
            <thead>
              <tr>
                <th>Method</th>
                <th>Fruit stays on</th>
                <th>Clarity</th>
                <th>Body</th>
                <th>Fruit</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {processing.map((p) => (
                <tr key={p.id} style={p.id === current.id ? { background: 'var(--accent-soft)' } : undefined}>
                  <td>
                    <button className="btn small ghost" style={{ padding: 0, minHeight: 0, fontWeight: 600 }} onClick={() => setParams({ p: p.id })}>
                      {p.name}
                    </button>
                  </td>
                  <td>{fruitOn[p.id]}</td>
                  <td>{dots(p.cupCharacter.clarity)}</td>
                  <td>{dots(p.cupCharacter.body)}</td>
                  <td>{dots(p.cupCharacter.fruitiness)}</td>
                  <td>{risk[p.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

const dots = (n: number) => '●'.repeat(n) + '○'.repeat(5 - n);
const shortName: Record<string, string> = { anaerobic: 'Anaerobic', 'wet-hulled': 'Wet-hulled', carbonic: 'Carbonic' };
const fruitOn: Record<string, string> = {
  washed: 'No',
  natural: 'Whole cherry',
  honey: 'Mucilage only',
  anaerobic: 'Varies',
  'wet-hulled': 'No',
  carbonic: 'Whole cherry',
  monsooned: 'No',
};
const risk: Record<string, string> = {
  washed: 'Low',
  natural: 'High',
  honey: 'Medium',
  anaerobic: 'High',
  'wet-hulled': 'Medium',
  carbonic: 'High',
  monsooned: 'Medium',
};
