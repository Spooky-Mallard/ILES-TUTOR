import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function RevealAnswer({ solution, language = 'python', onReveal }) {
  const [confirming, setConfirming] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    setRevealed(true);
    setConfirming(false);
    onReveal?.();
  }

  if (revealed) {
    return (
      <div className="reveal-answer-wrap">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{ borderRadius: '8px', fontSize: '0.82rem', whiteSpace: 'pre-wrap', overflowX: 'hidden' }}
          wrapLines
          codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
        >
          {solution}
        </SyntaxHighlighter>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="reveal-confirm">
        <p>Revealing the answer means this attempt won't count toward your score. Continue?</p>
        <div className="reveal-confirm-buttons">
          <button className="btn-danger" onClick={handleReveal}>Yes, show answer</button>
          <button className="btn-secondary" onClick={() => setConfirming(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <button className="btn-ghost" onClick={() => setConfirming(true)}>
      👁 Reveal Answer
    </button>
  );
}
