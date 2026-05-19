export default function DocsSidebar({ level, guidedScore, challengeScore }) {
  return (
    <aside className="docs-sidebar">
      <h3>Documentation</h3>
      <ul className="docs-link-list">
        {level.docs?.map((doc, i) => (
          <li key={i}>
            <a
              className="docs-link"
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 {doc.label}
            </a>
          </li>
        ))}
      </ul>

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
          <span className="score-val">{level.moduleTitle}</span>
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
