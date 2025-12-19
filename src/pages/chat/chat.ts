import { Block } from '../../core';
import { ChatItem } from '../../components/chat-item';
import { ChatHeader } from '../../components/chat-header';
import { ChatMenu } from '../../components/chat-menu';
import { Message } from '../../components/message';
import { MessageInput } from '../../components/message-input';
import { Modal } from '../../components/modal';
import { AddUserForm } from '../../components/add-user-form';
import type { ChatPageProps, ChatData, MessageData } from './types';
import template from './chat.hbs?raw';

// моки для чата
const MOCK_CHATS: ChatData[] = [
  {
    id: 1,
    name: 'Андрей',
    lastMessage: 'Изображение',
    time: '10:49',
    unreadCount: 2,
    isYou: false,
  },
  {
    id: 2,
    name: 'Посиделки у костра',
    lastMessage: 'стикер',
    time: '12:00',
    unreadCount: 0,
    isYou: true,
  },
  {
    id: 3,
    name: 'Илья',
    lastMessage: 'Гори в аду',
    time: '15:12',
    unreadCount: 4,
    isYou: false,
  },
  {
    id: 4,
    name: 'Вадим',
    lastMessage: 'Пошел ты!',
    time: 'Пт',
    unreadCount: 0,
    isYou: true,
  },
];

// мок выбранного чата
const MOCK_MESSAGES: MessageData[] = [
  {
    id: 1,
    text: 'Хай',
    time: '11:56',
    isMy: false,
  },
  {
    id: 2,
    text: 'Как оно?',
    time: '11:58',
    isMy: false,
  },
  {
    id: 3,
    text: 'Круто!',
    time: '12:00',
    isMy: true,
  },
];

export class ChatPage extends Block<ChatPageProps> {
  private selectedChatId: number | null = null;
  private chatMenu: ChatMenu;
  private addUserModal: Modal;
  private addUserForm: AddUserForm;

  constructor(props: ChatPageProps) {
    const chats = props.chats || MOCK_CHATS;
    const selectedChatId = props.selectedChatId || 4;

    const selectedChat = chats.find((chat) => chat.id === selectedChatId);

    const chatList = chats.map((chat) => {
      const { avatar, ...chatProps } = chat;
      return new ChatItem({
        ...chatProps,
        active: chat.id === selectedChatId,
        onClick: (id) => {
          this.handleChatSelect(id);
        },
      });
    });

    // меню чата
    const chatMenu = new ChatMenu({
      isOpen: false,
      onAddUser: () => {
        chatMenu.close();
        this.openAddUserModal();
      },
      onRemoveUser: () => {
        chatMenu.close();
        alert('Удалить пользователя');
      },
    });

    // форма добавления юзера
    const addUserForm = new AddUserForm({
      onSubmit: (login) => {
        alert(`Пользователь ${login} добавлен`);
        this.addUserModal.close();
        addUserForm.reset();
      },
    });

    // модалка добавления бзера
    const addUserModal = new Modal({
      title: 'Добавить пользователя',
      isOpen: false,
      content: addUserForm,
      onClose: () => {
        addUserForm.reset();
      },
    });

    super('div', {
      ...props,
      chats,
      selectedChat,
      chatList,
      chatHeader: selectedChat
        ? new ChatHeader({
            name: selectedChat.name,
            onMenuClick: () => {
              chatMenu.toggle();
            },
          })
        : null,
      chatMenu,
      messageList: MOCK_MESSAGES.map((msg) => new Message(msg)),
      messageInput: new MessageInput({
        placeholder: 'Сообщение',
        onSubmit: (message) => {
          console.log('Send message:', message);
          if (props.onMessageSend) {
            props.onMessageSend(message);
          }
          this.addMessage(message);
        },
        onAttach: () => {
          alert('Прикрепить файл');
        },
      }),
      addUserModal,
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });

    this.selectedChatId = selectedChatId;
    this.chatMenu = chatMenu;
    this.addUserModal = addUserModal;
    this.addUserForm = addUserForm;
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.closest('.chat-page__profile-link')) {
      e.preventDefault();
      (window as any).navigateTo('profile');
      return;
    }

    if (
      !target.closest('.chat-header__menu') &&
      !target.closest('.chat-menu')
    ) {
      this.chatMenu.close();
    }
  }

  private handleChatSelect(chatId: number): void {
    this.selectedChatId = chatId;
    console.log('Selected chat:', chatId);

    if (this.props.onChatSelect) {
      this.props.onChatSelect(chatId);
    }
  }

  private addMessage(text: string): void {
    const newMessage = new Message({
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMy: true,
    });

    const messageList = this.children.messageList as Message[];
    messageList.push(newMessage);

    this.setProps({ messageList });
  }

  private openAddUserModal(): void {
    this.addUserModal.open();
  }

  protected render(): string {
    return template;
  }
}
