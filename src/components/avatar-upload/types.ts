import type { BlockProps } from '../../core';

export interface AvatarUploadProps extends BlockProps {
  fileName?: string;
  error?: string;
  onChange?: (file: File) => void;
}
