import { useState } from 'react';
import { runChecks } from '../utils/evaluator';

export function useEvaluator() {
  const [result, setResult] = useState(null);

  function evaluate({ code, checks }) {
    const evalResult = runChecks(code, checks);
    setResult(evalResult);
    return evalResult;
  }

  function reset() {
    setResult(null);
  }

  return { evaluate, result, reset };
}
