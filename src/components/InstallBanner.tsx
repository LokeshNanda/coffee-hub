import { useState } from 'react';
import { Icon } from './Icon';
import { useInstall } from '../app/install';

const KEY = 'install-banner-dismissed';
const readDismissed = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

/** One-line offer to install the app. Shown only while the browser is holding an install prompt. */
export function InstallBanner() {
  const { canInstall, install } = useInstall();
  const [dismissed, setDismissed] = useState(readDismissed);
  if (!canInstall || dismissed) return null;
  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // Private mode: just hide it for this visit.
    }
  };
  return (
    <div className="install-banner" role="region" aria-label="Install Coffee Hub">
      <span className="install-icon">
        <Icon name="install" />
      </span>
      <div className="install-text">
        <strong>Add Coffee Hub to your home screen</strong>
        <span>Opens full-screen and works offline.</span>
      </div>
      <button className="btn small primary" onClick={install}>
        Install
      </button>
      <button className="install-close" onClick={dismiss} aria-label="Not now">
        ×
      </button>
    </div>
  );
}
