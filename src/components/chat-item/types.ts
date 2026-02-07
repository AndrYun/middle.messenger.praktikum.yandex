import type { Block, BlockProps } from "../../core";

export interface ChatItemProps extends BlockProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  active?: boolean;
  isYou?: boolean;
  avatar?: string | null;
  avatarComponent?: Block;
  onClick?: (id: number) => void;
}
