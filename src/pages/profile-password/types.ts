import type { BlockProps } from '../../core';

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

export interface ProfilePasswordPageProps extends BlockProps {
  onSubmit?: (data: PasswordChangeData) => void;
}
