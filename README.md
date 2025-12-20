# Messenger - Учебный проект Яндекс.Практикум

Веб-приложение мессенджер, разработанное в рамках курса "Мидл фронтенд-разработчик" в Яндекс.Практикуме.

## Описание

Проект представляет собой одностраничное приложение (SPA) для обмена сообщениями с полным функционалом:

- Авторизация и регистрация пользователей
- Профиль пользователя с возможностью редактирования
- Список чатов и переписка
- Загрузка аватара
- Обработка ошибок (404, 500)

## Макет

- https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&p=f

## Основные страницы

- Авторизация - http://localhost:3000/#profile
- Регистрация - http://localhost:3000/#register
- Чаты - http://localhost:3000/#chat

## Профиль

- Просмотр профиля - http://localhost:3000/#profile
- Редактирование данных - http://localhost:3000/#profile-edit
- Изменение пароля - http://localhost:3000/#profile-password

## Страницы ошибок

- 404 - http://localhost:3000/#anything-else
- 500 - http://localhost:3000/#500

## Технологический стек

- **TypeScript** - типизированный JavaScript
- **Handlebars** - шаблонизатор для создания переиспользуемых компонентов
- **SCSS** - CSS-препроцессор с модульной архитектурой
- **Vite** - современный сборщик проектов
- **Netlify** - платформа для деплоя

## Установка и запуск

### Требования

- Node.js версии 18 или выше
- npm или yarn

### Установка зависимостей

npm install

## Netlify

- https://messengeryaandryun.netlify.app/

### Реализация Блоков

- init - инициализация компонента
- componentDidMount - компонент добавлен в DOM
- componentDidUpdate - props изменились
- render - рендеринг шаблона

### Особенности:

- Реактивность - автоматическое обновление при изменении props через Proxy
- Композиция - компоненты могут содержать другие компоненты
- События - обработка через EventBus
- TypeScript - полная типизация props

### EventBus

Паттерн **Observer** для работы с событиями:

### ESLint

- Базируется на `eslint:recommended` и `@typescript-eslint`
- Проверяет TypeScript код
- Запуск: `npm run lint:ts`
- Автофикс: `npm run lint:ts:fix`

### Stylelint

- Базируется на `stylelint-config-standard-scss`
- Проверяет SCSS код
- Запуск: `npm run lint:style`
- Автофикс: `npm run lint:style:fix`

### HTTPTransport

Класс для работы с API (готов к использованию в спринте 3):

### Для просмотра страницы:

1. Откройте приложение в браузере
2. Нажмите `F12` для открытия консоли
3. Введите команду: `navigateTo('chat')`
4. Нажмите `Enter`

### Страницы

- 'login'
- 'register'
- 'profile'
- 'profile-edit'
- 'profile-password'
- 'chat'
