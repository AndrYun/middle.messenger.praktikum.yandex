import './styles/main.scss';
import './components/input/input.scss';
import './components/button/button.scss';
import './components/profile-field/profile-field.scss';
import './components/link/link.scss';
import './components/modal/modal.scss';
import './components/avatar-upload/avatar-upload.scss';
import './components/chat-item/chat-item.scss';
import './components/message/message.scss';
import './components/message-input/message-input.scss';
import './components/chat-header/chat-header.scss';
import './components/chat-menu/chat-menu.scss';
import './components/error-page/error-page.scss';
import './pages/login/login.scss';
import './pages/register/register.scss';
import './pages/profile/profile.scss';
import './pages/profile-edit/profile-edit.scss';
import './pages/profile-password/profile-password.scss';
import './pages/chat/chat.scss';
import Handlebars from 'handlebars';

import inputTemplate from './components/input/input.hbs?raw';
import buttonTemplate from './components/button/button.hbs?raw';
import profileFieldTemplate from './components/profile-field/profile-field.hbs?raw';
import linkTemplate from './components/link/link.hbs?raw';
import modalTemplate from './components/modal/modal.hbs?raw';
import avatarUploadTemplate from './components/avatar-upload/avatar-upload.hbs?raw';
import chatItemTemplate from './components/chat-item/chat-item.hbs?raw';
import messageTemplate from './components/message/message.hbs?raw';
import messageInputTemplate from './components/message-input/message-input.hbs?raw';
import chatHeaderTemplate from './components/chat-header/chat-header.hbs?raw';
import chatMenuTemplate from './components/chat-menu/chat-menu.hbs?raw';
import errorPageTemplate from './components/error-page/error-page.hbs?raw';

import { renderPage, getCurrentPage } from './utils/renderPage';
import { initAvatarModal } from './utils/avatarModal';
import { initChatInteractions } from './utils/chatInteractions';
import { Pages } from './utils/pages';

Handlebars.registerPartial('input', inputTemplate);
Handlebars.registerPartial('button', buttonTemplate);
Handlebars.registerPartial('profile-field', profileFieldTemplate);
Handlebars.registerPartial('link', linkTemplate);
Handlebars.registerPartial('modal', modalTemplate);
Handlebars.registerPartial('avatar-upload', avatarUploadTemplate);
Handlebars.registerPartial('chat-item', chatItemTemplate);
Handlebars.registerPartial('message', messageTemplate);
Handlebars.registerPartial('message-input', messageInputTemplate);
Handlebars.registerPartial('chat-header', chatHeaderTemplate);
Handlebars.registerPartial('chat-menu', chatMenuTemplate);
Handlebars.registerPartial('error-page', errorPageTemplate);

function initApp(): void {
  renderPage(getCurrentPage());
  initPageInteractions(getCurrentPage());

  window.addEventListener('hashchange', () => {
    const newPage = getCurrentPage();
    renderPage(newPage);
    initPageInteractions(newPage);
  });
}

function initPageInteractions(page: Pages): void {
  setTimeout(() => {
    if (page === Pages.PROFILE) {
      initAvatarModal();
    } else if (page === Pages.CHAT) {
      initChatInteractions();
    }
  }, 0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
