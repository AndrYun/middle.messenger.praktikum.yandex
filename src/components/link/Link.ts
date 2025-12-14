import { Block } from '../../core';
import type { LinkProps } from './types';
import template from './link.hbs?raw';

export class Link extends Block<LinkProps> {
  constructor(props: LinkProps) {
    super('div', {
      ...props,
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
