import type { BlockProps } from '../../core/';

export interface ButtonProps extends BlockProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  onClick?: (event: MouseEvent) => void;
}
