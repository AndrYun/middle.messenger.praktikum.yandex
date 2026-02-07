import type { BlockProps } from "../../core";
import type { Chat } from "../../api";

export interface ChatData {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  avatar?: string;
  isYou?: boolean;
}

export interface ChatPageProps extends BlockProps {
  chats?: Chat[];
  selectedChatId?: number;
  selectedChat?: Chat | null;
  onChatSelect?: (chatId: number) => void;
  onMessageSend?: (message: string) => void;
}

export interface WSMessage {
  id: number;
  user_id: number;
  chat_id: number;
  type: string;
  time: string;
  content: string;
}
