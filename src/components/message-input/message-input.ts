import { Block } from '../../core';
import type { MessageInputProps } from './types';
import { validateField } from '../../utils/validation';
import template from './message-input.hbs?raw';


export class MessageInput extends Block<MessageInputProps> {
  constructor(props: MessageInputProps) {
    super('div', {
      ...props,
      placeholder: props.placeholder || 'Сообщение',
      events: {
        submit: (e: Event) => this.handleSubmit(e),
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    
    if (target.closest('.message-input__attach')) {
      e.preventDefault();
      if (this.props.onAttach) {
        this.props.onAttach();
      }
    }
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    const input = this.element?.querySelector('.message-input__field') as HTMLInputElement;
    const message = input?.value?.trim();

    // валидация
    const error = validateField('message', message || '');
    
    if (error) {
      console.error('Validation error:', error);
      return;
    }

    // отправка сообщениыя
    if (this.props.onSubmit && message) {
      this.props.onSubmit(message);
      input.value = ''; // Очищаем поле после отправки
    }
  }

  // получить тек знач
  public getValue(): string {
    const input = this.element?.querySelector('.message-input__field') as HTMLInputElement;
    return input?.value || '';
  }

  // очищаем поле
  public clear(): void {
    const input = this.element?.querySelector('.message-input__field') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  protected render(): string {
    return template;
  }
}
