export function runChecks(code, checks) {
  const normalised = code
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '    ');

  const results = checks.map(check => {
    let passed = false;
    try {
      passed = check.test(normalised);
    } catch (_) {
      passed = false;
    }
    return {
      id: check.id,
      description: check.description,
      passed,
      points: check.points,
      earnedPoints: passed ? check.points : 0,
      failFeedback: check.failFeedback,
    };
  });

  const totalPoints = checks.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = results.reduce((sum, r) => sum + r.earnedPoints, 0);
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = score >= 70;

  const failedChecks = results.filter(r => !r.passed);
  const passedChecks = results.filter(r => r.passed);

  const praise = passedChecks.length > 0
    ? `You got ${passedChecks.map(r => r.description.toLowerCase()).join(', ')} right.`
    : 'Keep going — re-read the annotated example and try again.';

  const feedback = failedChecks.length > 0
    ? failedChecks.map(r => r.failFeedback)
    : ['Everything looks correct!'];

  return { score, passed, results, feedback, praise };
}
