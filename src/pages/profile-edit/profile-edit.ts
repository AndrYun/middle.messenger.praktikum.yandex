import { Block } from '../../core';
import { AvatarUpload } from '../../components/avatar-upload';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import type { ProfileEditPageProps } from './types';
import type { ProfileData } from '../profile/types';
import template from './profile-edit.hbs?raw';

export class ProfileEditPage extends Block<ProfileEditPageProps> {
  constructor(props: ProfileEditPageProps) {
    const defaultData = props.data || {
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      phone: '+7 (909) 967 30 30',
    };

    super('div', {
      ...props,
      data: defaultData,
      avatar: new AvatarUpload({
        size: 'large',
        src: props.data?.avatar,
        alt: defaultData.first_name,
      }),
      emailInput: new Input({
        label: 'Почта',
        type: 'email',
        name: 'email',
        value: defaultData.email,
      }),
      loginInput: new Input({
        label: 'Логин',
        type: 'text',
        name: 'login',
        value: defaultData.login,
      }),
      firstNameInput: new Input({
        label: 'Имя',
        type: 'text',
        name: 'first_name',
        value: defaultData.first_name,
      }),
      secondNameInput: new Input({
        label: 'Фамилия',
        type: 'text',
        name: 'second_name',
        value: defaultData.second_name,
      }),
      displayNameInput: new Input({
        label: 'Имя в чате',
        type: 'text',
        name: 'display_name',
        value: defaultData.display_name,
      }),
      phoneInput: new Input({
        label: 'Телефон',
        type: 'tel',
        name: 'phone',
        value: defaultData.phone,
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
      window.navigateTo('profile');
    }
  }

  private handleSubmit(e: MouseEvent): void {
    e.preventDefault();

    // валидируем все поля
    const inputs = [
      this.children.emailInput,
      this.children.loginInput,
      this.children.firstNameInput,
      this.children.secondNameInput,
      this.children.displayNameInput,
      this.children.phoneInput,
    ] as Input[];

    let isValid = true;
    inputs.forEach((input) => {
      if (!input.validate()) {
        isValid = false;
      }
    });

    if (!isValid) {
      console.log('Форма содержит ошибки');
      return;
    }

    // собираем данные
    const data: ProfileData = {
      email: (this.children.emailInput as Input).getValue(),
      login: (this.children.loginInput as Input).getValue(),
      first_name: (this.children.firstNameInput as Input).getValue(),
      second_name: (this.children.secondNameInput as Input).getValue(),
      display_name: (this.children.displayNameInput as Input).getValue(),
      phone: (this.children.phoneInput as Input).getValue(),
    };

    console.log('Profile updated:', data);

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    } else {
      alert('Данные сохранены!');
      window.navigateTo('profile');
    }
  }

  protected render(): string {
    return template;
  }
}
