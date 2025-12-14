import type { BlockProps } from '../../core';

export interface LoginPageProps extends BlockProps {
  onSubmit?: (data: { login: string; password: string }) => void;
}
