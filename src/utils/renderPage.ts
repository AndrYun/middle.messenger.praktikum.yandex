import Handlebars from 'handlebars';
import { Pages } from './pages';

import loginTemplate from '../pages/login/login.hbs?raw';
import registerTemplate from '../pages/register/register.hbs?raw';
import profileTemplate from '../pages/profile/profile.hbs?raw';
import profileEditTemplate from '../pages/profile-edit/profile-edit.hbs?raw';
import profilePasswordTemplate from '../pages/profile-password/profile-password.hbs?raw';
import chatTemplate from '../pages/chat/chat.hbs?raw';
import error404Template from '../pages/error-404/error-404.hbs?raw';
import error500Template from '../pages/error-500/error-500.hbs?raw';

// Маппинг страниц
const pageTemplates: Record<Pages, string> = {
  [Pages.LOGIN]: loginTemplate,
  [Pages.REGISTER]: registerTemplate,
  [Pages.PROFILE]: profileTemplate,
  [Pages.PROFILE_EDIT]: profileEditTemplate,
  [Pages.PROFILE_PASSWORD]: profilePasswordTemplate,
  [Pages.CHAT]: chatTemplate,
  [Pages.ERROR_404]: error404Template,
  [Pages.ERROR_500]: error500Template,
};

// Моки для юзера
const mockUserData = {
  name: 'Иван',
  email: 'pochta@yandex.ru',
  login: 'ivanivanov',
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'Иван',
  phone: '+7 (999) 999 99 99',
};

// Моки для чата
const mockChatData = {
  chats: [
    {
      id: 1,
      name: 'Андрей',
      lastMessage: 'Изображение',
      time: '10:49',
      unreadCount: 2,
      active: false,
      isYou: false,
    },
    {
      id: 2,
      name: 'Посиделки у костра',
      lastMessage: 'стикер',
      time: '12:00',
      unreadCount: 0,
      active: false,
      isYou: true,
    },
    {
      id: 3,
      name: 'Илья',
      lastMessage: 'Гори в аду',
      time: '15:12',
      unreadCount: 4,
      active: false,
      isYou: false,
    },
    {
      id: 4,
      name: 'Вадим',
      lastMessage: 'Пошел ты!',
      time: 'Пт',
      unreadCount: 0,
      active: true,
      isYou: true,
    },
  ],
  selectedChat: {
    name: 'Корешь',
    messages: [
      {
        text: 'Хай',
        time: '11:56',
        isMy: false,
      },
      {
        text: 'Как оно?',
        time: '11:58',
        isMy: false,
      },
      {
        text: 'Пошел ты!',
        time: '12:00',
        isMy: true,
      },
    ],
  },
};

export function renderPage(pageName: Pages): void {
  const template = pageTemplates[pageName];

  if (!template) {
    console.error(`Page ${pageName} not found`);
    return;
  }

  const compiledTemplate = Handlebars.compile(template);
  const app = document.getElementById('app');

  if (app) {
    let data = {};

    // Передаем соответствующие данные для разных страниц
    if (pageName.includes('profile')) {
      data = mockUserData;
    } else if (pageName === Pages.CHAT) {
      data = mockChatData;
    }

    app.innerHTML = compiledTemplate(data);
  }
}

export function getCurrentPage(): Pages {
  const hash = window.location.hash.slice(1);

  // Проверяем, существует ли такая страница
  if (Object.values(Pages).includes(hash as Pages)) {
    return hash as Pages;
  }

  if (!hash) {
    return Pages.LOGIN;
  }

  return Pages.ERROR_404;
}
