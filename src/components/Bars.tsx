interface Bar {
  label: string;
  /** 0 to max. */
  value: number;
  colour?: string;
}

export function Bars({ bars, max = 5 }: { bars: Bar[]; max?: number }) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      {bars.map((b) => (
        <div className="bar" key={b.label}>
          <span>{b.label}</span>
          <div className="track" role="meter" aria-label={b.label} aria-valuenow={b.value} aria-valuemin={0} aria-valuemax={max}>
            <div className="fill" style={{ width: `${(b.value / max) * 100}%`, ['--bar-colour' as string]: b.colour }} />
          </div>
        </div>
      ))}
    </div>
  );
}
