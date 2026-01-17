import type { BlockProps } from '../../core';

export interface RegisterData {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
}

export interface RegisterPageProps extends BlockProps {
  onSubmit?: (data: RegisterData) => void;
}
