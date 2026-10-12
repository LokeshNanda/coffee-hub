import { Link } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { DeviceIcon } from '../../components/DeviceIcon';
import { methods, grindForBand } from '../../content';
import { formatSeconds } from '../../lib/brew';

const familyName = { pressure: 'Pressure', percolation: 'Pour-over', immersion: 'Immersion' };

export function MethodsPage() {
  return (
    <>
      <PageHead title="Brewing methods" intro="Three families: water pushed through (pressure), water poured through (percolation), coffee steeped in water (immersion)." />

      <ul className="list">
        {methods.map((m) => (
          <li key={m.id}>
            <Link to={`/learn/methods/${m.id}`} className="rowcard with-icon">
              <span className="row-icon">
                <DeviceIcon method={m.id} />
              </span>
              <span className="title">{m.name}</span>
              <span className="faint" style={{ fontSize: '0.8rem' }}>
                {familyName[m.family]}
              </span>
              <span className="meta">{m.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="section">
        <h2>At a glance</h2>
        <div className="table-scroll">
          <table className="compare">
            <thead>
              <tr>
                <th>Method</th>
                <th>Ratio</th>
                <th>Grind</th>
                <th>Water</th>
                <th>Time</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link to={`/learn/methods/${m.id}`} style={{ fontWeight: 600 }}>
                      {m.name}
                    </Link>
                  </td>
                  <td>
                    1:{m.ratioRange[0]}–{m.ratioRange[1]}
                  </td>
                  <td>{grindForBand(m.grind)?.name}</td>
                  <td>
                    {m.tempRange[0]}–{m.tempRange[1]} °C
                  </td>
                  <td>{formatSeconds(m.typicalTimeS)}</td>
                  <td>{body[m.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

const body: Record<string, string> = {
  moka: 'Heavy',
  v60: 'Light',
  chemex: 'Very light',
  kalita: 'Medium',
  'french-press': 'Heavy',
  aeropress: 'Medium',
  espresso: 'Syrupy',
};
