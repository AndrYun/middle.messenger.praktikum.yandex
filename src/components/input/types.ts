import type { BlockProps } from '../../core';

export interface InputProps extends BlockProps {
  label?: string;
  type: string;
  name: string;
  placeholder?: string;
  value?: string;
  error?: string;
  onInput?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
