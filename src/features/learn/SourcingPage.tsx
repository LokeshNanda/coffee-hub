import { PageHead } from '../../components/PageHead';
import { Journey } from '../../components/Journey';
import { sourcingJourney, sourcingTerms } from '../../content';

export function SourcingPage() {
  return (
    <>
      <PageHead title="Sourcing" intro="A bag of coffee passes through at least six pairs of hands before yours. Here is the route, and what the words on the label mean." />
      <Journey stages={sourcingJourney} resetKey="sourcing" />
      <section className="section">
        <h2>Words on the bag</h2>
        <dl className="defs">
          {sourcingTerms.map((t) => (
            <div key={t.term}>
              <dt>{t.term}</dt>
              <dd>{t.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
