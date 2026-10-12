import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Icon } from '../../components/Icon';
import { Stars } from '../../components/Stars';
import { db } from '../../db/schema';
import { methods, getMethod } from '../../content';
import { formatRatio, ratioOf } from '../../lib/brew';

type Sort = 'newest' | 'rating';

export function LogList() {
  const [methodId, setMethodId] = useState('');
  const [beanId, setBeanId] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const beans = useLiveQuery(() => db.beans.toArray(), []);
  const brews = useLiveQuery(async () => {
    let list = await db.brews.toArray();
    if (methodId) list = list.filter((b) => b.methodId === methodId);
    if (beanId) list = list.filter((b) => b.beanId === Number(beanId));
    return list.sort((a, b) => (sort === 'rating' ? b.rating - a.rating || b.brewedAt.localeCompare(a.brewedAt) : b.brewedAt.localeCompare(a.brewedAt)));
  }, [methodId, beanId, sort]);
  const beanName = (id?: number) => beans?.find((b) => b.id === id)?.name;

  return (
    <>
      <header className="page-head spread" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1>Brew log</h1>
          <p style={{ margin: '6px 0 0' }}>
            <Link to="/beans" className="muted">
              Manage beans
            </Link>
          </p>
        </div>
        <Link to="/log/new" className="btn primary">
          <Icon name="plus" width={18} height={18} /> New brew
        </Link>
      </header>

      {brews && brews.length === 0 && !methodId && !beanId ? (
        <div className="empty card">
          <h3>No brews yet</h3>
          <p>Log your next cup with grind, dose, time and a rating. After a few, this page shows what worked.</p>
          <Link to="/log/new" className="btn primary">
            Log a brew
          </Link>
        </div>
      ) : (
        <>
          <div className="row" style={{ marginBottom: 14 }}>
            <select className="select" style={{ width: 'auto', flex: 1 }} value={methodId} onChange={(e) => setMethodId(e.target.value)} aria-label="Filter by method">
              <option value="">All methods</option>
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <select className="select" style={{ width: 'auto', flex: 1 }} value={beanId} onChange={(e) => setBeanId(e.target.value)} aria-label="Filter by bean">
              <option value="">All beans</option>
              {beans?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="seg" role="group" aria-label="Sort">
              <button aria-pressed={sort === 'newest'} onClick={() => setSort('newest')}>
                Newest
              </button>
              <button aria-pressed={sort === 'rating'} onClick={() => setSort('rating')}>
                Best
              </button>
            </div>
          </div>

          {brews && brews.length === 0 && <p className="empty">Nothing matches those filters.</p>}

          <ul className="list">
            {brews?.map((b) => (
              <li key={b.id}>
                <Link to={`/log/${b.id}`} className="rowcard">
                  <span className="title">
                    {getMethod(b.methodId)?.name ?? b.methodId}
                    {beanName(b.beanId) && (
                      <>
                        {' '}
                        <span className="faint">·</span> {beanName(b.beanId)}
                      </>
                    )}
                  </span>
                  <Stars value={b.rating} small />
                  <span className="meta">
                    {b.doseG} g, {formatRatio(ratioOf(b))}
                    {b.grindLabel ? `, grind ${b.grindLabel}` : ''} · {new Date(b.brewedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
