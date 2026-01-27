import type { BlockProps } from "../../core";

export interface CreateChatFormProps extends BlockProps {
  onSubmit?: (title: string) => void;
}
