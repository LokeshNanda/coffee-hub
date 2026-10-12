import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { methods, getMethod } from '../../content';
import { solveRatio } from '../../lib/brew';

export function CalculatorPage() {
  const [methodId, setMethodId] = useState('v60');
  const method = getMethod(methodId) ?? methods[0];
  const [ratio, setRatio] = useState(method.defaultRatio);
  const [dose, setDose] = useState(method.defaultDoseG);
  const [water, setWater] = useState(Math.round(method.defaultDoseG * method.defaultRatio));
  const [lock, setLock] = useState<'dose' | 'water'>('dose');

  const pick = (id: string) => {
    const m = getMethod(id)!;
    setMethodId(id);
    setRatio(m.defaultRatio);
    setDose(m.defaultDoseG);
    setWater(Math.round(m.defaultDoseG * m.defaultRatio));
  };
  const changeRatio = (r: number) => {
    setRatio(r);
    const solved = lock === 'dose' ? solveRatio({ doseG: dose, ratio: r }) : solveRatio({ waterG: water, ratio: r });
    setDose(solved.doseG);
    setWater(solved.waterG);
  };
  const changeDose = (d: number) => {
    setLock('dose');
    setDose(d);
    setWater(solveRatio({ doseG: d, ratio }).waterG);
  };
  const changeWater = (w: number) => {
    setLock('water');
    setWater(w);
    setDose(solveRatio({ waterG: w, ratio }).doseG);
  };
  const step = method.usesYield ? 0.1 : 0.5;
  const outLabel = method.usesYield ? 'Yield' : 'Water';

  return (
    <>
      <PageHead title="Ratio calculator" intro="Change any one number and the others follow." back={{ to: '/brew', label: 'Brew' }} />

      <div className="field" style={{ marginBottom: 16 }}>
        <label htmlFor="calc-method">Method</label>
        <select id="calc-method" className="select" value={methodId} onChange={(e) => pick(e.target.value)}>
          {methods.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card stack" style={{ gap: 20 }}>
        <div className="field">
          <div className="spread">
            <span className="label">Ratio</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>1:{ratio}</span>
          </div>
          <input
            type="range"
            min={method.ratioRange[0]}
            max={method.ratioRange[1]}
            step={step}
            value={ratio}
            onChange={(e) => changeRatio(Number(e.target.value))}
            aria-label="Ratio"
          />
          <div className="slider-labels">
            <span>Stronger 1:{method.ratioRange[0]}</span>
            <span>Lighter 1:{method.ratioRange[1]}</span>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="calc-dose">Coffee</label>
            <div className="unit-input">
              <input id="calc-dose" className="input" type="number" inputMode="decimal" min={1} step={0.5} value={dose} onChange={(e) => changeDose(Number(e.target.value))} />
              <span>g</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="calc-water">{outLabel}</label>
            <div className="unit-input">
              <input id="calc-water" className="input" type="number" inputMode="decimal" min={1} step={1} value={water} onChange={(e) => changeWater(Number(e.target.value))} />
              <span>g</span>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <Link to={`/brew/timer/${method.id}?dose=${dose}&water=${water}`} className="btn primary">
            Start timer with this
          </Link>
          <Link to={`/log/new?method=${method.id}&dose=${dose}&water=${water}`} className="btn">
            Log a brew
          </Link>
        </div>
      </div>

      <p className="faint" style={{ fontSize: '0.85rem', marginTop: 16 }}>
        {method.name} is usually brewed between 1:{method.ratioRange[0]} and 1:{method.ratioRange[1]} at {method.tempRange[0]} to {method.tempRange[1]} °C.
      </p>
    </>
  );
}
