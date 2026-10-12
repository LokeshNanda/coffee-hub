import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHead } from '../../components/PageHead';
import { Icon } from '../../components/Icon';
import { db } from '../../db/schema';
import { getOrigin, getProcess, roastForPosition } from '../../content';
import { daysSinceRoast } from '../../lib/brew';

export function BeansList() {
  const [showArchived, setShowArchived] = useState(false);
  const beans = useLiveQuery(() => db.beans.orderBy('createdAt').reverse().toArray(), []);
  const counts = useLiveQuery(async () => {
    const all = await db.brews.toArray();
    const m = new Map<number, number>();
    for (const b of all) if (b.beanId !== undefined) m.set(b.beanId, (m.get(b.beanId) ?? 0) + 1);
    return m;
  }, []);
  const shown = beans?.filter((b) => showArchived || !b.archived);

  return (
    <>
      <PageHead title="Beans" back={{ to: '/log', label: 'Log' }} />
      <div className="spread" style={{ marginBottom: 16 }}>
        <label className="row" style={{ gap: 8, fontSize: '0.9rem' }}>
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show finished bags
        </label>
        <Link to="/beans/new" className="btn primary">
          <Icon name="plus" width={18} height={18} /> Add bean
        </Link>
      </div>

      {shown && shown.length === 0 && (
        <div className="empty card">
          <h3>No beans yet</h3>
          <p>Add the bag you are drinking now. Every brew you log against it builds a picture of how it behaves over time.</p>
          <Link to="/beans/new" className="btn primary">
            Add a bean
          </Link>
        </div>
      )}

      <ul className="list">
        {shown?.map((b) => {
          const age = daysSinceRoast(b.roastDate);
          return (
            <li key={b.id}>
              <Link to={`/beans/${b.id}`} className="rowcard" style={b.archived ? { opacity: 0.6 } : undefined}>
                <span className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: roastForPosition(b.roastPosition).colour, flexShrink: 0 }} />
                  {b.name}
                </span>
                <span className="faint" style={{ fontSize: '0.8rem' }}>
                  {counts?.get(b.id!) ?? 0} brews
                </span>
                <span className="meta">
                  {[b.roaster, getOrigin(b.originId ?? '')?.name, getProcess(b.processId ?? '')?.name, age !== undefined ? `${age} days off roast` : undefined]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
