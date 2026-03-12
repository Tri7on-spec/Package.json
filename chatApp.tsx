import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LoginPage } from './LoginPage';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { InputBar } from './InputBar';
import { BackgroundSelector } from './BackgroundSelector';
import { ImageViewer } from './ImageViewer';
import { Message, Theme, User } from '../types';
import { encryptMessage, generateSessionSalt } from '../utils/encryption';
import { saveTheme, loadTheme } from '../utils/localStorage';
import { AlertTriangle } from 'lucide-react';

interface ChatAppProps {
  onLock: () => void;
}

const SIMULATED_USERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

export function ChatApp({ onLock }: ChatAppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme, setTheme] = useState<Theme>(loadTheme());
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [userCount] = useState(Math.floor(Math.random() * 10) + 2);
  const [deletedMessage, setDeletedMessage] = useState<{ id: string; message: Message } | null>(null);
  const [viewingImage, setViewingImage] = useState<{ src: string; alt: string } | null>(null);

  const themeClasses: Record<Theme, string> = {
    dark: 'bg-slate-950 text-slate-100',
    light: 'bg-slate-50 text-slate-900',
    purple: 'bg-purple-950 text-white',
    blue: 'bg-blue-950 text-white',
    peach: 'bg-black text-rose-50',
  };

  useEffect(() => {
    generateSessionSalt();
  }, []);

  // Simulate other users joining/leaving
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
      const action = Math.random() > 0.5 ? 'joined' : 'left';
      
      addSystemMessage(`${randomUser} ${action} the room`);
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [user]);

  const addSystemMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      text,
      encryptedText: '',
      sender: 'system',
      timestamp: new Date(),
      reactions: {},
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleLogin = (nickname: string, profilePic?: string) => {
    const newUser = {
      id: `User_${Date.now()}`,
      nickname,
      profilePic,
    };
    setUser(newUser);
    addSystemMessage(`${nickname} joined the room`);
  };

  const handleLogout = () => {
    if (user) {
      addSystemMessage(`${user.nickname} left the room`);
    }
    setUser(null);
    setMessages([]);
    setReplyTarget(null);
  };

  const handleLock = () => {
    if (user) {
      addSystemMessage(`${user.nickname} left the room`);
    }
    onLock();
  };

  const handleClearHistory = () => {
    setMessages([]);
    setShowClearConfirm(false);
    addSystemMessage('Chat history cleared');
  };

  const handleSendMessage = (text: string, media?: any) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: media ? 'image' : 'text',
      text: replyTarget ? `> ${replyTarget.text}\n${text}` : text,
      encryptedText: encryptMessage(replyTarget ? `> ${replyTarget.text}\n${text}` : text),
      sender: user.nickname,
      timestamp: new Date(),
      reactions: {},
      media,
    };
    setMessages((prev) => [...prev, newMessage]);
    setReplyTarget(null);
  };

  const handleEdit = (id: string, newText: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, text: newText, encryptedText: encryptMessage(newText), isEditing: false }
          : msg
      )
    );
  };

  const handleDelete = (id: string) => {
    const messageToDelete = messages.find((m) => m.id === id);
    if (messageToDelete) {
      setDeletedMessage({ id, message: messageToDelete });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setTimeout(() => setDeletedMessage(null), 2000);
    }
  };

  const handleUndoDelete = () => {
    if (deletedMessage) {
      setMessages((prev) => [...prev, deletedMessage.message]);
      setDeletedMessage(null);
    }
  };

  const handleForward = (text: string) => {
    setReplyTarget(null);
  };

  const handleReply = (message: Message) => {
    setReplyTarget(message);
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!user) return;
    
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const userId = user.id;
          const existingReaction = Object.entries(msg.reactions).find(([id, e]) => id === userId && e === emoji);
          
          if (existingReaction) {
            const { [existingReaction[0]]: _, ...rest } = msg.reactions;
            return { ...msg, reactions: rest };
          } else {
            const { [userId]: _, ...otherReactions } = msg.reactions;
            return { ...msg, reactions: { ...otherReactions, [userId]: emoji } };
          }
        }
        return msg;
      })
    );
  };

  const handleViewImage = (src: string, alt: string) => {
    setViewingImage({ src, alt });
  };

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
    setShowSettings(false);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`h-screen flex flex-col ${themeClasses[theme]}`}>
      <ChatHeader
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
        onLock={handleLock}
        onClearHistory={() => setShowClearConfirm(true)}
        userCount={userCount}
        nickname={user.nickname}
      />

      <MessageList
        messages={messages}
        currentUserId={user.nickname}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onForward={handleForward}
        onReply={handleReply}
        onReact={handleReact}
        onViewImage={handleViewImage}
        theme={theme}
        ownProfilePic={user.profilePic}
      />

      <InputBar
        onSend={handleSendMessage}
        replyTarget={replyTarget}
        onCancelReply={() => setReplyTarget(null)}
        theme={theme}
        profilePic={user.profilePic}
      />

      {showSettings && (
        <BackgroundSelector
          currentTheme={theme}
          onSelect={handleThemeSelect}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Clear Chat History?</h3>
                <p className="text-sm text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearHistory}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {viewingImage && (
        <ImageViewer
          src={viewingImage.src}
          alt={viewingImage.alt}
          onClose={() => setViewingImage(null)}
        />
      )}

      {deletedMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/95 text-rose-100 px-4 py-3 rounded-2xl shadow-2xl border border-rose-300/20 flex items-center gap-3 z-50">
          <span className="text-sm font-medium">Message unsent</span>
          <Button variant="ghost" size="sm" onClick={handleUndoDelete} className="text-rose-300 hover:bg-rose-300/10">
            Undo
          </Button>
        </div>
      )}
    </div>
  );
                }
