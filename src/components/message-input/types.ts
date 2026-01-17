import type { BlockProps } from '../../core';

export interface MessageInputProps extends BlockProps {
  placeholder?: string;
  onSubmit?: (message: string) => void;
  onAttach?: () => void;
}
