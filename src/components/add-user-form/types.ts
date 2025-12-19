import type { BlockProps } from '../../core';

export interface AddUserFormProps extends BlockProps {
  onSubmit?: (login: string) => void;
}
