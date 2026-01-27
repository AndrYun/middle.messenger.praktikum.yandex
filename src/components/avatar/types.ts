import type { BlockProps } from "../../core";

export interface AvatarProps extends BlockProps {
  src?: string;
  first_name?: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}
