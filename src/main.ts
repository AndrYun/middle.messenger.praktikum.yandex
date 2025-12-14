import './styles/main.scss';
import './components/button/button.scss';
import './components/input/input.scss';
import './components/link/link.scss';
import './pages/login/login.scss';
import './components/profile-field/profile-field.scss';
import './components/modal/modal.scss';
import './pages/login/login.scss';
import './pages/register/register.scss';

import type { Block } from './core';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { Modal } from './components/modal';
import { Button } from './components/button';

let currentPage: Block | null = null;

// Функция для рендера компонента в DOM
function render(page: Block): void {
  const root = document.querySelector('#app');

  if (!root) {
    throw new Error('Элемент #app не найден');
  }

  // Удаляем предыдущую страницу
  root.innerHTML = '';

  // Рендерим новую
  const content = page.getContent();
  if (content) {
    root.appendChild(content);
  }

  page.dispatchComponentDidMount();

  currentPage = page;
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
          navigateTo('login'); // Переходим на логин после регистрации
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

(window as any).navigateTo = navigateTo;

navigateTo('login');
