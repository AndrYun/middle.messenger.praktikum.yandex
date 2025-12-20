import { Block } from '../../core';
import { Avatar } from '../avatar';
import type { ChatItemProps } from './types';
import template from './chat-item.hbs?raw';

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super('div', {
      ...props,
      avatar:
        props.avatar
        || new Avatar({
          size: 'medium',
          alt: props.name,
        }),
      events: {
        click: () => {
          if (props.onClick) {
            props.onClick(props.id);
          }
        },
      },
    });
  }

  protected render(): string {
    return template;
  }
}
