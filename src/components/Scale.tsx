interface Props {
  value?: number;
  onChange: (v: number | undefined) => void;
  low: string;
  high: string;
  label: string;
}

/** 1 to 5 picker with word anchors. Tapping the selected value clears it. */
export function Scale({ value, onChange, low, high, label }: Props) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="scale" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-pressed={value === n} onClick={() => onChange(value === n ? undefined : n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="slider-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}
