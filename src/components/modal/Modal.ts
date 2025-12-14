import { Block } from '../../core';
import type { ModalProps } from './types';
import template from './modal.hbs?raw';

export class Modal extends Block<ModalProps> {
  constructor(props: ModalProps) {
    super('div', {
      ...props,
      isOpen: props.isOpen || false,
      events: {
        click: (e: Event) => this.handleOverlayClick(e),
      },
    });
  }

  private handleOverlayClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.classList.contains('modal__overlay')) {
      this.close();
    }
  }

  public open(): void {
    this.setProps({ isOpen: true });
  }

  public close(): void {
    this.setProps({ isOpen: false });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  protected render(): string {
    return template;
  }
}
