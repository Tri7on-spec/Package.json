import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ReactionBarProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = [
  '❤️', '👍', '😂', '🎉', '😢', '😮', '😡', '🔥',
  '👎', '🙏', '💯', '✨', '💪', '🤔', '😍', '🥳',
  '😎', '🤣', '😭', '😤', '👀', '💀', '🤯', '🥺',
  '😈', '🤡', '💩', '👻', '🤖', '🎃', '🦄', '🌈',
];

export function ReactionBar({ onSelect, onClose }: ReactionBarProps) {
  return (
    <div className="absolute bottom-full left-0 mb-2 bg-black/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-rose-300/20 p-3 z-50 w-72">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-rose-200/60 font-medium">React</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 hover:bg-rose-300/10 text-rose-300"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-rose-300/20 rounded-full transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}