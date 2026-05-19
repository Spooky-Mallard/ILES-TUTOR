import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './academy/academy.css';
import { useProgress } from './academy/hooks/useProgress.js';
import { getLevelById } from './academy/data/levels.js';
import LevelNav from './academy/components/LevelNav.jsx';
import AcademyHome from './academy/pages/AcademyHome.jsx';
import LevelPage from './academy/pages/LevelPage.jsx';

function AcademyShell({ progress, actions }) {
  const location = useLocation();
  const idMatch = location.pathname.match(/\/academy\/level\/(\d+)/);
  const currentLevelId = idMatch ? Number(idMatch[1]) : null;
  const currentLevel = currentLevelId ? getLevelById(currentLevelId) : null;
  const category = currentLevel?.category || 'Django';

  return (
    <div className="academy-layout" data-category={category}>
      <header className="academy-header">
        <h1>
          <Link to="/academy" style={{ color: 'inherit', textDecoration: 'none' }}>
            CSC 1202 Dev Academy
          </Link>
        </h1>
        {currentLevel && (
          <div className="header-actions">
            <span className={`tag ${category === 'React' ? 'tag-react' : 'tag-django'}`}>
              {category}
            </span>
            <span className="header-module">
              M{currentLevel.module}: {currentLevel.moduleTitle}
            </span>
          </div>
        )}
      </header>

      <LevelNav
        currentLevelId={currentLevelId}
        isUnlocked={actions.isUnlocked}
        isComplete={actions.isComplete}
        hasVisited={actions.hasVisited}
      />

      <Routes>
        <Route
          path="/academy"
          element={
            <AcademyHome
              progress={progress}
              isUnlocked={actions.isUnlocked}
              isComplete={actions.isComplete}
              resetAll={actions.resetAll}
            />
          }
        />
        <Route
          path="/academy/level/:id"
          element={
            <LevelPage
              markComplete={actions.markComplete}
              markVisited={actions.markVisited}
              saveScore={actions.saveScore}
              isComplete={actions.isComplete}
              isUnlocked={actions.isUnlocked}
              guidedScores={progress.guidedScores}
              challengeScores={progress.challengeScores}
            />
          }
        />
        <Route path="*" element={
          <div className="level-main" style={{ alignItems: 'center', justifyContent: 'center', gridColumn: '2', gridRow: '2' }}>
            <p>Page not found.</p>
            <Link to="/academy" style={{ marginTop: '1rem' }}>← Back to Academy</Link>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  const hook = useProgress();
  const { guidedScores, challengeScores, markComplete, markVisited, saveScore, isUnlocked, hasVisited, isComplete, resetAll } = hook;
  const progress = { guidedScores, challengeScores };
  const actions = { markComplete, markVisited, saveScore, isUnlocked, hasVisited, isComplete, resetAll };

  return (
    <BrowserRouter>
      <AcademyShell progress={progress} actions={actions} />
    </BrowserRouter>
  );
}
