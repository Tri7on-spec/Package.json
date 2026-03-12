import { Theme, ThemeConfig } from '../types';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface BackgroundSelectorProps {
  currentTheme: Theme;
  onSelect: (theme: Theme) => void;
  onClose: () => void;
}

const themes: Record<Theme, ThemeConfig> = {
  dark: {
    name: 'Dark',
    classes: 'bg-slate-950',
    textClasses: 'text-slate-100',
    bgClasses: 'bg-slate-950',
  },
  light: {
    name: 'Light',
    classes: 'bg-slate-50',
    textClasses: 'text-slate-900',
    bgClasses: 'bg-slate-50',
  },
  purple: {
    name: 'Purple',
    classes: 'bg-purple-950',
    textClasses: 'text-white',
    bgClasses: 'bg-purple-950',
  },
  blue: {
    name: 'Blue',
    classes: 'bg-blue-950',
    textClasses: 'text-white',
    bgClasses: 'bg-blue-950',
  },
  peach: {
    name: 'Peach',
    classes: 'bg-slate-950',
    textClasses: 'text-rose-50',
    bgClasses: 'bg-slate-950',
  },
};

export function BackgroundSelector({ currentTheme, onSelect, onClose }: BackgroundSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-slate-900 rounded-xl p-6 w-full max-w-sm border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Choose Theme</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(themes) as [Theme, ThemeConfig][]).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentTheme === key
                  ? 'border-rose-500 ring-2 ring-rose-500/50'
                  : 'border-slate-700 hover:border-slate-600'
              } ${theme.classes}`}
            >
              <p className={`font-medium ${theme.textClasses}`}>{theme.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}