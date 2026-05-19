import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './academy/academy.css';
import { useProgress } from './academy/hooks/useProgress.js';
import { getLevelById } from './academy/data/levels.js';
import LevelNav from './academy/components/LevelNav.jsx';
import AcademyHome from './academy/pages/AcademyHome.jsx';
import LevelPage from './academy/pages/LevelPage.jsx';

function MobileBottomNav({ onToggleNav, onToggleRef, navOpen, refOpen, hasLevel }) {
  const navigate = useNavigate();
  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-btn${navOpen ? ' active' : ''}`}
        onClick={onToggleNav}
        aria-label="Toggle contents"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <span>Contents</span>
      </button>
      <button
        className="mobile-nav-btn"
        onClick={() => navigate('/academy')}
        aria-label="Home"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </button>
      {hasLevel && (
        <button
          className={`mobile-nav-btn${refOpen ? ' active' : ''}`}
          onClick={onToggleRef}
          aria-label="Toggle reference"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span>Reference</span>
        </button>
      )}
    </nav>
  );
}

function AcademyShell({ progress, actions }) {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);

  const idMatch = location.pathname.match(/\/academy\/level\/(\d+)/);
  const currentLevelId = idMatch ? Number(idMatch[1]) : null;
  const currentLevel = currentLevelId ? getLevelById(currentLevelId) : null;
  const category = currentLevel?.category || 'Django';

  // Close drawers on route change
  useEffect(() => { setNavOpen(false); setRefOpen(false); }, [location.pathname]);

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

      {/* Overlay for mobile drawers */}
      {(navOpen || refOpen) && (
        <div className="mobile-drawer-overlay" onClick={() => { setNavOpen(false); setRefOpen(false); }} />
      )}

      <div className={`mobile-drawer mobile-drawer-left${navOpen ? ' mobile-open' : ''}`}>
        <LevelNav
          currentLevelId={currentLevelId}
          isUnlocked={actions.isUnlocked}
          isComplete={actions.isComplete}
          hasVisited={actions.hasVisited}
          onNavigate={() => setNavOpen(false)}
        />
      </div>

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
              refOpen={refOpen}
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


      <MobileBottomNav
        navOpen={navOpen}
        refOpen={refOpen}
        hasLevel={!!currentLevel}
        onToggleNav={() => { setNavOpen(o => !o); setRefOpen(false); }}
        onToggleRef={() => { setRefOpen(o => !o); setNavOpen(false); }}
      />
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
