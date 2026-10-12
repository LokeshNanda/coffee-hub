import { Fragment, type ReactNode } from 'react';

/** Renders the tiny markdown subset used in content: ## headings, paragraphs, - lists, **bold**, *italic*. */
export function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="md">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines[0].startsWith('## ')) {
          return (
            <Fragment key={i}>
              <h2>{inline(lines[0].slice(3))}</h2>
              {lines.length > 1 && <p>{inline(lines.slice(1).join(' '))}</p>}
            </Fragment>
          );
        }
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(lines.join(' '))}</p>;
      })}
    </div>
  );
}

function inline(s: string): ReactNode[] {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
}
