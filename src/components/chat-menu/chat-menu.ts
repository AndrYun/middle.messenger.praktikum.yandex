import { Block } from '../../core';
import type { ChatMenuProps } from './types';
import template from './chat-menu.hbs?raw';

export class ChatMenu extends Block<ChatMenuProps> {
  constructor(props: ChatMenuProps) {
    super('div', {
      ...props,
      isOpen: props.isOpen || false,
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button = target.closest('button[data-action]') as HTMLButtonElement;
    
    if (!button) return;

    const action = button.dataset.action;

    if (action === 'add' && this.props.onAddUser) {
      this.props.onAddUser();
    } else if (action === 'remove' && this.props.onRemoveUser) {
      this.props.onRemoveUser();
    }
  }

  
  public open(): void {
    this.setProps({ isOpen: true });
  }

  public close(): void {
    this.setProps({ isOpen: false });
  }

  public toggle(): void {
    this.setProps({ isOpen: !this.props.isOpen });
  }

  protected render(): string {
    return template;
  }
}
