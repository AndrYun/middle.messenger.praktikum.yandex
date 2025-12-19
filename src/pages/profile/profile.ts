import { Block } from '../../core';
import { ProfileField } from '../../components/profile-field';
import { Link } from '../../components/link';
import { Modal } from '../../components/modal';
import { AvatarUpload } from '../../components/avatar-upload';
import type { ProfilePageProps } from './types';
import template from './profile.hbs?raw';

export class ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps) {
    const defaultData = props.data || {
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      phone: '+7 (999) 999 99 99',
    };

    // cоздаем компонент загрузки аватара
    const avatarUpload = new AvatarUpload({
      onChange: (file) => {
        console.log('File selected:', file);
        if (props.onAvatarClick) {
          props.onAvatarClick();
        }
      },
    });

    // cоздаем модалку
    const avatarModal = new Modal({
      title: 'Загрузите файл',
      isOpen: false,
      content: avatarUpload,
      onClose: () => {
        avatarUpload.reset();
      },
    });

    super('div', {
      ...props,
      data: defaultData,
      avatarModal,
      emailField: new ProfileField({
        label: 'Почта',
        value: defaultData.email,
      }),
      loginField: new ProfileField({
        label: 'Логин',
        value: defaultData.login,
      }),
      firstNameField: new ProfileField({
        label: 'Имя',
        value: defaultData.first_name,
      }),
      secondNameField: new ProfileField({
        label: 'Фамилия',
        value: defaultData.second_name,
      }),
      displayNameField: new ProfileField({
        label: 'Имя в чате',
        value: defaultData.display_name,
      }),
      phoneField: new ProfileField({
        label: 'Телефон',
        value: defaultData.phone,
      }),
      editLink: new Link({
        text: 'Изменить данные',
        href: '#',
        variant: 'primary',
        onClick: (e) => {
          e.preventDefault();
          (window as any).navigateTo('profile-edit');
        },
      }),
      passwordLink: new Link({
        text: 'Изменить пароль',
        href: '#',
        variant: 'primary',
        onClick: (e) => {
          e.preventDefault();
          (window as any).navigateTo('profile-password');
        },
      }),
      logoutLink: new Link({
        text: 'Выйти',
        href: '#',
        variant: 'danger',
        onClick: (e) => {
          e.preventDefault();
          if (props.onLogout) {
            props.onLogout();
          } else {
            (window as any).navigateTo('login');
          }
        },
      }),
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    // вернуться
    if (target.closest('.profile-page__back')) {
      e.preventDefault();
      (window as any).navigateTo('login');
      return;
    }

    if (target.closest('.profile-page__avatar-circle')) {
      const modal = this.children.avatarModal as Modal;
      modal.open();
    }
  }

  protected render(): string {
    return template;
  }
}
