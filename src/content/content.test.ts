import { describe, it, expect } from 'vitest';
import {
  methods,
  processing,
  origins,
  roasts,
  varietals,
  grindSizes,
  flavourIndex,
  getMethod,
  getProcess,
  getOrigin,
  getVarietal,
  roastForPosition,
} from './index';

const ids = <T extends { id: string }>(list: T[]) => list.map((x) => x.id);

describe('content integrity', () => {
  it('has unique ids in every collection', () => {
    for (const list of [methods, processing, origins, roasts, varietals, grindSizes] as { id: string }[][]) {
      const all = ids(list);
      expect(new Set(all).size).toBe(all.length);
    }
  });

  it('every method has steps, a sane ratio and roast range', () => {
    for (const m of methods) {
      expect(m.steps.length, m.id).toBeGreaterThan(0);
      expect(m.ratioRange[0]).toBeLessThan(m.ratioRange[1]);
      expect(m.defaultRatio).toBeGreaterThanOrEqual(m.ratioRange[0]);
      expect(m.defaultRatio).toBeLessThanOrEqual(m.ratioRange[1]);
      expect(m.roastRange[0]).toBeGreaterThanOrEqual(0);
      expect(m.roastRange[1]).toBeLessThanOrEqual(100);
      expect(grindSizes.some((g) => g.band === m.grind), `${m.id} grind band`).toBe(true);
      // Water targets must be non-decreasing across steps.
      let last = 0;
      for (const s of m.steps) {
        if (s.waterPerGram !== undefined) {
          expect(s.waterPerGram, `${m.id} step ${s.title}`).toBeGreaterThanOrEqual(last);
          last = s.waterPerGram;
        }
      }
    }
  });

  it('processing methods reference known origins and flavours', () => {
    for (const p of processing) {
      expect(p.stages.length, p.id).toBeGreaterThan(0);
      for (const o of p.commonIn) expect(getOrigin(o), `${p.id} -> origin ${o}`).toBeDefined();
      for (const f of p.flavourTags) expect(flavourIndex.has(f), `${p.id} -> flavour ${f}`).toBe(true);
    }
  });

  it('origins reference known processes, flavours and varietals', () => {
    for (const o of origins) {
      for (const p of o.processes) expect(getProcess(p), `${o.id} -> process ${p}`).toBeDefined();
      for (const f of o.flavourTags) expect(flavourIndex.has(f), `${o.id} -> flavour ${f}`).toBe(true);
      for (const v of o.varietals) expect(getVarietal(v), `${o.id} -> varietal ${v}`).toBeDefined();
      expect(o.map.x).toBeGreaterThanOrEqual(0);
      expect(o.map.x).toBeLessThanOrEqual(100);
      expect(o.map.y).toBeGreaterThanOrEqual(0);
      expect(o.map.y).toBeLessThanOrEqual(100);
    }
  });

  it('varietals reference known origins', () => {
    for (const v of varietals) {
      for (const o of v.origins) expect(getOrigin(o), `${v.id} -> origin ${o}`).toBeDefined();
    }
  });

  it('roasts and grinds reference known methods and have 0-100 positions', () => {
    for (const r of roasts) {
      expect(r.position).toBeGreaterThanOrEqual(0);
      expect(r.position).toBeLessThanOrEqual(100);
      for (const m of r.suits) expect(getMethod(m), `${r.id} -> method ${m}`).toBeDefined();
    }
    for (const g of grindSizes) {
      expect(g.position).toBeGreaterThanOrEqual(0);
      expect(g.position).toBeLessThanOrEqual(100);
      for (const m of g.suits) expect(getMethod(m), `${g.id} -> method ${m}`).toBeDefined();
    }
  });

  it('roast positions are sorted and roastForPosition snaps to nearest', () => {
    const positions = roasts.map((r) => r.position);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(roastForPosition(0).id).toBe('light');
    expect(roastForPosition(100).id).toBe('very-dark');
    expect(roastForPosition(50).id).toBe('medium');
  });
});
