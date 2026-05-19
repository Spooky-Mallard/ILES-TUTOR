import { useNavigate } from 'react-router-dom';
import { levels, modules, getLevelsByModule } from '../data/levels.js';
import ProgressBar from '../components/ProgressBar.jsx';

export default function AcademyHome({ progress, isUnlocked, isComplete, resetAll }) {
  const navigate = useNavigate();
  const completed = levels.filter(l => isComplete(l.id)).length;

  function getFirstIncompleteLevel() {
    for (const level of levels) {
      if (!isComplete(level.id) && isUnlocked(level.id)) return level.id;
    }
    return levels[0].id;
  }

  function getModuleLevelCounts(modId) {
    const modLevels = getLevelsByModule(modId);
    const done = modLevels.filter(l => isComplete(l.id)).length;
    return { total: modLevels.length, done };
  }

  return (
    <div className="academy-home">
      <div className="academy-home-hero">
        <h1>CSC 1202 Dev Academy</h1>
        <p>
          52 progressive levels — Django, DRF, and React. Build real skills through
          reading, annotated examples, guided practice, and open challenges.
        </p>
        <button
          className="home-start-btn"
          onClick={() => navigate(`/academy/level/${getFirstIncompleteLevel()}`)}
        >
          {completed > 0 ? 'Continue Learning' : 'Start Learning'} →
        </button>
      </div>

      <div className="home-progress-card">
        <h2>Overall Progress</h2>
        <div style={{ flex: 1 }}>
          <ProgressBar completed={completed} total={levels.length} label="Levels" />
        </div>
        <button className="btn-ghost" style={{ fontSize: '.75rem' }} onClick={resetAll}>
          Reset All
        </button>
      </div>

      <div className="home-module-grid">
        {modules.map(mod => {
          const { total, done } = getModuleLevelCounts(mod.id);
          const modLevels = getLevelsByModule(mod.id);
          const unlocked = modLevels.some(l => isUnlocked(l.id));
          const firstLevel = modLevels[0];

          return (
            <div
              key={mod.id}
              className={`home-module-card${!unlocked ? ' locked' : ''}`}
              onClick={() => unlocked && navigate(`/academy/level/${firstLevel.id}`)}
            >
              <div className="home-module-card-header">
                <h3>M{mod.id}: {mod.title}</h3>
                <span className={`module-category-badge ${mod.category.toLowerCase()}`}>
                  {mod.category}
                </span>
              </div>
              <p>{done}/{total} levels complete</p>
              <ProgressBar completed={done} total={total} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
