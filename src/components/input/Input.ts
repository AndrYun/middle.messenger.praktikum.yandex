import { Block } from '../../core';
import type { InputProps } from './types';
import { validateField } from '../../utils/validation';
import template from './input.hbs?raw';

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super('div', {
      ...props,
      events: {
        input: (e: Event) => this.handleInput(e),
        focus: (e: Event) => this.handleFocus(e),
        blur: (e: Event) => this.handleBlur(e),
      },
    });
  }

  private handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;

    if (this.props.onInput) {
      this.props.onInput(target.value);
    }

    if (this.props.error) {
      this.setProps({ error: '' });
    }
  }

  private handleFocus(e: Event): void {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  private handleBlur(e: Event): void {
    const target = e.target as HTMLInputElement;

    const error = validateField(this.props.name, target.value);
    if (error) {
      this.setProps({ error });
    }

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  public getValue(): string {
    const input = this.element?.querySelector('input');
    return input?.value || '';
  }

  public setValue(value: string): void {
    const input = this.element?.querySelector('input');
    if (input) {
      input.value = value;
    }
  }

  public getName(): string {
    return this.props.name;
  }

  public validate(): boolean {
    const value = this.getValue();
    const error = validateField(this.props.name, value);

    if (error) {
      this.setProps({ error });
      return false;
    }

    this.setProps({ error: '' });
    return true;
  }

  protected render(): string {
    return template;
  }
}
