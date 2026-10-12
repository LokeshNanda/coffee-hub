import { useEffect, useReducer, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHead } from '../../components/PageHead';
import { Icon } from '../../components/Icon';
import { getMethod } from '../../content';
import { initialTimer, timerReducer, stepRemainingS, totalRecipeS } from '../../lib/timer';
import { formatSeconds } from '../../lib/brew';

export function TimerPage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const method = getMethod(id);
  const navigate = useNavigate();
  const [dose, setDose] = useState(() => Number(params.get('dose')) || method?.defaultDoseG || 15);
  const [water, setWater] = useState(() => Number(params.get('water')) || Math.round((method?.defaultDoseG ?? 15) * (method?.defaultRatio ?? 16)));
  const [state, dispatch] = useReducer(timerReducer, method?.steps ?? [], initialTimer);
  const lastTick = useRef<number | null>(null);
  const lastStep = useRef(0);

  useEffect(() => {
    if (state.status !== 'running') {
      lastTick.current = null;
      return;
    }
    let raf = 0;
    const loop = (t: number) => {
      if (lastTick.current !== null) dispatch({ type: 'tick', deltaMs: t - lastTick.current });
      lastTick.current = t;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.status]);

  // Buzz on step change and completion.
  useEffect(() => {
    if (state.stepIndex !== lastStep.current || state.status === 'done') {
      lastStep.current = state.stepIndex;
      if (state.status !== 'idle') navigator.vibrate?.(state.status === 'done' ? [120, 80, 120] : 80);
    }
  }, [state.stepIndex, state.status]);

  // Keep the screen awake while running.
  useEffect(() => {
    if (state.status !== 'running' || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock.request('screen').then((l) => (lock = l)).catch(() => undefined);
    return () => {
      lock?.release().catch(() => undefined);
    };
  }, [state.status]);

  if (!method) return <Navigate to="/brew" replace />;

  const step = state.steps[state.stepIndex];
  const remaining = stepRemainingS(state);
  // Step water targets are stored per gram at the default ratio; scale them so the last target equals the water entered.
  const maxPerGram = Math.max(...method.steps.map((s) => s.waterPerGram ?? 0)) || method.defaultRatio;
  const targetWater = step?.waterPerGram !== undefined ? Math.round((step.waterPerGram / maxPerGram) * water) : undefined;
  const progress = step?.duration ? Math.min(1, state.stepElapsedMs / (step.duration * 1000)) : 0;
  const circ = 2 * Math.PI * 100;

  const finish = () => {
    const q = new URLSearchParams({
      method: method.id,
      dose: String(dose),
      [method.usesYield ? 'yield' : 'water']: String(water),
      time: String(Math.round(state.totalElapsedMs / 1000)),
      steps: state.stepEndTimes.join(','),
    });
    navigate(`/log/new?${q.toString()}`);
  };

  return (
    <>
      <PageHead title={method.name} back={{ to: '/brew', label: 'Brew' }} />

      {state.status === 'idle' && (
        <div className="card form-grid" style={{ marginBottom: 20 }}>
          <div className="field">
            <label htmlFor="t-dose">Coffee</label>
            <div className="unit-input">
              <input id="t-dose" className="input" type="number" inputMode="decimal" value={dose} onChange={(e) => setDose(Number(e.target.value))} />
              <span>g</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="t-water">{method.usesYield ? 'Yield' : 'Water'}</label>
            <div className="unit-input">
              <input id="t-water" className="input" type="number" inputMode="decimal" value={water} onChange={(e) => setWater(Number(e.target.value))} />
              <span>g</span>
            </div>
          </div>
          <p className="faint full" style={{ margin: 0, fontSize: '0.85rem' }}>
            Timed steps run for about {formatSeconds(totalRecipeS(method.steps))}. Untimed steps wait for you to tap Next.
          </p>
        </div>
      )}

      <div className="timer">
        <div className="big-time" aria-live="off">
          {formatSeconds(state.totalElapsedMs / 1000)}
        </div>

        {state.status === 'done' ? (
          <>
            <div className="step-title">Done</div>
            <p className="step-text">
              {formatSeconds(state.totalElapsedMs / 1000)} total. Save it with your grind, rating and notes so you can repeat it.
            </p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <button className="btn primary big" onClick={finish}>
                Save as a brew
              </button>
              <button className="btn" onClick={() => dispatch({ type: 'reset' })}>
                Start again
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ring">
              <svg viewBox="0 0 220 220" width="220" height="220" aria-hidden="true">
                <circle cx="110" cy="110" r="100" fill="none" stroke="var(--surface-2)" strokeWidth="10" />
                {step?.duration !== undefined && (
                  <circle
                    cx="110"
                    cy="110"
                    r="100"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - progress)}
                  />
                )}
              </svg>
              <div className="remain" aria-live="polite">
                {remaining !== undefined ? remaining : <Icon name="hand" width={44} height={44} />}
              </div>
            </div>
            <div className="step-title">
              {state.stepIndex + 1}. {step?.title}
            </div>
            <p className="step-text">{step?.instruction}</p>
            {targetWater !== undefined && (
              <div className="water-target">
                Pour to <strong>{targetWater} g</strong>
              </div>
            )}
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              {state.status === 'idle' && (
                <button className="btn primary big" onClick={() => dispatch({ type: 'start' })}>
                  <Icon name="play" width={20} height={20} /> Start
                </button>
              )}
              {state.status === 'running' && (
                <button className="btn big" onClick={() => dispatch({ type: 'pause' })}>
                  <Icon name="pause" width={20} height={20} /> Pause
                </button>
              )}
              {state.status === 'paused' && (
                <button className="btn primary big" onClick={() => dispatch({ type: 'resume' })}>
                  <Icon name="play" width={20} height={20} /> Resume
                </button>
              )}
              {state.status !== 'idle' && (
                <button className="btn big" onClick={() => dispatch({ type: 'next' })}>
                  Next <Icon name="next" width={20} height={20} />
                </button>
              )}
              {state.status !== 'idle' && (
                <button className="btn ghost" onClick={() => dispatch({ type: 'reset' })}>
                  Reset
                </button>
              )}
            </div>
          </>
        )}

        <ol className="step-list" aria-label="All steps">
          {state.steps.map((s, i) => (
            <li key={s.title} className={i < state.stepIndex || state.status === 'done' ? 'done' : i === state.stepIndex ? 'current' : ''}>
              <span className="no">{i + 1}</span>
              <span>{s.title}</span>
              <span className="faint">
                {state.stepEndTimes[i] !== undefined ? formatSeconds(state.stepEndTimes[i]) : s.duration !== undefined ? formatSeconds(s.duration) : 'tap'}
              </span>
            </li>
          ))}
        </ol>

        <p className="faint" style={{ fontSize: '0.85rem' }}>
          Recipe notes and tweaks are on the <Link to={`/learn/methods/${method.id}`}>{method.name} guide</Link>.
        </p>
      </div>
    </>
  );
}
