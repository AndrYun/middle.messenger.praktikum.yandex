import type { BlockProps, Block } from '../../core';

export interface ChatItemProps extends BlockProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  active?: boolean;
  isYou?: boolean;
  avatar?: Block;
  onClick?: (id: number) => void;
}
