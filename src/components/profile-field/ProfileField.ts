import { Block } from '../../core';
import type { ProfileFieldProps } from './types';
import template from './profile-field.hbs?raw';

export class ProfileField extends Block<ProfileFieldProps> {
  constructor(props: ProfileFieldProps) {
    super('div', props);
  }

  protected render(): string {
    return template;
  }
}
