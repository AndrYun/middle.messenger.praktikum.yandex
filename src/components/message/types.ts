import type { BlockProps } from '../../core';

export interface MessageProps extends BlockProps {
  text?: string;
  time: string;
  isMy: boolean;
  image?: string;
}
