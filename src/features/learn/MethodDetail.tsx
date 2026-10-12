import { Link, useParams, Navigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { DeviceIcon } from '../../components/DeviceIcon';

const familyName = { pressure: 'Pressure brewing', percolation: 'Pour-over', immersion: 'Immersion' };
import { getMethod, grindForBand, roastForPosition, roasts } from '../../content';
import { formatSeconds } from '../../lib/brew';

export function MethodDetail() {
  const { id = '' } = useParams();
  const m = getMethod(id);
  if (!m) return <Navigate to="/learn/methods" replace />;
  const grind = grindForBand(m.grind);
  const suitedRoasts = roasts.filter((r) => r.position >= m.roastRange[0] && r.position <= m.roastRange[1]);
  const defaultWater = Math.round(m.defaultDoseG * m.defaultRatio);

  return (
    <>
      <Link to="/learn/methods" className="back">
        <Icon name="back" width={16} height={16} /> Methods
      </Link>
      <div className="method-hero">
        <div>
          <span className="family">{familyName[m.family]}</span>
          <h1>{m.name}</h1>
          <p>{m.tagline}</p>
        </div>
        <DeviceIcon method={m.id} className="device" />
      </div>

      <div className="btn-row" style={{ marginBottom: 20 }}>
        <Link to={`/brew/timer/${m.id}`} className="btn primary">
          <Icon name="timer" width={18} height={18} /> Start guided timer
        </Link>
        <Link to={`/log/new?method=${m.id}`} className="btn">
          <Icon name="plus" width={18} height={18} /> Log a brew
        </Link>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="v">1:{m.defaultRatio}</div>
          <div className="k">
            ratio ({m.ratioRange[0]}–{m.ratioRange[1]})
          </div>
        </div>
        <div className="stat">
          <div className="v">{grind?.name}</div>
          <div className="k">grind</div>
        </div>
        <div className="stat">
          <div className="v">
            {m.tempRange[0]}–{m.tempRange[1]}°
          </div>
          <div className="k">water, °C</div>
        </div>
        <div className="stat">
          <div className="v">{formatSeconds(m.typicalTimeS)}</div>
          <div className="k">typical time</div>
        </div>
      </div>

      <section className="section">
        <p>{m.description}</p>
        <p className="muted">{m.deviceNotes}</p>
      </section>

      <section className="section">
        <h2>
          Recipe for {m.defaultDoseG} g{m.usesYield ? ` in, ${defaultWater} g out` : ` and ${defaultWater} g water`}
        </h2>
        <ol className="recipe">
          {m.steps.map((s, i) => (
            <li key={s.title}>
              <span className="no">{i + 1}</span>
              <div>
                <div className="t">{s.title}</div>
                <div className="d">{s.instruction}</div>
                <div className="meta">
                  {s.duration !== undefined && <span>{formatSeconds(s.duration)}</span>}
                  {s.duration !== undefined && s.waterPerGram !== undefined && ' · '}
                  {s.waterPerGram !== undefined && <span>to {Math.round(s.waterPerGram * m.defaultDoseG)} g</span>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>If it tastes wrong</h2>
        <div className="tweaks">
          {(
            [
              ['Too bitter', m.tweaks.tooBitter],
              ['Too sour', m.tweaks.tooSour],
              ['Too weak', m.tweaks.tooWeak],
              ['Too strong', m.tweaks.tooStrong],
            ] as const
          ).map(([k, v]) => (
            <div className="card" key={k}>
              <strong>{k}</strong>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Common mistakes</h2>
        <ul>
          {m.mistakes.map((x) => (
            <li key={x} className="muted">
              {x}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Roasts that suit it</h2>
        <div className="chips">
          {suitedRoasts.map((r) => (
            <Link key={r.id} to="/learn/roasting" className="chip dot" style={{ ['--chip-colour' as string]: r.colour }}>
              {r.name}
            </Link>
          ))}
        </div>
        <p className="faint" style={{ fontSize: '0.85rem', marginTop: 8 }}>
          Nearest level to the middle of the range: {roastForPosition((m.roastRange[0] + m.roastRange[1]) / 2).name}.
        </p>
      </section>
    </>
  );
}
