import { Block } from '../../core';
import { Avatar } from '../avatar';
import type { ChatHeaderProps } from './types';
import template from './chat-header.hbs?raw';

export class ChatHeader extends Block<ChatHeaderProps> {
  constructor(props: ChatHeaderProps) {
    super('div', {
      ...props,
      avatar:
        props.avatar ||
        new Avatar({
          size: 'small',
          alt: props.name,
        }),
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    // чекам клик по меню
    if (target.closest('.chat-header__menu')) {
      if (this.props.onMenuClick) {
        this.props.onMenuClick();
      }
    }
  }

  protected render(): string {
    return template;
  }
}
