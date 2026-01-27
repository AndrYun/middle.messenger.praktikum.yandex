import type { BlockProps } from "../../core";

export interface LoginFormData {
  login: string;
  password: string;
}

export interface LoginPageProps extends BlockProps {
  onSubmit?: (data: LoginFormData) => void;
}
