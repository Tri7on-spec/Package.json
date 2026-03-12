import { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Smile, Image as ImageIcon, Mic, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Message } from '../types';

interface InputBarProps {
  onSend: (text: string, media?: any) => void;
  replyTarget: Message | null;
  onCancelReply: () => void;
  theme: string;
  profilePic?: string;
}

export function InputBar({ onSend, replyTarget, onCancelReply, theme, profilePic }: InputBarProps) {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let type: 'image' | 'video' | 'audio' | 'file' = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';

        onSend('', {
          type,
          url: reader.result as string,
          name: file.name,
          size: file.size,
        });
        setShowAttachMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-t border-rose-300/20 bg-black/30 backdrop-blur-sm p-3 space-y-2">
      {/* Reply Preview */}
      {replyTarget && (
        <div className="flex items-center gap-2 bg-rose-300/10 rounded-2xl px-3 py-2 border-l-4 border-rose-400">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-rose-300 font-bold uppercase tracking-wide">
              Replying to {replyTarget.sender}
            </p>
            <p className="text-xs text-rose-200/60 truncate">{replyTarget.text || 'Media message'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelReply}
            className="h-6 w-6 hover:bg-rose-300/20 text-rose-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-300/20 to-pink-400/20 flex items-center justify-center text-xl border-2 border-rose-300/30 flex-shrink-0 overflow-hidden">
          {profilePic ? (
            profilePic.startsWith('data:') ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{profilePic}</span>
            )
          ) : (
            <span>👤</span>
          )}
        </div>

        {/* Input Field */}
        <div className="flex-1 relative">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="bg-rose-300/10 border-rose-300/20 text-rose-100 placeholder:text-rose-200/40 focus:border-rose-400 pr-24 rounded-2xl"
          />

          {/* Attach Menu */}
          {showAttachMenu && (
            <div
              ref={attachMenuRef}
              className="absolute bottom-full left-0 mb-2 bg-black/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-rose-300/20 p-2 z-50"
            >
              <div className="grid grid-cols-4 gap-1">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 flex flex-col items-center justify-center hover:bg-rose-300/20 rounded-xl transition-colors">
                    <ImageIcon className="w-5 h-5 text-rose-300" />
                    <span className="text-xs text-rose-200/60 mt-1">Image</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 flex flex-col items-center justify-center hover:bg-rose-300/20 rounded-xl transition-colors">
                    <span className="text-xl">🎬</span>
                    <span className="text-xs text-rose-200/60 mt-1">Video</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 flex flex-col items-center justify-center hover:bg-rose-300/20 rounded-xl transition-colors">
                    <Mic className="w-5 h-5 text-rose-300" />
                    <span className="text-xs text-rose-200/60 mt-1">Audio</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 flex flex-col items-center justify-center hover:bg-rose-300/20 rounded-xl transition-colors">
                    <FileText className="w-5 h-5 text-rose-300" />
                    <span className="text-xs text-rose-200/60 mt-1">File</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="hover:bg-rose-300/20 text-rose-300 h-10 w-10"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-black h-10 w-10 rounded-full p-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}