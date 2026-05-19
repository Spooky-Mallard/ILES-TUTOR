import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DocEntry({ doc, category }) {
  // External link format: { label, url }
  if (doc.url) {
    return (
      <li>
        <a
          className="docs-link"
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 {doc.label}
        </a>
      </li>
    );
  }

  // Inline reference card format: { heading, content, code }
  return (
    <li className="docs-card">
      <div className="docs-card-heading">{doc.heading}</div>
      {doc.content && <p className="docs-card-content">{doc.content}</p>}
      {doc.code && (
        <SyntaxHighlighter
          language={category === 'React' ? 'jsx' : 'python'}
          style={oneDark}
          customStyle={{ borderRadius: '4px', fontSize: '0.72rem', margin: '0.3rem 0 0', padding: '0.5rem' }}
        >
          {doc.code}
        </SyntaxHighlighter>
      )}
    </li>
  );
}

export default function DocsSidebar({ level, guidedScore, challengeScore }) {
  const hasDocs = level.docs?.length > 0;

  return (
    <aside className="docs-sidebar">
      <h3>Reference</h3>

      {hasDocs ? (
        <ul className="docs-link-list">
          {level.docs.map((doc, i) => (
            <DocEntry key={i} doc={doc} category={level.category} />
          ))}
        </ul>
      ) : (
        <p className="docs-empty">No reference for this level.</p>
      )}

      <hr className="docs-divider" />

      <div className="docs-score-section">
        <h4>Your Scores</h4>
        <div className="docs-score-row">
          <span>Guided</span>
          <span className={`score-val ${guidedScore >= 70 ? 'score-pass' : guidedScore > 0 ? 'score-fail' : ''}`}>
            {guidedScore > 0 ? `${guidedScore}%` : '—'}
          </span>
        </div>
        <div className="docs-score-row">
          <span>Challenge</span>
          <span className={`score-val ${challengeScore >= 70 ? 'score-pass' : challengeScore > 0 ? 'score-fail' : ''}`}>
            {challengeScore > 0 ? `${challengeScore}%` : '—'}
          </span>
        </div>
      </div>

      <hr className="docs-divider" />

      <div className="docs-score-section">
        <h4>Level Info</h4>
        <div className="docs-score-row">
          <span>Module</span>
          <span className="score-val" style={{ fontSize: '.7rem' }}>{level.moduleTitle}</span>
        </div>
        <div className="docs-score-row">
          <span>Category</span>
          <span className={`tag ${level.category === 'React' ? 'tag-react' : 'tag-django'}`}>
            {level.category}
          </span>
        </div>
      </div>
    </aside>
  );
}
