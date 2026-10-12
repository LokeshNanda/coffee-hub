import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface Props {
  title: string;
  intro?: string;
  back?: { to: string; label: string };
}

export function PageHead({ title, intro, back = { to: '/', label: 'Learn' } }: Props) {
  return (
    <header className="page-head">
      <Link to={back.to} className="back">
        <Icon name="back" width={16} height={16} /> {back.label}
      </Link>
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </header>
  );
}
