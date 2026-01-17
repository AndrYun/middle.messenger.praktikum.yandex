import type { BlockProps } from '../../core';

export interface LinkProps extends BlockProps {
  text: string;
  href: string;
  variant?: 'primary' | 'danger';
  onClick?: (event: MouseEvent) => void;
}
