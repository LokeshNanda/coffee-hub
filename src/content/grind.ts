import type { GrindSize } from './types';

export const grindSizes: GrindSize[] = [
  { id: 'extra-fine', band: 'extra-fine', name: 'Extra fine', position: 8, looksLike: 'Powdered sugar or flour. Clumps when pressed.', suits: ['espresso'] },
  { id: 'fine', band: 'fine', name: 'Fine', position: 22, looksLike: 'Table salt. Slightly gritty between fingers.', suits: ['moka'] },
  { id: 'medium-fine', band: 'medium-fine', name: 'Medium fine', position: 38, looksLike: 'Fine beach sand.', suits: ['v60', 'aeropress'] },
  { id: 'medium', band: 'medium', name: 'Medium', position: 52, looksLike: 'Regular sand or kosher salt.', suits: ['kalita'] },
  { id: 'medium-coarse', band: 'medium-coarse', name: 'Medium coarse', position: 68, looksLike: 'Rough sand.', suits: ['chemex'] },
  { id: 'coarse', band: 'coarse', name: 'Coarse', position: 85, looksLike: 'Sea salt flakes or breadcrumbs.', suits: ['french-press'] },
];
