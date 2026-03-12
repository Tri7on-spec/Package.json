import { Lock, Settings, LogOut, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ChatHeaderProps {
  onSettingsClick: () => void;
  onLogout: () => void;
  onLock: () => void;
  onClearHistory: () => void;
  userCount: number;
  nickname: string;
}

export function ChatHeader({
  onSettingsClick,
  onLogout,
  onLock,
  onClearHistory,
  userCount,
  nickname,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-rose-300/20 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-rose-400/20">
          {nickname.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-bold text-rose-100 text-sm tracking-wide">EchoRoom</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-rose-200/60">
              {userCount} online
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLock}
          className="hover:bg-rose-300/20 text-rose-300 h-9 w-9"
          title="Lock App"
        >
          <Lock className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearHistory}
          className="hover:bg-red-500/20 text-red-400 h-9 w-9"
          title="Delete Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="hover:bg-rose-300/20 text-rose-300 h-9 w-9"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="hover:bg-rose-300/20 text-rose-300 h-9 w-9"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
