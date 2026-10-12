import { NavLink, Outlet } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Icon } from '../components/Icon';
import { InstallBanner } from '../components/InstallBanner';
import { useTheme } from './theme';

const tabs = [
  { to: '/', label: 'Learn', icon: 'learn', end: true },
  { to: '/brew', label: 'Brew', icon: 'brew' },
  { to: '/log', label: 'Log', icon: 'log' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export function Shell() {
  useTheme();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <div className="shell">
      <nav className="nav" aria-label="Main">
        <div className="nav-brand">Coffee Hub</div>
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="pill">
              <Icon name={t.icon} />
            </span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
      <main className="main">
        <InstallBanner />
        <Outlet />
      </main>
      {needRefresh && (
        <div className="toast" role="status">
          <span>A new version is ready.</span>
          <button onClick={() => updateServiceWorker(true)}>Update</button>
          <button onClick={() => setNeedRefresh(false)} aria-label="Dismiss" style={{ background: 'transparent', color: '#fff' }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
