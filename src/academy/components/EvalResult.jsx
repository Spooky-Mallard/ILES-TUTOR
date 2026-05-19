export default function EvalResult({ result }) {
  if (!result) return null;
  const { score, passed, results, feedback, praise } = result;

  return (
    <div className={`eval-result ${passed ? 'passed' : 'failed'}`}>
      <div className="eval-result-header">
        <span className="eval-score">{score}%</span>
        <span className="eval-label">{passed ? 'PASS' : 'FAIL'}</span>
        {praise && <span className="eval-praise">{praise}</span>}
      </div>
      <div className="eval-checks">
        {results.map(r => (
          <div key={r.id} className="eval-check">
            <span className="eval-check-icon">{r.passed ? '✅' : '❌'}</span>
            <span className="eval-check-desc">{r.description}</span>
            {!r.passed && r.failFeedback && (
              <span className="eval-check-feedback">— {r.failFeedback}</span>
            )}
          </div>
        ))}
      </div>
      {!passed && feedback?.length > 0 && (
        <div className="eval-feedback-list">
          {feedback.map((f, i) => (
            <div key={i} className="eval-feedback-item">
              <span>→</span> {f}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
