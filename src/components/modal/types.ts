import type { Block, BlockProps } from '../../core';

export interface ModalProps extends BlockProps {
  title: string;
  isOpen?: boolean;
  content?: Block;
  onClose?: () => void;
}
