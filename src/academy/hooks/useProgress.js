import { useState, useCallback } from 'react';
import { levels } from '../data/levels';

const STORAGE_KEY = 'csc1202_academy_progress';

const defaultState = {
  completedLevels: [],
  visitedLevels: [],
  lastLevelId: 1,
  guidedScores: {},
  challengeScores: {},
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// A level is unlocked if:
// 1. It's level 1 (always unlocked)
// 2. Its previous level is completed
// 3. Any level in the same module has been visited (module-wide unlock once attempted)
function computeUnlocked() {
  return () => true; // all levels always unlocked
}

export function useProgress() {
  const [state, setState] = useState(load);

  const update = useCallback((updater) => {
    setState(prev => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  const markComplete = useCallback((id) => {
    update(prev => ({
      ...prev,
      completedLevels: prev.completedLevels.includes(id)
        ? prev.completedLevels
        : [...prev.completedLevels, id],
      lastLevelId: id,
    }));
  }, [update]);

  const markVisited = useCallback((id) => {
    update(prev => ({
      ...prev,
      visitedLevels: prev.visitedLevels.includes(id)
        ? prev.visitedLevels
        : [...prev.visitedLevels, id],
      lastLevelId: id,
    }));
  }, [update]);

  const saveScore = useCallback((id, phase, score) => {
    update(prev => ({
      ...prev,
      [phase === 'guided' ? 'guidedScores' : 'challengeScores']: {
        ...prev[phase === 'guided' ? 'guidedScores' : 'challengeScores'],
        [id]: score,
      },
    }));
  }, [update]);

  const resetAll = useCallback(() => {
    const fresh = { ...defaultState };
    save(fresh);
    setState(fresh);
  }, []);

  const isUnlocked = computeUnlocked(state);
  const hasVisited = (id) => state.visitedLevels.includes(id);
  const isComplete = (id) => state.completedLevels.includes(id);

  return {
    ...state,
    markComplete,
    markVisited,
    saveScore,
    isUnlocked,
    hasVisited,
    isComplete,
    resetAll,
  };
}
