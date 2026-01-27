import type { BlockProps } from "../../core";

export interface RegisterData {
  email: string;
  first_name: string;
  login: string;
  password: string;
  phone: string;
  second_name: string;
}

export interface RegisterPageProps extends BlockProps {
  onSubmit?: (data: RegisterData) => void;
}
