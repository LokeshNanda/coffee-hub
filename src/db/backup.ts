import { SCHEMA_VERSION, type Bean, type Brew, type CoffeeDB, type Setting } from './schema';

export interface BackupFile {
  app: 'coffee-hub';
  schemaVersion: number;
  exportedAt: string;
  beans: Bean[];
  brews: Brew[];
  settings: Setting[];
}

export type ImportMode = 'merge' | 'replace';

export type ParseResult = { ok: true; data: BackupFile } | { ok: false; error: string };

export async function exportBackup(db: CoffeeDB): Promise<BackupFile> {
  const [beans, brews, settings] = await Promise.all([
    db.beans.toArray(),
    db.brews.toArray(),
    db.settings.toArray(),
  ]);
  return { app: 'coffee-hub', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), beans, brews, settings };
}

export function backupFileName(date = new Date()): string {
  return `coffee-hub-backup-${date.toISOString().slice(0, 10)}.json`;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Apply forward migrations to a parsed backup from an older schema. */
function migrate(data: BackupFile): BackupFile {
  // Version 1 is the first schema. Future versions add cases here.
  return { ...data, schemaVersion: SCHEMA_VERSION };
}

export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (!isObj(raw) || raw.app !== 'coffee-hub') {
    return { ok: false, error: 'That file does not look like a Coffee Hub backup.' };
  }
  const version = raw.schemaVersion;
  if (typeof version !== 'number') return { ok: false, error: 'Backup is missing a schema version.' };
  if (version > SCHEMA_VERSION) {
    return { ok: false, error: `Backup was made by a newer version of the app (schema ${version}). Update the app first.` };
  }
  for (const key of ['beans', 'brews', 'settings'] as const) {
    if (!Array.isArray(raw[key])) return { ok: false, error: `Backup is missing the "${key}" list.` };
  }
  const brews = raw.brews as unknown[];
  for (const b of brews) {
    if (!isObj(b) || typeof b.methodId !== 'string' || typeof b.doseG !== 'number') {
      return { ok: false, error: 'A brew entry in the backup is malformed.' };
    }
  }
  const beans = raw.beans as unknown[];
  for (const b of beans) {
    if (!isObj(b) || typeof b.name !== 'string') return { ok: false, error: 'A bean entry in the backup is malformed.' };
  }
  const data = migrate({
    app: 'coffee-hub',
    schemaVersion: version,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : '',
    beans: raw.beans as Bean[],
    brews: raw.brews as Brew[],
    settings: raw.settings as Setting[],
  });
  return { ok: true, data };
}

export interface ImportSummary {
  beans: number;
  brews: number;
  settings: number;
}

/** Writes nothing unless the whole import succeeds. */
export async function importBackup(db: CoffeeDB, data: BackupFile, mode: ImportMode): Promise<ImportSummary> {
  await db.transaction('rw', db.beans, db.brews, db.settings, async () => {
    if (mode === 'replace') {
      await Promise.all([db.beans.clear(), db.brews.clear(), db.settings.clear()]);
    }
    await db.beans.bulkPut(data.beans);
    await db.brews.bulkPut(data.brews);
    await db.settings.bulkPut(data.settings);
  });
  return { beans: data.beans.length, brews: data.brews.length, settings: data.settings.length };
}
