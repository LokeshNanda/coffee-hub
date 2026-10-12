import { useEffect, useState } from 'react';

/**
 * Captures the browser's install prompt as early as possible. The event fires once,
 * soon after load, so it has to be caught at module level rather than inside a page
 * that may not be mounted yet.
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface InstallState {
  /** The browser offered an install prompt and we are holding it. */
  canInstall: boolean;
  /** Running from the home screen already (or just installed this session). */
  installed: boolean;
}

let deferred: InstallPromptEvent | null = null;
let installed = typeof window !== 'undefined' && !!window.matchMedia?.('(display-mode: standalone)').matches;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function captureInstallPrompt() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    notify();
  });
}

export function getInstallState(): InstallState {
  return { canInstall: deferred !== null && !installed, installed };
}

/** Shows the native prompt. Resolves true if the user accepted. */
export async function promptInstall(): Promise<boolean> {
  const ev = deferred;
  if (!ev) return false;
  await ev.prompt();
  const { outcome } = await ev.userChoice;
  deferred = null;
  if (outcome === 'accepted') installed = true;
  notify();
  return outcome === 'accepted';
}

export function useInstall(): InstallState & { install: () => Promise<boolean> } {
  const [state, setState] = useState(getInstallState);
  useEffect(() => {
    const l = () => setState(getInstallState());
    listeners.add(l);
    l();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { ...state, install: promptInstall };
}
