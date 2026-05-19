import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLevelById, levels } from '../data/levels.js';
import PhaseReader from '../components/PhaseReader.jsx';
import CodeChallenge from '../components/CodeChallenge.jsx';
import DocsSidebar from '../components/DocsSidebar.jsx';

const PHASES = ['concept', 'guided', 'challenge'];
const PHASE_LABELS = { concept: '1. Concept', guided: '2. Guided', challenge: '3. Challenge' };

export default function LevelPage({ markComplete, markVisited, saveScore, isComplete, isUnlocked, guidedScores, challengeScores }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const levelId = Number(id);
  const level = getLevelById(levelId);
  const [phase, setPhase] = useState('concept');

  useEffect(() => {
    if (level) {
      markVisited(levelId);
      setPhase('concept');
    }
  }, [levelId]);

  if (!level) {
    return (
      <div className="level-main" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p>Level {id} not found.</p>
        <button className="btn-secondary" onClick={() => navigate('/academy')}>Back to Home</button>
      </div>
    );
  }

  if (!isUnlocked(levelId)) {
    return (
      <div className="level-main" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p>This level is locked. Complete the previous level first.</p>
        <button className="btn-secondary" onClick={() => navigate('/academy')}>Back to Home</button>
      </div>
    );
  }

  const levelIndex = levels.findIndex(l => l.id === levelId);
  const prevLevel = levelIndex > 0 ? levels[levelIndex - 1] : null;
  const nextLevel = levelIndex < levels.length - 1 ? levels[levelIndex + 1] : null;

  const guidedScore = guidedScores[levelId] || 0;
  const challengeScore = challengeScores[levelId] || 0;

  function handleGuidedPass(score) {
    saveScore(levelId, 'guided', score);
  }

  function handleChallengePass(score) {
    saveScore(levelId, 'challenge', score);
    markComplete(levelId);
  }

  return (
    <>
      <main className="level-main">
        <div className="level-page-inner">
          <div className="level-page-meta">
            <span>M{level.module}</span>
            <span className="sep">›</span>
            <span>{level.moduleTitle}</span>
            <span className="sep">›</span>
            <span className={`tag ${level.category === 'React' ? 'tag-react' : 'tag-django'}`}>
              {level.category}
            </span>
          </div>

          <h1 className="level-title">Level {level.id}: {level.title}</h1>
          <p className="level-topic">{level.topic}</p>

          <div className="phase-tabs">
            {PHASES.map(p => (
              <button
                key={p}
                className={`phase-tab${phase === p ? ' active' : ''}`}
                onClick={() => setPhase(p)}
              >
                {PHASE_LABELS[p]}
                {p === 'guided' && guidedScore >= 70 && ' ✓'}
                {p === 'challenge' && challengeScore >= 70 && ' ✓'}
              </button>
            ))}
          </div>

          {phase === 'concept' && <PhaseReader level={level} />}

          {phase === 'guided' && level.guided && (
            <CodeChallenge
              phase="guided"
              phaseData={level.guided}
              hints={level.hints}
              levelCategory={level.category}
              onPass={handleGuidedPass}
              savedScore={guidedScore}
            />
          )}

          {phase === 'challenge' && level.challenge && (
            <CodeChallenge
              phase="challenge"
              phaseData={level.challenge}
              hints={level.hints}
              levelCategory={level.category}
              onPass={handleChallengePass}
              savedScore={challengeScore}
            />
          )}

          <div className="level-nav-buttons">
            {prevLevel ? (
              <button
                className="btn-secondary"
                onClick={() => navigate(`/academy/level/${prevLevel.id}`)}
              >
                ← Level {prevLevel.id}
              </button>
            ) : (
              <button className="btn-secondary" onClick={() => navigate('/academy')}>
                ← Home
              </button>
            )}

            {nextLevel && isUnlocked(nextLevel.id) && (
              <button
                className="btn-primary"
                onClick={() => navigate(`/academy/level/${nextLevel.id}`)}
              >
                Level {nextLevel.id} →
              </button>
            )}
          </div>
        </div>
      </main>

      <DocsSidebar
        level={level}
        guidedScore={guidedScore}
        challengeScore={challengeScore}
      />
    </>
  );
}
