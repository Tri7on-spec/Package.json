import { Theme } from '../types';

const THEME_KEY = 'chatTheme';

export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = (): Theme => {
  const saved = localStorage.getItem(THEME_KEY);
  return (saved as Theme) || 'dark';
};