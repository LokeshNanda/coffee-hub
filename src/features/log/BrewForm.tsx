import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHead } from '../../components/PageHead';
import { Stars } from '../../components/Stars';
import { Scale } from '../../components/Scale';
import { FlavourPicker } from '../../components/FlavourPicker';
import { db, type Brew } from '../../db/schema';
import { methods, getMethod } from '../../content';
import { lastBrewForMethod } from '../../db/queries';
import { cloneForBrewAgain, formatRatio, ratioOf } from '../../lib/brew';

type Draft = Omit<Brew, 'id'>;

const blank = (methodId: string): Draft => ({
  methodId,
  doseG: getMethod(methodId)?.defaultDoseG ?? 15,
  rating: 0,
  flavourTags: [],
  brewedAt: new Date().toISOString(),
});

const num = (v: string): number | undefined => (v.trim() === '' ? undefined : Number(v));
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function BrewForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const editing = id !== undefined;
  const beans = useLiveQuery(() => db.beans.filter((b) => !b.archived).toArray(), []);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedFrom, setLoadedFrom] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (editing) {
        const b = await db.brews.get(Number(id));
        if (!cancelled) setDraft(b ? { ...b } : blank('v60'));
        return;
      }
      const again = params.get('again');
      if (again) {
        const src = await db.brews.get(Number(again));
        if (src && !cancelled) {
          setDraft(cloneForBrewAgain(src));
          setLoadedFrom(`Prefilled from your brew on ${new Date(src.brewedAt).toLocaleDateString()}. Change one thing.`);
          return;
        }
      }
      const methodId = params.get('method') ?? 'v60';
      let d = blank(methodId);
      const dose = num(params.get('dose') ?? '');
      const water = num(params.get('water') ?? '');
      const yieldG = num(params.get('yield') ?? '');
      const time = num(params.get('time') ?? '');
      const steps = params.get('steps');
      const tag = params.get('tag');
      const fromTimer = time !== undefined;
      if (!fromTimer && dose === undefined) {
        // Prefill grind/device from the last brew with this method so the user only changes what moved.
        const last = await lastBrewForMethod(db, methodId);
        if (last) {
          d = { ...d, beanId: last.beanId, device: last.device, grinder: last.grinder, grindLabel: last.grindLabel, grindValue: last.grindValue, doseG: last.doseG, waterG: last.waterG, yieldG: last.yieldG, tempC: last.tempC };
          setLoadedFrom('Settings copied from your last brew with this method.');
        }
      } else {
        const last = await lastBrewForMethod(db, methodId);
        if (last) d = { ...d, beanId: last.beanId, device: last.device, grinder: last.grinder, grindLabel: last.grindLabel, grindValue: last.grindValue, tempC: last.tempC };
      }
      if (dose !== undefined) d.doseG = dose;
      if (water !== undefined) d.waterG = water;
      if (yieldG !== undefined) d.yieldG = yieldG;
      if (time !== undefined) d.timeS = time;
      if (steps) d.stepTimes = steps.split(',').filter(Boolean).map(Number);
      if (tag) d.flavourTags = [tag];
      const beanParam = num(params.get('bean') ?? '');
      if (beanParam !== undefined) d.beanId = beanParam;
      if (!cancelled) setDraft(d);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!draft) return <p className="muted">Loading…</p>;
  const method = getMethod(draft.methodId);
  const usesYield = method?.usesYield ?? false;
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });

  const save = async () => {
    if (!draft.doseG || draft.doseG <= 0) return setError('Dose is required.');
    if (!draft.rating) return setError('Give it a rating, even a rough one.');
    setError(null);
    try {
      const clean: Draft = { ...draft };
      if (editing) {
        await db.brews.put({ ...clean, id: Number(id) });
        navigate(`/log/${id}`);
      } else {
        const newId = await db.brews.add(clean);
        navigate(`/log/${newId}`, { replace: true });
      }
    } catch (e) {
      setError(`Could not save: ${(e as Error).message}`);
    }
  };

  return (
    <>
      <PageHead title={editing ? 'Edit brew' : 'Log a brew'} back={editing ? { to: `/log/${id}`, label: 'Brew' } : { to: '/log', label: 'Log' }} />
      {loadedFrom && (
        <p className="muted" style={{ background: 'var(--accent-soft)', padding: '8px 12px', borderRadius: 'var(--r-md)', fontSize: '0.9rem' }}>
          {loadedFrom}
        </p>
      )}

      <form
        className="stack"
        style={{ gap: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="form-grid">
          <div className="field">
            <label htmlFor="f-method">Method</label>
            <select id="f-method" className="select" value={draft.methodId} onChange={(e) => set('methodId', e.target.value)}>
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-bean">Bean</label>
            <select id="f-bean" className="select" value={draft.beanId ?? ''} onChange={(e) => set('beanId', e.target.value ? Number(e.target.value) : undefined)}>
              <option value="">Not recorded</option>
              {beans?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                  {b.roaster ? ` (${b.roaster})` : ''}
                </option>
              ))}
            </select>
            <span className="hint">
              <Link to="/beans/new">Add a bean</Link>
            </span>
          </div>
          <div className="field">
            <label htmlFor="f-device">Device</label>
            <input id="f-device" className="input" placeholder="Bialetti 3-cup, V60 02…" value={draft.device ?? ''} onChange={(e) => set('device', e.target.value || undefined)} />
          </div>
          <div className="field">
            <label htmlFor="f-grinder">Grinder</label>
            <input id="f-grinder" className="input" placeholder="Timemore C2…" value={draft.grinder ?? ''} onChange={(e) => set('grinder', e.target.value || undefined)} />
          </div>
          <div className="field">
            <label htmlFor="f-grind">Grind setting</label>
            <input id="f-grind" className="input" placeholder="18 clicks, 2.5…" value={draft.grindLabel ?? ''} onChange={(e) => set('grindLabel', e.target.value || undefined)} />
            <span className="hint">As it reads on your grinder.</span>
          </div>
          <div className="field">
            <label htmlFor="f-temp">Water temperature</label>
            <div className="unit-input">
              <input id="f-temp" className="input" type="number" inputMode="decimal" value={draft.tempC ?? ''} onChange={(e) => set('tempC', num(e.target.value))} />
              <span>°C</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-dose">Coffee dose</label>
            <div className="unit-input">
              <input id="f-dose" className="input" type="number" inputMode="decimal" step={0.1} required value={draft.doseG || ''} onChange={(e) => set('doseG', Number(e.target.value))} />
              <span>g</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-out">{usesYield ? 'Yield in cup' : 'Water'}</label>
            <div className="unit-input">
              <input
                id="f-out"
                className="input"
                type="number"
                inputMode="decimal"
                step={1}
                value={(usesYield ? draft.yieldG : draft.waterG) ?? ''}
                onChange={(e) => set(usesYield ? 'yieldG' : 'waterG', num(e.target.value))}
              />
              <span>g</span>
            </div>
            <span className="hint">Ratio {formatRatio(ratioOf(draft))}</span>
          </div>
          <div className="field">
            <label htmlFor="f-time">Brew time</label>
            <div className="unit-input">
              <input id="f-time" className="input" type="number" inputMode="numeric" value={draft.timeS ?? ''} onChange={(e) => set('timeS', num(e.target.value))} />
              <span>sec</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-when">When</label>
            <input id="f-when" className="input" type="datetime-local" value={toLocalInput(draft.brewedAt)} onChange={(e) => e.target.value && set('brewedAt', new Date(e.target.value).toISOString())} />
          </div>
        </div>

        <div className="card stack" style={{ gap: 18 }}>
          <div className="field">
            <span className="label">Rating</span>
            <Stars value={draft.rating} onChange={(v) => set('rating', v)} />
          </div>
          <Scale label="Bitterness" low="None" high="Harsh" value={draft.bitterness} onChange={(v) => set('bitterness', v)} />
          <Scale label="Acidity" low="Flat" high="Sharp" value={draft.acidity} onChange={(v) => set('acidity', v)} />
          <Scale label="Sweetness" low="None" high="Syrupy" value={draft.sweetness} onChange={(v) => set('sweetness', v)} />
          <Scale label="Body" low="Thin" high="Heavy" value={draft.body} onChange={(v) => set('body', v)} />
        </div>

        <div className="field">
          <span className="label">Flavours you noticed</span>
          <FlavourPicker value={draft.flavourTags} onChange={(tags) => set('flavourTags', tags)} />
        </div>

        <div className="field">
          <label htmlFor="f-notes">Notes</label>
          <textarea id="f-notes" className="textarea" value={draft.notes ?? ''} onChange={(e) => set('notes', e.target.value || undefined)} />
        </div>
        <div className="field">
          <label htmlFor="f-next">Next time</label>
          <textarea id="f-next" className="textarea" placeholder="Grind one step finer, lower the heat…" value={draft.nextTime ?? ''} onChange={(e) => set('nextTime', e.target.value || undefined)} />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="btn-row">
          <button type="submit" className="btn primary big">
            {editing ? 'Save changes' : 'Save brew'}
          </button>
          <Link to={editing ? `/log/${id}` : '/log'} className="btn ghost">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
