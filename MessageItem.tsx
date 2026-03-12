import { useState, useRef, useEffect } from 'react';
import { Lock, MoreVertical, Reply, X, Heart, ThumbsUp, Laugh, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';
import { encryptMessage } from '../utils/encryption';

interface MessageItemProps {
  message: {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    reactions: Record<string, string>;
  };
  isOwn: boolean;
  onReply: (message: any) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onForward: (text: string) => void;
  onReact: (id: string, emoji: string) => void;
  currentUser: string;
}

export function MessageItem({
  message,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onReact,
  currentUser,
}: MessageItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [startX, setStartX] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const encryptedText = encryptMessage(message.text);
  const isEmojiOnly = /^[\p{Emoji}\u200d]+$/u.test(message.text.trim());

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowReactions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    longPressTimer.current = setTimeout(() => {
      setShowMenu(true);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    const diff = e.touches[0].clientX - startX;
    if (diff < -50) {
      setSwipeOffset(Math.max(diff, -100));
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (swipeOffset < -50) {
      onReply(message);
    }
    setSwipeOffset(0);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
  };

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(message.id, editText);
      setIsEditing(false);
    }
  };

  const reactionEmojis = [
    { icon: Heart, emoji: '❤️' },
    { icon: ThumbsUp, emoji: '👍' },
    { icon: Laugh, emoji: '😂' },
    { icon: PartyPopper, emoji: '🎉' },
  ];

  return (
    <div
      className={`flex mb-4 relative ${isOwn ? 'justify-end' : 'justify-start'} transition-transform duration-200`}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {/* Reply hint on swipe */}
      {swipeOffset < -30 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 z-10">
          <Reply size={16} /> Reply
        </div>
      )}

      <div
        className={`max-w-[80%] relative group ${
          isOwn ? 'items-end' : 'items-start'
        } flex flex-col`}
      >
        {/* Message Bubble */}
        <div
          className={`
            relative rounded-2xl px-4 py-2 shadow-sm backdrop-blur-md border
            ${isOwn 
              ? 'bg-indigo-600/20 border-indigo-400/30 text-indigo-50 rounded-br-sm' 
              : 'bg-white/10 border-white/10 text-gray-100 rounded-bl-sm'
            }
            ${isEmojiOnly && !isEditing ? 'text-6xl p-4' : ''}
            transition-all duration-200 hover:shadow-md
          `}
          onMouseEnter={() => setShowEncrypted(true)}
          onMouseLeave={() => setShowEncrypted(false)}
        >
          {/* Encryption Lock */}
          <div className={`flex items-center gap-1 mb-1 ${isEmojiOnly && !isEditing ? 'justify-center' : ''}`}>
            <Lock size={12} className="opacity-70" />
            <span className="text-[10px] opacity-60 uppercase tracking-wider">E2EE</span>
          </div>

          {/* Message Content */}
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              className="bg-transparent border-b border-indigo-400/50 outline-none w-full text-indigo-50"
              autoFocus
            />
          ) : (
            <div className="relative">
              {/* Plaintext (Visible by default) */}
              <div className={`text-sm ${isEmojiOnly ? 'hidden' : ''}`}>
                {message.text}
              </div>
              
              {/* Encrypted Tooltip (Hover) */}
              {showEncrypted && !isEmojiOnly && (
                <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 z-20 flex items-center justify-center">
                  <span className="text-white text-xs font-mono">{encryptedText}</span>
                </div>
              )}

              {/* Large Emoji Display */}
              {isEmojiOnly && (
                <div className="flex justify-center items-center filter drop-shadow-lg">
                  {message.text}
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          {!isEmojiOnly && (
            <div className={`text-[10px] opacity-50 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
              {format(message.timestamp, 'HH:mm')}
            </div>
          )}

          {/* Reactions */}
          {Object.keys(message.reactions).length > 0 && (
            <div className={`flex gap-1 mt-2 flex-wrap ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {Object.entries(message.reactions).map(([userId, emoji]) => (
                <span
                  key={userId}
                  className="bg-indigo-500/30 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm border border-indigo-400/20"
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'} 
              bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 py-1 z-50 min-w-[120px]`}
          >
            <button
              onClick={() => { setIsEditing(true); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-2"
            >
              Edit
            </button>
            <button
              onClick={() => { onDelete(message.id); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700/50 flex items-center gap-2"
            >
              Unsend
            </button>
            <button
              onClick={() => { onForward(message.text); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-2"
            >
              Forward
            </button>
            <button
              onClick={() => { setShowReactions(!showReactions); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-2"
            >
              React
            </button>
          </div>
        )}

        {/* Reaction Picker */}
        {showReactions && (
          <div
            className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'} 
              bg-gray-800/95 backdrop-blur-md rounded-full shadow-xl border border-gray-700 p-2 z-50 flex gap-1`}
          >
            {reactionEmojis.map(({ icon: Icon, emoji }) => (
              <button
                key={emoji}
                onClick={() => { onReact(message.id, emoji); setShowReactions(false); }}
                className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
              >
                <span className="text-xl">{emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}