import type { BlockProps } from "../../core";

export interface UserItemProps extends BlockProps {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  avatar?: string | null;
  role?: string;
  onClick?: () => void;
}
