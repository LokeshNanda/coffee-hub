import type { Brew } from '../db/schema';
import { getMethod } from '../content';

/** Water (or yield for espresso) divided by dose. Undefined when not computable. */
export function ratioOf(brew: Pick<Brew, 'doseG' | 'waterG' | 'yieldG' | 'methodId'>): number | undefined {
  const method = getMethod(brew.methodId);
  const out = method?.usesYield ? brew.yieldG : brew.waterG ?? brew.yieldG;
  if (!brew.doseG || !out) return undefined;
  return Math.round((out / brew.doseG) * 10) / 10;
}

export function formatRatio(ratio: number | undefined): string {
  if (ratio === undefined) return '—';
  return `1:${Number.isInteger(ratio) ? ratio : ratio.toFixed(1)}`;
}

/** Whole days between an ISO date and a reference date. Negative if roast is in the future. */
export function daysSinceRoast(roastDate: string | undefined, now = new Date()): number | undefined {
  if (!roastDate) return undefined;
  const roast = new Date(roastDate + 'T00:00:00');
  if (Number.isNaN(roast.getTime())) return undefined;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today.getTime() - roast.getTime()) / 86_400_000);
}

/** Compute the missing side of a ratio. Exactly one of dose/water should be given. */
export function solveRatio(input: { doseG?: number; waterG?: number; ratio: number }): { doseG: number; waterG: number } {
  const { ratio } = input;
  if (input.doseG !== undefined) {
    return { doseG: input.doseG, waterG: Math.round(input.doseG * ratio) };
  }
  if (input.waterG !== undefined) {
    return { doseG: Math.round((input.waterG / ratio) * 10) / 10, waterG: input.waterG };
  }
  return { doseG: 0, waterG: 0 };
}

export function formatSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** A new brew prefilled from a previous one, without id, rating, notes or timestamp. */
export function cloneForBrewAgain(brew: Brew): Omit<Brew, 'id'> {
  const {
    id: _id,
    rating: _rating,
    notes: _notes,
    nextTime: _nextTime,
    brewedAt: _brewedAt,
    stepTimes: _stepTimes,
    bitterness: _b,
    acidity: _a,
    sweetness: _s,
    body: _bo,
    ...rest
  } = brew;
  return { ...rest, rating: 0, flavourTags: [...brew.flavourTags], brewedAt: new Date().toISOString() };
}
