import type { BlockProps } from '../../core';
import type { ProfileData } from '../profile/types';

export interface ProfileEditPageProps extends BlockProps {
  data?: ProfileData;
  onSubmit?: (data: ProfileData) => void;
}
