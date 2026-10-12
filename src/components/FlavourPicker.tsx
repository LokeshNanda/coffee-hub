import { useState } from 'react';
import { flavourWheel, flavourIndex, type FlavourNode } from '../content';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
}

/** Drill-down tag picker that mirrors the flavour wheel. Selected tags appear as chips at the top. */
export function FlavourPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((t) => t !== id) : [...value, id]);
  const openNode = open ? flavourWheel.find((n) => n.id === open) : null;

  return (
    <div className="stack">
      {value.length > 0 && (
        <div className="chips" aria-label="Selected flavours">
          {value.map((id) => {
            const f = flavourIndex.get(id);
            return (
              <button
                key={id}
                type="button"
                className="chip dot"
                style={{ ['--chip-colour' as string]: f?.colour }}
                aria-pressed="true"
                onClick={() => toggle(id)}
              >
                {f?.name ?? id} ×
              </button>
            );
          })}
        </div>
      )}
      <div className="chips" role="group" aria-label="Flavour families">
        {flavourWheel.map((n) => (
          <button
            key={n.id}
            type="button"
            className="chip dot"
            style={{ ['--chip-colour' as string]: n.colour }}
            aria-pressed={open === n.id}
            onClick={() => setOpen(open === n.id ? null : n.id)}
          >
            {n.name}
          </button>
        ))}
      </div>
      {openNode && (
        <div className="chips" role="group" aria-label={`${openNode.name} flavours`}>
          {leaves(openNode).map((leaf) => (
            <button key={leaf.id} type="button" className="chip" aria-pressed={value.includes(leaf.id)} onClick={() => toggle(leaf.id)}>
              {leaf.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function leaves(node: FlavourNode): FlavourNode[] {
  if (!node.children) return [node];
  return node.children.flatMap((c) => (c.children ? [c, ...leaves(c)] : [c]));
}
