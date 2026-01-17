import type { BlockProps } from '../../core';

export interface ChatMenuProps extends BlockProps {
  isOpen?: boolean;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
}
