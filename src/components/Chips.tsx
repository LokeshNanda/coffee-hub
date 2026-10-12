import { Link } from 'react-router-dom';
import { flavourIndex, getOrigin, getProcess, getMethod } from '../content';

/** Flavour tags as coloured chips, linking to the wheel. */
export function FlavourChips({ tags, link = true }: { tags: string[]; link?: boolean }) {
  if (tags.length === 0) return null;
  return (
    <div className="chips">
      {tags.map((id) => {
        const f = flavourIndex.get(id);
        const style = { ['--chip-colour' as string]: f?.colour };
        const cls = `chip dot${f ? '' : ' unknown'}`;
        return link && f ? (
          <Link key={id} to={`/learn/flavours?tag=${id}`} className={cls} style={style}>
            {f.name}
          </Link>
        ) : (
          <span key={id} className={cls} style={style}>
            {f?.name ?? id}
          </span>
        );
      })}
    </div>
  );
}

export function OriginChip({ id }: { id?: string }) {
  if (!id) return null;
  const o = getOrigin(id);
  return o ? (
    <Link to={`/learn/origins?o=${id}`} className="chip">
      {o.name}
    </Link>
  ) : (
    <span className="chip unknown">{id}</span>
  );
}

export function ProcessChip({ id }: { id?: string }) {
  if (!id) return null;
  const p = getProcess(id);
  return p ? (
    <Link to={`/learn/processing?p=${id}`} className="chip">
      {p.name}
    </Link>
  ) : (
    <span className="chip unknown">{id}</span>
  );
}

export function MethodChip({ id }: { id: string }) {
  const m = getMethod(id);
  return m ? (
    <Link to={`/learn/methods/${id}`} className="chip">
      {m.name}
    </Link>
  ) : (
    <span className="chip unknown">{id}</span>
  );
}
