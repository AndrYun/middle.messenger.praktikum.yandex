import type { BlockProps } from '../../core';

export interface AvatarProps extends BlockProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}
