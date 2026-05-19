import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { levels, modules } from '../data/levels.js';

export default function LevelNav({ currentLevelId, isUnlocked, isComplete, hasVisited }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState({});

  function toggleModule(modId) {
    setCollapsed(prev => ({ ...prev, [modId]: !prev[modId] }));
  }

  return (
    <nav className="level-nav">
      {modules.map(mod => {
        const modLevels = levels.filter(l => l.module === mod.id);
        const isCollapsed = collapsed[mod.id];
        return (
          <div key={mod.id} className={`level-nav-module${isCollapsed ? ' collapsed' : ''}`}>
            <div
              className="level-nav-module-title"
              onClick={() => toggleModule(mod.id)}
            >
              <span className="module-collapse-icon">▾</span>
              <span>M{mod.id}: {mod.title}</span>
            </div>
            <div className="level-nav-items">
              {modLevels.map(level => {
                const locked = !isUnlocked(level.id);
                const complete = isComplete(level.id);
                const active = level.id === currentLevelId;

                let className = 'level-nav-item';
                if (active) className += ' active';
                if (locked) className += ' locked';
                if (complete) className += ' completed';

                return (
                  <div
                    key={level.id}
                    className={className}
                    onClick={() => {
                      if (!locked) navigate(`/academy/level/${level.id}`);
                    }}
                  >
                    <div className="level-nav-dot">
                      {complete && '✓'}
                    </div>
                    <span>{level.id}. {level.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
