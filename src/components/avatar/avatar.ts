import { Block } from '../../core';
import type { AvatarProps } from './types';
import template from './avatar.hbs?raw';

export class Avatar extends Block<AvatarProps> {
  constructor(props: AvatarProps) {
    super('div', {
      ...props,
      size: props.size || 'medium',
      events: props.onClick
        ? {
          click: () => {
            if (props.onClick) {
              props.onClick();
            }
          },
        }
        : {},
    });
  }

  protected render(): string {
    return template;
  }
}
