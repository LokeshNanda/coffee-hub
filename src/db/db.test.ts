import { describe, it, expect, beforeEach } from 'vitest';
import { CoffeeDB, SCHEMA_VERSION, type Brew } from './schema';
import { exportBackup, parseBackup, importBackup, backupFileName } from './backup';
import { bestBrewsForBean, bestBrewPerMethod, lastBrewForMethod, brewsForBean, recentBrews } from './queries';

let db: CoffeeDB;
let counter = 0;

const brew = (over: Partial<Brew>): Brew => ({
  methodId: 'v60',
  doseG: 15,
  waterG: 240,
  rating: 3,
  flavourTags: [],
  brewedAt: '2026-10-01T08:00:00.000Z',
  ...over,
});

beforeEach(async () => {
  db = new CoffeeDB(`test-${counter++}`);
  await db.open();
});

describe('brews and beans', () => {
  it('adds a bean and brews linked to it', async () => {
    const beanId = await db.beans.add({ name: 'Yirgacheffe', roastPosition: 20, archived: false, createdAt: '2026-10-01T00:00:00.000Z' });
    await db.brews.add(brew({ beanId }));
    await db.brews.add(brew({ beanId, rating: 5, brewedAt: '2026-10-02T08:00:00.000Z' }));
    const list = await brewsForBean(db, beanId as number);
    expect(list).toHaveLength(2);
    expect(list[0].brewedAt < list[1].brewedAt).toBe(true);
  });

  it('returns best-rated brews for a bean, newest first on ties', async () => {
    const beanId = (await db.beans.add({ name: 'A', roastPosition: 40, archived: false, createdAt: '' })) as number;
    await db.brews.bulkAdd([
      brew({ beanId, rating: 2, brewedAt: '2026-10-01T00:00:00.000Z' }),
      brew({ beanId, rating: 5, brewedAt: '2026-10-02T00:00:00.000Z' }),
      brew({ beanId, rating: 5, brewedAt: '2026-10-03T00:00:00.000Z' }),
      brew({ beanId, rating: 4, brewedAt: '2026-10-04T00:00:00.000Z' }),
      brew({ rating: 5, brewedAt: '2026-10-05T00:00:00.000Z' }), // different bean
    ]);
    const best = await bestBrewsForBean(db, beanId, 3);
    expect(best.map((b) => b.rating)).toEqual([5, 5, 4]);
    expect(best[0].brewedAt).toBe('2026-10-03T00:00:00.000Z');
  });

  it('finds the best brew per method and the last brew for a method', async () => {
    await db.brews.bulkAdd([
      brew({ methodId: 'v60', rating: 3, brewedAt: '2026-10-01T00:00:00.000Z' }),
      brew({ methodId: 'v60', rating: 4, brewedAt: '2026-10-02T00:00:00.000Z' }),
      brew({ methodId: 'moka', rating: 5, brewedAt: '2026-09-01T00:00:00.000Z' }),
      brew({ methodId: 'moka', rating: 2, brewedAt: '2026-10-03T00:00:00.000Z' }),
    ]);
    const best = await bestBrewPerMethod(db);
    expect(best.get('v60')?.rating).toBe(4);
    expect(best.get('moka')?.rating).toBe(5);
    const last = await lastBrewForMethod(db, 'moka');
    expect(last?.rating).toBe(2);
    expect(await lastBrewForMethod(db, 'espresso')).toBeUndefined();
  });

  it('lists recent brews newest first', async () => {
    await db.brews.bulkAdd([
      brew({ brewedAt: '2026-10-01T00:00:00.000Z' }),
      brew({ brewedAt: '2026-10-03T00:00:00.000Z' }),
      brew({ brewedAt: '2026-10-02T00:00:00.000Z' }),
    ]);
    const list = await recentBrews(db, 2);
    expect(list.map((b) => b.brewedAt)).toEqual(['2026-10-03T00:00:00.000Z', '2026-10-02T00:00:00.000Z']);
  });
});

describe('backup', () => {
  it('names the file by date', () => {
    expect(backupFileName(new Date('2026-10-12T15:00:00Z'))).toBe('coffee-hub-backup-2026-10-12.json');
  });

  it('round-trips export through import in replace mode', async () => {
    const beanId = (await db.beans.add({ name: 'A', roastPosition: 40, archived: false, createdAt: '' })) as number;
    await db.brews.add(brew({ beanId, notes: 'lovely' }));
    await db.settings.put({ key: 'theme', value: 'dark' });

    const file = await exportBackup(db);
    expect(file.schemaVersion).toBe(SCHEMA_VERSION);
    const parsed = parseBackup(JSON.stringify(file));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const target = new CoffeeDB(`test-target-${counter++}`);
    await target.brews.add(brew({ notes: 'should vanish' }));
    const summary = await importBackup(target, parsed.data, 'replace');
    expect(summary).toEqual({ beans: 1, brews: 1, settings: 1 });
    const brews = await target.brews.toArray();
    expect(brews).toHaveLength(1);
    expect(brews[0].notes).toBe('lovely');
    expect(brews[0].beanId).toBe(beanId);
    expect((await target.settings.get('theme'))?.value).toBe('dark');
  });

  it('merge mode upserts by id and keeps existing rows', async () => {
    await db.brews.add(brew({ id: 1, notes: 'old' }));
    await db.brews.add(brew({ id: 2, notes: 'keep' }));
    const file = await exportBackup(db);
    file.brews = [{ ...file.brews[0], notes: 'new' }, brew({ id: 7, notes: 'added' })];
    await importBackup(db, file, 'merge');
    const all = await db.brews.orderBy('id').toArray();
    expect(all.map((b) => b.notes)).toEqual(['new', 'keep', 'added']);
  });

  it('rejects junk, wrong app, newer schema and malformed entries', () => {
    expect(parseBackup('not json').ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: 'other' })).ok).toBe(false);
    const newer = parseBackup(JSON.stringify({ app: 'coffee-hub', schemaVersion: SCHEMA_VERSION + 1, beans: [], brews: [], settings: [] }));
    expect(newer.ok).toBe(false);
    if (!newer.ok) expect(newer.error).toMatch(/newer/);
    const bad = parseBackup(JSON.stringify({ app: 'coffee-hub', schemaVersion: 1, beans: [], brews: [{ nope: 1 }], settings: [] }));
    expect(bad.ok).toBe(false);
  });

  it('import is atomic: a failing write leaves the db untouched', async () => {
    await db.brews.add(brew({ id: 1, notes: 'original' }));
    const file = await exportBackup(db);
    // Duplicate primary keys inside one bulkPut on a non-autoincrement path is fine, so force a failure
    // by passing an invalid key type for a bean.
    file.beans = [{ id: {} as unknown as number, name: 'broken', roastPosition: 0, archived: false, createdAt: '' }];
    await expect(importBackup(db, file, 'replace')).rejects.toBeTruthy();
    const all = await db.brews.toArray();
    expect(all).toHaveLength(1);
    expect(all[0].notes).toBe('original');
  });
});
