import type { BlockProps } from '../../core';

export interface ChatData {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  avatar?: string;
  isYou?: boolean;
}

export interface MessageData {
  id: number;
  text?: string;
  time: string;
  isMy: boolean;
  image?: string;
  [key: string]: unknown;
}

export interface ChatPageProps extends BlockProps {
  chats?: ChatData[];
  selectedChatId?: number;
  onChatSelect?: (chatId: number) => void;
  onMessageSend?: (message: string) => void;
}
