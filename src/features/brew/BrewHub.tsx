import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Icon } from '../../components/Icon';
import { DeviceIcon } from '../../components/DeviceIcon';
import { methods } from '../../content';
import { db } from '../../db/schema';
import { bestBrewPerMethod } from '../../db/queries';
import { formatRatio, ratioOf } from '../../lib/brew';

export function BrewHub() {
  const best = useLiveQuery(() => bestBrewPerMethod(db), []);
  return (
    <>
      <header className="page-head">
        <h1>Brew</h1>
        <p>Pick a method to run its guided timer. Your best-rated brew for each one sits right there so you can match it.</p>
      </header>

      <Link to="/brew/calculator" className="rowcard" style={{ marginBottom: 20 }}>
        <span className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="calc" width={20} height={20} /> Ratio calculator
        </span>
        <span className="meta">Dose in, water out. Or the other way round.</span>
      </Link>

      <ul className="list">
        {methods.map((m) => {
          const b = best?.get(m.id);
          return (
            <li key={m.id}>
              <Link to={`/brew/timer/${m.id}`} className="rowcard with-icon">
                <span className="row-icon">
                  <DeviceIcon method={m.id} />
                </span>
                <span className="title">{m.name}</span>
                <Icon name="timer" width={20} height={20} style={{ color: 'var(--accent)' }} />
                <span className="meta">
                  {b
                    ? `Your best: ${b.doseG} g, ${formatRatio(ratioOf(b))}${b.grindLabel ? `, grind ${b.grindLabel}` : ''}, rated ${b.rating}/5`
                    : `Default 1:${m.defaultRatio}, ${m.defaultDoseG} g. No brews logged yet.`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
