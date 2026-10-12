import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHead } from '../../components/PageHead';
import { Stars } from '../../components/Stars';
import { Bars } from '../../components/Bars';
import { Icon } from '../../components/Icon';
import { FlavourChips, MethodChip } from '../../components/Chips';
import { db } from '../../db/schema';
import { getMethod } from '../../content';
import { daysSinceRoast, formatRatio, formatSeconds, ratioOf } from '../../lib/brew';

export function BrewDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const brew = useLiveQuery(() => db.brews.get(Number(id)), [id]);
  const bean = useLiveQuery(() => (brew?.beanId ? db.beans.get(brew.beanId) : undefined), [brew?.beanId]);

  if (brew === undefined) return <p className="muted">Loading…</p>;
  if (brew === null) return <Navigate to="/log" replace />;
  const method = getMethod(brew.methodId);
  const age = bean ? daysSinceRoast(bean.roastDate, new Date(brew.brewedAt)) : undefined;
  const taste = [
    { label: 'Bitterness', value: brew.bitterness },
    { label: 'Acidity', value: brew.acidity },
    { label: 'Sweetness', value: brew.sweetness },
    { label: 'Body', value: brew.body },
  ].filter((t): t is { label: string; value: number } => t.value !== undefined);

  const remove = async () => {
    await db.brews.delete(brew.id!);
    navigate('/log', { replace: true });
  };

  return (
    <>
      <PageHead title={bean?.name ?? getMethod(brew.methodId)?.name ?? 'Brew'} back={{ to: '/log', label: 'Log' }} />
      <div className="row" style={{ marginTop: -12, marginBottom: 16 }}>
        <MethodChip id={brew.methodId} />
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          {new Date(brew.brewedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>
      <Stars value={brew.rating} />

      <div className="btn-row" style={{ margin: '16px 0 24px' }}>
        <Link to={`/log/new?again=${brew.id}`} className="btn primary">
          <Icon name="repeat" width={18} height={18} /> Brew again
        </Link>
        <Link to={`/log/${brew.id}/edit`} className="btn">
          <Icon name="edit" width={18} height={18} /> Edit
        </Link>
        {method && (
          <Link to={`/brew/timer/${method.id}?dose=${brew.doseG}&water=${brew.waterG ?? brew.yieldG ?? ''}`} className="btn">
            <Icon name="timer" width={18} height={18} /> Timer
          </Link>
        )}
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="v">{brew.doseG} g</div>
          <div className="k">dose</div>
        </div>
        <div className="stat">
          <div className="v">{(method?.usesYield ? brew.yieldG : brew.waterG) ?? '—'} g</div>
          <div className="k">{method?.usesYield ? 'yield' : 'water'}</div>
        </div>
        <div className="stat">
          <div className="v">{formatRatio(ratioOf(brew))}</div>
          <div className="k">ratio</div>
        </div>
        <div className="stat">
          <div className="v">{brew.timeS !== undefined ? formatSeconds(brew.timeS) : '—'}</div>
          <div className="k">time</div>
        </div>
        <div className="stat">
          <div className="v">{brew.grindLabel ?? '—'}</div>
          <div className="k">grind{brew.grinder ? ` (${brew.grinder})` : ''}</div>
        </div>
        <div className="stat">
          <div className="v">{brew.tempC !== undefined ? `${brew.tempC}°` : '—'}</div>
          <div className="k">water °C</div>
        </div>
      </div>

      {(brew.device || age !== undefined) && (
        <p className="muted" style={{ marginTop: 12 }}>
          {brew.device && <span>{brew.device}. </span>}
          {age !== undefined && <span>Beans were {age} days off roast. </span>}
        </p>
      )}

      {taste.length > 0 && (
        <section className="section card">
          <Bars bars={taste} />
        </section>
      )}

      {brew.flavourTags.length > 0 && (
        <section className="section">
          <h3>Flavours</h3>
          <FlavourChips tags={brew.flavourTags} />
        </section>
      )}

      {brew.notes && (
        <section className="section">
          <h3>Notes</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{brew.notes}</p>
        </section>
      )}
      {brew.nextTime && (
        <section className="section">
          <h3>Next time</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{brew.nextTime}</p>
        </section>
      )}

      {brew.stepTimes && brew.stepTimes.length > 0 && method && (
        <section className="section">
          <h3>Step times</h3>
          <ol className="step-list">
            {method.steps.map((s, i) => (
              <li key={s.title}>
                <span className="no">{i + 1}</span>
                <span>{s.title}</span>
                <span className="faint">{brew.stepTimes![i] !== undefined ? formatSeconds(brew.stepTimes![i]) : ''}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="section">
        {confirm ? (
          <div className="row">
            <span className="muted">Delete this brew?</span>
            <button className="btn danger primary small" onClick={remove}>
              Delete
            </button>
            <button className="btn small" onClick={() => setConfirm(false)}>
              Keep
            </button>
          </div>
        ) : (
          <button className="btn ghost danger small" onClick={() => setConfirm(true)}>
            <Icon name="trash" width={16} height={16} /> Delete brew
          </button>
        )}
      </section>
    </>
  );
}
