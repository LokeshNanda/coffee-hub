import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Icon } from '../../components/Icon';
import { DeviceIcon } from '../../components/DeviceIcon';
import { Stars } from '../../components/Stars';
import { db } from '../../db/schema';
import { getMethod } from '../../content';
import { formatRatio, ratioOf } from '../../lib/brew';

const topics = [
  { to: '/learn/beans', icon: 'bean', title: 'Beans and varietals', text: 'Arabica, robusta, and the cultivars behind the names on a bag.', tone: 'tone-bean' },
  { to: '/learn/origins', icon: 'globe', title: 'Origins', text: 'A map of where coffee grows and what each place tastes like.', tone: 'tone-leaf' },
  { to: '/learn/processing', icon: 'cherry', title: 'Processing', text: 'Washed, natural, honey, anaerobic. Step through cherry to green bean.', tone: 'tone-cherry' },
  { to: '/learn/roasting', icon: 'flame', title: 'Roasting', text: 'Slide from light to dark and watch acidity, body and sweetness shift.', tone: 'tone-roast' },
  { to: '/learn/grind-water', icon: 'grind', title: 'Grind and water', text: 'The two variables that decide extraction.', tone: 'tone-stone' },
  { to: '/learn/methods', icon: 'brew', title: 'Brewing methods', text: 'Moka, V60, Chemex, Kalita, French press, AeroPress, espresso.', tone: 'tone-crema' },
  { to: '/learn/flavours', icon: 'wheel', title: 'Flavour wheel', text: 'Put words to what you taste.', tone: 'tone-plum' },
  { to: '/learn/sourcing', icon: 'route', title: 'Sourcing', text: 'Farm to cup, and what the labels actually mean.', tone: 'tone-jute' },
];

export function LearnHub() {
  const latest = useLiveQuery(() => db.brews.orderBy('brewedAt').reverse().first(), []);
  const bean = useLiveQuery(() => (latest?.beanId ? db.beans.get(latest.beanId) : undefined), [latest?.beanId]);
  const count = useLiveQuery(() => db.brews.count(), []);

  return (
    <>
      <section className="hero">
        <h1>Know your coffee, then brew it on purpose.</h1>
        <p>Everything from the cherry on the tree to the ratio in your cup, built to be tapped through, not just read.</p>
        <div className="btn-row" style={{ marginTop: 18 }}>
          <Link to="/learn/methods" className="btn primary">
            Pick a brew method
          </Link>
          <Link to="/log/new" className="btn hero-btn">
            Log a brew
          </Link>
        </div>
        <svg className="cup" viewBox="0 0 100 100" aria-hidden="true">
          <ellipse cx="50" cy="82" rx="34" ry="6" fill="#0f0806" />
          <path d="M18 30h56v22a28 28 0 0 1-56 0z" fill="#d9a66b" />
          <ellipse cx="46" cy="30" rx="28" ry="7" fill="#f1e9df" />
          <ellipse cx="46" cy="30" rx="22" ry="5" fill="#7a4b2a" />
          <path d="M74 36h6a9 9 0 0 1 0 18h-6" fill="none" stroke="#d9a66b" strokeWidth="5" />
          <path d="M34 14c0 4 4 4 4 8M44 10c0 4 4 4 4 8M54 14c0 4 4 4 4 8" stroke="#c9b8a8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </section>

      {latest && (
        <section className="latest">
          <div className="latest-icon">
            <DeviceIcon method={latest.methodId} />
          </div>
          <div className="latest-body">
            <div className="latest-kicker">
              Your last brew · {new Date(latest.brewedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </div>
            <div className="latest-title">
              {bean?.name ?? getMethod(latest.methodId)?.name}
              {bean && <span className="faint"> on {getMethod(latest.methodId)?.name}</span>}
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Stars value={latest.rating} small />
              <span className="muted" style={{ fontSize: '0.85rem' }}>
                {latest.doseG} g · {formatRatio(ratioOf(latest))}
                {latest.grindLabel ? ` · grind ${latest.grindLabel}` : ''}
              </span>
            </div>
          </div>
          <div className="latest-actions">
            <Link to={`/log/new?again=${latest.id}`} className="btn small primary">
              <Icon name="repeat" width={16} height={16} /> Brew again
            </Link>
            <Link to="/log" className="btn small ghost">
              All {count} brews
            </Link>
          </div>
        </section>
      )}

      <h2 className="section-title">Learn</h2>
      <div className="tile-grid">
        {topics.map((t) => (
          <Link key={t.to} to={t.to} className={`tile ${t.tone}`}>
            <span className="tile-icon">
              <Icon name={t.icon} />
            </span>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
