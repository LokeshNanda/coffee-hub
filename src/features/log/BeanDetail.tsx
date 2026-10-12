import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHead } from '../../components/PageHead';
import { Stars } from '../../components/Stars';
import { Icon } from '../../components/Icon';
import { OriginChip, ProcessChip } from '../../components/Chips';
import { db, type Brew } from '../../db/schema';
import { getMethod, roastForPosition } from '../../content';
import { brewsForBean } from '../../db/queries';
import { daysSinceRoast, formatRatio, ratioOf } from '../../lib/brew';

export function BeanDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const bean = useLiveQuery(() => db.beans.get(Number(id)), [id]);
  const brews = useLiveQuery(() => brewsForBean(db, Number(id)), [id]);

  if (bean === undefined) return <p className="muted">Loading…</p>;
  if (bean === null) return <Navigate to="/beans" replace />;
  const best = brews ? [...brews].sort((a, b) => b.rating - a.rating || b.brewedAt.localeCompare(a.brewedAt))[0] : undefined;
  const age = daysSinceRoast(bean.roastDate);

  const remove = async () => {
    await db.transaction('rw', db.beans, db.brews, async () => {
      await db.brews.where('beanId').equals(bean.id!).modify({ beanId: undefined });
      await db.beans.delete(bean.id!);
    });
    navigate('/beans', { replace: true });
  };

  return (
    <>
      <PageHead title={bean.name} intro={bean.roaster} back={{ to: '/beans', label: 'Beans' }} />
      <div className="chips" style={{ marginTop: -8, marginBottom: 16 }}>
        <span className="chip dot" style={{ ['--chip-colour' as string]: roastForPosition(bean.roastPosition).colour }}>
          {roastForPosition(bean.roastPosition).name} roast
        </span>
        <OriginChip id={bean.originId} />
        <ProcessChip id={bean.processId} />
        {bean.varietal && <span className="chip">{bean.varietal}</span>}
        {age !== undefined && <span className="chip">{age} days off roast</span>}
        {bean.archived && <span className="chip">Finished</span>}
      </div>
      {bean.bagNotes && <p className="muted">{bean.bagNotes}</p>}

      <div className="btn-row" style={{ marginBottom: 24 }}>
        <Link to={`/log/new?bean=${bean.id}`} className="btn primary">
          <Icon name="plus" width={18} height={18} /> Log a brew
        </Link>
        <Link to={`/beans/${bean.id}/edit`} className="btn">
          <Icon name="edit" width={18} height={18} /> Edit
        </Link>
      </div>

      {best && (
        <section className="card" style={{ marginBottom: 24 }}>
          <div className="spread">
            <h3>Best so far</h3>
            <Stars value={best.rating} small />
          </div>
          <p className="muted" style={{ margin: '6px 0 10px' }}>
            {getMethod(best.methodId)?.name}, {best.doseG} g at {formatRatio(ratioOf(best))}
            {best.grindLabel ? `, grind ${best.grindLabel}` : ''}
            {best.tempC !== undefined ? `, ${best.tempC} °C` : ''}.
          </p>
          <div className="btn-row">
            <Link to={`/log/new?again=${best.id}`} className="btn small primary">
              <Icon name="repeat" width={16} height={16} /> Brew it again
            </Link>
            <Link to={`/log/${best.id}`} className="btn small">
              Open
            </Link>
          </div>
        </section>
      )}

      {brews && brews.length > 1 && bean.roastDate && (
        <section className="section">
          <h3>Rating against days off roast</h3>
          <RatingChart brews={brews} roastDate={bean.roastDate} />
        </section>
      )}

      <section className="section">
        <h3>Brews with this bean</h3>
        {brews && brews.length === 0 && <p className="muted">None yet.</p>}
        <ul className="list">
          {brews
            ?.slice()
            .reverse()
            .map((b) => (
              <li key={b.id}>
                <Link to={`/log/${b.id}`} className="rowcard">
                  <span className="title">{getMethod(b.methodId)?.name ?? b.methodId}</span>
                  <Stars value={b.rating} small />
                  <span className="meta">
                    {b.doseG} g, {formatRatio(ratioOf(b))}
                    {b.grindLabel ? `, grind ${b.grindLabel}` : ''} · {new Date(b.brewedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="section">
        {confirm ? (
          <div className="row">
            <span className="muted">Delete this bean? Its brews stay but lose the link.</span>
            <button className="btn danger primary small" onClick={remove}>
              Delete
            </button>
            <button className="btn small" onClick={() => setConfirm(false)}>
              Keep
            </button>
          </div>
        ) : (
          <button className="btn ghost danger small" onClick={() => setConfirm(true)}>
            <Icon name="trash" width={16} height={16} /> Delete bean
          </button>
        )}
      </section>
    </>
  );
}

function RatingChart({ brews, roastDate }: { brews: Brew[]; roastDate: string }) {
  const pts = brews
    .map((b) => ({ x: daysSinceRoast(roastDate, new Date(b.brewedAt)) ?? 0, y: b.rating, method: b.methodId }))
    .sort((a, b) => a.x - b.x);
  const W = 320;
  const H = 140;
  const padL = 24;
  const padB = 20;
  const maxX = Math.max(7, ...pts.map((p) => p.x));
  const sx = (x: number) => padL + (x / maxX) * (W - padL - 8);
  const sy = (y: number) => 8 + ((5 - y) / 4) * (H - padB - 8);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(' ');
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Rating by days since roast">
      {[1, 2, 3, 4, 5].map((y) => (
        <g key={y}>
          <line x1={padL} x2={W - 8} y1={sy(y)} y2={sy(y)} />
          <text x={padL - 6} y={sy(y) + 3} textAnchor="end">
            {y}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {pts.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="4" fill="var(--cherry)">
          <title>
            Day {p.x}: {p.y}/5 ({getMethod(p.method)?.name})
          </title>
        </circle>
      ))}
      <text x={padL} y={H - 4}>
        day 0
      </text>
      <text x={W - 8} y={H - 4} textAnchor="end">
        day {maxX}
      </text>
    </svg>
  );
}
