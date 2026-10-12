import { PageHead } from '../../components/PageHead';
import { Markdown } from '../../components/Markdown';
import { MethodChip } from '../../components/Chips';
import { grindSizes, prose } from '../../content';

/** A swatch of particles whose size grows with the grind position. */
function GrindSwatch({ position }: { position: number }) {
  const r = 0.6 + (position / 100) * 4.5;
  const step = r * 2.6;
  const dots: { x: number; y: number }[] = [];
  for (let y = step / 2; y < 56; y += step) {
    for (let x = step / 2 + ((Math.round(y / step) % 2) * step) / 2; x < 56; x += step) {
      dots.push({ x, y });
    }
  }
  return (
    <svg className="grind-swatch" viewBox="0 0 56 56" aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={r} fill="var(--text-2)" />
      ))}
    </svg>
  );
}

export function GrindWaterPage() {
  return (
    <>
      <PageHead title="Grind and water" intro="Grind size and water decide how much of the coffee ends up in your cup. Everything else is fine tuning." />

      <section className="section">
        <h2>Grind scale</h2>
        <div className="grind-scale">
          {grindSizes.map((g) => (
            <div className="grind-item card" key={g.id}>
              <GrindSwatch position={g.position} />
              <div>
                <div className="spread">
                  <strong>{g.name}</strong>
                </div>
                <div className="muted" style={{ fontSize: '0.9rem' }}>
                  {g.looksLike}
                </div>
                <div className="chips" style={{ marginTop: 6 }}>
                  {g.suits.map((m) => (
                    <MethodChip key={m} id={m} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <Markdown text={prose.grindGuide.body} />
      </section>

      <section className="section">
        <h2>{prose.water.title}</h2>
        <Markdown text={prose.water.body} />
      </section>
    </>
  );
}
