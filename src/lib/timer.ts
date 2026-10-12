import type { RecipeStep } from '../content';

export interface TimerState {
  steps: RecipeStep[];
  stepIndex: number;
  /** ms elapsed within the current step. */
  stepElapsedMs: number;
  /** ms elapsed in total since start. */
  totalElapsedMs: number;
  /** Seconds at which each completed step ended (cumulative). */
  stepEndTimes: number[];
  status: 'idle' | 'running' | 'paused' | 'done';
}

export type TimerAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'tick'; deltaMs: number }
  | { type: 'next' }
  | { type: 'reset' };

export function initialTimer(steps: RecipeStep[]): TimerState {
  return { steps, stepIndex: 0, stepElapsedMs: 0, totalElapsedMs: 0, stepEndTimes: [], status: 'idle' };
}

function advance(state: TimerState): TimerState {
  const endTimes = [...state.stepEndTimes, Math.round(state.totalElapsedMs / 1000)];
  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= state.steps.length) {
    return { ...state, stepEndTimes: endTimes, status: 'done' };
  }
  return { ...state, stepIndex: nextIndex, stepElapsedMs: 0, stepEndTimes: endTimes };
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start':
      return state.status === 'idle' ? { ...state, status: 'running' } : state;
    case 'pause':
      return state.status === 'running' ? { ...state, status: 'paused' } : state;
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'running' } : state;
    case 'reset':
      return initialTimer(state.steps);
    case 'next':
      return state.status === 'running' || state.status === 'paused' ? advance(state) : state;
    case 'tick': {
      if (state.status !== 'running') return state;
      let next: TimerState = {
        ...state,
        stepElapsedMs: state.stepElapsedMs + action.deltaMs,
        totalElapsedMs: state.totalElapsedMs + action.deltaMs,
      };
      // Auto-advance timed steps. Untimed steps wait for 'next'.
      const step = next.steps[next.stepIndex];
      if (step.duration !== undefined && next.stepElapsedMs >= step.duration * 1000) {
        next = advance(next);
      }
      return next;
    }
  }
}

export function stepRemainingS(state: TimerState): number | undefined {
  const step = state.steps[state.stepIndex];
  if (!step || step.duration === undefined) return undefined;
  return Math.max(0, Math.ceil(step.duration - state.stepElapsedMs / 1000));
}

export function totalRecipeS(steps: RecipeStep[]): number {
  return steps.reduce((sum, s) => sum + (s.duration ?? 0), 0);
}
