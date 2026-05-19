import { module1 } from './levels_m1.js';
import { module2 } from './levels_m2.js';
import { module3 } from './levels_m3.js';
import { module4, module5 } from './levels_m4m5.js';
import { module6 } from './levels_m6.js';
import { levelsM7 } from './levels_m7.js';
import { levelsM8 } from './levels_m8.js';
import { levelsM9 } from './levels_m9.js';

export const levels = [
  ...module1,
  ...module2,
  ...module3,
  ...module4,
  ...module5,
  ...module6,
  ...levelsM7,
  ...levelsM8,
  ...levelsM9,
];

export function getLevelById(id) {
  return levels.find(l => l.id === id) || null;
}

export function getLevelsByModule(moduleNum) {
  return levels.filter(l => l.module === moduleNum);
}

export const modules = [
  { id: 1, title: 'Django Foundations', category: 'Django' },
  { id: 2, title: 'ORM & QuerySets', category: 'Django' },
  { id: 3, title: 'DRF Serializers', category: 'Django' },
  { id: 4, title: 'DRF Views', category: 'Django' },
  { id: 5, title: 'Routers & URLs', category: 'Django' },
  { id: 6, title: 'Auth & Permissions', category: 'Django' },
  { id: 7, title: 'React Fundamentals', category: 'React' },
  { id: 8, title: 'React Hooks', category: 'React' },
  { id: 9, title: 'React Router & Context', category: 'React' },
];
