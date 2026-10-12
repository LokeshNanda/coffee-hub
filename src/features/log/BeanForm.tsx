import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { db, type Bean } from '../../db/schema';
import { origins, processing, varietals, roastForPosition } from '../../content';
import { roastAt } from '../learn/RoastingPage';

type Draft = Omit<Bean, 'id'>;

const blank = (): Draft => ({ name: '', roastPosition: 40, archived: false, createdAt: new Date().toISOString() });

export function BeanForm() {
  const { id } = useParams();
  const editing = id !== undefined;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<Draft | null>(editing ? null : blank());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) return;
    db.beans.get(Number(id)).then((b) => setDraft(b ? { ...b } : blank()));
  }, [editing, id]);

  if (!draft) return <p className="muted">Loading…</p>;
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });
  const named = roastForPosition(draft.roastPosition);

  const save = async () => {
    if (!draft.name.trim()) return setError('Give the bean a name.');
    setError(null);
    try {
      if (editing) {
        await db.beans.put({ ...draft, id: Number(id) });
        navigate(`/beans/${id}`);
      } else {
        const newId = await db.beans.add(draft);
        const returnTo = params.get('return');
        if (returnTo) {
          const sep = returnTo.includes('?') ? '&' : '?';
          navigate(`${returnTo}${sep}bean=${newId}`, { replace: true });
        } else {
          navigate(`/beans/${newId}`, { replace: true });
        }
      }
    } catch (e) {
      setError(`Could not save: ${(e as Error).message}`);
    }
  };

  return (
    <>
      <PageHead title={editing ? 'Edit bean' : 'Add a bean'} back={editing ? { to: `/beans/${id}`, label: 'Bean' } : { to: '/beans', label: 'Beans' }} />
      <form
        className="stack"
        style={{ gap: 18 }}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="b-name">Name</label>
            <input id="b-name" className="input" required placeholder="Yirgacheffe Kochere, House Espresso…" value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="b-roaster">Roaster</label>
            <input id="b-roaster" className="input" value={draft.roaster ?? ''} onChange={(e) => set('roaster', e.target.value || undefined)} />
          </div>
          <div className="field">
            <label htmlFor="b-date">Roast date</label>
            <input id="b-date" className="input" type="date" value={draft.roastDate ?? ''} onChange={(e) => set('roastDate', e.target.value || undefined)} />
          </div>
          <div className="field">
            <label htmlFor="b-origin">Origin</label>
            <select id="b-origin" className="select" value={draft.originId ?? ''} onChange={(e) => set('originId', e.target.value || undefined)}>
              <option value="">Unknown or blend</option>
              {origins.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="b-process">Process</label>
            <select id="b-process" className="select" value={draft.processId ?? ''} onChange={(e) => set('processId', e.target.value || undefined)}>
              <option value="">Unknown</option>
              {processing.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="b-varietal">Varietal</label>
            <input id="b-varietal" className="input" list="varietal-list" value={draft.varietal ?? ''} onChange={(e) => set('varietal', e.target.value || undefined)} />
            <datalist id="varietal-list">
              {varietals.map((v) => (
                <option key={v.id} value={v.name} />
              ))}
            </datalist>
          </div>
          <div className="field full">
            <div className="spread">
              <span className="label">Roast level</span>
              <span className="row" style={{ gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: roastAt(draft.roastPosition).colour, display: 'inline-block' }} />
                {named.name}
              </span>
            </div>
            <input type="range" min={0} max={100} value={draft.roastPosition} onChange={(e) => set('roastPosition', Number(e.target.value))} aria-label="Roast level" />
            <div className="slider-labels">
              <span>Light</span>
              <span>Dark</span>
            </div>
          </div>
          <div className="field full">
            <label htmlFor="b-notes">Notes on the bag</label>
            <textarea id="b-notes" className="textarea" placeholder="What the roaster says it tastes like, altitude, farm…" value={draft.bagNotes ?? ''} onChange={(e) => set('bagNotes', e.target.value || undefined)} />
          </div>
          {editing && (
            <label className="row full" style={{ gap: 8 }}>
              <input type="checkbox" checked={draft.archived} onChange={(e) => set('archived', e.target.checked)} /> Bag finished (hide from pickers)
            </label>
          )}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="btn-row">
          <button type="submit" className="btn primary big">
            {editing ? 'Save changes' : 'Add bean'}
          </button>
          <Link to={editing ? `/beans/${id}` : '/beans'} className="btn ghost">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
