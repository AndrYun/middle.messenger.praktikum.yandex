import type { BlockProps } from "../../core";

export interface RemoveUserFormProps extends BlockProps {
  onSubmit?: (userId: number) => void;
  users?: Array<{ id: number; login: string; name: string }>;
  isLoading?: boolean;
  hasUsers?: boolean;
}
