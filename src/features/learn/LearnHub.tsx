import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';

const topics = [
  { to: '/learn/beans', icon: 'bean', title: 'Beans & varietals', text: 'Arabica, robusta, and the cultivars behind the names on a bag.' },
  { to: '/learn/origins', icon: 'globe', title: 'Origins', text: 'A map of where coffee grows and what each place tastes like.' },
  { to: '/learn/processing', icon: 'cherry', title: 'Processing', text: 'Washed, natural, honey, anaerobic. Step through cherry to green bean.' },
  { to: '/learn/roasting', icon: 'flame', title: 'Roasting', text: 'Slide from light to dark and watch acidity, body and sweetness shift.' },
  { to: '/learn/grind-water', icon: 'grind', title: 'Grind & water', text: 'The two variables that decide extraction.' },
  { to: '/learn/methods', icon: 'brew', title: 'Brewing methods', text: 'Moka, V60, Chemex, Kalita, French press, AeroPress, espresso.' },
  { to: '/learn/flavours', icon: 'wheel', title: 'Flavour wheel', text: 'Put words to what you taste.' },
  { to: '/learn/sourcing', icon: 'route', title: 'Sourcing', text: 'Farm to cup, and what the labels actually mean.' },
];

export function LearnHub() {
  return (
    <>
      <section className="hero">
        <h1>Know your coffee, then brew it on purpose.</h1>
        <p>Everything from the cherry on the tree to the ratio in your cup, built to be tapped through, not just read.</p>
        <svg className="cup" viewBox="0 0 100 100" aria-hidden="true">
          <ellipse cx="50" cy="82" rx="34" ry="6" fill="#0f0806" />
          <path d="M18 30h56v22a28 28 0 0 1-56 0z" fill="#d9a66b" />
          <ellipse cx="46" cy="30" rx="28" ry="7" fill="#f1e9df" />
          <ellipse cx="46" cy="30" rx="22" ry="5" fill="#7a4b2a" />
          <path d="M74 36h6a9 9 0 0 1 0 18h-6" fill="none" stroke="#d9a66b" strokeWidth="5" />
          <path d="M34 14c0 4 4 4 4 8M44 10c0 4 4 4 4 8M54 14c0 4 4 4 4 8" stroke="#c9b8a8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </section>
      <div className="tile-grid">
        {topics.map((t) => (
          <Link key={t.to} to={t.to} className="tile">
            <Icon name={t.icon} />
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
