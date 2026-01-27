import type { Block, BlockProps } from "../../core";

export interface ModalProps extends BlockProps {
  title: string;
  isOpen?: boolean;
  content?: Block;
  onOpen?: () => void | Promise<void>;
  onClose?: () => void;
}
