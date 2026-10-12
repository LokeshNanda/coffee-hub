import { Icon } from './Icon';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  small?: boolean;
  label?: string;
}

export function Stars({ value, onChange, small, label = 'Rating' }: Props) {
  const readOnly = !onChange;
  return (
    <div className={`stars${small ? ' small' : ''}`} role={readOnly ? 'img' : 'radiogroup'} aria-label={readOnly ? `${label} ${value} of 5` : label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'on' : ''}
          role={readOnly ? undefined : 'radio'}
          aria-checked={readOnly ? undefined : n === value}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          tabIndex={readOnly ? -1 : 0}
          onClick={() => onChange?.(n)}
        >
          <Icon name="star" fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}
