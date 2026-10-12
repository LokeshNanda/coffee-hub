import { useState } from 'react';
import type { Stage } from '../content';
import { Icon } from './Icon';

interface Props {
  stages: Stage[];
  /** Reset the view when this changes. */
  resetKey?: string;
}

/** A tap-through journey: a horizontal track of nodes and a body showing the current stage. */
export function Journey({ stages, resetKey }: Props) {
  const [key, setKey] = useState(resetKey);
  const [index, setIndex] = useState(0);
  if (key !== resetKey) {
    setKey(resetKey);
    setIndex(0);
  }
  const current = stages[Math.min(index, stages.length - 1)];
  const last = stages.length - 1;

  return (
    <div className="journey">
      <div className="journey-track" role="tablist" aria-label="Stages">
        {stages.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={i === index}
            className={i < index ? 'done' : i === index ? 'current' : ''}
            onClick={() => setIndex(i)}
          >
            <span className="node">{i < index ? <Icon name="check" /> : <Icon name={s.icon} />}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>
      <div className="journey-body" role="tabpanel">
        <div className="step-no">
          Stage {index + 1} of {stages.length}
        </div>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        {current.flavourImpact && (
          <div className="impact">
            <strong>In the cup:</strong> {current.flavourImpact}
          </div>
        )}
        <div className="journey-nav">
          <button className="btn small" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            Previous
          </button>
          <button className="btn small primary" disabled={index === last} onClick={() => setIndex(index + 1)}>
            {index === last ? 'Finished' : 'Next stage'}
          </button>
        </div>
      </div>
    </div>
  );
}
