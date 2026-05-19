import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import { runChecks } from '../utils/evaluator.js';
import EvalResult from './EvalResult.jsx';
import HintDrawer from './HintDrawer.jsx';
import RevealAnswer from './RevealAnswer.jsx';

const BLANK_PATTERN = /_{3,}/;

export default function CodeChallenge({
  phase,
  phaseData,
  hints,
  levelCategory,
  onPass,
  savedScore,
}) {
  const isReact = levelCategory === 'React';
  const langExtension = isReact ? javascript({ jsx: true }) : python();
  const starter = phaseData?.starterCode || '';

  const [code, setCode] = useState(starter);
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [blankWarning, setBlankWarning] = useState(false);

  function handleRun() {
    if (BLANK_PATTERN.test(code)) {
      setBlankWarning(true);
      setResult(null);
      return;
    }
    setBlankWarning(false);
    const r = runChecks(code, phaseData.evalChecks);
    setResult(r);
    if (r.passed) onPass?.(r.score);
  }

  function handleCodeChange(val) {
    setCode(val);
    if (blankWarning) setBlankWarning(false);
  }

  function handleReset() {
    setCode(starter);
    setResult(null);
    setBlankWarning(false);
  }

  return (
    <div className="code-challenge">
      <div className="code-challenge-header">
        <div>
          <h3>{phase === 'guided' ? 'Guided Practice' : 'Challenge'}</h3>
          {phaseData?.instructions && (
            <p className="challenge-instructions">{phaseData.instructions}</p>
          )}
        </div>
        {savedScore > 0 && (
          <span className={`eval-label ${savedScore >= 70 ? 'eval-result passed' : 'eval-result failed'}`} style={{ padding: '0.25rem 0.6rem' }}>
            Best: {savedScore}%
          </span>
        )}
      </div>

      <div className="code-challenge-editor">
        <CodeMirror
          value={code}
          onChange={handleCodeChange}
          theme={vscodeLight}
          extensions={[langExtension]}
          basicSetup={{ lineNumbers: true, foldGutter: false }}
          style={{ minHeight: '180px' }}
        />
      </div>

      <div className="code-challenge-actions">
        <button className="btn-primary" onClick={handleRun}>▶ Run Checks</button>
        <button className="btn-secondary" onClick={handleReset}>↺ Reset</button>
        <HintDrawer hints={hints} />
        {!revealed && (
          <RevealAnswer
            solution={phaseData?.solution || ''}
            language={isReact ? 'jsx' : 'python'}
            onReveal={() => setRevealed(true)}
          />
        )}
      </div>

      {blankWarning && (
        <div className="blank-warning">
          <strong>Remove the blanks first!</strong> Replace all <code>_____</code> with your actual code before running checks.
        </div>
      )}

      {result && (
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <EvalResult result={result} />
        </div>
      )}
    </div>
  );
}
