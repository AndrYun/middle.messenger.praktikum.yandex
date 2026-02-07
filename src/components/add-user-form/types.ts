import type { BlockProps } from "../../core";
import type { User } from "../../api/types";

export interface AddUserFormProps extends BlockProps {
  onSubmit?: (userId: number) => void;
  foundUser?: User;
}
