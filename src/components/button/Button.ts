import { Block } from '../../core';
import type { ButtonProps } from './types';
import template from './button.hbs?raw';

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super('div', {
      ...props,
      type: props.type || 'button',
      events: {
        click: (e: Event) => {
          if (props.onClick) {
            props.onClick(e as MouseEvent);
          }
        },
      },
    });
  }

  protected render(): string {
    return template;
  }
}
