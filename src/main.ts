import './styles/main.scss';
import './components/button/button.scss';
import './components/input/input.scss';
import './components/link/link.scss';
import './pages/login/login.scss';
import './components/profile-field/profile-field.scss';
import './components/modal/modal.scss';
import './pages/register/register.scss';
import './components/add-user-form/add-user-form.scss';
import './pages/profile/profile.scss';
import './pages/profile-edit/profile-edit.scss';
import './pages/profile-password/profile-password.scss';
import './pages/chat/chat.scss';
import './components/avatar-upload/avatar-upload.scss';
import './components/error-page/error-page.scss';
import './components/chat-item/chat-item.scss';
import './components/chat-header/chat-header.scss';
import './components/chat-menu/chat-menu.scss';
import './components/message-input/message-input.scss';
import './components/avatar/avatar.scss';
import './components/message/message.scss';

import type { Block } from './core';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ProfilePage } from './pages/profile';
import { ProfileEditPage } from './pages/profile-edit';
import { ProfilePasswordPage } from './pages/profile-password';
import { Error404Page } from './pages/error-404';
import { Error500Page } from './pages/error-500';
import { ChatPage } from './pages/chat';

// Функция для рендера компонента в DOM
function render(page: Block): void {
  const root = document.querySelector('#app');

  if (!root) {
    throw new Error('Элемент #app не найден');
  }

  root.innerHTML = '';

  const content = page.getContent();
  if (content) {
    root.appendChild(content);
  }

  page.dispatchComponentDidMount();
}

function navigateTo(pageName: string): void {
  let page: Block;

  switch (pageName) {
    case 'login':
      page = new LoginPage({
        onSubmit: (data) => {
          console.log('Login:', data);
          alert(`Добро пожаловать, ${data.login}!`);
        },
      });
      break;

    case 'register':
      page = new RegisterPage({
        onSubmit: (data) => {
          console.log('Register:', data);
          alert(`Регистрация успешна!\nEmail: ${data.email}`);
          navigateTo('login');
        },
      });
      break;

    case 'profile':
      page = new ProfilePage({
        data: {
          email: 'pochta@yandex.ru',
          login: 'ivanivanov',
          first_name: 'Иван',
          second_name: 'Иванов',
          display_name: 'Иван',
          phone: '+7 (999) 999 99 99',
        },
        onAvatarClick: () => {
          console.log('Avatar clicked - открыть модалку загрузки');
        },
        onLogout: () => {
          alert('Вы вышли из системы');
          navigateTo('login');
        },
      });
      break;

    case 'profile-edit':
      page = new ProfileEditPage({
        data: {
          email: 'pochta@yandex.ru',
          login: 'ivanivanov',
          first_name: 'Иван',
          second_name: 'Иванов',
          display_name: 'Иван',
          phone: '+7 (999) 999 99 99',
        },
        onSubmit: (data) => {
          console.log('Profile updated:', data);
          alert('Данные сохранены!');
          navigateTo('profile');
        },
      });
      break;

    case 'profile-password':
      page = new ProfilePasswordPage({
        onSubmit: (data) => {
          console.log('Password changed:', data);
          alert('Пароль изменен!');
          navigateTo('profile');
        },
      });
      break;

    case '404':
      page = new Error404Page({});
      break;

    case '500':
      page = new Error500Page({});
      break;

    case 'chat':
      page = new ChatPage({
        onChatSelect: (chatId) => {
          console.log('Selected chat:', chatId);
        },
        onMessageSend: (message) => {
          console.log('Message sent:', message);
        },
      });
      break;

    default:
      page = new LoginPage({
        onSubmit: (data) => {
          console.log('Login:', data);
          alert(`Добро пожаловать, ${data.login}!`);
        },
      });
  }

  render(page);
}

window.navigateTo = navigateTo;

navigateTo('login');
