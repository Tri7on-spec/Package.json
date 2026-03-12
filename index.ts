export type MessageType = 'text' | 'image' | 'system';

export interface Message {
  id: string;
  type: MessageType;
  text: string;
  encryptedText: string;
  sender: string;
  timestamp: Date;
  reactions: Record<string, string>;
  media?: any;
  isEditing?: boolean;
}

export type Theme = 'dark' | 'light' | 'purple' | 'blue' | 'peach';

export interface User {
  id: string;
  nickname: string;
  profilePic?: string;
}
