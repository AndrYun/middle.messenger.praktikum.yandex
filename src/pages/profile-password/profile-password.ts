import { Block } from '../../core';
import { AvatarUpload } from '../../components/avatar-upload';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import type { ProfilePasswordPageProps, PasswordChangeData } from './types';
import template from './profile-password.hbs?raw';

export class ProfilePasswordPage extends Block<ProfilePasswordPageProps> {
  constructor(props: ProfilePasswordPageProps) {
    super('div', {
      ...props,
      avatar: new AvatarUpload({
        size: 'large',
        alt: 'User avatar',
      }),
      oldPasswordInput: new Input({
        label: 'Старый пароль',
        type: 'password',
        name: 'password',
        placeholder: '••••••••••••',
      }),
      newPasswordInput: new Input({
        label: 'Новый пароль',
        type: 'password',
        name: 'password',
        placeholder: '••••••••••••',
      }),
      newPasswordConfirmInput: new Input({
        label: 'Повторите новый пароль',
        type: 'password',
        name: 'password',
        placeholder: '••••••••••••',
      }),
      submitButton: new Button({
        text: 'Сохранить',
        type: 'submit',
        variant: 'primary',
        onClick: (e) => this.handleSubmit(e),
      }),
      events: {
        click: (e: Event) => this.handleBackClick(e),
      },
    });
  }

  private handleBackClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.closest('.profile-page__back')) {
      e.preventDefault();
      (window as any).navigateTo('profile');
    }
  }

  private handleSubmit(e: MouseEvent): void {
    e.preventDefault();

    const oldPasswordInput = this.children.oldPasswordInput as Input;
    const newPasswordInput = this.children.newPasswordInput as Input;
    const newPasswordConfirmInput = this.children
      .newPasswordConfirmInput as Input;

    // dалидируем все поля
    const isOldValid = oldPasswordInput.validate();
    const isNewValid = newPasswordInput.validate();
    const isConfirmValid = newPasswordConfirmInput.validate();

    if (!isOldValid || !isNewValid || !isConfirmValid) {
      console.log('Форма содержит ошибки');
      return;
    }

    const oldPassword = oldPasswordInput.getValue();
    const newPassword = newPasswordInput.getValue();
    const confirmPassword = newPasswordConfirmInput.getValue();

    // проверка на совпадение паролей
    if (newPassword !== confirmPassword) {
      newPasswordConfirmInput.setProps({ error: 'Пароли не совпадают' });
      return;
    }

    const data: PasswordChangeData = {
      oldPassword,
      newPassword,
    };

    console.log('Password change:', data);

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    } else {
      alert('Пароль изменен!');
      (window as any).navigateTo('profile');
    }
  }

  protected render(): string {
    return template;
  }
}
