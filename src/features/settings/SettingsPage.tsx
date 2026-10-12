import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Icon } from '../../components/Icon';
import { db } from '../../db/schema';
import { exportBackup, backupFileName, parseBackup, importBackup, type BackupFile, type ImportMode } from '../../db/backup';
import { useTheme, type Theme } from '../../app/theme';

export function SettingsPage() {
  const [theme, setTheme] = useTheme();
  const counts = useLiveQuery(async () => ({ beans: await db.beans.count(), brews: await db.brews.count() }), []);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [wipeStep, setWipeStep] = useState(0);

  const doExport = async () => {
    const data = await exportBackup(db);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFileName();
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ kind: 'ok', text: `Exported ${data.brews.length} brews and ${data.beans.length} beans.` });
  };

  const onFile = async (file: File | undefined) => {
    setMessage(null);
    setPending(null);
    if (!file) return;
    const parsed = parseBackup(await file.text());
    if (!parsed.ok) return setMessage({ kind: 'error', text: parsed.error });
    setPending(parsed.data);
  };

  const doImport = async (mode: ImportMode) => {
    if (!pending) return;
    try {
      const s = await importBackup(db, pending, mode);
      setMessage({ kind: 'ok', text: `${mode === 'replace' ? 'Replaced with' : 'Merged'} ${s.brews} brews and ${s.beans} beans.` });
      setPending(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      setMessage({ kind: 'error', text: `Import failed and nothing was changed: ${(e as Error).message}` });
    }
  };

  const wipe = async () => {
    await db.transaction('rw', db.beans, db.brews, db.settings, async () => {
      await Promise.all([db.beans.clear(), db.brews.clear(), db.settings.clear()]);
    });
    setWipeStep(0);
    setMessage({ kind: 'ok', text: 'All data cleared.' });
  };

  return (
    <>
      <header className="page-head">
        <h1>Settings</h1>
        <p>
          {counts ? `${counts.brews} brews and ${counts.beans} beans` : '…'} stored in this browser. Nothing leaves your device unless you export it.
        </p>
      </header>

      {message && (
        <p role="status" className={message.kind === 'error' ? 'form-error' : ''} style={{ background: message.kind === 'ok' ? 'var(--ok-soft)' : undefined, padding: '10px 14px', borderRadius: 'var(--r-md)' }}>
          {message.text}
        </p>
      )}

      <section className="section card stack">
        <h3>Backup</h3>
        <p className="muted" style={{ margin: 0 }}>
          Export writes one JSON file with everything. Keep it in Drive, iCloud or anywhere. Import it on a new phone or after clearing the browser.
        </p>
        <div className="btn-row">
          <button className="btn primary" onClick={doExport}>
            <Icon name="download" width={18} height={18} /> Export backup
          </button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            <Icon name="upload" width={18} height={18} /> Import backup
            <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        </div>
        {pending && (
          <div className="card" style={{ background: 'var(--accent-soft)' }}>
            <p style={{ margin: '0 0 10px' }}>
              The file holds <strong>{pending.brews.length} brews</strong> and <strong>{pending.beans.length} beans</strong>
              {pending.exportedAt ? `, exported ${new Date(pending.exportedAt).toLocaleDateString()}` : ''}. How should it be applied?
            </p>
            <div className="btn-row">
              <button className="btn primary" onClick={() => doImport('merge')}>
                Merge into current data
              </button>
              <button className="btn danger" onClick={() => doImport('replace')}>
                Replace everything
              </button>
              <button className="btn ghost" onClick={() => setPending(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="section card stack">
        <h3>Appearance</h3>
        <div className="seg" role="group" aria-label="Theme">
          {(['system', 'light', 'dark'] as Theme[]).map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="section card stack">
        <h3>Clear all data</h3>
        <p className="muted" style={{ margin: 0 }}>
          Removes every brew, bean and setting from this browser. Export first if you want to keep anything.
        </p>
        {wipeStep === 0 && (
          <button className="btn danger" onClick={() => setWipeStep(1)}>
            Clear all data
          </button>
        )}
        {wipeStep === 1 && (
          <div className="btn-row">
            <button className="btn danger primary" onClick={() => setWipeStep(2)}>
              Yes, I have a backup
            </button>
            <button className="btn" onClick={() => setWipeStep(0)}>
              Cancel
            </button>
          </div>
        )}
        {wipeStep === 2 && (
          <div className="btn-row">
            <button className="btn danger primary" onClick={wipe}>
              Delete everything now
            </button>
            <button className="btn" onClick={() => setWipeStep(0)}>
              Cancel
            </button>
          </div>
        )}
      </section>

      <p className="faint" style={{ fontSize: '0.85rem' }}>
        Coffee Hub runs entirely in your browser and works offline once installed.
      </p>
    </>
  );
}
