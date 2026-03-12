import { Message } from '../types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onForward: (text: string) => void;
  onReply: (message: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
  onViewImage: (src: string, alt: string) => void;
  theme: string;
  ownProfilePic?: string;
}

export function MessageList({
  messages,
  currentUserId,
  onEdit,
  onDelete,
  onForward,
  onReply,
  onReact,
  onViewImage,
  theme,
  ownProfilePic,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((message) => {
        if (message.type === 'system') {
          return (
            <div key={message.id} className="flex justify-center my-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/60 backdrop-blur-sm border border-white/5">
                {message.text}
              </span>
            </div>
          );
        }

        return (
          <MessageItem
            key={message.id}
            message={message}
            isOwn={message.sender === currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onForward={onForward}
            onReply={onReply}
            onReact={onReact}
            onViewImage={onViewImage}
            theme={theme}
            ownProfilePic={ownProfilePic}
          />
        );
      })}
    </div>
  );
}