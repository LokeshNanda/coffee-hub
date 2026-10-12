import { describe, it, expect } from 'vitest';
import { ratioOf, formatRatio, daysSinceRoast, solveRatio, formatSeconds, cloneForBrewAgain } from './brew';
import { initialTimer, timerReducer, stepRemainingS, totalRecipeS } from './timer';
import type { RecipeStep } from '../content';

describe('ratio helpers', () => {
  it('computes water:dose for filter and yield:dose for espresso', () => {
    expect(ratioOf({ methodId: 'v60', doseG: 15, waterG: 240 })).toBe(16);
    expect(ratioOf({ methodId: 'espresso', doseG: 18, yieldG: 36 })).toBe(2);
    expect(ratioOf({ methodId: 'espresso', doseG: 18, waterG: 300, yieldG: 40 })).toBe(2.2);
    expect(ratioOf({ methodId: 'v60', doseG: 0, waterG: 240 })).toBeUndefined();
    expect(ratioOf({ methodId: 'v60', doseG: 15 })).toBeUndefined();
  });

  it('formats ratios', () => {
    expect(formatRatio(16)).toBe('1:16');
    expect(formatRatio(2.2)).toBe('1:2.2');
    expect(formatRatio(undefined)).toBe('—');
  });

  it('solves the missing side of a ratio', () => {
    expect(solveRatio({ doseG: 15, ratio: 16 })).toEqual({ doseG: 15, waterG: 240 });
    expect(solveRatio({ waterG: 250, ratio: 16 })).toEqual({ doseG: 15.6, waterG: 250 });
  });

  it('counts days since roast', () => {
    const now = new Date('2026-10-12T20:00:00');
    expect(daysSinceRoast('2026-10-01', now)).toBe(11);
    expect(daysSinceRoast('2026-10-12', now)).toBe(0);
    expect(daysSinceRoast(undefined, now)).toBeUndefined();
    expect(daysSinceRoast('garbage', now)).toBeUndefined();
  });

  it('formats seconds as m:ss', () => {
    expect(formatSeconds(0)).toBe('0:00');
    expect(formatSeconds(65)).toBe('1:05');
    expect(formatSeconds(600)).toBe('10:00');
  });

  it('clones a brew for "brew again" without result fields', () => {
    const clone = cloneForBrewAgain({
      id: 9,
      methodId: 'moka',
      doseG: 18,
      waterG: 150,
      grindLabel: '12',
      rating: 5,
      notes: 'great',
      nextTime: 'less heat',
      bitterness: 4,
      flavourTags: ['chocolate'],
      brewedAt: '2026-01-01T00:00:00.000Z',
      stepTimes: [10, 20],
    });
    expect(clone).not.toHaveProperty('id');
    expect(clone.rating).toBe(0);
    expect(clone.notes).toBeUndefined();
    expect(clone.bitterness).toBeUndefined();
    expect(clone.stepTimes).toBeUndefined();
    expect(clone.grindLabel).toBe('12');
    expect(clone.flavourTags).toEqual(['chocolate']);
    expect(clone.brewedAt).not.toBe('2026-01-01T00:00:00.000Z');
  });
});

describe('timer reducer', () => {
  const steps: RecipeStep[] = [
    { title: 'Prep', instruction: 'untimed' },
    { title: 'Bloom', instruction: 'timed', duration: 30 },
    { title: 'Pour', instruction: 'timed', duration: 20 },
  ];

  it('starts idle and only ticks while running', () => {
    let s = initialTimer(steps);
    expect(s.status).toBe('idle');
    s = timerReducer(s, { type: 'tick', deltaMs: 1000 });
    expect(s.totalElapsedMs).toBe(0);
    s = timerReducer(s, { type: 'start' });
    s = timerReducer(s, { type: 'tick', deltaMs: 1000 });
    expect(s.totalElapsedMs).toBe(1000);
  });

  it('does not auto-advance untimed steps but advances on next, recording end time', () => {
    let s = timerReducer(initialTimer(steps), { type: 'start' });
    s = timerReducer(s, { type: 'tick', deltaMs: 5000 });
    expect(s.stepIndex).toBe(0);
    expect(stepRemainingS(s)).toBeUndefined();
    s = timerReducer(s, { type: 'next' });
    expect(s.stepIndex).toBe(1);
    expect(s.stepEndTimes).toEqual([5]);
    expect(s.stepElapsedMs).toBe(0);
  });

  it('auto-advances timed steps and finishes', () => {
    let s = timerReducer(initialTimer(steps), { type: 'start' });
    s = timerReducer(s, { type: 'next' }); // to bloom
    s = timerReducer(s, { type: 'tick', deltaMs: 29000 });
    expect(stepRemainingS(s)).toBe(1);
    s = timerReducer(s, { type: 'tick', deltaMs: 1000 });
    expect(s.stepIndex).toBe(2);
    expect(s.stepEndTimes).toEqual([0, 30]);
    s = timerReducer(s, { type: 'tick', deltaMs: 20000 });
    expect(s.status).toBe('done');
    expect(s.stepEndTimes).toEqual([0, 30, 50]);
    expect(s.totalElapsedMs).toBe(50000);
    // Ticks after done are ignored.
    expect(timerReducer(s, { type: 'tick', deltaMs: 1000 }).totalElapsedMs).toBe(50000);
  });

  it('pauses, resumes and resets', () => {
    let s = timerReducer(initialTimer(steps), { type: 'start' });
    s = timerReducer(s, { type: 'pause' });
    s = timerReducer(s, { type: 'tick', deltaMs: 1000 });
    expect(s.totalElapsedMs).toBe(0);
    s = timerReducer(s, { type: 'resume' });
    s = timerReducer(s, { type: 'tick', deltaMs: 1000 });
    expect(s.totalElapsedMs).toBe(1000);
    s = timerReducer(s, { type: 'reset' });
    expect(s).toEqual(initialTimer(steps));
  });

  it('sums timed steps for total recipe time', () => {
    expect(totalRecipeS(steps)).toBe(50);
  });
});
