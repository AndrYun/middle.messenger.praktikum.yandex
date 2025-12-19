import { Block } from '../../core';
import { Input } from '../input';
import { Button } from '../button';
import type { AddUserFormProps } from './types';
import template from './add-user-form.hbs?raw';

export class AddUserForm extends Block<AddUserFormProps> {
  constructor(props: AddUserFormProps) {
    super('div', {
      ...props,
      loginInput: new Input({
        label: 'Логин',
        type: 'text',
        name: 'login',
        placeholder: 'ivanivanov',
      }),
      submitButton: new Button({
        text: 'Добавить',
        type: 'submit',
        variant: 'primary',
        onClick: (e) => this.handleSubmit(e),
      }),
      events: {
        submit: (e: Event) => {
          e.preventDefault();
        },
      },
    });
  }

  private handleSubmit(e: MouseEvent): void {
    e.preventDefault();

    const loginInput = this.children.loginInput as Input;
    const login = loginInput.getValue();

    if (!login) {
      loginInput.setProps({ error: 'Введите логин' });
      return;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(login);
    }

    // обнуляем поле после отправки
    loginInput.setValue('');
  }

  public reset(): void {
    const loginInput = this.children.loginInput as Input;
    loginInput.setValue('');
    loginInput.setProps({ error: '' });
  }

  protected render(): string {
    return template;
  }
}
