import type { BlockProps } from "../../core";

export interface ChatHeaderProps extends BlockProps {
  name: string;
  avatar?: string | null;
  onMenuClick?: () => void;
}
