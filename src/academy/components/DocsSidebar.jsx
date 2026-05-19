import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DocsModal({ docs, category, onClose }) {
  const [active, setActive] = useState(0);
  const doc = docs[active];

  return (
    <div className="docs-modal-overlay" onClick={onClose}>
      <div className="docs-modal" onClick={e => e.stopPropagation()}>
        <div className="docs-modal-header">
          <h3>Reference</h3>
          <button className="docs-modal-close" onClick={onClose}>✕</button>
        </div>

        {docs.length > 1 && (
          <div className="docs-modal-tabs">
            {docs.map((d, i) => (
              <button
                key={i}
                className={`docs-modal-tab${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                {d.heading || d.label || `Item ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        <div className="docs-modal-body">
          {/* External link */}
          {doc.url && (
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="docs-ext-link">
              📄 {doc.label} — opens in new tab →
            </a>
          )}

          {/* Inline reference card */}
          {doc.heading && (
            <>
              <h4 className="docs-card-heading">{doc.heading}</h4>
              {doc.content && <p className="docs-card-content">{doc.content}</p>}
              {doc.code && (
                <SyntaxHighlighter
                  language={category === 'React' ? 'jsx' : 'python'}
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    margin: '0.75rem 0 0',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    whiteSpace: 'pre',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                  codeTagProps={{
                    style: {
                      whiteSpace: 'pre',
                      display: 'block',
                    }
                  }}
                >
                  {doc.code}
                </SyntaxHighlighter>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocsSidebar({ level, guidedScore, challengeScore }) {
  const [modalOpen, setModalOpen] = useState(false);
  const hasDocs = level.docs?.length > 0;

  return (
    <aside className="docs-sidebar">
      <h3>Reference</h3>

      {hasDocs ? (
        <button className="btn-primary docs-open-btn" onClick={() => setModalOpen(true)}>
          📖 View Reference ({level.docs.length})
        </button>
      ) : (
        <p className="docs-empty">No reference for this level.</p>
      )}

      {modalOpen && (
        <DocsModal
          docs={level.docs}
          category={level.category}
          onClose={() => setModalOpen(false)}
        />
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
