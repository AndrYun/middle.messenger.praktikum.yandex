import type { BlockProps, Block } from '../../core';

export interface ChatHeaderProps extends BlockProps {
  name: string;
  avatar?: Block;
  onMenuClick?: () => void;
}