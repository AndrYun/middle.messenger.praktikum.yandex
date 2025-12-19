import type { BlockProps } from '../../core';

export interface ProfileData {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  avatar?: string;
}

export interface ProfilePageProps extends BlockProps {
  data?: ProfileData;
  onAvatarClick?: () => void;
  onLogout?: () => void;
}